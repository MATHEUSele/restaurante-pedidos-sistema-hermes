import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider as PaletteProvider } from './context/ThemeContext'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { Providers } from './Providers'
import { Inter } from 'next/font/google'
import { ToastProvider } from './context/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hermes - Pedidos',
  description: 'Sistema de pedidos para restaurantes',
}

import ThemeToggle from './components/ThemeToggle'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
      <body>
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <PaletteProvider>
              <ToastProvider>
                <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }}>
                  <ThemeToggle />
                </div>
                {children}
              </ToastProvider>
            </PaletteProvider>
          </Providers>
        </NextThemeProvider>
      </body>
    </html>
  )
}
