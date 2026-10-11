import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
        qrToken: { label: "QR Token", type: "text" },
      },
      async authorize(credentials) {
        // Fluxo de login via QR Code de Uso Único
        if (credentials?.qrToken) {
          const rawToken = (credentials.qrToken as string).trim()
          const qrCode = await prisma.qRCode.findUnique({
            where: { token: rawToken },
            include: {
              usuario: true,
              restaurante: true,
            },
          })

          if (!qrCode || !qrCode.ativo) {
            return null
          }

          if (new Date() > qrCode.expiresAt) {
            return null
          }

          // Invalida o token imediatamente: USO ÚNICO garantido
          await prisma.qRCode.update({
            where: { id: qrCode.id },
            data: { ativo: false },
          })

          return {
            id: qrCode.usuario.id,
            name: qrCode.usuario.nome,
            email: qrCode.usuario.email || `${qrCode.usuario.id}@qr.local`,
            perfil: qrCode.usuario.perfil || "ATENDENTE",
            restauranteId: qrCode.restauranteId || qrCode.usuario.restauranteId,
          }
        }

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const identifier = (credentials.email as string).trim()
        const rawPassword = (credentials.password as string).trim()

        const user = await prisma.usuario.findFirst({
          where: {
            OR: [
              { email: { equals: identifier, mode: "insensitive" } },
              { nome: { equals: identifier, mode: "insensitive" } },
              ...(identifier.toLowerCase() === "admin" ||
              identifier.toLowerCase() === "adm"
                ? [
                    { email: "adm@gmail.com" },
                    { email: "admin@hermes.com" },
                    { email: "admin@gmail.com" },
                  ]
                : []),
            ],
          },
        })

        if (!user || !user.senha) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(
          rawPassword,
          user.senha
        )

        if (!passwordsMatch) {
          return null
        }

        return {
          id: user.id,
          name: user.nome,
          email: user.email,
          perfil: user.perfil,
          restauranteId: user.restauranteId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.perfil = user.perfil
        token.restauranteId = user.restauranteId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.perfil = token.perfil as string
        session.user.restauranteId = token.restauranteId as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
