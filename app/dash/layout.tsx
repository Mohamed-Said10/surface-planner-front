import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import Header from '@/components/dashboard/header/Header';
import AuthChecker from '../AuthChecker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Surface Planner - Professional Property Services',
  description: 'High-quality property visualization and planning services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="surface-planner-theme"
        >
          <main>
            <div className="h-[100vh] bg-[#FDFDFD]">
                  <div>
                    {/* Sidebar */}
                    <Sidebar />
                    {/* Main Content */}
                    <div className="ml-64 h-[100vh]">
                      <Header />
                      {children}
                    </div>
                  </div>
                </div>
            </main>
        </ThemeProvider>
      </body>
    </html>
  );
}