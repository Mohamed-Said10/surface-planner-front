// hooks/useTypedSession.ts
'use client';

import { useSession as useAuthSession } from 'next-auth/react';

export function useSession() {
  const { data: session, ...rest } = useAuthSession();
  
  return {
    ...rest,
    data: session as {
      user: {
        id: string;
        name?: string;
        email?: string;
        image?: string;
        role: string;
        firstname: string;
        lastname: string;
        phoneNumber?: string;
        dateOfBirth?: string;
        address?: string;
      };
      expires: string;
    } | null,
  };
}