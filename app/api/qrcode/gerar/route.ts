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

    // Busca ou garante usuário atendente válido
    let targetUser = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    })

    if (!targetUser) {
      targetUser = await prisma.usuario.findFirst({
        where: { restauranteId, perfil: "ATENDENTE" }
      })
    }

    if (!targetUser) {
      targetUser = await prisma.usuario.create({
        data: {
          nome: "Atendente do Restaurante",
          email: `atendente-${Date.now()}@restaurante.local`,
          perfil: "ATENDENTE",
          restauranteId,
        }
      })
    }

    // Busca o restaurante para pegar o slug
    const restaurante = await prisma.restaurante.findUnique({
      where: { id: restauranteId }
    })

    if (!restaurante) {
      return NextResponse.json({ error: "Restaurante not found" }, { status: 404 })
    }

    const slug = restaurante.nome.toLowerCase().replace(/\s+/g, '-')

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + expiresInHours)

    const qrCode = await prisma.qRCode.create({
      data: {
        usuarioId: targetUser.id,
        restauranteId,
        slug,
        expiresAt,
        ativo: true,
      }
    })

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000"
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
    const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`
    const qrCodeUrl = `${baseUrl}/login/qr?token=${qrCode.token}`

    return NextResponse.json({ 
      qrCodeUrl, 
      token: qrCode.token, 
      expiresAt,
      usuarioNome: targetUser.nome,
    }, { status: 201 })
  } catch (error) {
    console.error("Error generating QR Code:", error)
    return NextResponse.json({ error: "Failed to generate QR Code" }, { status: 500 })
  }
}
