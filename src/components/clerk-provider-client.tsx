'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { clerkConfig } from "@/lib/clerk-config";
import { useEffect } from "react";

export function ClerkProviderClient({
  children,
  publishableKey,
}: {
  children: React.ReactNode;
  publishableKey?: string;
}) {
  // Désactiver le stockage local pour éviter les erreurs
  useEffect(() => {
    // Intercepter les erreurs liées au stockage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      try {
        if (key.includes('clerk')) {
          // Ne pas stocker les données Clerk dans localStorage
          console.debug('Clerk localStorage access prevented:', key);
          return;
        }
        return originalSetItem.call(this, key, value);
      } catch (e) {
        console.warn('localStorage access error:', e);
        return undefined;
      }
    };

    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

  return (
    <ClerkProvider
      localization={frFR}
      appearance={clerkConfig.appearance}
      publishableKey={publishableKey}
    >
      {children}
    </ClerkProvider>
  );
} 