import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { auth } from "../../../../auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user.perfil !== "ADM" && session.user.perfil !== "DEV")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { usuarioId, restauranteId, expiresInHours = 24 } = body

    if (!usuarioId || !restauranteId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Busca o restaurante para pegar o slug (nome formatado simplificado por hora)
    const restaurante = await prisma.restaurante.findUnique({
      where: { id: restauranteId }
    })

    if (!restaurante) {
      return NextResponse.json({ error: "Restaurante not found" }, { status: 404 })
    }

    // Cria o slug simplificado a partir do nome
    const slug = restaurante.nome.toLowerCase().replace(/\s+/g, '-')

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + expiresInHours)

    const qrCode = await prisma.qRCode.create({
      data: {
        usuarioId,
        restauranteId,
        slug,
        expiresAt,
      }
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const qrCodeUrl = `${baseUrl}/totem/${slug}?token=${qrCode.token}`

    return NextResponse.json({ qrCodeUrl, token: qrCode.token, expiresAt }, { status: 201 })
  } catch (error) {
    console.error("Error generating QR Code:", error)
    return NextResponse.json({ error: "Failed to generate QR Code" }, { status: 500 })
  }
}
