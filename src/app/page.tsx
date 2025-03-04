"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TicketIcon, UserIcon, ShieldIcon } from 'lucide-react'
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Redirection automatique si l'utilisateur est l'administrateur
  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress === 'stephdumaz@gmail.com') {
      router.push('/admin');
    }
  }, [user, router]);

  // Ce useEffect ne s'exécute que côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fonction pour obtenir le nom d'affichage de l'utilisateur de manière sécurisée
  const getUserDisplayName = () => {
    if (!user) return "utilisateur";
    
    if (user.firstName) return user.firstName;
    
    if (user.emailAddresses && user.emailAddresses.length > 0 && user.emailAddresses[0].emailAddress) {
      return user.emailAddresses[0].emailAddress;
    }
    
    return "utilisateur";
  };

  // Si l'utilisateur est l'admin, ne pas afficher la page d'accueil
  if (user?.emailAddresses?.[0]?.emailAddress === 'stephdumaz@gmail.com') {
    return null;
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1>AppShade - Support</h1>
      <p>Bienvenue sur la plateforme de gestion de tickets de support.</p>
      
      {isClient ? (
        <div style={{ marginTop: '20px' }}>
          <p>Application chargée avec succès côté client!</p>
          <div style={{ marginTop: '20px' }}>
            <Link href="/debug" style={{
              padding: '10px 15px',
              background: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              display: 'inline-block'
            }}>
              Page de débogage
            </Link>
          </div>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  )
} 