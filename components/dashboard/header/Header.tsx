'use client';
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export default function Header() {
  const DASH_BASE = '/dash';
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [pageSubtitle, setPageSubtitle] = useState("Here's the overview of your latest bookings.");

  const user = {
    role: 'photographer',
  };

  useEffect(() => {
    const rolePathSegment = user.role === 'photographer' ? 'photographer' : '';
    // Normalize pathname relative to dashboard base and role
    let normalizedPath = pathname;

    // If photographer, strip "/dash/photographer" prefix to simplify matching
    if (rolePathSegment && pathname.startsWith(`${DASH_BASE}/${rolePathSegment}`)) {
      normalizedPath = pathname.replace(`${DASH_BASE}/${rolePathSegment}`, DASH_BASE);
    }

    switch (normalizedPath) {
      case DASH_BASE:
        setPageTitle(capitalize(`${rolePathSegment} Dashboard`));
        setPageSubtitle("Here's the overview of your latest bookings.");
        break;
      case `${DASH_BASE}/bookings`:
        setPageTitle(capitalize(`${rolePathSegment} - My Bookings`));
        setPageSubtitle('View and manage your upcoming bookings.');
        break;
      case `${DASH_BASE}/completed`: 
        setPageTitle(capitalize(`${rolePathSegment} - Completed Projects`));
        setPageSubtitle('Browse your completed projects and media.');
        break;
      case `${DASH_BASE}/settings`:
        setPageTitle('Settings');
        setPageSubtitle('Manage your account settings and preferences.');
        break;
      default:
        setPageTitle('Dashboard');
        setPageSubtitle('');
    }
  }, [pathname, user.role]);

  return (
    <div className="border-b bg-white sticky top-0 z-10">
      <div className="flex justify-between items-center px-8 py-4">
        <div>
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
          {pageSubtitle && (
            <p className="text-xs text-gray-500">{pageSubtitle}</p>
          )}
        </div>
        {pathname !== '/booking' && (
          <a href="/booking">
            <Button className="font-normal text-xs bg-[#0F553E] hover:bg-[#0F553E]/90">
              + Book a New Session
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
