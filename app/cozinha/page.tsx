"use client";

import { usePedidosApi } from "../hooks/usePedidosApi";
import { Clock, ChefHat, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./cozinha.module.css";

const NAV_LINKS = [
  { href: "/", label: "🏠 Home" },
  { href: "/dev", label: "💻 Workspace DEV" },
  { href: "/adm", label: "🛠️ Painel ADM" },
  { href: "/cozinha", label: "🍳 Cozinha" },
  { href: "/atendente", label: "🧾 Atendente" },
];

export default function CozinhaInterface() {
  const { pedidos, atualizarStatus } = usePedidosApi({ restauranteId: "rest-pastelaria-do-galo" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000); // atualiza a cada 10s
    return () => clearInterval(timer);
  }, []);

  const getTempoEspera = (criadoEm: string | Date) => {
    const diff = now.getTime() - new Date(criadoEm).getTime();
    return Math.floor(diff / 60000); // minutos
  };

  const getCorTimer = (minutos: number) => {
    if (minutos >= 15) return "#EF4444"; // Vermelho
    if (minutos >= 10) return "#F5C518"; // Amarelo
    return "#10B981"; // Verde
  };

  // A cozinha vê o que está PAGO, EM_PREPARO ou PRONTO
  const pedidosAtivos = pedidos.filter(p => p.status === "PAGO" || p.status === "EM_PREPARO" || p.status === "PRONTO");

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#111827", color: "white", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      
      {/* Hamburger Nav */}
      <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 100 }}>
        <button onClick={() => setMenuOpen(o => !o)} style={{ background: "#374151", color: "white", border: "none", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        {menuOpen && (
          <nav style={{ position: "absolute", top: "100%", right: 0, marginTop: "0.5rem", background: "#1F2937", borderRadius: "0.75rem", padding: "0.75rem", minWidth: 200, display: "flex", flexDirection: "column", gap: "0.25rem", border: "1px solid #374151", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)" }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "0.5rem", color: "white", textDecoration: "none", borderRadius: "0.5rem", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#374151"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #374151", paddingBottom: "1rem" }}>
        <h1 style={{ fontSize: "2rem", display: "flex", alignItems: "center", gap: "0.75rem", margin: 0 }}>
          <ChefHat size={32} color="#F5C518" /> Cozinha - Ao Vivo
        </h1>
        <div style={{ background: "#F5C518", color: "#111827", padding: "0.5rem 1rem", borderRadius: "999px", fontWeight: "bold" }}>
          {pedidosAtivos.length} Pedidos na Fila
        </div>
      </header>

      {pedidosAtivos.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", color: "#6B7280" }}>
          <CheckCircle size={64} opacity={0.2} style={{ marginBottom: "1rem" }} />
          <h2>Nenhum pedido na fila!</h2>
          <p>A cozinha está tranquila.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {pedidosAtivos.map((pedido) => {
            const minutosEspera = getTempoEspera(pedido.criadoEm);
            const timerColor = getCorTimer(minutosEspera);

            return (
            <div key={pedido.id} className={`${styles.orderCard} ${styles.fadeInUp}`} style={{ 
              background: pedido.status === "EM_PREPARO" ? "#1F2937" : pedido.status === "PRONTO" ? "#064E3B" : "#374151", 
              borderRadius: "1rem", 
              padding: "1.5rem",
              border: pedido.status === "EM_PREPARO" ? "2px solid #F5C518" : pedido.status === "PRONTO" ? "2px solid #10B981" : "2px solid transparent",
              display: "flex", flexDirection: "column",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
            }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.5rem", color: "#F9FAFB" }}>
                    {pedido.clienteNome ? pedido.clienteNome.toUpperCase() : `#${pedido.id.slice(0,4)}`}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#9CA3AF", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    <Clock size={14} /> Feito às {formatTime(pedido.criadoEm)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <span style={{ 
                    background: pedido.status === "EM_PREPARO" ? "rgba(245, 197, 24, 0.2)" : pedido.status === "PRONTO" ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.1)", 
                    color: pedido.status === "EM_PREPARO" ? "#F5C518" : pedido.status === "PRONTO" ? "#10B981" : "#D1D5DB",
                    padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "bold" 
                  }}>
                    {pedido.status === "EM_PREPARO" ? "PREPARANDO" : pedido.status === "PRONTO" ? "PRONTO" : "NOVO"}
                  </span>
                  
                  {pedido.status !== "PRONTO" && (
                    <div style={{ backgroundColor: timerColor, color: "white", padding: "0.25rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Clock size={12} /> {minutosEspera} min
                    </div>
                  )}

                  {pedido.agendadoPara && (
                    <span className={styles.pulseAlert} style={{ background: "#EA580C", color: "white", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: "bold", display: "inline-block" }}>
                      Agendado: {pedido.agendadoPara}
                    </span>
                  )}
                </div>
              </div>

              {pedido.nota && (
                <div style={{ background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1rem", borderLeft: "3px solid #F5C518" }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#FCD34D", fontWeight: 600 }}>Nota: {pedido.nota}</p>
                </div>
              )}

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", flex: 1 }}>
                {pedido.itens?.map((item: any, idx: number) => (
                  <li key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontWeight: 600 }}>{item.quantidade}x {item.nomeProduto || item.produto?.nome}</span>
                  </li>
                ))}
              </ul>

              {pedido.status === "PAGO" ? (
                <button 
                  onClick={() => atualizarStatus(pedido.id, "EM_PREPARO")}
                  style={{ width: "100%", padding: "1rem", background: "#3B82F6", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer", fontSize: "1rem", transition: "opacity 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Iniciar Preparo
                </button>
              ) : pedido.status === "EM_PREPARO" ? (
                <button 
                  onClick={() => atualizarStatus(pedido.id, "PRONTO")}
                  style={{ width: "100%", padding: "1rem", background: "#10B981", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer", fontSize: "1rem", transition: "opacity 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  <CheckCircle size={20} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.5rem" }} />
                  Marcar como Pronto
                </button>
              ) : (
                <button 
                  onClick={() => atualizarStatus(pedido.id, "ENTREGUE")}
                  style={{ width: "100%", padding: "1rem", background: "#374151", color: "white", border: "1px solid #10B981", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer", fontSize: "1rem", transition: "opacity 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Fechar Pedido (Entregue)
                </button>
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
