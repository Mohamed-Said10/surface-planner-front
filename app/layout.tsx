// app/layout.tsx
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import SessionProviderWrapper from './SessionProviderWrapper'
import './globals.css'
import { authOptions } from '@/lib/auth'

const geistSans = { subsets: ['latin'] }
const geistMono = { subsets: ['latin'] }

export const metadata: Metadata = {
  title: 'Surface Planner',
  description: 'Professional property services',
}

export default async function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await getServerSession(authOptions)
  
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper session={session}>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}