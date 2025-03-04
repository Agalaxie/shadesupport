'use client';

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MainNav } from "@/components/layout/MainNav";
import { UserSync } from "@/components/user-sync";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { cn } from "@/lib/utils";
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AppShade - Gestion de tickets',
  description: 'Plateforme de gestion de tickets de support',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

// Composant pour gérer les erreurs globales
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Gestionnaire d'erreurs global
    const handleError = (event: ErrorEvent) => {
      console.error('Erreur globale capturée:', event.error);
      // Éviter l'écran blanc en affichant un message d'erreur
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
          <h1>Une erreur s'est produite</h1>
          <p>Nous sommes désolés, une erreur inattendue s'est produite.</p>
          <p>Veuillez rafraîchir la page ou réessayer plus tard.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">
            Rafraîchir la page
          </button>
        </div>
      `;
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return <>{children}</>;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        </head>
        <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
          <ErrorBoundary>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative flex min-h-screen flex-col">
                <MainNav />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
              <CookieConsent />
              <Toaster />
              <UserSync />
            </ThemeProvider>
          </ErrorBoundary>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
} 