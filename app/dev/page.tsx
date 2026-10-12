"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Terminal,
  Menu,
  X,
  Search,
  ExternalLink,
  UtensilsCrossed,
  Receipt,
  RotateCw,
} from "lucide-react";
import Link from "next/link";
import RestauranteForm from "../components/RestauranteForm";

const NAV_LINKS = [
  { href: "/", label: "🏠 Home" },
  { href: "/dev", label: "💻 Workspace DEV" },
  { href: "/adm", label: "🛠️ Painel ADM" },
  { href: "/cozinha", label: "🍳 Cozinha" },
  { href: "/atendente", label: "🧾 Atendente" },
  { href: "/restaurantes/novo", label: "➕ Novo Restaurante" },
];

interface RestauranteData {
  id: string;
  nome: string;
  logo?: string | null;
  cores?: string | null;
  horarios?: string | null;
  _count?: {
    produtos: number;
    pedidos: number;
    usuarios: number;
  };
}

export default function DevWorkspace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [restaurantes, setRestaurantes] = useState<RestauranteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const carregarRestaurantes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/restaurantes");
      const data = await res.json();
      if (res.ok && data.restaurantes) {
        setRestaurantes(data.restaurantes);
      }
    } catch (err) {
      console.error("Erro ao carregar restaurantes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRestaurantes();
  }, []);

  const getSlug = (id: string) => {
    return id.replace(/^rest-/, "");
  };

  const getColors = (coresStr?: string | null) => {
    try {
      if (coresStr) {
        const parsed = JSON.parse(coresStr);
        return {
          primary: parsed.primary || "#1E293B",
          secondary: parsed.secondary || "#38BDF8",
        };
      }
    } catch {
      // json parse fallback
    }
    return { primary: "#1E293B", secondary: "#38BDF8" };
  };

  const filteredRestaurantes = restaurantes.filter((r) =>
    r.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A", color: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <header style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Terminal color="#38BDF8" /> Workspace do Desenvolvedor
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "0.5rem 1rem",
              background: "#38BDF8",
              color: "#0F172A",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Plus size={18} /> Novo Restaurante
          </button>

          {/* Hamburger */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: "transparent",
                border: "1px solid #334155",
                color: "white",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {menuOpen && (
              <nav
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "0.5rem",
                  background: "#1E293B",
                  borderRadius: "0.75rem",
                  padding: "0.5rem",
                  minWidth: 220,
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
                  border: "1px solid #334155",
                  zIndex: 50,
                }}
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "0.6rem 0.85rem",
                      color: "#F8FAFC",
                      textDecoration: "none",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Barra Superior de Ações e Filtro */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", margin: 0, color: "#F8FAFC" }}>
              Restaurantes Ativos ({restaurantes.length})
            </h2>
            <p style={{ margin: "0.25rem 0 0 0", color: "#94A3B8", fontSize: "0.85rem" }}>
              Gerencie estabelecimentos multi-tenant conectados ao Sistema Hermes
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Buscar restaurante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "0.5rem 1rem 0.5rem 2.2rem",
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "0.5rem",
                  color: "#F8FAFC",
                  fontSize: "0.875rem",
                  outline: "none",
                  width: "220px",
                }}
              />
              <Search size={16} color="#64748B" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>

            <button
              onClick={carregarRestaurantes}
              title="Atualizar lista"
              style={{
                background: "#1E293B",
                border: "1px solid #334155",
                color: "#94A3B8",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
              }}
            >
              <RotateCw size={18} />
            </button>
          </div>
        </div>

        {/* Loading ou Grid de Restaurantes */}
        {loading ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#94A3B8" }}>
            <p>Carregando estabelecimentos...</p>
          </div>
        ) : filteredRestaurantes.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center", background: "#1E293B", borderRadius: "1rem", border: "1px dashed #334155" }}>
            <Building2 size={48} color="#64748B" style={{ margin: "0 auto 1rem auto" }} />
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#F8FAFC" }}>Nenhum restaurante encontrado</h3>
            <p style={{ color: "#94A3B8", margin: "0 0 1.5rem 0", fontSize: "0.875rem" }}>
              Cadastre sua primeira unidade para começar a receber pedidos e configurar o totem.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: "0.6rem 1.25rem",
                background: "#38BDF8",
                color: "#0F172A",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Plus size={18} /> Cadastrar Restaurante
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filteredRestaurantes.map((rest) => {
              const colors = getColors(rest.cores);
              const slug = getSlug(rest.id);

              return (
                <div
                  key={rest.id}
                  style={{
                    background: "#1E293B",
                    borderRadius: "1rem",
                    border: "1px solid #334155",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1.25rem",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px -10px rgba(0,0,0,0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "0.75rem",
                        backgroundColor: colors.primary,
                        color: colors.secondary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${colors.secondary}`,
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      {rest.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={rest.logo} alt={rest.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => ((e.target as any).style.display = "none")} />
                      ) : (
                        <Building2 size={28} />
                      )}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.2rem", color: "#F8FAFC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {rest.nome}
                      </h3>
                      <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.8rem" }}>
                        Slug: <code>{slug}</code>
                      </p>
                      <div style={{ marginTop: "0.5rem", display: "inline-block", background: "rgba(56, 189, 248, 0.1)", color: "#38BDF8", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: "bold" }}>
                        Status: Ativo
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas / Detalhes */}
                  <div style={{ display: "flex", gap: "1rem", background: "#0F172A", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #334155", fontSize: "0.8rem", color: "#CBD5E1" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <UtensilsCrossed size={14} color="#38BDF8" />
                      <span>{rest._count?.produtos ?? 0} Produtos</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Receipt size={14} color="#10B981" />
                      <span>{rest._count?.pedidos ?? 0} Pedidos</span>
                    </div>
                  </div>

                  {/* Ações / Links */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid #334155" }}>
                    <Link
                      href={`/dev/restaurante/${slug}`}
                      style={{
                        color: "#38BDF8",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      Gerenciar Detalhes &rarr;
                    </Link>

                    <Link
                      href={`/totem/${slug}`}
                      target="_blank"
                      style={{
                        color: "#94A3B8",
                        textDecoration: "none",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <span>Abrir Totem</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Criação Rápida de Restaurante */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1.5rem",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#131C31",
              border: "1px solid #334155",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                right: "1.5rem",
                top: "1.5rem",
                background: "transparent",
                border: "none",
                color: "#94A3B8",
                cursor: "pointer",
                padding: "0.25rem",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "1.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Building2 color="#38BDF8" size={24} /> Cadastrar Novo Restaurante
              </h2>
              <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.875rem" }}>
                Defina o nome, cores da marca e cardápio de testes para a nova unidade.
              </p>
            </div>

            <RestauranteForm
              onSuccess={() => {
                carregarRestaurantes();
                setIsModalOpen(false);
              }}
              onCancel={() => setIsModalOpen(false)}
              redirectOnSuccess={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
