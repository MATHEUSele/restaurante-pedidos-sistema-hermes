import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, Check, ShieldCheck, Smartphone } from "lucide-react";

export default function QRCodeModal({ 
  isOpen, 
  url, 
  loading, 
  onClose 
}: { 
  isOpen: boolean; 
  url: string; 
  loading: boolean; 
  onClose: () => void 
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "1.25rem", maxWidth: "440px", width: "100%", textAlign: "center", position: "relative", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "#F3F4F6", border: "none", cursor: "pointer", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={20} color="#4B5563" />
        </button>
        
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#EEF2FF", color: "#4F46E5", padding: "0.35rem 0.85rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          <ShieldCheck size={14} /> USO ÚNICO & SEGURO
        </div>

        <h3 style={{ margin: "0 0 0.5rem 0", color: "#111827", fontSize: "1.35rem", fontWeight: 800 }}>Acesso do Atendente</h3>
        <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.4 }}>
          Peça para o atendente apontar a câmera do celular para este QR Code. Assim que conectar, o código é consumido e protegido contra outros acessos.
        </p>

        {loading ? (
          <div style={{ padding: "3rem 0", color: "#6B7280", fontWeight: 500 }}>Gerando QR Code seguro...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ background: "white", padding: "1.25rem", border: "2px solid #E5E7EB", borderRadius: "1.25rem", display: "inline-block", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <QRCodeSVG value={url} size={220} level="M" />
            </div>

            <div style={{ width: "100%", display: "flex", gap: "0.5rem" }}>
              <input 
                type="text" 
                readOnly 
                value={url} 
                style={{ flex: 1, padding: "0.6rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", background: "#F9FAFB", fontSize: "0.8rem", color: "#374151" }} 
              />
              <button 
                onClick={handleCopy} 
                style={{ background: copied ? "#10B981" : "#4F46E5", color: "white", border: "none", borderRadius: "0.5rem", padding: "0.6rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap" }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#4F46E5", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}
            >
              <Smartphone size={16} /> Testar login direto neste navegador
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
