"use client";

import { useState } from "react";
import { usePedidosApi } from "../hooks/usePedidosApi";
import { LayoutDashboard, Clock, History, CheckCircle, XCircle, Users, QrCode, X } from "lucide-react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const NAV_LINKS = [
  { href: "/", label: "🏠 Home" },
  { href: "/dev", label: "💻 Workspace DEV" },
  { href: "/adm", label: "🛠️ Painel ADM" },
  { href: "/cozinha", label: "🍳 Cozinha" },
  { href: "/atendente", label: "🧾 Atendente" },
];

export default function AdmPanel() {
  const { pedidos, atualizarStatus } = usePedidosApi({ restauranteId: "rest-pastelaria-do-galo" });
  const [activeTab, setActiveTab] = useState<"ao_vivo" | "prontos" | "historico" | "equipe">("ao_vivo");
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrCodeModal, setQrCodeModal] = useState<{ isOpen: boolean, url: string, loading: boolean }>({ isOpen: false, url: "", loading: false });

  // Exemplo mockado de equipe para o restaurante
  const mockEquipe = [
    { id: "user-1", nome: "João (Atendente 1)", perfil: "ATENDENTE", restauranteId: "rest-1" },
    { id: "user-2", nome: "Maria (Atendente 2)", perfil: "ATENDENTE", restauranteId: "rest-1" },
  ];

  const aoVivo = pedidos.filter(p => p.status === "PAGO" || p.status === "EM_PREPARO");
  const prontos = pedidos.filter(p => p.status === "PRONTO");
  const historico = pedidos.filter(p => p.status === "ENTREGUE" || p.status === "CANCELADO");

  const formatTime = (date: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const statusColors: Record<string, { bg: string, text: string }> = {
    PAGO: { bg: "#DBEAFE", text: "#1D4ED8" },
    EM_PREPARO: { bg: "#FEF3C7", text: "#D97706" },
    PRONTO: { bg: "#D1FAE5", text: "#059669" },
    ENTREGUE: { bg: "#F3F4F6", text: "#374151" },
    CANCELADO: { bg: "#FEE2E2", text: "#B91C1C" },
  };

  const displayedPedidos = activeTab === "ao_vivo" ? aoVivo : activeTab === "prontos" ? prontos : historico;

  const handleGenerateQRCode = async (usuarioId: string, restauranteId: string) => {
    setQrCodeModal({ isOpen: true, url: "", loading: true });
    try {
      const res = await fetch("/api/qrcode/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, restauranteId, expiresInHours: 24 })
      });
      const data = await res.json();
      if (res.ok) {
        setQrCodeModal({ isOpen: true, url: data.qrCodeUrl, loading: false });
      } else {
        alert("Erro ao gerar QR Code: " + data.error);
        setQrCodeModal({ isOpen: false, url: "", loading: false });
      }
    } catch (error) {
      alert("Erro de conexão");
      setQrCodeModal({ isOpen: false, url: "", loading: false });
    }
  };

  // Analytics Metrics
  const totalVendas = pedidos.filter(p => p.status !== "CANCELADO").reduce((acc, p) => acc + p.total, 0);
  const pedidosPendentes = aoVivo.length + prontos.length;
  const ticketsMedio = pedidos.length > 0 ? (totalVendas / pedidos.filter(p => p.status !== "CANCELADO").length) : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 1; }
        }
      `}</style>
      
      {/* Header */}
      <header style={{ background: "white", padding: "1.5rem 2rem", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem", color: "#111827" }}>
          <LayoutDashboard color="#4F46E5" /> Painel ADM - Restaurante
        </h1>
        
        {/* Hamburger */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "transparent", border: "1px solid #E5E7EB", padding: "0.5rem", borderRadius: "0.5rem", cursor: "pointer" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {menuOpen && (
            <nav style={{ position: "absolute", top: "100%", right: 0, marginTop: "0.5rem", background: "white", borderRadius: "0.75rem", padding: "0.5rem", minWidth: 200, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", zIndex: 50 }}>
              {NAV_LINKS.map((link: { href: string; label: string }) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "0.5rem 0.75rem", color: "#374151", textDecoration: "none", borderRadius: "0.375rem" }}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Analytics Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#6B7280", fontSize: "0.875rem", fontWeight: 600 }}>Total de Vendas (Hoje)</span>
            <span style={{ color: "#111827", fontSize: "1.5rem", fontWeight: 700, marginTop: "0.5rem" }}>{formatPrice(totalVendas)}</span>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#6B7280", fontSize: "0.875rem", fontWeight: 600 }}>Pedidos Pendentes</span>
            <span style={{ color: "#D97706", fontSize: "1.5rem", fontWeight: 700, marginTop: "0.5rem" }}>{pedidosPendentes}</span>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#6B7280", fontSize: "0.875rem", fontWeight: 600 }}>Ticket Médio</span>
            <span style={{ color: "#10B981", fontSize: "1.5rem", fontWeight: 700, marginTop: "0.5rem" }}>{formatPrice(ticketsMedio)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #E5E7EB", paddingBottom: "1rem", flexWrap: "wrap" }}>
          <button 
            onClick={() => setActiveTab("ao_vivo")}
            style={{ padding: "0.5rem 1rem", border: "none", background: "transparent", fontSize: "1.1rem", fontWeight: 600, color: activeTab === "ao_vivo" ? "#4F46E5" : "#6B7280", cursor: "pointer", borderBottom: activeTab === "ao_vivo" ? "2px solid #4F46E5" : "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Clock size={18} />
            Ao Vivo 
            <span style={{ background: activeTab === "ao_vivo" ? "#4F46E5" : "#E5E7EB", color: activeTab === "ao_vivo" ? "white" : "#4B5563", padding: "0.1rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", marginLeft: "0.25rem" }}>{aoVivo.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("prontos")}
            style={{ padding: "0.5rem 1rem", border: "none", background: "transparent", fontSize: "1.1rem", fontWeight: 600, color: activeTab === "prontos" ? "#4F46E5" : "#6B7280", cursor: "pointer", borderBottom: activeTab === "prontos" ? "2px solid #4F46E5" : "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <CheckCircle size={18} />
            Prontos / Entregar
            <span style={{ background: activeTab === "prontos" ? "#4F46E5" : "#E5E7EB", color: activeTab === "prontos" ? "white" : "#4B5563", padding: "0.1rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", marginLeft: "0.25rem" }}>{prontos.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("historico")}
            style={{ padding: "0.5rem 1rem", border: "none", background: "transparent", fontSize: "1.1rem", fontWeight: 600, color: activeTab === "historico" ? "#4F46E5" : "#6B7280", cursor: "pointer", borderBottom: activeTab === "historico" ? "2px solid #4F46E5" : "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <History size={18} />
            Histórico
            <span style={{ background: activeTab === "historico" ? "#4F46E5" : "#E5E7EB", color: activeTab === "historico" ? "white" : "#4B5563", padding: "0.1rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", marginLeft: "0.25rem" }}>{historico.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("equipe")}
            style={{ padding: "0.5rem 1rem", border: "none", background: "transparent", fontSize: "1.1rem", fontWeight: 600, color: activeTab === "equipe" ? "#4F46E5" : "#6B7280", cursor: "pointer", borderBottom: activeTab === "equipe" ? "2px solid #4F46E5" : "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Users size={18} />
            Equipe / Acessos
          </button>
        </div>

        {/* List / Equipe */}
        {activeTab === "equipe" ? (
          <div>
            <h2 style={{ color: "#111827", marginBottom: "1rem" }}>Gestão de Atendentes (Totem)</h2>
            <p style={{ color: "#6B7280", marginBottom: "2rem" }}>Gere um QR Code para vincular o celular do atendente diretamente a este restaurante.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {mockEquipe.map((membro: any) => (
                <div key={membro.id} style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, color: "#111827" }}>{membro.nome}</h3>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>{membro.perfil}</span>
                  </div>
                  <button 
                    onClick={() => handleGenerateQRCode(membro.id, membro.restauranteId)}
                    style={{ background: "#4F46E5", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: 600 }}
                  >
                    <QrCode size={18} /> Gerar Acesso
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {displayedPedidos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}>
                Nenhum pedido encontrado nesta aba.
              </div>
            ) : (
              displayedPedidos.map((pedido: any) => (
                <div key={pedido.id} style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", position: "relative" }}>
                  
                  {pedido.status === "PRONTO" && (
                    <div style={{ position: "absolute", top: -6, right: -6, width: 14, height: 14, borderRadius: "50%", background: "#10B981", animation: "pulse 1.5s infinite" }} />
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.25rem" }}>
                        {pedido.clienteNome ? pedido.clienteNome.toUpperCase() : `Pedido #${pedido.id}`}
                      </h3>
                      <span style={{ 
                        background: statusColors[pedido.status].bg, 
                        color: statusColors[pedido.status].text,
                        padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "bold" 
                      }}>
                        {pedido.status}
                      </span>
                      <span style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>{formatTime(pedido.createdAt)}</span>
                      {pedido.agendadoPara && (
                        <span style={{ background: "#EA580C", color: "white", padding: "0.15rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: "bold" }}>
                          Agendado: {pedido.agendadoPara}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, color: "#6B7280" }}>
                      {pedido.itens?.map((i: any) => `${i.quantidade}x ${i.nomeProduto || i.produto?.nome}`).join(", ")}
                    </p>
                    {pedido.nota && (
                      <p style={{ margin: "0.5rem 0 0 0", color: "#D97706", fontSize: "0.875rem", fontWeight: 500 }}>
                        Nota: {pedido.nota}
                      </p>
                    )}
                  </div>

                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>
                      {formatPrice(pedido.total)}
                    </span>
                    
                    {pedido.status === "PRONTO" && activeTab === "prontos" && (
                      <button 
                        onClick={() => atualizarStatus(pedido.id, "ENTREGUE")}
                        style={{ padding: "0.5rem 1rem", background: "#10B981", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}
                      >
                        <CheckCircle size={16} /> Entregar
                      </button>
                    )}
                    {pedido.status === "PAGO" && activeTab === "ao_vivo" && (
                       <button 
                       onClick={() => atualizarStatus(pedido.id, "CANCELADO")}
                       style={{ padding: "0.5rem 1rem", background: "white", color: "#EF4444", border: "1px solid #EF4444", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}
                     >
                       <XCircle size={16} /> Cancelar
                     </button>
                    )}
                  </div>
                  
                </div>
              ))
            )}
          </div>
        )}

      </main>

      {/* QR Code Modal */}
      {qrCodeModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", maxWidth: "400px", width: "90%", textAlign: "center", position: "relative" }}>
            <button 
              onClick={() => setQrCodeModal({ isOpen: false, url: "", loading: false })}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "none", cursor: "pointer" }}
            >
              <X size={24} color="#6B7280" />
            </button>
            
            <h3 style={{ margin: "0 0 1rem 0", color: "#111827", fontSize: "1.25rem" }}>Acesso do Atendente</h3>
            <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Peça para o atendente escanear este QR Code com o celular. O acesso é válido por 24 horas.
            </p>

            {qrCodeModal.loading ? (
              <div style={{ padding: "3rem 0", color: "#6B7280" }}>Gerando QR Code...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ background: "white", padding: "1rem", border: "1px solid #E5E7EB", borderRadius: "1rem", display: "inline-block" }}>
                  <QRCodeSVG value={qrCodeModal.url} size={200} />
                </div>
                <div style={{ background: "#F3F4F6", padding: "0.5rem", borderRadius: "0.5rem", wordBreak: "break-all", fontSize: "0.75rem", color: "#4B5563" }}>
                  {qrCodeModal.url}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
