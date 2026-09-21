import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from './context/ThemeContext'
import { Providers } from './Providers'

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
    <html lang="pt-BR">
      <body>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
