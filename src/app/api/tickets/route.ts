import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

// Configuration Prisma optimisée pour serverless
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
} as const;

// GET /api/tickets
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Utilisation de prisma.$transaction pour optimiser les requêtes
    const [user, tickets] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      }),
      prisma.ticket.findMany({
        where: {
          OR: [
            { userId },
            { user: { role: 'admin' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: userSelect },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              user: { select: userSelect }
            }
          },
        },
      })
    ]);

    // Filtrer les tickets selon le rôle
    const filteredTickets = user?.role === 'admin' ? tickets : tickets.filter(t => t.userId === userId);

    return NextResponse.json(filteredTickets, {
      headers: {
        // Aide Vercel à optimiser le cache
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
      }
    });
  } catch (error) {
    console.error('GET /tickets error:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Impossible de récupérer les tickets' }, 
      { status: 500 }
    );
  }
}

// POST /api/tickets
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validation des champs requis
    if (!data.title?.trim() || !data.description?.trim()) {
      return NextResponse.json(
        { error: 'Le titre et la description sont obligatoires' },
        { status: 400 }
      );
    }

    // Création du ticket avec valeurs par défaut dans une transaction
    const ticket = await prisma.$transaction(async (tx) => {
      // Vérifier si l'utilisateur existe
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return tx.ticket.create({
        data: {
          title: data.title.trim(),
          description: data.description.trim(),
          status: 'open',
          priority: data.priority || 'medium',
          category: data.category || 'other',
          userId,
          // Informations d'accès optionnelles
          ...(data.ftpHost && {
            ftpHost: data.ftpHost,
            ftpPort: data.ftpPort,
            ftpUsername: data.ftpUsername,
            ftpPassword: data.ftpPassword,
          }),
          ...(data.cmsType && {
            cmsType: data.cmsType,
            cmsUrl: data.cmsUrl,
            cmsUsername: data.cmsUsername,
            cmsPassword: data.cmsPassword,
          }),
          ...(data.hostingProvider && {
            hostingProvider: data.hostingProvider,
            hostingPlan: data.hostingPlan,
          }),
        },
        include: {
          user: { select: userSelect }
        }
      });
    });
    
    return NextResponse.json(ticket, { 
      status: 201,
      headers: {
        // Indique à Vercel de ne pas mettre en cache les POST
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('POST /tickets error:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Impossible de créer le ticket' }, 
      { status: 500 }
    );
  }
} 