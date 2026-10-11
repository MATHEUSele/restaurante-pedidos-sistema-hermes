"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, AlertCircle } from "lucide-react";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
      setCameraActive(false);
      setError(null);
      return;
    }

    const elementId = "html5qr-code-reader";
    const qrCodeScanner = new Html5Qrcode(elementId);
    scannerRef.current = qrCodeScanner;

    qrCodeScanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          qrCodeScanner
            .stop()
            .then(() => {
              setCameraActive(false);
              onScanSuccess(decodedText);
            })
            .catch(console.error);
        },
        () => {
          // Frame sem QR code, prossegue silenciosamente
        }
      )
      .then(() => {
        setCameraActive(true);
        setError(null);
      })
      .catch((err) => {
        console.error("Erro ao iniciar câmera:", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
      });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "1rem"
    }}>
      <div style={{
        backgroundColor: "#1E293B",
        border: "1px solid #334155",
        borderRadius: "1.25rem",
        padding: "1.5rem",
        maxWidth: "420px",
        width: "100%",
        position: "relative",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#F8FAFC", fontWeight: 700, fontSize: "1.1rem" }}>
            <Camera size={20} color="#818CF8" /> Escanear QR Code
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            <X size={22} />
          </button>
        </div>

        <p style={{ color: "#94A3B8", fontSize: "0.875rem", margin: "0 0 1rem 0" }}>
          Aponte a câmera para o QR Code gerado pelo administrador no painel.
        </p>

        {error ? (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid #EF4444",
            padding: "1rem",
            borderRadius: "0.75rem",
            color: "#FCA5A5",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.875rem"
          }}>
            <AlertCircle size={24} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        ) : (
          <div style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "0.75rem",
            background: "#0F172A",
            border: "1px solid #334155",
            minHeight: "280px"
          }}>
            <div id="html5qr-code-reader" style={{ width: "100%" }} />
          </div>
        )}

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button
            onClick={onClose}
            style={{
              background: "#334155",
              color: "#F8FAFC",
              border: "none",
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
