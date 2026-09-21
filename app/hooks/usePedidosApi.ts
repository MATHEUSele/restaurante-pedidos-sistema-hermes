"use client";
import { useEffect, useState, useCallback } from "react";

export interface ItemApi {
  id: string;
  quantidade: number;
  precoUnitario: number;
  produto: { id: string; nome: string; preco: number } | null;
  nomeProduto?: string;
}

export interface PedidoApi {
  id: string;
  clienteNome: string | null;
  status: string;
  total: number;
  nota: string | null;
  agendadoPara: string | null;
  restauranteId: string;
  criadoEm: string;
  itens: ItemApi[];
}

interface Options {
  statusFilter?: string;
  restauranteId?: string;
  pollingInterval?: number;
}

export function usePedidosApi(options: Options = {}) {
  const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
  const [loading, setLoading] = useState(true);
  const { statusFilter, restauranteId, pollingInterval = 5000 } = options;

  const fetchPedidos = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (restauranteId) params.set("restauranteId", restauranteId);

      const res = await fetch(`/api/pedidos?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      }
    } catch (e) {
      console.error("Erro ao buscar pedidos", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, restauranteId]);

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchPedidos, pollingInterval]);

  const atualizarStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchPedidos();
    } catch (e) {
      console.error("Erro ao atualizar pedido", e);
    }
  };

  const criarPedido = async (payload: {
    restauranteId: string;
    clienteNome?: string;
    nota?: string;
    agendadoPara?: string;
    itens: Array<{ nomeProduto: string; quantidade: number; precoUnitario: number }>;
  }) => {
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchPedidos();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Erro ao criar pedido", e);
      return false;
    }
  };

  return { pedidos, loading, atualizarStatus, criarPedido, fetchPedidos };
}
