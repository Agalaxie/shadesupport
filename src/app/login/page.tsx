'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Importer la configuration pour désactiver l'Edge Runtime
import '@/app/not-edge-runtime';

export default function LoginPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Capturer les erreurs globales
    const handleError = (event: ErrorEvent) => {
      console.error('Erreur capturée:', event.error);
      setError(event.error?.message || 'Une erreur inconnue est survenue');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleLogin = () => {
    try {
      // Rediriger vers la page de connexion de Clerk
      window.location.href = '/sign-in';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de redirection');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connexion</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Connectez-vous à votre compte AppShade
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <p>Erreur: {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Rafraîchir la page
            </Button>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {isLoaded ? 'Page chargée avec succès!' : 'Chargement...'}
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleLogin}
              className="w-full"
            >
              Se connecter avec Clerk
            </Button>
            
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 