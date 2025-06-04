import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/supabase/types"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")
  const customRedirectPath = requestUrl.searchParams.get("redirect") // login sayfasından gelen redirect

  // 1. Twitch'ten bir hata parametresi gelip gelmediğini kontrol et
  if (error) {
    console.error(`Twitch OAuth Error: ${error}, Description: ${errorDescription}`)
    // Kullanıcıyı login sayfasına bir hata mesajıyla geri yönlendir
    const loginErrorUrl = new URL("/login", requestUrl.origin)
    loginErrorUrl.searchParams.set("error", "twitch_oauth_failed")
    loginErrorUrl.searchParams.set(
      "error_description",
      `Twitch ile giriş sırasında bir hata oluştu: ${errorDescription || error}`,
    )
    return NextResponse.redirect(loginErrorUrl)
  }

  // 2. Eğer 'code' varsa, session exchange yap
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Supabase session exchange error:", exchangeError)
        const loginErrorUrl = new URL("/login", requestUrl.origin)
        loginErrorUrl.searchParams.set("error", "session_exchange_failed")
        loginErrorUrl.searchParams.set(
          "error_description",
          "Oturum oluşturulurken bir sorun oluştu. Lütfen tekrar deneyin.",
        )
        return NextResponse.redirect(loginErrorUrl)
      }

      // Session başarıyla oluşturuldu, şimdi kullanıcı profilini kontrol et/oluştur
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser()

      if (getUserError || !user) {
        console.error("Error getting user after session exchange:", getUserError)
        const loginErrorUrl = new URL("/login", requestUrl.origin)
        loginErrorUrl.searchParams.set("error", "get_user_failed")
        loginErrorUrl.searchParams.set("error_description", "Kullanıcı bilgileri alınamadı. Lütfen tekrar deneyin.")
        return NextResponse.redirect(loginErrorUrl)
      }

      // Kullanıcı var, veritabanında profilini kontrol et/oluştur
      const { data: existingUser, error: dbError } = await supabase
        .from("users")
        .select("id, username") // Sadece gerekli alanları seç
        .eq("id", user.id)
        .single()

      if (dbError && dbError.code !== "PGRST116") {
        // PGRST116: no rows found, bu durumda kullanıcı yenidir.
        console.error("Database error checking existing user:", dbError)
        // Burada kritik bir DB hatası varsa kullanıcıyı bilgilendir
        const loginErrorUrl = new URL("/login", requestUrl.origin)
        loginErrorUrl.searchParams.set("error", "db_check_failed")
        loginErrorUrl.searchParams.set(
          "error_description",
          "Veritabanı hatası oluştu. Lütfen daha sonra tekrar deneyin.",
        )
        return NextResponse.redirect(loginErrorUrl)
      }

      if (!existingUser) {
        // Yeni kullanıcı, profil oluştur
        const provider = user.app_metadata.provider as "twitch" | "kick"
        const providerUsername = user.user_metadata.preferred_username || user.user_metadata.full_name || "User"
        // const providerUserId = user.user_metadata.sub || user.user_metadata.provider_id || "" // Bu alan users tablosunda yoksa eklemeyin

        await supabase.from("users").insert({
          id: user.id,
          display_name: user.user_metadata.full_name || providerUsername,
          username: null, // Kullanıcı adı daha sonra login sayfasında belirlenecek
          avatar: user.user_metadata.avatar_url || "/abstract-user-icon.png",
          provider,
          provider_username: providerUsername,
          provider_user_id: user.user_metadata.sub || user.id, // Bu alanın users tablonuzda olduğundan emin olun
          email: user.email,
          ore_points: 1000, // Başlangıç puanı
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      // Kullanıcı profili oluşturuldu veya zaten vardı.
      // Şimdi kullanıcıyı login sayfasından gelen customRedirectPath'e veya ana sayfaya yönlendir.
      // Eğer kullanıcı adı yoksa, login sayfası bunu handle edip modal gösterecek.
      const finalRedirectPath = customRedirectPath || "/"
      return NextResponse.redirect(new URL(finalRedirectPath, requestUrl.origin))
    } catch (e) {
      console.error("Unexpected error in callback handler:", e)
      const loginErrorUrl = new URL("/login", requestUrl.origin)
      loginErrorUrl.searchParams.set("error", "callback_unexpected_error")
      loginErrorUrl.searchParams.set("error_description", "Giriş işlemi sırasında beklenmedik bir hata oluştu.")
      return NextResponse.redirect(loginErrorUrl)
    }
  }

  // Eğer 'code' veya 'error' yoksa, bu beklenmedik bir durum. Login'e yönlendir.
  console.warn("Callback received without code or error query parameters.")
  const loginErrorUrl = new URL("/login", requestUrl.origin)
  loginErrorUrl.searchParams.set("error", "invalid_callback")
  loginErrorUrl.searchParams.set("error_description", "Geçersiz geri arama isteği.")
  return NextResponse.redirect(loginErrorUrl)
}
