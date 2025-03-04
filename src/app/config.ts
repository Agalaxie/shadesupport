// Configuration globale de l'application
export const runtime = 'nodejs';

// URLs de base
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shadesupport.vercel.app';
export const API_URL = `${BASE_URL}/api`;

// Configuration Clerk
export const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

// Configuration de la base de données
export const DATABASE_URL = process.env.DATABASE_URL;
export const DIRECT_URL = process.env.DIRECT_URL;

// Vérification des variables d'environnement requises
if (!CLERK_PUBLISHABLE_KEY) {
  console.error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined');
}

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not defined');
}

// Configuration des rôles
export const ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
};

// Configuration des statuts de ticket
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Configuration des priorités de ticket
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Configuration des catégories de ticket
export const TICKET_CATEGORY = {
  GENERAL: 'general',
  TECHNICAL: 'technical',
  BILLING: 'billing',
  FEATURE: 'feature',
  BUG: 'bug',
}; 