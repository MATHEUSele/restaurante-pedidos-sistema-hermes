"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Credenciais inválidas. Tente novamente.")
    } else {
      // O redirect adequado seria feito baseado no perfil, 
      // mas podemos redirecionar para a raiz e deixar o middleware agir
      router.push("/dev")
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#111827", fontFamily: "Inter, sans-serif" }}>
      <form onSubmit={handleLogin} style={{ background: "white", padding: "2.5rem", borderRadius: "1rem", width: "100%", maxWidth: "400px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#111827", margin: 0 }}>Hermes</h1>
          <p style={{ color: "#6B7280", marginTop: "0.5rem" }}>Faça login na sua conta</p>
        </div>

        {error && (
          <div style={{ background: "#FEE2E2", color: "#B91C1C", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.875rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", color: "#374151", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            E-mail
          </label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", boxSizing: "border-box", fontSize: "1rem" }}
            placeholder="admin@hermes.com"
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", color: "#374151", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Senha
          </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", boxSizing: "border-box", fontSize: "1rem" }}
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          style={{ width: "100%", padding: "0.875rem", background: "#4F46E5", color: "white", border: "none", borderRadius: "0.5rem", fontSize: "1rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
          onMouseOver={(e) => e.currentTarget.style.background = "#4338CA"}
          onMouseOut={(e) => e.currentTarget.style.background = "#4F46E5"}
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
