"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export default function SessionProviderWrapper({
  children,
  session, // Add this prop
}: {
  children: React.ReactNode;
  session?: Session | null; // Type it with next-auth's Session type
}) {
  return (
    <SessionProvider
      session={session || undefined}
      refetchInterval={5 * 60} // 5 minutes instead of default 60s
      refetchOnWindowFocus={false} // Disable refetch on focus
    >
      {children}
    </SessionProvider>
  );
}