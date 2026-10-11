"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, AlertCircle, Loader2, ArrowRight, Store } from "lucide-react";
import Link from "next/link";

function QRLoginHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function performQRLogin() {
      if (!token) {
        setStatus("error");
        setErrorMessage("Nenhum token fornecido no link do QR Code.");
        return;
      }

      try {
        const res = await signIn("credentials", {
          qrToken: token,
          redirect: false,
        });

        if (res?.error) {
          setStatus("error");
          setErrorMessage(
            "Este QR Code já foi utilizado ou sua validade expirou. Por segurança, os códigos são de uso único."
          );
        } else {
          setStatus("success");
          setTimeout(() => {
            router.replace("/atendente");
          }, 1200);
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("Erro de rede ao validar QR Code. Verifique sua conexão.");
      }
    }

    performQRLogin();
  }, [token, router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0F172A",
      padding: "1.5rem",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#1E293B",
        border: "1px solid #334155",
        borderRadius: "1.5rem",
        padding: "2.5rem 2rem",
        maxWidth: "460px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: status === "loading" ? "rgba(99, 102, 241, 0.15)" : status === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
          color: status === "loading" ? "#818CF8" : status === "success" ? "#10B981" : "#EF4444",
          marginBottom: "1.5rem",
        }}>
          {status === "loading" && <Loader2 size={36} style={{ animation: "spin 1s linear infinite" }} />}
          {status === "success" && <ShieldCheck size={36} />}
          {status === "error" && <AlertCircle size={36} />}
        </div>

        {status === "loading" && (
          <>
            <h2 style={{ color: "#F8FAFC", fontSize: "1.5rem", margin: "0 0 0.5rem 0", fontWeight: 700 }}>
              Sincronizando Atendente...
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>
              Validando o QR Code de uso único e conectando seu dispositivo à Pastelaria.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 style={{ color: "#10B981", fontSize: "1.5rem", margin: "0 0 0.5rem 0", fontWeight: 700 }}>
              Acesso Autorizado!
            </h2>
            <p style={{ color: "#CBD5E1", fontSize: "0.95rem", lineHeight: 1.5, margin: "0 0 1.5rem 0" }}>
              Seu dispositivo foi vinculado com sucesso como atendente. Entrando no painel de pedidos...
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", color: "#64748B", fontSize: "0.85rem" }}>
              <Store size={18} /> Pastelaria do Galo
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h2 style={{ color: "#EF4444", fontSize: "1.5rem", margin: "0 0 0.5rem 0", fontWeight: 700 }}>
              QR Code Indisponível
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 2rem 0" }}>
              {errorMessage}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  backgroundColor: "#4F46E5",
                  color: "white",
                  padding: "0.875rem 1.5rem",
                  borderRadius: "0.75rem",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                Fazer Login Manual <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function QRLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", color: "white" }}>
        Carregando...
      </div>
    }>
      <QRLoginHandler />
    </Suspense>
  );
}
