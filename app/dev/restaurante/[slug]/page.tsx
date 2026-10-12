"use client";

import { usePedidosApi } from "../../../hooks/usePedidosApi";
import { ArrowLeft, Store, Settings, ExternalLink, Check, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const PALETTES = [
  { id: "galo", name: "Galo (Padrão)", prim: "#7A1E2E", sec: "#F5C518" },
  { id: "tech", name: "Tech Blue", prim: "#2563EB", sec: "#FCD34D" },
  { id: "coffee", name: "Coffee Shop", prim: "#78350F", sec: "#D97706" },
  { id: "neon", name: "Neon Vibes", prim: "#0F172A", sec: "#10B981" },
  { id: "berry", name: "Berry Mix", prim: "#86198F", sec: "#F472B6" },
  { id: "mint", name: "Mint Fresh", prim: "#065F46", sec: "#34D399" },
  { id: "sunset", name: "Sunset Orange", prim: "#9A3412", sec: "#FB923C" },
  { id: "ocean", name: "Ocean Depth", prim: "#1E3A8A", sec: "#38BDF8" },
  { id: "dark", name: "Dark Knight", prim: "#111827", sec: "#F3F4F6" },
  { id: "emerald", name: "Emerald", prim: "#047857", sec: "#A7F3D0" },
  { id: "purple", name: "Royal Purple", prim: "#5B21B6", sec: "#C4B5FD" },
  { id: "rose", name: "Rose Gold", prim: "#9F1239", sec: "#FECDD3" },
  { id: "amber", name: "Amber Warmth", prim: "#B45309", sec: "#FDE68A" },
  { id: "cyan", name: "Cyber Cyan", prim: "#155E75", sec: "#67E8F9" },
  { id: "slate", name: "Slate Minimal", prim: "#334155", sec: "#94A3B8" },
  { id: "indigo", name: "Indigo Night", prim: "#312E81", sec: "#818CF8" },
];

export default function RestauranteDevDetails({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [restaurante, setRestaurante] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingColors, setSavingColors] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [palette, setPalette] = useState(PALETTES[0]);

  // Carregar dados reais do restaurante
  useEffect(() => {
    async function loadRestaurante() {
      setLoading(true);
      try {
        const res = await fetch(`/api/restaurantes/${slug}`);
        const data = await res.json();
        if (res.ok && data.restaurante) {
          setRestaurante(data.restaurante);

          // Ajustar paleta caso o restaurante já tenha cores gravadas
          if (data.restaurante.cores) {
            try {
              const parsed = JSON.parse(data.restaurante.cores);
              setPalette({
                id: "custom",
                name: "Marca Cadastrada",
                prim: parsed.primary || PALETTES[0].prim,
                sec: parsed.secondary || PALETTES[0].sec,
              });
            } catch {
              // fallback
            }
          }
        }
      } catch (err) {
        console.error("Erro ao carregar restaurante:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurante();
  }, [slug]);

  const targetId = restaurante?.id || `rest-${slug}`;
  const { pedidos } = usePedidosApi({ restauranteId: targetId });

  const salvarPaleta = async () => {
    if (!restaurante) return;
    setSavingColors(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/restaurantes/${restaurante.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cores: { primary: palette.prim, secondary: palette.sec },
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Erro ao salvar paleta:", err);
    } finally {
      setSavingColors(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  };

  const formatTime = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(dateString));
    } catch {
      return "Agora";
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
        <Loader2 className="animate-spin" size={32} />
        <span style={{ marginLeft: "0.75rem" }}>Carregando dados do restaurante...</span>
      </div>
    );
  }

  if (!restaurante) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0F172A", padding: "4rem 2rem", textAlign: "center", color: "#F8FAFC" }}>
        <h2>Restaurante não encontrado</h2>
        <p style={{ color: "#94A3B8" }}>O identificador &quot;{slug}&quot; não corresponde a nenhum estabelecimento cadastrado.</p>
        <Link href="/dev" style={{ color: "#38BDF8", textDecoration: "underline", marginTop: "1rem", display: "inline-block" }}>
          Voltar para o Workspace DEV
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A", color: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <header
        style={{
          padding: "2rem",
          borderBottom: "1px solid #1E293B",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: palette.prim,
          transition: "background 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/dev" style={{ color: palette.sec, textDecoration: "none" }}>
            <ArrowLeft size={24} />
          </Link>
          <h1 style={{ margin: 0, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: palette.sec }}>
            <Store color={palette.sec} /> {restaurante.nome}
          </h1>
        </div>

        <Link
          href={`/totem/${slug}`}
          target="_blank"
          style={{
            backgroundColor: palette.sec,
            color: palette.prim,
            textDecoration: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <span>Abrir Cardápio / Totem</span>
          <ExternalLink size={16} />
        </Link>
      </header>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Detalhes do Restaurante e Cores */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "#1E293B", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Settings size={20} color="#94A3B8" /> Configurações de Marca
              </h2>
              <button
                onClick={salvarPaleta}
                disabled={savingColors}
                style={{
                  padding: "0.4rem 0.8rem",
                  background: saveSuccess ? "#10B981" : "#38BDF8",
                  color: "#0F172A",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {savingColors ? <Loader2 size={14} className="animate-spin" /> : saveSuccess ? <Check size={14} /> : <Save size={14} />}
                <span>{saveSuccess ? "Salvo!" : "Salvar Cores"}</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <p style={{ margin: "0 0 0.5rem 0", color: "#94A3B8", fontSize: "0.875rem" }}>
                  Cores da Marca (Clique para testar e use &quot;Salvar Cores&quot; para persistir):
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                  {PALETTES.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPalette(p)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: palette.id === p.id ? `2px solid ${p.sec}` : "2px solid transparent",
                        background: palette.id === p.id ? "rgba(255,255,255,0.05)" : "transparent",
                      }}
                      title={p.name}
                    >
                      <div style={{ position: "relative", width: 44, height: 44, borderRadius: "50%", background: p.prim, border: "2px solid #334155", overflow: "hidden" }}>
                        <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "50%", background: p.sec }} />
                        {palette.id === p.id && (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                            <Check size={18} color="white" />
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#94A3B8", textAlign: "center" }}>{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações da Unidade */}
              <div style={{ background: "#0F172A", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #334155" }}>
                <p style={{ margin: "0 0 0.25rem 0", color: "#CBD5E1", fontSize: "0.85rem" }}>
                  <strong>ID Técnico:</strong> <code>{restaurante.id}</code>
                </p>
                <p style={{ margin: "0 0 0.25rem 0", color: "#CBD5E1", fontSize: "0.85rem" }}>
                  <strong>Horários:</strong> {restaurante.horarios || "Não informado"}
                </p>
                <p style={{ margin: 0, color: "#CBD5E1", fontSize: "0.85rem" }}>
                  <strong>Cardápio:</strong> {restaurante.produtos?.length ?? 0} itens cadastrados
                </p>
              </div>

              <div>
                <p style={{ margin: "0 0 0.25rem 0", color: "#94A3B8", fontSize: "0.875rem" }}>Links Rápidos</p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/atendente" style={{ color: "#38BDF8", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <ExternalLink size={14} /> Totem Atendente
                  </Link>
                  <Link href="/adm" style={{ color: "#38BDF8", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <ExternalLink size={14} /> Painel ADM
                  </Link>
                  <Link href="/cozinha" style={{ color: "#38BDF8", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <ExternalLink size={14} /> Cozinha
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visão Geral dos Pedidos */}
        <div>
          <div style={{ background: "#1E293B", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #334155" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📦 Pedidos Registrados ({pedidos.length})
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "400px", overflowY: "auto", paddingRight: "0.5rem" }}>
              {pedidos.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>
                  <p style={{ margin: 0 }}>Nenhum pedido registrado nesta unidade ainda.</p>
                  <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Faça um pedido de teste no Totem Mobile para visualizar o fluxo em tempo real.</p>
                </div>
              ) : (
                [...pedidos].reverse().map((pedido) => (
                  <div
                    key={pedido.id}
                    style={{
                      background: "#0F172A",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #334155",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 0.25rem 0", color: "#F8FAFC" }}>#{pedido.id.slice(0, 8)}</h4>
                      <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.75rem" }}>{formatTime(pedido.criadoEm)}</p>
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
