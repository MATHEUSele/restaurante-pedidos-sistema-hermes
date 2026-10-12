import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    // Aceita busca por id direto (ex: 'rest-pastelaria-do-galo'), slug sem prefixo ('pastelaria-do-galo'), ou uuid
    const possibleIds = [id, `rest-${id}`];

    const restaurante = await prisma.restaurante.findFirst({
      where: {
        OR: [
          { id: { in: possibleIds } },
          { nome: { equals: id.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
      include: {
        produtos: {
          orderBy: { categoria: "asc" },
        },
        _count: {
          select: {
            pedidos: true,
            usuarios: true,
            produtos: true,
          },
        },
      },
    });

    if (!restaurante) {
      return NextResponse.json(
        { error: "Restaurante não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ restaurante });
  } catch (error) {
    console.error("Erro ao buscar restaurante:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar restaurante" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nome, logo, cores, horarios } = body;

    const data: any = {};
    if (nome !== undefined) data.nome = nome.trim();
    if (logo !== undefined) data.logo = logo;
    if (cores !== undefined) {
      data.cores = typeof cores === "object" ? JSON.stringify(cores) : cores;
    }
    if (horarios !== undefined) data.horarios = horarios;

    const updated = await prisma.restaurante.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, restaurante: updated });
  } catch (error: any) {
    console.error("Erro ao atualizar restaurante:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar restaurante" },
      { status: 500 }
    );
  }
}
