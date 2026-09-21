import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.senha) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
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
