import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^\w-]+/g, "") // remove all non-word chars
    .replace(/--+/g, "-"); // replace multiple - with single -
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const where: any = {};
    if (search) {
      where.nome = { contains: search, mode: "insensitive" };
    }

    const restaurantes = await prisma.restaurante.findMany({
      where,
      include: {
        _count: {
          select: {
            produtos: true,
            pedidos: true,
            usuarios: true,
          },
        },
      },
      orderBy: { nome: "asc" },
    });

    return NextResponse.json({ restaurantes });
  } catch (error) {
    console.error("Erro ao listar restaurantes:", error);
    return NextResponse.json(
      { error: "Falha ao listar restaurantes do sistema" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, logo, cores, horarios, slug: customSlug, criarProdutosExemplo } = body;

    if (!nome || typeof nome !== "string" || !nome.trim()) {
      return NextResponse.json(
        { error: "O nome do restaurante é obrigatório" },
        { status: 400 }
      );
    }

    const trimmedNome = nome.trim();
    const baseSlug = customSlug && typeof customSlug === "string" && customSlug.trim()
      ? slugify(customSlug.trim())
      : slugify(trimmedNome);

    if (!baseSlug) {
      return NextResponse.json(
        { error: "Identificador/slug inválido" },
        { status: 400 }
      );
    }

    const id = `rest-${baseSlug}`;

    // Verificar se já existe restaurante com esse id ou nome
    const restauranteExistente = await prisma.restaurante.findFirst({
      where: {
        OR: [
          { id },
          { nome: { equals: trimmedNome, mode: "insensitive" } },
        ],
      },
    });

    if (restauranteExistente) {
      return NextResponse.json(
        { error: `Já existe um restaurante com o nome ou identificador "${trimmedNome}" (${id})` },
        { status: 409 }
      );
    }

    // Normalizar cores
    let coresString: string | null = null;
    if (cores) {
      if (typeof cores === "object") {
        coresString = JSON.stringify(cores);
      } else if (typeof cores === "string") {
        coresString = cores;
      }
    } else {
      coresString = JSON.stringify({ primary: "#0F172A", secondary: "#38BDF8" });
    }

    const novoRestaurante = await prisma.restaurante.create({
      data: {
        id,
        nome: trimmedNome,
        logo: logo || null,
        cores: coresString,
        horarios: horarios || "Seg a Dom: 10:00 - 23:00",
      },
    });

    // Se solicitado criar cardápio de exemplo básico
    if (criarProdutosExemplo) {
      await prisma.produto.createMany({
        data: [
          {
            nome: "Prato Principal da Casa",
            preco: 25.0,
            categoria: "Principais",
            restauranteId: novoRestaurante.id,
          },
          {
            nome: "Bebida Refrescante 350ml",
            preco: 6.0,
            categoria: "Bebidas",
            restauranteId: novoRestaurante.id,
          },
          {
            nome: "Sobremesa Especial",
            preco: 12.0,
            categoria: "Sobremesas",
            restauranteId: novoRestaurante.id,
          },
        ],
      });
    }

    // Log de auditoria
    await prisma.log.create({
      data: {
        acao: `Criação do restaurante: ${trimmedNome} (${novoRestaurante.id})`,
        restauranteId: novoRestaurante.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        restaurante: novoRestaurante,
        slug: baseSlug,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao cadastrar restaurante:", error);
    return NextResponse.json(
      { error: error.message || "Falha interna ao criar restaurante" },
      { status: 500 }
    );
  }
}
