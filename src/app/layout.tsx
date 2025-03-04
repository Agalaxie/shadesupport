import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserSync } from "@/components/user-sync";
import { CookieConsent } from "@/components/cookie-consent";
import { cn } from "@/lib/utils";
import { ClerkProviderClient } from "@/components/clerk-provider-client";

// Composant client pour la gestion des erreurs
import { ErrorHandler } from "@/components/error-handler";

const inter = Inter({ subsets: ["latin"] });

// Désactiver l'Edge Runtime pour éviter les problèmes avec Clerk
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'AppShade - Gestion de tickets',
  description: 'Plateforme de gestion de tickets de support',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
        <ClerkProviderClient publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <ErrorHandler>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <CookieConsent />
              {children}
              <UserSync />
            </ThemeProvider>
          </ErrorHandler>
        </ClerkProviderClient>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
} 