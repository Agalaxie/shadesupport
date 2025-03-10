import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/debug",
    "/login",
    "/api/webhook(.*)",
    "/api/clerk(.*)",
    "/api/trpc(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/sso-callback(.*)",
    "/terms(.*)",
    "/privacy(.*)",
    "/about(.*)",
    "/contact(.*)",
    "/api/health",
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/webhook(.*)",
    "/api/clerk(.*)",
    "/api/health",
  ],
  // Custom function to run before the middleware
  beforeAuth: (req) => {
    // Custom logic here
    return NextResponse.next();
  },
  // Custom function to run after the middleware
  afterAuth: (auth, req) => {
    // Rediriger l'administrateur vers le dashboard admin s'il est connecté
    if (auth.userId && auth.sessionClaims?.email === "stephdumaz@gmail.com") {
      const url = new URL(req.url);
      const path = url.pathname;
      
      // Si l'admin n'est pas déjà sur une page admin, le rediriger vers /admin
      if (!path.startsWith("/admin")) {
        const adminUrl = new URL("/admin", req.url);
        return NextResponse.redirect(adminUrl);
      }
    }

    // Vérifier si l'utilisateur essaie d'accéder à une route admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // Vérifier si l'utilisateur est connecté et a le rôle admin
      const metadata = auth.sessionClaims?.metadata as Record<string, unknown> || {};
      if (!auth.userId || metadata.role !== "admin") {
        const homeUrl = new URL("/", req.url);
        return NextResponse.redirect(homeUrl);
      }
    }

    // Vérifier si l'utilisateur essaie d'accéder à une route client
    if (req.nextUrl.pathname.startsWith("/client")) {
      // Vérifier si l'utilisateur est connecté
      if (!auth.userId) {
        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
      }
    }
    
    return NextResponse.next();
  },
  // Désactiver le stockage de session dans localStorage pour éviter les erreurs
  // "Access to storage is not allowed from this context"
  debug: process.env.NODE_ENV === "development",
  // Configurer le comportement de Clerk en cas d'erreur
  handleError: (error) => {
    console.error("Clerk middleware error:", error);
  },
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", 
    "/", 
    "/(api|trpc)(.*)",
    "/api/tickets(.*)",
    "/api/tickets/[id](.*)",
    "/api/sync-user(.*)"
  ],
  runtime: 'nodejs'
}; 