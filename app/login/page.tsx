"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "../context/ToastContext"
import styles from "./login.module.css"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  
  // Estados para Login e Cadastro
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
          addToast("Credenciais inválidas. Tente novamente.", "error")
          setLoading(false)
        } else {
          router.push("/dev") // ou a rota raiz do perfil
        }
      } else {
        // Fluxo de Cadastro
        if (password !== confirmPassword) {
          addToast("As senhas não coincidem.", "error")
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
          addToast(data.message || "Erro ao cadastrar. Tente novamente.", "error")
          setLoading(false)
          return
        }

        addToast("Cadastro realizado com sucesso! Fazendo login...", "success")
        
        // Faz o login automaticamente após o cadastro
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (loginRes?.error) {
          addToast("Erro ao fazer login automático. Por favor, faça login.", "error")
          setIsLogin(true)
          setLoading(false)
        } else {
          router.push("/dev")
        }
      }
    } catch (err) {
      console.error(err)
      addToast("Ocorreu um erro inesperado. Tente novamente.", "error")
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setNome("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <div className={styles.header}>
          <h1 className={styles.title}>Hermes</h1>
          <p className={styles.subtitle}>Sistema de Pedidos</p>
        </div>

        {/* Toggle Login/Cadastro */}
        <div className={styles.toggleContainer}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`${styles.toggleButton} ${isLogin ? styles.toggleButtonActive : ""}`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`${styles.toggleButton} ${!isLogin ? styles.toggleButtonActive : ""}`}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Nome
              </label>
              <input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required={!isLogin}
                className={styles.input}
                placeholder="Seu nome"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              E-mail
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder={isLogin ? "admin@hermes.com" : "seu@email.com"}
            />
          </div>

          <div className={styles.inputGroup} style={{ marginBottom: isLogin ? "2rem" : "1.25rem" }}>
            <label className={styles.label}>
              Senha
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup} style={{ marginBottom: "2rem" }}>
              <label className={styles.label}>
                Confirmar Senha
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                className={styles.input}
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={styles.button}
          >
            {loading ? "Processando..." : (isLogin ? "Entrar" : "Cadastrar")}
          </button>
        </form>
      </div>
    </div>
  )
}
