import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import DesktopSidebar from '../components/Desktop-sidebar'
import DesktopRightBar from '@/components/Desktop-rightbar'
import { ThemeProvider } from 'next-themes'
import { BottomTabBar } from '@/components/Bottom-tab-bar'
import { Toaster } from '@/components/ui/sonner'
import { UserProvider } from '../../context/UserContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gistly',
  description:
    'A simple and fun social app for Nigerians to share, gist, and connect.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <UserProvider>
            <div className="flex min-h-screen">
              <div className="hidden lg:block w-72 flex-shrink-0">
                <DesktopSidebar />
              </div>

              <main className="flex-1 min-w-0 flex justify-center">
                <div className="w-full max-w-4xl px-4 pb-24 lg:px-6">
                  {children}
                </div>
              </main>

              <div className="hidden xl:block w-80 flex-shrink-0">
                <DesktopRightBar />
              </div>

              <Toaster />
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
