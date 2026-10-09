import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from './context/ThemeContext'
import { Providers } from './Providers'
import { Inter } from 'next/font/google'
import { ToastProvider } from './context/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hermes - Pedidos',
  description: 'Sistema de pedidos para restaurantes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>
        <Providers>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
