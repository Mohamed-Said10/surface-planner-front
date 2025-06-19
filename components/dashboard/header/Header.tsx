'use client';

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

// Configuration des pages avec leurs titres et sous-titres
const PAGE_CONFIG = {
  '/dash/client': {
    title: 'Dashboard',
    subtitle: "Here's the overview of your latest bookings.",
    showBookButton: true,
    showBookButtonAdmin: false,
  },
  '/dash/client/bookings': {
    title: 'My Bookings',
    subtitle: 'View and manage your upcoming bookings.',
    showBookButton: true,
    showBookButtonAdmin: false,
  },
  '/dash/client/completed': {
    title: 'Completed Projects',
    subtitle: 'Browse your completed projects and media.',
    showBookButton: true,
    showBookButtonAdmin: false,
  },
  '/dash/photographer': {
    title: 'Welcome Back [User Name]',
    subtitle: '',
    showBookButton: false,
    showBookButtonAdmin: false,
  },
  '/dash/photographer/bookings': {
    title: 'My Bookings',
    subtitle: '',
    showBookButton: false,
    showBookButtonAdmin: false,
  },
  '/dash/photographer/payments': {
    title: 'Payments',
    subtitle: '',
    showBookButton: false,
    showBookButtonAdmin: false,
  },
  '/dash/settings': {
    title: 'Settings',
    subtitle: 'Manage your account settings and preferences.',
    showBookButton: false,
    showBookButtonAdmin: false,
  },
  '/dash/admin': {
    title: 'Welcome Back [User Name]',
    subtitle: "",
    showBookButton: false,
    showBookButtonAdmin: false,
  },
  '/dash/admin/bookings': {
    title: 'Bookings',
    subtitle: "",
    showBookButton: false,
    showBookButtonAdmin: true // button for admin/bookings only based on Figma.
  },
  '/dash/admin/photographers': {
    title: 'Photographers Management',
    subtitle: "",
    showBookButton: false,
    showBookButtonAdmin: false 
  },
  '/dash/admin/payments': {
    title: 'Payments',
    subtitle: "",
    showBookButton: false,
    showBookButtonAdmin: false 
  }
} as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [previousPath, setPreviousPath] = useState<string>('');

  // Sauvegarder l'URL précédente dans sessionStorage
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      const storedPreviousPath = sessionStorage.getItem('previousPath');
      
      // Si on n'est pas sur une page de détails ET qu'on a un chemin précédent différent
      if (!currentPath.includes('/booking-details/') && storedPreviousPath !== currentPath) {
        sessionStorage.setItem('previousPath', currentPath);
        setPreviousPath(currentPath);
      }
    };

    // Sauvegarder le chemin actuel lors du premier chargement
    handleRouteChange();
    
    // Écouter les changements de route
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [pathname]);

  // Calculer les informations de la page de manière optimisée
  const pageInfo = useMemo(() => {
    // Vérifier si c'est une page de détails de réservation
    const bookingDetailsMatch = pathname.match(/^\/dash\/(photographer|admin)\/booking-details\/(.+)$/);

    if (bookingDetailsMatch) {
      return {
        title: 'Booking Details',
        subtitle: '',
        showBookButton: false,
        showBookButtonAdmin: false,
        showBackButton: true
      };
    }
    const photographerDetailsMatch = pathname.match(/^\/dash\/(photographer|admin)\/photographers-portfolio\/(.+)$/);

    if (photographerDetailsMatch) {
      return {
        title: 'Photographers Profile',
        subtitle: '',
        showBookButton: false,
        showBookButtonAdmin: false,
        showBackButton: true
      };
    }
    // Utiliser la configuration pour les autres pages
    const config = PAGE_CONFIG[pathname as keyof typeof PAGE_CONFIG];
    
    return {
      title: config?.title || 'Dashboard',
      subtitle: config?.subtitle || '',
      showBookButton: config?.showBookButton || false,
      showBookButtonAdmin: config?.showBookButtonAdmin || false,
      showBackButton: false
    };
  }, [pathname]);

  const handleBack = () => {
    const storedPreviousPath = sessionStorage.getItem('previousPath');
    
    if (storedPreviousPath && storedPreviousPath !== pathname) {
      router.push(storedPreviousPath);
    } else {
      // Fallback vers la page des bookings si pas d'historique
      router.push('/dash/photographer/bookings');
    }
  };

  const handleBookNewSession = () => {
    router.push('/booking');
  };

  const handleAddNewBooking = () => {
     // Still waiting for the function. 
  };

  return (
    <div className="flex justify-between items-center p-6">
      <div className="flex items-center gap-4">
        {pageInfo.showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {pageInfo.title}
          </h1>
          {pageInfo.subtitle && (
            <p className="text-gray-600 mt-1">
              {pageInfo.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {pageInfo.showBookButton && (
          <Button
            onClick={handleBookNewSession}
            className="flex items-center gap-2 bg-[#0F553E] hover:bg-[#689485]"
          >
            <Plus className="h-4 w-4" />
            Book a New Session
          </Button>
        )}

        {pageInfo.showBookButtonAdmin && (
          <Button
            onClick={handleAddNewBooking}
            variant="outline"
            className="flex items-center gap-2 text-[#101828] border-[#DBDCDF] hover:bg-gray-100"
          >
            Add a New Booking
          </Button>
        )}
      </div>
    </div>
  );
}
