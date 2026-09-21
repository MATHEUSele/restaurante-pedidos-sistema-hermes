"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type StatusPedido = "PAGO" | "EM_PREPARO" | "PRONTO" | "ENTREGUE" | "CANCELADO";

export interface ItemPedido {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Pedido {
  id: string;
  items: ItemPedido[];
  total: number;
  status: StatusPedido;
  createdAt: Date;
  clienteNome?: string;
  nota?: string;
  agendadoPara?: string;
}

interface PedidoContextData {
  pedidos: Pedido[];
  adicionarPedido: (items: ItemPedido[], total: number, options?: { clienteNome?: string; nota?: string; agendadoPara?: string }) => void;
  atualizarStatus: (id: string, status: StatusPedido) => void;
}

const PedidoContext = createContext<PedidoContextData>({} as PedidoContextData);

export function PedidoProvider({ children }: { children: ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const adicionarPedido = (items: ItemPedido[], total: number, options?: { clienteNome?: string; nota?: string; agendadoPara?: string }) => {
    const novoPedido: Pedido = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items,
      total,
      status: "PAGO",
      createdAt: new Date(),
      ...options
    };
    setPedidos((prev) => [...prev, novoPedido]);
  };

  const atualizarStatus = (id: string, status: StatusPedido) => {
    setPedidos((prev) =>
      prev.map((pedido) => (pedido.id === id ? { ...pedido, status } : pedido))
    );
  };

  return (
    <PedidoContext.Provider value={{ pedidos, adicionarPedido, atualizarStatus }}>
      {children}
    </PedidoContext.Provider>
  );
}

export const usePedido = () => useContext(PedidoContext);
