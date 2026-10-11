"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react"
import { useToast } from "../context/ToastContext"
import styles from "./login.module.css"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  
  // Estados para Login e Cadastro
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Estados para alternar visualização da senha
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
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
          email: email.trim(),
          password: password.trim(),
          redirect: false,
        })

        if (res?.error) {
          addToast("Credenciais inválidas. Verifique o e-mail e a senha digitada.", "error")
          setLoading(false)
        } else {
          addToast("Login realizado com sucesso! Redirecionando...", "success")
          router.refresh()
          router.push("/adm")
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
          body: JSON.stringify({ nome: nome.trim(), email: email.trim(), senha: password.trim() }),
        })

        const data = await res.json()

        if (!res.ok) {
          addToast(data.message || "Erro ao cadastrar. Tente novamente.", "error")
          setLoading(false)
          return
        }

        addToast("Cadastro realizado com sucesso! Entrando...", "success")
        
        // Faz o login automaticamente após o cadastro
        const loginRes = await signIn("credentials", {
          email: email.trim(),
          password: password.trim(),
          redirect: false,
        })

        if (loginRes?.error) {
          addToast("Erro ao autenticar automaticamente. Por favor, entre na tela de login.", "error")
          setIsLogin(true)
          setLoading(false)
        } else {
          router.refresh()
          router.push("/adm")
        }
      }
    } catch (err) {
      console.error(err)
      addToast("Ocorreu um erro inesperado. Tente novamente.", "error")
      setLoading(false)
    }
  }

  const toggleMode = (targetLogin: boolean) => {
    setIsLogin(targetLogin)
    setNome("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const fillQuickCredentials = (userEmail: string, pass: string) => {
    setEmail(userEmail)
    setPassword(pass)
    setShowPassword(true)
    addToast(`Credenciais preenchidas: ${userEmail} / ${pass}`, "info")
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <div className={styles.header}>
          <div className={styles.logoBadge}>
            <ShieldCheck size={28} color="#4f46e5" />
          </div>
          <h1 className={styles.title}>Hermes</h1>
          <p className={styles.subtitle}>Sistema de Pedidos e Gestão</p>
        </div>

        {/* Toggle Login/Cadastro */}
        <div className={styles.toggleContainer} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            onClick={() => toggleMode(true)}
            className={`${styles.toggleButton} ${isLogin ? styles.toggleButtonActive : ""}`}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            onClick={() => toggleMode(false)}
            className={`${styles.toggleButton} ${!isLogin ? styles.toggleButtonActive : ""}`}
          >
            Cadastrar
          </button>
        </div>

        {/* Dica de preenchimento rápido para o usuário no modo Login */}
        {isLogin && (
          <div className={styles.quickFillContainer}>
            <span className={styles.quickFillLabel}>
              <Sparkles size={14} className={styles.quickFillIcon} />
              Acesso rápido (clique para testar):
            </span>
            <div className={styles.quickFillBadges}>
              <button
                type="button"
                className={styles.quickFillBtn}
                onClick={() => fillQuickCredentials("adm@gmail.com", "123")}
              >
                adm@gmail.com (123)
              </button>
              <button
                type="button"
                className={styles.quickFillBtn}
                onClick={() => fillQuickCredentials("admin@hermes.com", "123")}
              >
                admin@hermes.com (123)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="nome" className={styles.label}>
                Nome Completo
              </label>
              <input 
                id="nome"
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required={!isLogin}
                className={styles.input}
                placeholder="Seu nome"
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              E-mail ou Usuário
            </label>
            <input 
              id="email"
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder={isLogin ? "adm@gmail.com ou admin" : "seu@email.com"}
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <div className={styles.passwordWrapper}>
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputWithToggle}
                placeholder="Digite sua senha"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleVisibilityButton}
                title={showPassword ? "Ocultar senha" : "Ver o que estou digitando"}
                aria-label={showPassword ? "Ocultar senha" : "Ver o que estou digitando"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar Senha
              </label>
              <div className={styles.passwordWrapper}>
                <input 
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  className={styles.inputWithToggle}
                  placeholder="Repita sua senha"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.toggleVisibilityButton}
                  title={showConfirmPassword ? "Ocultar senha" : "Ver o que estou digitando"}
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Ver o que estou digitando"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={styles.button}
          >
            {loading ? "Processando..." : (isLogin ? "Entrar no Sistema" : "Criar Minha Conta")}
          </button>
        </form>
      </div>
    </div>
  )
}
