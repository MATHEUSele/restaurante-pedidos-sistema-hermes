import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: { token },
      include: {
        usuario: true,
        restaurante: true
      }
    })

    if (!qrCode) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 })
    }

    if (!qrCode.ativo) {
      return NextResponse.json({ error: "Token is inactive" }, { status: 403 })
    }

    if (new Date() > qrCode.expiresAt) {
      return NextResponse.json({ error: "Token has expired" }, { status: 403 })
    }

    return NextResponse.json({ 
      valid: true,
      usuario: {
        id: qrCode.usuario.id,
        nome: qrCode.usuario.nome,
        perfil: qrCode.usuario.perfil
      },
      restaurante: {
        id: qrCode.restaurante?.id,
        nome: qrCode.restaurante?.nome,
        slug: qrCode.slug
      }
    }, { status: 200 })
  } catch (error) {
    console.error("Error validating QR Code:", error)
    return NextResponse.json({ error: "Failed to validate QR Code" }, { status: 500 })
  }
}
