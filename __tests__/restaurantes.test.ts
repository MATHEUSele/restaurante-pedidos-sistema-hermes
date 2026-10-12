import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock do prisma
vi.mock("../lib/prisma", () => ({
  prisma: {
    restaurante: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    produto: {
      createMany: vi.fn(),
    },
    log: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "../lib/prisma";
import { GET as getRestaurantes, POST as postRestaurante } from "../app/api/restaurantes/route";
import { GET as getRestauranteById } from "../app/api/restaurantes/[id]/route";

describe("Restaurantes API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/restaurantes", () => {
    it("deve listar todos os restaurantes com contagem de produtos e pedidos", async () => {
      const mockList = [
        {
          id: "rest-pastelaria-do-galo",
          nome: "Pastelaria do Galo",
          _count: { produtos: 24, pedidos: 5, usuarios: 3 },
        },
      ];
      vi.mocked(prisma.restaurante.findMany).mockResolvedValue(mockList as any);

      const req = new NextRequest("http://localhost:3000/api/restaurantes");
      const res = await getRestaurantes(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.restaurantes).toHaveLength(1);
      expect(data.restaurantes[0].nome).toBe("Pastelaria do Galo");
    });
  });

  describe("POST /api/restaurantes", () => {
    it("deve retornar 400 se o nome for omitido ou vazio", async () => {
      const req = new NextRequest("http://localhost:3000/api/restaurantes", {
        method: "POST",
        body: JSON.stringify({ nome: "" }),
      });

      const res = await postRestaurante(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain("nome do restaurante é obrigatório");
    });

    it("deve retornar 409 se já existir restaurante com mesmo identificador ou nome", async () => {
      vi.mocked(prisma.restaurante.findFirst).mockResolvedValue({
        id: "rest-pizzaria-roma",
        nome: "Pizzaria Roma",
      } as any);

      const req = new NextRequest("http://localhost:3000/api/restaurantes", {
        method: "POST",
        body: JSON.stringify({ nome: "Pizzaria Roma" }),
      });

      const res = await postRestaurante(req);
      const data = await res.json();

      expect(res.status).toBe(409);
      expect(data.error).toContain("Já existe um restaurante");
    });

    it("deve criar novo restaurante com sucesso e registrar log", async () => {
      vi.mocked(prisma.restaurante.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.restaurante.create).mockResolvedValue({
        id: "rest-sushi-master",
        nome: "Sushi Master",
        logo: null,
        cores: JSON.stringify({ primary: "#1E293B", secondary: "#38BDF8" }),
        horarios: "Seg a Sex 18h as 23h",
      } as any);

      const req = new NextRequest("http://localhost:3000/api/restaurantes", {
        method: "POST",
        body: JSON.stringify({
          nome: "Sushi Master",
          criarProdutosExemplo: true,
        }),
      });

      const res = await postRestaurante(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.restaurante.nome).toBe("Sushi Master");
      expect(prisma.produto.createMany).toHaveBeenCalled();
      expect(prisma.log.create).toHaveBeenCalled();
    });
  });

  describe("GET /api/restaurantes/[id]", () => {
    it("deve retornar restaurante existente pelo slug", async () => {
      vi.mocked(prisma.restaurante.findFirst).mockResolvedValue({
        id: "rest-sushi-master",
        nome: "Sushi Master",
        produtos: [],
      } as any);

      const req = new NextRequest("http://localhost:3000/api/restaurantes/sushi-master");
      const res = await getRestauranteById(req, {
        params: Promise.resolve({ id: "sushi-master" }),
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.restaurante.nome).toBe("Sushi Master");
    });

    it("deve retornar 404 para restaurante inexistente", async () => {
      vi.mocked(prisma.restaurante.findFirst).mockResolvedValue(null);

      const req = new NextRequest("http://localhost:3000/api/restaurantes/nao-existe");
      const res = await getRestauranteById(req, {
        params: Promise.resolve({ id: "nao-existe" }),
      });
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toBe("Restaurante não encontrado");
    });
  });
});
