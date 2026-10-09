"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "../context/ToastContext";

export function RequireAuth({ 
  children, 
  allowedRoles = [] 
}: { 
  children: React.ReactNode; 
  allowedRoles?: string[];
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      addToast("Acesso negado. Faça login para continuar.", "error");
      router.replace("/login");
      return;
    }

    if (allowedRoles.length > 0 && session.user?.perfil) {
      if (!allowedRoles.includes(session.user.perfil)) {
        addToast("Você não tem permissão para acessar esta página.", "error");
        router.replace("/dev"); // fallback if not allowed
      }
    }
  }, [session, status, router, allowedRoles, addToast]);

  if (status === "loading") {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#111827", color: "white" }}>Carregando...</div>;
  }

  if (!session) {
    return null;
  }

  if (allowedRoles.length > 0 && session.user?.perfil && !allowedRoles.includes(session.user.perfil)) {
    return null;
  }

  return <>{children}</>;
}
