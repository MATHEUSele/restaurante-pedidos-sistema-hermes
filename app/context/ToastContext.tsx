"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type ToastType = "success" | "error" | "info"

interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

interface ToastContextData {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 9999,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: "1rem 1.5rem",
              borderRadius: "0.5rem",
              background:
                toast.type === "success"
                  ? "#10B981"
                  : toast.type === "error"
                  ? "#EF4444"
                  : "#3B82F6",
              color: "white",
              fontWeight: 500,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              animation: "slideIn 0.3s ease-out forwards",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider")
  }
  return context
}
