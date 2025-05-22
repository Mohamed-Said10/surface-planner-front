"use client";

import { LogoutButton } from "@/components/ui/LogoutButton";
import { Camera, HelpCircle, Home, LogOut, Settings, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const truncateEmail = (email: string | null | undefined) => {
    if (!email) return 'user@example.com';
    if (email.length <= 25) return email;
    return `${email.substring(0, 22)}...`;
  };

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/dash') {
      return pathname === path; // Requires exact match for dashboard
    }
    return pathname.startsWith(path); // Partial match for other routes
  };

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
          <Camera className="h-5 w-5 mr-3" />
          My Bookings
        </a>
        <a
          href="/dash/completed"
          className={`flex items-center text-sm px-4 py-2 rounded-lg ${
            isActive('/dash/completed') 
              ? 'bg-gray-100 text-[#0F553E]' 
              : 'text-[#646973] hover:bg-gray-100'
          }`}
        >
          <Video className="h-5 w-5 mr-3" />
          Completed Projects
        </a>
      </nav>

      <div className="absolute bottom-0 w-64 border-t">
        <div className="p-4">
          <div className="flex items-center mb-4">
            {session?.user?.image ? (
              <Image
                src={`https://planner-back-end-six.vercel.app${session.user.image}`}
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