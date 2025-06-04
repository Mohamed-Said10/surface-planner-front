"use client";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { Camera, HelpCircle, Home, Settings, CircleDollarSign } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/types/user";

const ROLE_PATHS = {
  CLIENT: {
    base: '/dash/client',
    bookings: '/dash/bookings',
    projects: '/dash/completed'
  },
  PHOTOGRAPHER: {
    base: '/dash/photographer',
    bookings: '/dash/photographer/bookings',
    projects: '/dash/photographer/payments'
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
  // console.log('sessionnnnnnnnnn:', session);
  const userRole = 'PHOTOGRAPHER' as UserRole;
  const { base, bookings, projects } = getRolePaths(userRole); 

  // Helper functions
  const truncateEmail = (email: string | null | undefined) => {
    if (!email) return 'user@example.com';
    return email.length <= 25 ? email : `${email.substring(0, 22)}...`;
  };

  const isActive = (path: string) => pathname.startsWith(path);

  // 5. Path validation effect
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
        <a
          href={base}
          className={`flex items-center text-sm px-4 py-2 rounded-lg ${
            isActive(base) 
              ? 'bg-gray-100 text-[#0F553E]' 
              : 'text-[#646973] hover:bg-gray-100'
          }`}
        >
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </a>

        <a
          href={bookings}
          className={`flex items-center text-sm px-4 py-2 rounded-lg ${
            isActive(bookings) 
              ? 'bg-gray-100 text-[#0F553E]' 
              : 'text-[#646973] hover:bg-gray-100'
          }`}
        >
          <Camera className="h-5 w-5 mr-3" />
          My Bookings
        </a>

        <a
          href={projects}
          className={`flex items-center text-sm px-4 py-2 rounded-lg ${
            isActive(projects) 
              ? 'bg-gray-100 text-[#0F553E]' 
              : 'text-[#646973] hover:bg-gray-100'
          }`}
        >
          <CircleDollarSign className="h-5 w-5 mr-3" />
          {userRole === 'PHOTOGRAPHER' ? 'Payments' : 'Completed Projects'}
        </a>
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
              href='/dash/settings'
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
              href='/dash/support'
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