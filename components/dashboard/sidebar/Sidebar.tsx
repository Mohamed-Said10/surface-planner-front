"use client";

import { LogoutButton } from "@/components/ui/LogoutButton";
import { Camera, HelpCircle, Home, LogOut, Settings, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/components/types/user";
import { cn } from "@/lib/utils";
import { DollarCircle, DollarCircleFull, CameraTool, CameraToolFull, CalendarDays, CalendarDaysFull, Home, HomeFull, Completedprojects, CompletedprojectsFull, Settings, Support, Message, MessageFull } from '@/components/icons';
import { DashIcon } from "@radix-ui/react-icons";


const ROLE_PATHS = {
  CLIENT: {
    base: '/dash/client',
    bookings: '/dash/client/bookings',
    messages: '/dash/client/messages',
    projects: '/dash/client/completed'
  },
  PHOTOGRAPHER: {
    base: '/dash/photographer',
    bookings: '/dash/photographer/bookings',
    messages: '/dash/photographer/messages',
    projects: '/dash/photographer/payments',

  },
  ADMIN: {
    base: '/dash/admin',
    bookings: '/dash/admin/bookings',
    messages: '/dash/admin/messages',
    projects: '/dash/admin/completed',
    photographers: '/dash/admin/photographers',
    payments: '/dash/admin/payments',
    support: '/dash/admin/support_tickets',
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
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Get user role safely, with fallback
  const userRole = (session?.user?.role as UserRole) || null;

  // Only get role paths if we have a valid user role
  const rolePaths = userRole ? getRolePaths(userRole) : null;
  const base = rolePaths?.base || '';
  const bookings = rolePaths?.bookings || '';
  const messages = rolePaths?.messages || '';
  const projects = rolePaths?.projects || '';
  const photographers = 'photographers' in (rolePaths || {}) ? (rolePaths as typeof ROLE_PATHS.ADMIN).photographers : '';
  const support = 'support' in (rolePaths || {}) ? (rolePaths as typeof ROLE_PATHS.ADMIN).support : '';
  const activePath = userRole === 'ADMIN' ? photographers : projects;

  // Helper functions
  const truncateEmail = (email: string | null | undefined) => {
    if (!email) return 'user@example.com';
    if (email.length <= 25) return email;
    return `${email.substring(0, 22)}...`;
  };

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (!base) return false;
    // Exact match for base dashboard route
    if (path === base) {
      return pathname === base;
    }
    if (
      userRole === 'ADMIN' &&
      path === bookings &&
      (pathname.startsWith(bookings) || pathname.startsWith('/dash/admin/booking-details'))
    ) {
      return true;
    }
    // For other routes, use startsWith
    return pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    if (status !== 'authenticated' || !userRole || !base) return;

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

  // Early return AFTER all hooks have been called
  if (status !== 'authenticated' || !session?.user?.role) return null;

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-white border-r">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <img src="/icons/logo.svg" alt="" />
          <span className="ml-2 text-xl font-semibold">Surface Planner</span>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        <a
          href="/dash"
          className={`flex items-center text-sm px-4 py-2 rounded-lg ${
            isActive('/dash') 
              ? 'bg-gray-100 text-[#0F553E]' 
              : 'text-[#646973] hover:bg-gray-100'
          }`}
        >
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </a>
        <a
          href="/dash/bookings"
          className={`flex items-center text-sm px-4 py-2 rounded-lg ${
            isActive('/dash/bookings') 
              ? 'bg-gray-100 text-[#0F553E]' 
              : 'text-[#646973] hover:bg-gray-100'
          }`}
        >
          {isActive(bookings) ? (
            <CalendarDaysFull className="h-5 w-5 mr-3" />
          ) : (
            <CalendarDays className="h-5 w-5 mr-3" />
          )}
          {userRole === 'ADMIN' ? 'Bookings' : 'My Bookings'}
        </button>

        <button
          onClick={() => handleNavigation(messages)}
          className={cn(
            "w-full flex items-center text-sm px-4 py-2 rounded-lg text-left transition-colors",
            isActive(messages)
              ? "bg-gray-100 text-[#0F553E]"
              : "text-[#646973] hover:bg-gray-100"
          )}
        >
          {isActive(messages) ? (
            <MessageFull className="h-5 w-5 mr-3" />
          ) : (
            <Message className="h-5 w-5 mr-3" />
          )}
          Messages
        </button>

        <button
          onClick={() => handleNavigation(userRole === 'ADMIN' ? photographers : projects)}

          className={cn(
            "w-full flex items-center text-sm px-4 py-2 rounded-lg text-left transition-colors",
            isActive(activePath)
              ? "bg-gray-100 text-[#0F553E]"
              : "text-[#646973] hover:bg-gray-100"
          )}
        >
          {userRole === 'PHOTOGRAPHER' ? (
            <>
              {isActive(projects) ? (
                <DollarCircleFull size={24} color="#000" className="h-5 w-5 mr-3" />
              ) : (
                <DollarCircle size={24} color="#000" className="h-5 w-5 mr-3" />
              )}
              Payments
            </>
          ) : userRole === 'ADMIN' ? (
            <>
              {isActive(photographers) ? (
                <CameraToolFull className="h-5 w-5 mr-3" />
              ) : (
                <CameraTool className="h-5 w-5 mr-3" />
              )}
              Photographers
            </>
          ) : (
            <>
              {isActive(activePath) ? (
                <CompletedprojectsFull className="h-5 w-5 mr-3" />
              ) : (
                <Completedprojects className="h-5 w-5 mr-3" />
              )}
              Completed Projects
            </>
          )}
        </button>
        {userRole === 'ADMIN' && (
          <button
            onClick={() => handleNavigation(ROLE_PATHS.ADMIN.payments)}
            className={cn(
              "w-full flex items-center text-sm px-4 py-2 rounded-lg text-left transition-colors",
              isActive(ROLE_PATHS.ADMIN.payments)
                ? "bg-gray-100 text-[#0F553E]"
                : "text-[#646973] hover:bg-gray-100"
            )}
          >
            {isActive(ROLE_PATHS.ADMIN.payments) ? (
              <DollarCircleFull className="h-5 w-5 mr-3" />
            ) : (
              <DollarCircle className="h-5 w-5 mr-3" />
            )}
            Payments
          </button>
        )}
        {userRole === "ADMIN" && (
          <button
            onClick={() => handleNavigation(ROLE_PATHS.ADMIN.support)}
            className={cn(
              "w-full flex items-center text-sm px-4 py-2 rounded-lg text-left transition-colors",
              isActive(ROLE_PATHS.ADMIN.support)
                ? "bg-gray-100 text-[#0F553E]"
                : "text-[#646973] hover:bg-gray-100"
            )}
          >
            {isActive(ROLE_PATHS.ADMIN.support) ? (
              <Support className="h-5 w-5 mr-3" />
            ) : (
              <Support className="h-5 w-5 mr-3" />
            )}
            Support & Tickets
          </button>
        )}
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
            <a 
              href="/dash/settings" 
              className={`w-full text-sm flex items-center px-4 py-2 text-left rounded-lg ${
                isActive('/dash/settings') 
                  ? 'bg-gray-100 text-[#0F553E]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </a>
            <a 
              href="/dash/support" 
              className={`w-full text-sm flex items-center px-4 py-2 text-left rounded-lg ${
                isActive('/dash/support') 
                  ? 'bg-gray-100 text-[#0F553E]' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </a>
            <LogoutButton/>
          </div>
        </div>
      </div>
    </div>
  );
}