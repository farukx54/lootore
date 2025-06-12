import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

// Route configurations
const publicRoutes = ["/", "/nasil-kazanilir", "/yayinlar", "/oduller"]
const authRoutes = ["/login"]
const protectedRoutes = ["/profile"]
const adminRoutes = ["/admin"]
const adminAuthRoutes = ["/admin/login"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Cookie ayarlarını düzenle
  const response = NextResponse.next()
  const sbAuthToken = request.cookies.get('sb-auth-token')?.value;
  if (!sbAuthToken) {
    console.warn('[MIDDLEWARE] sb-auth-token çerezi bulunamadı. Kullanıcı oturumu yok veya çerez silinmiş.');
  }

  response.cookies.set({
    name: 'sb-auth-token',
    value: sbAuthToken || '',
    path: '/',
    domain: 'www.lootore.com',
    sameSite: 'lax',
    secure: true
  })

  // Admin routes protection - STRICT MODE
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    console.log("[MIDDLEWARE] Admin route detected:", pathname)

    try {
      // Supabase auth ile admin rolü kontrolü
      const supabase = createServerComponentClient<Database>({ cookies })
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error("[MIDDLEWARE] Error getting session:", error.message)
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      console.log("[MIDDLEWARE] Session:", session)
      if (session?.user) {
        console.log("[MIDDLEWARE] User:", session.user)
      }

      if (!session?.user) {
        console.log("[MIDDLEWARE] No session found, redirecting to login")
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // user_metadata içinde admin rolü var mı?
      const isAdmin = session.user.user_metadata?.role === "admin"

      if (!isAdmin) {
        console.log("[MIDDLEWARE] User is not admin, redirecting to login")
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      return response
    } catch (error) {
      console.error("[MIDDLEWARE] Unexpected error:", error)
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Admin login page - sadece erişime izin ver, yönlendirme yapma
  if (pathname.startsWith("/admin/login")) {
    return response
  }

  // Protected routes - check auth
  if (pathname.startsWith("/protected")) {
    try {
      const supabase = createServerComponentClient<Database>({ cookies })
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error("[MIDDLEWARE] Error getting session:", error.message)
        return NextResponse.redirect(new URL("/auth/login", request.url))
      }

      if (!session?.user) {
        console.log("[MIDDLEWARE] No session found for protected route")
        return NextResponse.redirect(new URL("/auth/login", request.url))
      }

      return response
    } catch (error) {
      console.error("[MIDDLEWARE] Unexpected error:", error)
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // Auth pages - redirect to home if already logged in
  if (pathname.startsWith("/auth")) {
    try {
      const supabase = createServerComponentClient<Database>({ cookies })
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error("[MIDDLEWARE] Error getting session:", error.message)
        return response
      }

      if (session?.user) {
        console.log("[MIDDLEWARE] User already logged in, redirecting to home")
        return NextResponse.redirect(new URL("/", request.url))
      }

      return response
    } catch (error) {
      console.error("[MIDDLEWARE] Unexpected error:", error)
      return response
    }
  }

  // Public routes - no restrictions
  return response
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/protected/:path*",
    "/auth/:path*",

    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}
