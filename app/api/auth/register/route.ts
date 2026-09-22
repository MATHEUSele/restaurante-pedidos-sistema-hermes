import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { nome, email, senha } = await req.json()

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { message: "Nome, email e senha são obrigatórios." },
        { status: 400 }
      )
    }

    const userExists = await prisma.usuario.findUnique({
      where: { email },
    })

    if (userExists) {
      return NextResponse.json(
        { message: "Este e-mail já está em uso." },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(senha, 10)

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        perfil: "ADM", // Perfil padrão para novos cadastros
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
      },
    })

    return NextResponse.json(
      { message: "Usuário cadastrado com sucesso", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro no cadastro:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    )
  }
}
