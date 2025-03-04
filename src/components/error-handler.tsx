'use client';

import { useEffect } from 'react';

export function ErrorHandler({ children }: { children: React.ReactNode }) {
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
} 