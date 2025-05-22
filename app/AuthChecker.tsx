'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role: string
      };
    }
  }

const publicRoutes = ['/auth/login', '/auth/register', '/auth/login']

export default function AuthChecker() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  const isPublic = publicRoutes.includes(pathname)

  useEffect(() => {
    // Don't check auth until session is fully loaded
    if (status === 'loading') return

    if (isPublic) {
      setChecked(true)
      return
    }

    if (status === 'unauthenticated') {
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    console.log('Session:', session)

    // Wait until session is fully loaded even if status is 'authenticated'
    if (!session || !session.user) return

    const role = session.user.role?.toLowerCase()
    if (role != 'client') {
      router.replace('/auth/login')
      return
    }

    setChecked(true)
  }, [status, session, pathname, router, isPublic])

  // Gate rendering until auth check passes
  if (!checked) {
    return <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50" />
  }

  return null
}
