// Configuration pour Clerk
export const clerkConfig = {
  // Désactiver le stockage local pour éviter les erreurs
  // "Access to storage is not allowed from this context"
  disableSessionStorageInLocalStorage: true,
  
  // Utiliser les cookies pour le stockage de session
  useSessionCookies: true,
  
  // Configurer l'apparence
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