import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      perfil?: string
      restauranteId?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    perfil?: string
    restauranteId?: string | null
  }
}
