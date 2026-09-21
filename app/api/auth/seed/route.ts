import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const devExists = await prisma.usuario.findFirst({
      where: { perfil: "DEV" }
    })

    if (devExists) {
      return NextResponse.json({ message: "Dev user already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash("senha123", 10)

    const user = await prisma.usuario.create({
      data: {
        nome: "Admin DEV",
        email: "dev@hermes.com",
        senha: hashedPassword,
        perfil: "DEV"
      }
    })

    return NextResponse.json({ message: "Dev user created", user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create seed user" }, { status: 500 })
  }
}
