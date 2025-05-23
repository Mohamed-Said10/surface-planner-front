'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

const publicRoutes = ['/auth/login', '/auth/register']

export default function AuthChecker() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const initialCheckDone = useRef(false)

  const isPublic = publicRoutes.includes(pathname)

  useEffect(() => {
    // Don't check auth until session is fully loaded
    if (status === 'loading') return

    // Prevent multiple checks
    if (initialCheckDone.current) return
    initialCheckDone.current = true

    if (isPublic) {
      setChecked(true)
      return
    }

    if (status === 'unauthenticated') {
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    // Session exists but user data might be loading
    if (!session?.user) {
      console.warn('Session exists but user data not loaded')
      return
    }

    const role = session.user.role?.toLowerCase()
    if (role !== 'client') {
      router.replace('/auth/login')
      return
    }

    setChecked(true)
  }, [status, session, pathname, router, isPublic])

  if (!checked) {
    return <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50" />
  }

  return null
}