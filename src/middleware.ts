import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/api/webhook(.*)",
    "/legal(.*)",
    "/terms(.*)",
    "/cookies(.*)",
    "/contact",
    "/pricing",
    "/features",
    "/privacy",
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/webhook(.*)"
  ],
  // Custom function to run before the middleware
  beforeAuth: (req) => {
    // Custom logic here
    return NextResponse.next();
  },
  // Custom function to run after the middleware
  afterAuth: (auth, req) => {
    // Si l'utilisateur est connecté
    if (auth.userId) {
      const userEmail = auth.sessionClaims?.email as string;
      
      // Si c'est l'email de l'admin, rediriger vers le tableau de bord admin
      if (userEmail === 'stephdumaz@gmail.com') {
        if (!req.nextUrl.pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/admin', req.url));
        }
        return NextResponse.next();
      }
    }

    // Vérification des routes admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!auth.userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }
      
      const metadata = auth.sessionClaims?.metadata as Record<string, unknown> || {};
      const isAdmin = Array.isArray(metadata.roles) && metadata.roles.includes('admin');
      
      if (!isAdmin && process.env.NODE_ENV !== 'development') {
        return NextResponse.redirect(new URL('/client', req.url));
      }
    }
    
    return NextResponse.next();
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