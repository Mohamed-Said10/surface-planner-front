'use client'
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // 1. First call NextAuth signOut (which sends POST)
      await signOut({ redirect: false })

      // 2. Then call our API to clear cookies
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, {
        method: 'POST' // or 'GET' - both work now
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      // 3. Manual cleanup for any remaining cookies
      if (typeof window !== 'undefined') {
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=')
          if (name.startsWith('next-auth.') || name.startsWith('__Secure-next-auth.')) {
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          }
        })
      }

      // 4. Redirect and refresh
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to sign out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full text-sm flex items-center px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <LogOut className="h-4 w-4 mr-3" />
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}