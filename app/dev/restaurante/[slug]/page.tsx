"use client";

import { usePedido } from "../../../context/PedidoContext";
import { ArrowLeft, Store, Settings, ExternalLink, Check } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

import { useTheme, PALETTES } from "../../../context/ThemeContext";

export default function RestauranteDevDetails({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { pedidos } = usePedido();
  
  const { palette, setPalette } = useTheme();

  const isGalo = slug === "pastelaria-do-galo";

  if (!isGalo) {
    return <div style={{ padding: "2rem", color: "white" }}>Restaurante não encontrado.</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A", color: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <header style={{ padding: "2rem", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: "1rem", background: palette.prim }}>
        <Link href="/dev" style={{ color: palette.sec, textDecoration: "none" }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ margin: 0, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: palette.sec }}>
          <Store color={palette.sec} /> Pastelaria do Galo
        </h1>
      </header>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Detalhes do Restaurante */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "#1E293B", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #334155" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Settings size={20} color="#94A3B8" /> Configurações
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <p style={{ margin: "0 0 0.5rem 0", color: "#94A3B8", fontSize: "0.875rem" }}>Cores da Marca (Preview no Cabeçalho)</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                  {PALETTES.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => setPalette(p)}
                      style={{ 
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", cursor: "pointer",
                        padding: "0.5rem", borderRadius: "0.5rem", border: palette.id === p.id ? `2px solid ${p.sec}` : "2px solid transparent",
                        background: palette.id === p.id ? "rgba(255,255,255,0.05)" : "transparent"
                      }}
                      title={p.name}
                    >
                      <div style={{ position: "relative", width: 48, height: 48, borderRadius: "50%", background: p.prim, border: "2px solid #334155", overflow: "hidden" }}>
                        <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "50%", background: p.sec }}></div>
                        {palette.id === p.id && (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                            <Check size={20} color="white" />
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#94A3B8", textAlign: "center" }}>{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", color: "#94A3B8", fontSize: "0.875rem" }}>Links Rápidos</p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/atendente" style={{ color: "#38BDF8", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><ExternalLink size={14} /> Totem Atendente</Link>
                  <Link href="/adm" style={{ color: "#38BDF8", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><ExternalLink size={14} /> Painel ADM</Link>
                  <Link href="/cozinha" style={{ color: "#38BDF8", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><ExternalLink size={14} /> Cozinha</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visão Geral dos Pedidos (Admin Global) */}
        <div>
          <div style={{ background: "#1E293B", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #334155" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📦 Log de Pedidos Global ({pedidos.length})
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "400px", overflowY: "auto", paddingRight: "0.5rem" }}>
              {pedidos.length === 0 ? (
                <p style={{ color: "#94A3B8", margin: 0 }}>Nenhum pedido registrado no sistema.</p>
              ) : (
                [...pedidos].reverse().map(pedido => (
                  <div key={pedido.id} style={{ background: "#0F172A", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: "0 0 0.25rem 0", color: "#F8FAFC" }}>#{pedido.id}</h4>
                      <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.75rem" }}>{formatTime(pedido.createdAt)}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 0.25rem 0", color: "#F8FAFC", fontWeight: "bold" }}>{formatPrice(pedido.total)}</p>
                      <p style={{ margin: 0, color: "#38BDF8", fontSize: "0.75rem" }}>Status: {pedido.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
