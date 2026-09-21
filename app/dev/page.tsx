"use client";

import { Building2, Plus, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "🏠 Home" },
  { href: "/dev", label: "💻 Workspace DEV" },
  { href: "/adm", label: "🛠️ Painel ADM" },
  { href: "/cozinha", label: "🍳 Cozinha" },
  { href: "/atendente", label: "🧾 Atendente" },
];

export default function DevWorkspace() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A", color: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      
      {/* Header */}
      <header style={{ padding: "2rem", borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Terminal color="#38BDF8" /> Workspace do Desenvolvedor
        </h1>

        {/* Hamburger */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "transparent", border: "1px solid #334155", color: "white", padding: "0.5rem", borderRadius: "0.5rem", cursor: "pointer" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {menuOpen && (
            <nav style={{ position: "absolute", top: "100%", right: 0, marginTop: "0.5rem", background: "#1E293B", borderRadius: "0.75rem", padding: "0.5rem", minWidth: 200, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)", border: "1px solid #334155", zIndex: 50 }}>
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "0.5rem 0.75rem", color: "#F8FAFC", textDecoration: "none", borderRadius: "0.375rem" }}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", color: "#94A3B8" }}>Restaurantes Ativos</h2>
          <button style={{ padding: "0.5rem 1rem", background: "#38BDF8", color: "#0F172A", border: "none", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={18} /> Novo Restaurante
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          
          <Link href="/dev/restaurante/pastelaria-do-galo" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ background: "#1E293B", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #334155", display: "flex", alignItems: "flex-start", gap: "1rem", transition: "transform 0.2s", cursor: "pointer" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ width: 64, height: 64, borderRadius: "0.75rem", background: "#7A1E2E", display: "flex", alignItems: "center", justifyContent: "center", color: "#F5C518" }}>
                <Building2 size={32} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.25rem", color: "#F8FAFC" }}>Pastelaria do Galo</h3>
                <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.875rem" }}>Slug: pastelaria-do-galo</p>
                <div style={{ marginTop: "1rem", display: "inline-block", background: "rgba(56, 189, 248, 0.1)", color: "#38BDF8", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: "bold" }}>
                  Status: Ativo
                </div>
              </div>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
