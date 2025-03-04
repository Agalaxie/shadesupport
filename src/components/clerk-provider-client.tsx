'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { useEffect, useState } from "react";

// Configuration simplifiée pour Clerk
const clerkConfig = {
  appearance: {
    baseTheme: undefined,
    variables: {
      colorPrimary: 'hsl(var(--primary))',
      colorText: 'hsl(var(--foreground))',
      colorBackground: 'hsl(var(--background))',
      colorDanger: 'hsl(var(--destructive))',
      fontFamily: 'var(--font-sans)',
    },
  },
};

export function ClerkProviderClient({
  children,
  publishableKey,
}: {
  children: React.ReactNode;
  publishableKey?: string;
}) {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Marquer que nous sommes côté client
    setIsClient(true);

    // Intercepter les erreurs globales
    const handleError = (event: ErrorEvent) => {
      console.error('Erreur globale:', event.error);
      if (event.error?.message?.includes('clerk') || event.error?.message?.includes('storage')) {
        setError('Erreur avec Clerk: ' + event.error.message);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Si nous ne sommes pas côté client, ne pas rendre Clerk
  if (!isClient) {
    return <>{children}</>;
  }

  // Si une erreur Clerk est détectée, afficher un message d'erreur
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Erreur d'authentification</h2>
        <p>{error}</p>
        <p>Veuillez rafraîchir la page ou réessayer plus tard.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '10px 20px', 
            marginTop: '20px', 
            cursor: 'pointer',
            background: 'hsl(var(--primary))',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Rafraîchir la page
        </button>
        <div style={{ marginTop: '20px' }}>
          {children}
        </div>
      </div>
    );
  }

  // Rendre Clerk normalement
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