"use client";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { CircleCheckBig, HelpCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/components/types/user";
import { cn } from "@/lib/utils"; 
import { DollarCircle, CalendarDays, Home, Settings } from '@/components/icons';
import { DashIcon } from "@radix-ui/react-icons";

const ROLE_PATHS = {
  CLIENT: {
    base: '/dash/client',
    bookings: '/dash/client/bookings',
    projects: '/dash/client/completed'    
  },
  PHOTOGRAPHER: {
    base: '/dash/photographer',
    bookings: '/dash/photographer/bookings',
    projects: '/dash/photographer/payments',
  },
  ADMIN: {
    base: '/dash/admin',
    bookings: '/dash/admin/bookings',
    projects: '/dash/admin/completed'
  }
} as const;

const getRolePaths = (role: UserRole) => {
  if (!ROLE_PATHS[role]) {
    throw new Error(`Invalid role: ${role}`); 
  }
  return ROLE_PATHS[role];
};

const COMMON_ROUTES = ['/dash/settings', '/dash/support'];

export default function Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // const userRole = (session?.user?.role as UserRole); 
  const userRole = 'PHOTOGRAPHER' as UserRole;
  const { base, bookings, projects } = getRolePaths(userRole); 

  // Helper functions
  const truncateEmail = (email: string | null | undefined) => {
    if (!email) return 'user@example.com';
    return email.length <= 25 ? email : `${email.substring(0, 22)}...`;
  };

  const isActive = (path: string) => {
    // Exact match for base dashboard route
    if (path === base) {
      return pathname === base;
    }
    // For other routes, use startsWith
    return pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    if (status !== 'authenticated') return;

    // If path is a common route, allow access
    if (COMMON_ROUTES.some(route => pathname.startsWith(route))) {
      return;
    }

    // Admin can access all routes
    if (userRole === 'ADMIN') {
      return;
    }

    // Get all allowed paths for the current role
    const allowedPaths = Object.values(ROLE_PATHS[userRole]);
    
    // Check if current path belongs to another role's namespace
    const isOtherRolesPath = Object.entries(ROLE_PATHS)
      .filter(([role]) => role !== userRole) // exclude current role
      .some(([_, paths]) => {
        const otherRoleBase = paths.base;
        return pathname === otherRoleBase || pathname.startsWith(otherRoleBase + '/');
      });

    // Check if current path is explicitly allowed
    const isAllowed = allowedPaths.some(path => 
      pathname === path || pathname.startsWith(path + '/')
    );

    if (isOtherRolesPath || !isAllowed) {
      router.push(base);
    }
  }, [pathname, status, userRole, router, base]);

  if (status !== 'authenticated') return null;

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-white border-r">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <img src="/icons/logo.svg" alt="" />
          <span className="ml-2 text-xl font-semibold">Surface Planner</span>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        <button
          onClick={() => handleNavigation(base)}
          className={cn(
            "w-full flex items-center text-sm px-4 py-2 rounded-lg text-left transition-colors",
            isActive(base) 
              ? "bg-gray-100 text-[#0F553E]" 
              : "text-[#646973] hover:bg-gray-100"
          )}
        >
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </button>

        <button
          onClick={() => handleNavigation(bookings)}
          className={cn(
            "w-full flex items-center text-sm px-4 py-2 rounded-lg text-left transition-colors",
            isActive(bookings) 
              ? "bg-gray-100 text-[#0F553E]" 
              : "text-[#646973] hover:bg-gray-100"
          )}
        >
          <CalendarDays  className="h-5 w-5 mr-3" />
          My Bookings
        </button>

        <button
          onClick={() => handleNavigation(projects)}
          className={cn(
            "w-full flex items-center text-sm px-4 py-2 rounded-lg text-left transition-colors",
            isActive(projects) 
              ? "bg-gray-100 text-[#0F553E]" 
              : "text-[#646973] hover:bg-gray-100"
          )}
        >
          {userRole === 'PHOTOGRAPHER' ? (
            <>
              <DollarCircle size={24} color="#000" className="h-5 w-5 mr-3"/>
              Payments
            </>
          ) : (
            <>
              <CircleCheckBig className="h-5 w-5 mr-3" />
              Completed Projects
            </>
          )}
        </button>
      </nav>

      <div className="absolute bottom-0 w-64 border-t">
        <div className="p-4">
          <div className="flex items-center mb-4">
            {session?.user?.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${session.user.image}`}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate" style={{ maxWidth: '160px' }}>
                {truncateEmail(session?.user?.email)}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => handleNavigation('/dash/settings')}
              className={cn(
                "w-full text-sm flex items-center px-4 py-2 text-left rounded-lg transition-colors",
                isActive('/dash/settings') 
                  ? "bg-gray-100 text-[#0F553E]" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </button>
            <button 
              onClick={() => handleNavigation('/dash/support')}
              className={cn(
                "w-full text-sm flex items-center px-4 py-2 text-left rounded-lg transition-colors",
                isActive('/dash/support') 
                  ? "bg-gray-100 text-[#0F553E]" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </button>
            <LogoutButton/>
          </div>
        </div>
      </div>
    </div>
  );
}