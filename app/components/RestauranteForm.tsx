"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Sparkles,
  Check,
  Clock,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

export const PRESET_PALETTES = [
  { id: "galo", name: "Galo (Vinho & Ouro)", prim: "#7A1E2E", sec: "#F5C518" },
  { id: "tech", name: "Tech Blue", prim: "#2563EB", sec: "#FCD34D" },
  { id: "coffee", name: "Coffee Shop", prim: "#78350F", sec: "#D97706" },
  { id: "neon", name: "Neon Vibes", prim: "#0F172A", sec: "#10B981" },
  { id: "berry", name: "Berry Mix", prim: "#86198F", sec: "#F472B6" },
  { id: "mint", name: "Mint Fresh", prim: "#065F46", sec: "#34D399" },
  { id: "sunset", name: "Sunset Orange", prim: "#9A3412", sec: "#FB923C" },
  { id: "ocean", name: "Ocean Depth", prim: "#1E3A8A", sec: "#38BDF8" },
  { id: "cyber", name: "Cyber Cyan", prim: "#155E75", sec: "#67E8F9" },
  { id: "dark", name: "Dark Slate", prim: "#1E293B", sec: "#94A3B8" },
];

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

interface RestauranteFormProps {
  onSuccess?: (restaurante: any) => void;
  onCancel?: () => void;
  redirectOnSuccess?: boolean;
}

export default function RestauranteForm({
  onSuccess,
  onCancel,
  redirectOnSuccess = true,
}: RestauranteFormProps) {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [horarios, setHorarios] = useState("Seg a Dom: 11:00 às 23:00");
  const [selectedPalette, setSelectedPalette] = useState(PRESET_PALETTES[1]);
  const [customPrim, setCustomPrim] = useState(PRESET_PALETTES[1].prim);
  const [customSec, setCustomSec] = useState(PRESET_PALETTES[1].sec);
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [criarProdutosExemplo, setCriarProdutosExemplo] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleNomeChange = (val: string) => {
    setNome(val);
    setSlug(slugify(val));
  };

  const handleSelectPalette = (pal: typeof PRESET_PALETTES[0]) => {
    setSelectedPalette(pal);
    setCustomPrim(pal.prim);
    setCustomSec(pal.sec);
    setIsCustomColor(false);
  };

  const activePrim = isCustomColor ? customPrim : selectedPalette.prim;
  const activeSec = isCustomColor ? customSec : selectedPalette.sec;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!nome.trim()) {
      setError("Por favor, digite o nome do restaurante.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/restaurantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          slug: slug.trim() || undefined,
          logo: logo.trim() || undefined,
          horarios: horarios.trim(),
          cores: {
            primary: activePrim,
            secondary: activeSec,
          },
          criarProdutosExemplo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao registrar novo restaurante");
      }

      setSuccessMsg(`Restaurante "${data.restaurante.nome}" cadastrado com sucesso!`);

      if (onSuccess) {
        onSuccess(data.restaurante);
      }

      if (redirectOnSuccess) {
        setTimeout(() => {
          router.push(`/dev/restaurante/${data.slug || slug}`);
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao cadastrar restaurante.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid #EF4444",
            color: "#FCA5A5",
            padding: "0.875rem 1rem",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
          }}
        >
          <AlertCircle size={20} color="#EF4444" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid #10B981",
            color: "#6EE7B7",
            padding: "0.875rem 1rem",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
          }}
        >
          <CheckCircle2 size={20} color="#10B981" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Campos Principais + Live Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {/* Coluna 1: Dados do Restaurante */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Nome do Estabelecimento *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Pizzaria Forno Nobre"
              value={nome}
              onChange={(e) => handleNomeChange(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                backgroundColor: "#0F172A",
                border: "1px solid #334155",
                color: "#F8FAFC",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94A3B8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.35rem" }}>
              Identificador (Slug para URL / Totem)
            </label>
            <div style={{ display: "flex", alignItems: "center", background: "#0F172A", border: "1px solid #334155", borderRadius: "0.5rem", padding: "0.5rem 0.75rem" }}>
              <span style={{ color: "#64748B", fontSize: "0.85rem", userSelect: "none" }}>hermes/totem/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="nome-do-restaurante"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#38BDF8",
                  fontSize: "0.85rem",
                  width: "100%",
                  outline: "none",
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              URL da Logomarca (Opcional)
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="url"
                placeholder="https://exemplo.com/logo.png"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  color: "#F8FAFC",
                  fontSize: "0.875rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <ImageIcon size={18} color="#64748B" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Horários de Atendimento
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Seg a Dom: 11:00 às 23:00"
                value={horarios}
                onChange={(e) => setHorarios(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  color: "#F8FAFC",
                  fontSize: "0.875rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <Clock size={18} color="#64748B" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>
        </div>

        {/* Coluna 2: Live Preview Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <label style={{ display: "block", color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Visualização em Tempo Real (Card & Marca)
          </label>
          <div
            style={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "1rem",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header com as cores */}
            <div
              style={{
                backgroundColor: activePrim,
                color: activeSec,
                padding: "1.25rem",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: `2px solid ${activeSec}`,
                }}
              >
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => ((e.target as any).style.display = "none")} />
                ) : (
                  <Store size={28} color={activeSec} />
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: activeSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {nome.trim() || "Nome do Restaurante"}
                </h3>
                <span style={{ fontSize: "0.75rem", opacity: 0.9, color: activeSec }}>
                  {horarios || "Horário a definir"}
                </span>
              </div>
            </div>

            {/* Simulação de Status e Botão Totem */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10B981" }} />
                <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Slug: {slug || "exemplo"}</span>
              </div>
              <div style={{ background: "rgba(56, 189, 248, 0.1)", color: "#38BDF8", padding: "0.25rem 0.6rem", borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: 600 }}>
                Pronto para Atendimento
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de Paleta de Cores */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <label style={{ color: "#CBD5E1", fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={16} color="#F59E0B" /> Paleta de Cores da Marca
          </label>
          <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Selecione um tema ou personalize</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem" }}>
          {PRESET_PALETTES.map((pal) => {
            const isSelected = !isCustomColor && selectedPalette.id === pal.id;
            return (
              <button
                type="button"
                key={pal.id}
                onClick={() => handleSelectPalette(pal)}
                style={{
                  background: isSelected ? "#334155" : "#1E293B",
                  border: isSelected ? `2px solid ${pal.sec}` : "1px solid #334155",
                  borderRadius: "0.75rem",
                  padding: "0.6rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: pal.prim,
                    border: "2px solid #475569",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "50%", backgroundColor: pal.sec }} />
                  {isSelected && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
                      <Check size={16} color="white" />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#E2E8F0", textAlign: "center", lineHeight: 1.2 }}>
                  {pal.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Color Pickers */}
        <div style={{ marginTop: "1rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center", background: "#0F172A", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #334155" }}>
          <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Personalização Livre:</span>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#CBD5E1", cursor: "pointer" }}>
            <span>Cor Primária:</span>
            <input
              type="color"
              value={customPrim}
              onChange={(e) => {
                setCustomPrim(e.target.value);
                setIsCustomColor(true);
              }}
              style={{ width: 32, height: 32, border: "none", borderRadius: "0.25rem", cursor: "pointer", background: "transparent" }}
            />
            <code style={{ fontSize: "0.75rem", color: "#38BDF8" }}>{customPrim}</code>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#CBD5E1", cursor: "pointer" }}>
            <span>Cor Secundária:</span>
            <input
              type="color"
              value={customSec}
              onChange={(e) => {
                setCustomSec(e.target.value);
                setIsCustomColor(true);
              }}
              style={{ width: 32, height: 32, border: "none", borderRadius: "0.25rem", cursor: "pointer", background: "transparent" }}
            />
            <code style={{ fontSize: "0.75rem", color: "#38BDF8" }}>{customSec}</code>
          </label>
        </div>
      </div>

      {/* Opção de Produtos Demo */}
      <div style={{ background: "#0F172A", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #334155", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <input
          type="checkbox"
          id="demoProductsCheck"
          checked={criarProdutosExemplo}
          onChange={(e) => setCriarProdutosExemplo(e.target.checked)}
          style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#38BDF8" }}
        />
        <label htmlFor="demoProductsCheck" style={{ fontSize: "0.875rem", color: "#CBD5E1", cursor: "pointer" }}>
          <strong>Gerar cardápio básico de exemplo</strong> (Cria automaticamente 3 itens: prato principal, bebida e sobremesa para testes rápidos)
        </label>
      </div>

      {/* Ações / Botões */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "0.5rem" }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.75rem 1.5rem",
              background: "transparent",
              color: "#94A3B8",
              border: "1px solid #334155",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 1.75rem",
            background: "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
            color: "#0F172A",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 14px rgba(56, 189, 248, 0.35)",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Cadastrando...</span>
            </>
          ) : (
            <>
              <span>Criar Restaurante</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
