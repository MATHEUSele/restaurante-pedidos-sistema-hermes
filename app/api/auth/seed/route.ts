import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const senhaHash = await bcrypt.hash("senha123", 10)

    // Cria ou atualiza o restaurante principal
    const restaurante = await prisma.restaurante.upsert({
      where: { id: "rest-pastelaria-do-galo" },
      update: {},
      create: {
        id: "rest-pastelaria-do-galo",
        nome: "Pastelaria do Galo",
        cores: JSON.stringify({ prim: "#7A1E2E", sec: "#F5C518" }),
      },
    })

    const usuariosData = [
      {
        nome: "Admin Principal",
        email: "adm@hermes.com",
        senha: senhaHash,
        perfil: "ADM",
        restauranteId: restaurante.id,
      },
      {
        nome: "Equipe Cozinha",
        email: "cozinha@hermes.com",
        senha: senhaHash,
        perfil: "COZINHA",
        restauranteId: restaurante.id,
      },
      {
        nome: "Desenvolvedor",
        email: "dev@hermes.com",
        senha: senhaHash,
        perfil: "DEV",
        restauranteId: restaurante.id,
      },
    ]

    let user
    for (const userData of usuariosData) {
      user = await prisma.usuario.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
      })
    }

    return NextResponse.json({ message: "Dev user created", user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create seed user" }, { status: 500 })
  }
}
