import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/supabase/types"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code)

    // Get user data
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if user exists in our database
      const { data: existingUser } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (!existingUser) {
        // Create new user profile
        const provider = user.app_metadata.provider as "twitch" | "kick"
        const providerUsername = user.user_metadata.preferred_username || user.user_metadata.full_name || "User"
        const providerUserId = user.user_metadata.sub || user.user_metadata.provider_id || ""

        // Yeni kullanıcı oluşturulurken UserProfileSchema (MVP versiyonu) ile uyumlu olduğundan emin ol.
        // Örneğin, referral_code gibi alanlar MVP şemasında yoksa burada da eklenmemeli.
        // Başlangıç ore_points değerinin (örn: 1000) atandığından emin ol.

        // Örnek insert (MVP):
        await supabase.from("users").insert({
          id: user.id,
          display_name: user.user_metadata.full_name || providerUsername || "User",
          username: null, // Kullanıcı daha sonra belirleyecek
          avatar: user.user_metadata.avatar_url || "/abstract-user-icon.png",
          provider,
          provider_username: providerUsername,
          provider_user_id: user.user_metadata.sub || user.id,
          email: user.email, // Opsiyonel
          ore_points: 1000, // Başlangıç puanı
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    }
  }

  // Redirect to home page
  return NextResponse.redirect(requestUrl.origin)
}
