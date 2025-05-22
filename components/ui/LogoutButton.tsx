'use client';

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Sign out and redirect to login
      await signOut({
        redirect: false,
        callbackUrl: 'https://sp-dashboard-nine.vercel.app/auth/login',
      });
      window.location.href = 'https://sp-dashboard-nine.vercel.app/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full text-sm flex items-center px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
    >
      <LogOut className="h-4 w-4 mr-3" />
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
