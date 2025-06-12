import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SUPABASE_CONFIG } from "./lib/supabase/config"

// Route configurations
const publicRoutes = ["/", "/nasil-kazanilir", "/yayinlar", "/oduller"]
const authRoutes = ["/login"]
const protectedRoutes = ["/profile"]
const adminRoutes = ["/admin"]
const adminAuthRoutes = ["/admin/login"]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const pathname = request.nextUrl.pathname

    // Admin routes protection
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      if (!session) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // Check if user is admin
      const isAdmin = session.user.user_metadata.role === "admin"
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    }

    // Redirect admin users away from login page
    if (pathname.startsWith("/admin/login") && session?.user.user_metadata.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    // Set cookie options based on environment
    const cookieOptions = SUPABASE_CONFIG.cookieOptions
    res.cookies.set('sb-auth-token', session?.access_token || '', {
      ...cookieOptions,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
