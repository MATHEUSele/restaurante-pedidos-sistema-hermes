import './globals.css'
import type { Metadata } from 'next'
import { PedidoProvider } from './context/PedidoContext'
import { ThemeProvider } from './context/ThemeContext'
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
        <ThemeProvider>
          <PedidoProvider>
            {children}
          </PedidoProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
