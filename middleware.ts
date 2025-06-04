import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Route configurations
const publicRoutes = ["/", "/nasil-kazanilir", "/yayinlar", "/oduller"]
const authRoutes = ["/login"]
const protectedRoutes = ["/profile"]
const adminRoutes = ["/admin"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth status from cookies (will be set by the auth store)
  const isLoggedIn = request.cookies.get("auth-logged-in")?.value === "true"
  const isAdminLoggedIn = request.cookies.get("admin-logged-in")?.value === "true"

  // Admin routes protection
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAdminLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Protected routes - require authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      // Store the attempted URL for redirect after login
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }

  // Public routes - no restrictions
  return NextResponse.next()
}

export const config = {
  matcher: [
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
