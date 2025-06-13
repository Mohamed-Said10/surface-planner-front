"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@/components/types/user";

const ROLE_PATHS = {
  CLIENT: '/dash/client',
  PHOTOGRAPHER: '/dash/photographer',
  ADMIN: '/dash/admin'
} as const;

const getDashboardPath = (role: UserRole) => {
  return ROLE_PATHS[role] || '/dash/client';
};

export default function NotFound() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardPath, setDashboardPath] = useState('/dash/client');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const userRole = session.user.role as UserRole;
      setDashboardPath(getDashboardPath(userRole));
    }
  }, [session, status]);

  const handleLogoClick = () => {
    if (status === 'authenticated') {
      router.push(dashboardPath);
    } else {
      // Redirect to login or home page if not authenticated
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo - Clickable */}
        <div 
          onClick={handleLogoClick}
          className="cursor-pointer hover:opacity-80 transition-opacity duration-200 mb-8"
        >
          <div className="flex items-center justify-center">
            <img 
              src="/icons/logo.svg" 
              alt="Surface Planner Logo" 
              className="h-12 w-12"
            />
            <span className="ml-3 text-2xl font-semibold text-gray-900">
              Surface Planner
            </span>
          </div>
        </div>

        {/* 404 Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleLogoClick}
            className="w-full bg-[#0F553E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0d4a36] transition-colors duration-200"
          >
            {status === 'authenticated' ? 'Go to Dashboard' : 'Go to Home'}
          </button>
          
          <button
            onClick={() => router.back()}
            className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>

        {/* Additional Help Text */}
        <p className="text-sm text-gray-500 mt-8">
          Click on the logo above to return to your dashboard
        </p>
      </div>
    </div>
  );
}