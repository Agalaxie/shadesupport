'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [info, setInfo] = useState<any>({
    loaded: true,
    error: null,
    env: {},
    domains: []
  });

  useEffect(() => {
    // Récupérer les informations sur l'environnement
    try {
      setInfo(prev => ({
        ...prev,
        env: {
          nodeEnv: process.env.NODE_ENV,
          hasClerkKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
          baseUrl: window.location.origin,
          hostname: window.location.hostname,
          pathname: window.location.pathname,
        },
        domains: [
          window.location.origin,
          window.location.hostname,
        ]
      }));
    } catch (error) {
      setInfo(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error)
      }));
    }
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>Page de débogage</h1>
      <p>Cette page n'utilise pas Clerk et devrait toujours s'afficher.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Informations</h2>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          overflow: 'auto'
        }}>
          {JSON.stringify(info, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Actions</h2>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 15px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Retour à l'accueil
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 15px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Rafraîchir la page
        </button>
      </div>
    </div>
  );
} 