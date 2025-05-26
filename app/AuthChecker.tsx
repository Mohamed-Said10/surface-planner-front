'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getSession } from 'next-auth/react'

const publicRoutes = ['/auth/login', '/auth/signup']

export default function AuthChecker() {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()

      if (!session && !publicRoutes.includes(pathname)) {
        router.replace(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`)
        return
      }

      if (session?.user?.role?.toLowerCase() !== 'client') {
        router.replace('/auth/login')
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
