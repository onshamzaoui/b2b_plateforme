//ons
// Middleware configuration for route protection
export const middlewareConfig = {
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/missions",
    "/tarifs",
    "/auth/login",
    "/auth/signup",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/public"
  ],

  // Role-based protected routes
  protectedRoutes: {
    // Freelance-only routes
    freelance: [
      "/dashboard/freelance",
      "/applications",
      "/profile"
    ],
    
    // Entreprise-only routes
    entreprise: [
      "/dashboard/entreprise",
      "/missions/create",
      "/missions/[id]/applications"
    ],
    
    // Admin-only routes
    admin: [
      "/admin",
      "/admin/users",
      "/admin/missions",
      "/admin/applications"
    ],
    
    // Authenticated user routes (any role)
    authenticated: [
      "/profile",
      "/dashboard"
    ]
  },

  // Default redirect paths for each role
  defaultRedirects: {
    freelance: "/dashboard/freelance",
    entreprise: "/dashboard/entreprise",
    admin: "/admin"
  },

  // Routes that should redirect authenticated users away
  authRedirectRoutes: [
    "/auth/login",
    "/auth/signup"
  ]
}

// Helper function to check if a route requires a specific role
export function requiresRole(pathname: string, role: string): boolean {
  const routes = middlewareConfig.protectedRoutes[role as keyof typeof middlewareConfig.protectedRoutes]
  if (!routes) return false
  
  return routes.some(route => {
    // Handle dynamic routes with [id] parameters
    if (route.includes('[id]')) {
      // Convert route pattern to regex
      const pattern = route.replace(/\[id\]/g, '[^/]+')
      const regex = new RegExp(`^${pattern.replace(/\//g, '\\/')}`)
      return regex.test(pathname)
    }
    // Handle static routes
    return pathname.startsWith(route)
  })
}

// Helper function to check if a route is public
export function isPublicRoute(pathname: string): boolean {
  return middlewareConfig.publicRoutes.some(route => pathname.startsWith(route))
}

// Helper function to get the appropriate dashboard for a role
export function getDashboardForRole(role: string): string {
  return middlewareConfig.defaultRedirects[role as keyof typeof middlewareConfig.defaultRedirects] || "/"
}
