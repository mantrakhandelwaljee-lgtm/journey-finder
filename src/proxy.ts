import { auth } from "@/auth"
import { NextResponse } from "next/server"

// Define routes that require authentication
const protectedRoutes = ["/dashboard", "/publish", "/search", "/profile"]

// Define public routes
const publicRoutes = ["/", "/login"]

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnboarded = req.auth?.user?.isOnboarded

  const { nextUrl } = req
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isJourneyDetailRoute = nextUrl.pathname.startsWith("/journey/")

  // Allow all API auth routes (login, callback, etc.)
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // If user is not logged in and tries to access a protected route, redirect to login
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // If user is logged in
  if (isLoggedIn) {
    // Redirect away from login page to dashboard
    if (nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    // If user is not onboarded and tries to access a protected route, redirect to onboarding
    if (!isOnboarded && nextUrl.pathname !== "/onboarding" && isProtectedRoute) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl))
    }

    // If user IS onboarded and tries to access onboarding page, redirect to dashboard
    if (isOnboarded && nextUrl.pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
