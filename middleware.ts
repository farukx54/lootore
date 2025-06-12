import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

// Route configurations
const publicRoutes = ["/", "/nasil-kazanilir", "/yayinlar", "/oduller"]
const authRoutes = ["/login"]
const protectedRoutes = ["/profile"]
const adminRoutes = ["/admin"]
const adminAuthRoutes = ["/admin/login"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Admin routes protection - STRICT MODE
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    console.log("Admin route detected:", pathname)

    // Supabase auth ile admin rolü kontrolü
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      console.log("No session or error, redirecting to admin login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // user_metadata içinde admin rolü var mı?
    const isAdmin = session.user.user_metadata?.role === "admin"

    if (!isAdmin) {
      console.log("User is not admin, redirecting to admin login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    return NextResponse.next()
  }

  // Admin login page - redirect to admin if already logged in
  if (pathname.startsWith("/admin/login")) {
    // Supabase auth ile admin rolü kontrolü
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return NextResponse.next()
    }

    // user_metadata içinde admin rolü var mı?
    const isAdmin = session.user.user_metadata?.role === "admin"

    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    return NextResponse.next()
  }

  // Protected routes - check auth
  if (pathname.startsWith("/protected")) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    return NextResponse.next()
  }

  // Auth pages - redirect to home if already logged in
  if (pathname.startsWith("/auth")) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect logged-in users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Protected routes - require authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      // Store the attempted URL for redirect after login
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Public routes - no restrictions
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/protected/:path*",
    "/auth/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}
