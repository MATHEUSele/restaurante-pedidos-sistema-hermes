"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Sparkles } from "lucide-react";
import RestauranteForm from "../../components/RestauranteForm";

export default function NovoRestaurantePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0B1120",
        color: "#F8FAFC",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1.5rem 2rem",
          borderBottom: "1px solid #1E293B",
          backgroundColor: "#0F172A",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/dev"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#94A3B8",
              textDecoration: "none",
              fontSize: "0.875rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
            }}
          >
            <ArrowLeft size={16} />
            <span>Voltar ao DEV</span>
          </Link>

          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#38BDF8",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Multi-Tenant &bull; Sistema Hermes
            </span>
            <h1
              style={{
                margin: 0,
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                color: "#F8FAFC",
              }}
            >
              <Building2 color="#38BDF8" size={24} /> Cadastrar Novo Restaurante
            </h1>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(56, 189, 248, 0.1)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            padding: "0.4rem 0.8rem",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            color: "#38BDF8",
          }}
        >
          <Sparkles size={16} />
          <span>Configuração Dinâmica</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "960px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <div
          style={{
            backgroundColor: "#131C31",
            borderRadius: "1rem",
            border: "1px solid #1E293B",
            padding: "2rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div style={{ marginBottom: "1.75rem", borderBottom: "1px solid #1E293B", paddingBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.25rem 0", color: "#F8FAFC" }}>
              Identidade e Cardápio da Unidade
            </h2>
            <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.875rem" }}>
              Cadastre as informações básicas da nova unidade, defina a paleta visual e os canais de atendimento.
            </p>
          </div>

          <RestauranteForm redirectOnSuccess={true} />
        </div>
      </main>
    </div>
  );
}
