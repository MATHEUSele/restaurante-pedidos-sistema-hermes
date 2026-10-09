import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", maxWidth: "400px", width: "90%", textAlign: "center", position: "relative" }}>
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "none", cursor: "pointer" }}
        >
          <X size={24} color="#6B7280" />
        </button>
        
        <h3 style={{ margin: "0 0 1rem 0", color: "#111827", fontSize: "1.25rem" }}>Acesso do Atendente</h3>
        <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Peça para o atendente escanear este QR Code com o celular. O acesso é válido por 24 horas.
        </p>

        {loading ? (
          <div style={{ padding: "3rem 0", color: "#6B7280" }}>Gerando QR Code...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ background: "white", padding: "1rem", border: "1px solid #E5E7EB", borderRadius: "1rem", display: "inline-block" }}>
              <QRCodeSVG value={url} size={200} />
            </div>
            <div style={{ background: "#F3F4F6", padding: "0.5rem", borderRadius: "0.5rem", wordBreak: "break-all", fontSize: "0.75rem", color: "#4B5563" }}>
              {url}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
