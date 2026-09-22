"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  
  // Estados para Login e Cadastro
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (isLogin) {
        // Fluxo de Login
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (res?.error) {
          setError("Credenciais inválidas. Tente novamente.")
          setLoading(false)
        } else {
          router.push("/dev")
        }
      } else {
        // Fluxo de Cadastro
        if (password !== confirmPassword) {
          setError("As senhas não coincidem.")
          setLoading(false)
          return
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha: password }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.message || "Erro ao cadastrar. Tente novamente.")
          setLoading(false)
          return
        }

        setSuccess("Cadastro realizado com sucesso! Fazendo login...")
        
        // Faz o login automaticamente após o cadastro
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (loginRes?.error) {
          setError("Erro ao fazer login automático. Por favor, faça login.")
          setIsLogin(true)
          setLoading(false)
        } else {
          router.push("/dev")
        }
      }
    } catch (err) {
      console.error(err)
      setError("Ocorreu um erro inesperado. Tente novamente.")
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setSuccess("")
    setNome("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#111827", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "white", padding: "2.5rem", borderRadius: "1rem", width: "100%", maxWidth: "450px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", margin: 0 }}>Hermes</h1>
          <p style={{ color: "#6B7280", marginTop: "0.5rem" }}>Sistema de Pedidos</p>
        </div>

        {/* Toggle Login/Cadastro */}
        <div style={{ display: "flex", marginBottom: "2rem", background: "#F3F4F6", borderRadius: "0.5rem", padding: "0.25rem" }}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1, padding: "0.5rem", borderRadius: "0.375rem", border: "none", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              background: isLogin ? "white" : "transparent",
              color: isLogin ? "#111827" : "#6B7280",
              boxShadow: isLogin ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1, padding: "0.5rem", borderRadius: "0.375rem", border: "none", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              background: !isLogin ? "white" : "transparent",
              color: !isLogin ? "#111827" : "#6B7280",
              boxShadow: !isLogin ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: "#FEE2E2", color: "#B91C1C", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.875rem", textAlign: "center" }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ background: "#D1FAE5", color: "#065F46", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.875rem", textAlign: "center" }}>
              {success}
            </div>
          )}

          {!isLogin && (
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", color: "#374151", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                Nome
              </label>
              <input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required={!isLogin}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", boxSizing: "border-box", fontSize: "1rem" }}
                placeholder="Seu nome"
              />
            </div>
          )}

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", color: "#374151", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              E-mail
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", boxSizing: "border-box", fontSize: "1rem" }}
              placeholder={isLogin ? "admin@hermes.com" : "seu@email.com"}
            />
          </div>

          <div style={{ marginBottom: isLogin ? "2rem" : "1.25rem" }}>
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

          {!isLogin && (
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", color: "#374151", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                Confirmar Senha
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", boxSizing: "border-box", fontSize: "1rem" }}
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: "100%", padding: "0.875rem", background: "#4F46E5", color: "white", border: "none", 
              borderRadius: "0.5rem", fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", 
              transition: "background 0.2s", opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => { if(!loading) e.currentTarget.style.background = "#4338CA" }}
            onMouseOut={(e) => { if(!loading) e.currentTarget.style.background = "#4F46E5" }}
          >
            {loading ? "Processando..." : (isLogin ? "Entrar" : "Cadastrar")}
          </button>
        </form>
      </div>
    </div>
  )
}
