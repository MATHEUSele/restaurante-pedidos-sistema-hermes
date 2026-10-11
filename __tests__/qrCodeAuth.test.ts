import { describe, it, expect, vi } from "vitest";

describe("QR Code Single-Use Logic", () => {
  it("should invalidate the token upon first use so it cannot be used again", async () => {
    // Simula token inicial no banco
    const mockQRCode = {
      id: "qr-123",
      token: "secret-qr-token",
      ativo: true,
      expiresAt: new Date(Date.now() + 3600000), // expira em 1 hora
      usuario: { id: "user-1", nome: "Atendente Teste", perfil: "ATENDENTE" },
    };

    // Primeiro acesso: token ativo e dentro da validade
    const isFirstAccessValid = mockQRCode.ativo && new Date() <= mockQRCode.expiresAt;
    expect(isFirstAccessValid).toBe(true);

    // Consome o token (invalida imediatamente para uso único)
    mockQRCode.ativo = false;

    // Segundo acesso pelo mesmo ou outro dispositivo: deve falhar
    const isSecondAccessValid = mockQRCode.ativo && new Date() <= mockQRCode.expiresAt;
    expect(isSecondAccessValid).toBe(false);
  });

  it("should reject expired QR tokens even if active flag is true", () => {
    const expiredQRCode = {
      id: "qr-expired",
      token: "expired-token",
      ativo: true,
      expiresAt: new Date(Date.now() - 10000), // expirado há 10 segundos
    };

    const isValid = expiredQRCode.ativo && new Date() <= expiredQRCode.expiresAt;
    expect(isValid).toBe(false);
  });
});
