//ons
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { 
  middlewareConfig, 
  requiresRole, 
  isPublicRoute, 
  getDashboardForRole 
} from "./lib/middleware-config"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Check if the current path requires authentication
    const requiresAuth = !isPublicRoute(pathname)
if (pathname.startsWith("/profile")) {
  return NextResponse.next()
}

    // If route requires authentication but user is not authenticated
    if (requiresAuth && !token) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // If user is authenticated, check role-based access
    if (token) {
      const userRole = token.role?.toLowerCase()

      // Check role-based access for protected routes
      if (requiresRole(pathname, "freelance") && userRole !== "freelance") {
        return NextResponse.redirect(new URL(getDashboardForRole(userRole), req.url))
      }

      if (requiresRole(pathname, "entreprise") && userRole !== "entreprise") {
        return NextResponse.redirect(new URL(getDashboardForRole(userRole), req.url))
      }

      if (requiresRole(pathname, "admin") && userRole !== "admin") {
        return NextResponse.redirect(new URL(getDashboardForRole(userRole), req.url))
      }

      // Redirect to appropriate dashboard based on role
      if (pathname === "/dashboard") {
        return NextResponse.redirect(new URL(getDashboardForRole(userRole), req.url))
      }

      // Redirect authenticated users away from auth pages
      if (middlewareConfig.authRedirectRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL(getDashboardForRole(userRole), req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to public routes
        if (isPublicRoute(pathname)) {
          return true
        }

        // For all other routes, require authentication
        return !!token
      },
    },
  }
)

// Configure which paths the middleware should run on
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
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
