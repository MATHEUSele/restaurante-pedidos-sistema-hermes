"use client";

import { useState } from "react";
import { usePedidosApi } from "../hooks/usePedidosApi";
import { LayoutDashboard, Clock, History, CheckCircle, XCircle, Users, QrCode, X } from "lucide-react";
import Link from "next/link";
import { Menu } from "lucide-react";
import dynamic from "next/dynamic";

import styles from "./adm.module.css";

const QRCodeModal = dynamic(() => import("../components/QRCodeModal"), { ssr: false });

const NAV_LINKS = [
  { href: "/", label: "🏠 Home" },
  { href: "/dev", label: "💻 Workspace DEV" },
  { href: "/adm", label: "🛠️ Painel ADM" },
  { href: "/cozinha", label: "🍳 Cozinha" },
  { href: "/atendente", label: "🧾 Atendente" },
];

function AdmPanel() {
  const { pedidos, atualizarStatus } = usePedidosApi({ restauranteId: "rest-pastelaria-do-galo" });
  const [activeTab, setActiveTab] = useState<"ao_vivo" | "prontos" | "historico" | "equipe">("ao_vivo");
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrCodeModal, setQrCodeModal] = useState<{ isOpen: boolean, url: string, loading: boolean }>({ isOpen: false, url: "", loading: false });

  // Equipe de atendimento da Pastelaria do Galo
  const mockEquipe = [
    { id: "atendente-galo-1", nome: "Atendente Principal", perfil: "ATENDENTE", restauranteId: "rest-pastelaria-do-galo" },
    { id: "atendente-galo-2", nome: "Atendente Caixa / Balcão", perfil: "ATENDENTE", restauranteId: "rest-pastelaria-do-galo" },
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
        alert("Erro ao gerar QR Code: " + (data.error || "Tente novamente"));
        setQrCodeModal({ isOpen: false, url: "", loading: false });
      }
    } catch {
      alert("Erro de conexão ao gerar QR Code");
      setQrCodeModal({ isOpen: false, url: "", loading: false });
    }
  };

  // Analytics Metrics
  const totalVendas = pedidos.filter(p => p.status !== "CANCELADO").reduce((acc, p) => acc + p.total, 0);
  const pedidosPendentes = aoVivo.length + prontos.length;
  const ticketsMedio = pedidos.length > 0 ? (totalVendas / (pedidos.filter(p => p.status !== "CANCELADO").length || 1)) : 0;

  return (
    <div className={styles.container}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 1; }
        }
      `}</style>
      
      {/* Header Responsivo */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          <LayoutDashboard color="#4F46E5" /> Painel ADM
        </h1>
        
        {/* Hamburger */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen(o => !o)} className={styles.burgerBtn} aria-label="Menu de Navegação">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {menuOpen && (
            <nav className={styles.navMenu}>
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className={styles.main}>
        
        {/* Analytics Summary */}
        <div className={styles.analyticsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Total de Vendas (Hoje)</span>
            <span className={styles.metricValue}>{formatPrice(totalVendas)}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Pedidos Pendentes</span>
            <span className={styles.metricValue} style={{ color: "#D97706" }}>{pedidosPendentes}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Ticket Médio</span>
            <span className={styles.metricValue} style={{ color: "#10B981" }}>{formatPrice(ticketsMedio)}</span>
          </div>
        </div>

        {/* Tabs Responsivas */}
        <div className={styles.tabsContainer}>
          <button 
            onClick={() => setActiveTab("ao_vivo")}
            className={`${styles.tabBtn} ${activeTab === "ao_vivo" ? styles.tabBtnActive : ""}`}
          >
            <Clock size={18} />
            Ao Vivo 
            <span className={`${styles.tabBadge} ${activeTab === "ao_vivo" ? styles.tabBadgeActive : ""}`}>{aoVivo.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("prontos")}
            className={`${styles.tabBtn} ${activeTab === "prontos" ? styles.tabBtnActive : ""}`}
          >
            <CheckCircle size={18} />
            Prontos / Entregar
            <span className={`${styles.tabBadge} ${activeTab === "prontos" ? styles.tabBadgeActive : ""}`}>{prontos.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("historico")}
            className={`${styles.tabBtn} ${activeTab === "historico" ? styles.tabBtnActive : ""}`}
          >
            <History size={18} />
            Histórico
            <span className={`${styles.tabBadge} ${activeTab === "historico" ? styles.tabBadgeActive : ""}`}>{historico.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("equipe")}
            className={`${styles.tabBtn} ${activeTab === "equipe" ? styles.tabBtnActive : ""}`}
          >
            <Users size={18} />
            Equipe / Acessos QR
          </button>
        </div>

        {/* List / Equipe */}
        {activeTab === "equipe" ? (
          <div>
            <h2 style={{ color: "var(--text, #111827)", marginBottom: "0.5rem", fontSize: "1.35rem" }}>Gestão de Atendentes</h2>
            <p style={{ color: "var(--text-muted, #6B7280)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              Gere um QR Code de uso único para sincronizar o celular do atendente diretamente a este restaurante sem precisar digitar senha.
            </p>
            
            <div className={styles.teamGrid}>
              {mockEquipe.map((membro) => (
                <div key={membro.id} className={styles.teamCard}>
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem 0", color: "var(--text, #111827)", fontSize: "1.05rem" }}>{membro.nome}</h3>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #6B7280)" }}>{membro.perfil}</span>
                  </div>
                  <button 
                    onClick={() => handleGenerateQRCode(membro.id, membro.restauranteId)}
                    className={styles.btnAction}
                    style={{ background: "#4F46E5", color: "white" }}
                  >
                    <QrCode size={18} /> Gerar Acesso QR
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {displayedPedidos.length === 0 ? (
              <div className={styles.emptyState}>
                Nenhum pedido encontrado nesta aba.
              </div>
            ) : (
              displayedPedidos.map((pedido: any) => (
                <div key={pedido.id} className={styles.orderCard}>
                  
                  {pedido.status === "PRONTO" && (
                    <div style={{ position: "absolute", top: -5, right: -5, width: 12, height: 12, borderRadius: "50%", background: "#10B981", animation: "pulse 1.5s infinite" }} />
                  )}

                  <div className={styles.orderMain}>
                    <div className={styles.orderHeader}>
                      <h3 className={styles.orderTitle}>
                        {pedido.clienteNome ? pedido.clienteNome.toUpperCase() : `Pedido #${pedido.id.slice(0, 5)}`}
                      </h3>
                      <span style={{ 
                        background: statusColors[pedido.status]?.bg || "#E5E7EB", 
                        color: statusColors[pedido.status]?.text || "#374151",
                        padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "bold" 
                      }}>
                        {pedido.status}
                      </span>
                      <span style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>{formatTime(pedido.createdAt || pedido.criadoEm)}</span>
                      {pedido.agendadoPara && (
                        <span style={{ background: "#EA580C", color: "white", padding: "0.15rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: "bold" }}>
                          Agendado: {pedido.agendadoPara}
                        </span>
                      )}
                    </div>
                    <p className={styles.orderItems}>
                      {pedido.itens?.map((i: any) => `${i.quantidade}x ${i.nomeProduto || i.produto?.nome}`).join(", ")}
                    </p>
                    {pedido.nota && (
                      <p className={styles.orderNote}>
                        Nota: {pedido.nota}
                      </p>
                    )}
                  </div>

                  <div className={styles.orderActions}>
                    <span className={styles.orderPrice}>
                      {formatPrice(pedido.total)}
                    </span>
                    
                    {pedido.status === "PRONTO" && activeTab === "prontos" && (
                      <button 
                        onClick={() => atualizarStatus(pedido.id, "ENTREGUE")}
                        className={styles.btnAction}
                        style={{ background: "#10B981", color: "white" }}
                      >
                        <CheckCircle size={16} /> Entregar
                      </button>
                    )}
                    {pedido.status === "PAGO" && activeTab === "ao_vivo" && (
                       <button 
                       onClick={() => atualizarStatus(pedido.id, "CANCELADO")}
                       className={styles.btnAction}
                       style={{ background: "white", color: "#EF4444", border: "1px solid #EF4444" }}
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
      <QRCodeModal 
        isOpen={qrCodeModal.isOpen} 
        url={qrCodeModal.url} 
        loading={qrCodeModal.loading} 
        onClose={() => setQrCodeModal({ isOpen: false, url: "", loading: false })} 
      />
    </div>
  );
}

import { RequireAuth } from "../components/RequireAuth";
export default function Page() {
  return (
    <RequireAuth allowedRoles={["ADM", "DEV"]}>
      <AdmPanel />
    </RequireAuth>
  );
}
