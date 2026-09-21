import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");
    const restauranteId = searchParams.get("restauranteId");

    const where: any = {};
    if (statusParam) where.status = { in: statusParam.split(",") };
    if (restauranteId) where.restauranteId = restauranteId;

    const pedidos = await prisma.pedido.findMany({
      where,
      include: { itens: { include: { produto: true } } },
      orderBy: { criadoEm: "desc" },
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to list orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restauranteId, clienteNome, nota, agendadoPara, itens } = body;

    if (!restauranteId || !itens || !itens.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const total = itens.reduce((acc: number, item: any) => acc + (item.quantidade * item.precoUnitario), 0);

    const pedido = await prisma.pedido.create({
      data: {
        restauranteId,
        clienteNome: clienteNome || undefined,
        nota: nota || undefined,
        agendadoPara: agendadoPara || undefined,
        total,
        status: "PAGO",
        itens: {
          create: itens.map((i: any) => ({
            quantidade: i.quantidade,
            precoUnitario: i.precoUnitario,
            nomeProduto: i.nomeProduto,
          })),
        }
      },
      include: { itens: true }
    });

    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
