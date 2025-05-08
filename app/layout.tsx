// app/layout.tsx
import type { Metadata } from 'next'
import SessionProviderWrapper from './SessionProviderWrapper'
import './globals.css'

const geistSans ={ subsets: ['latin'] }
const geistMono = { subsets: ['latin'] }

export const metadata: Metadata = {
  title: 'Surface Planner',
  description: 'Professional property services',
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}