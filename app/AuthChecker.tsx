'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getSession } from 'next-auth/react'

const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/verify']

// Define role-based access
const roleRouteAccess = {
  client: ['/dash/client', '/dash'],
  photographer: ['/dash/photographer'],
  admin: ['/dash/admin']
}

export default function AuthChecker() {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()

      // Allow access to public routes
      if (publicRoutes.some(route => pathname.startsWith(route))) {
        setChecked(true)
        return
      }

      // Redirect to login if no session
      if (!session) {
        router.replace(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`)
        return
      }

      // Check if user has access to current route based on role
      const userRole = session?.user?.role?.toLowerCase()
      const allowedRoutes = roleRouteAccess[userRole as keyof typeof roleRouteAccess]

      if (allowedRoutes && !allowedRoutes.some(route => pathname.startsWith(route))) {
        // Redirect to appropriate dashboard based on role
        switch (userRole) {
          case 'admin':
            router.replace('/dash/admin')
            break
          case 'photographer':
            router.replace('/dash/photographer')
            break
          case 'client':
            router.replace('/dash/client')
            break
          default:
            router.replace('/auth/login')
        }
        return
      }

      setChecked(true)
    }

    checkSession()
  }, [pathname, router])

  if (!checked) {
    return <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50" />
  }

  return null
}