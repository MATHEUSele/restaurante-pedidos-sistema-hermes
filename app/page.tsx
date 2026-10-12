"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import styles from "./home.module.css";
import {
  ShieldCheck,
  QrCode,
  LogIn,
  UserPlus,
  Utensils,
  ChefHat,
  LayoutDashboard,
  Smartphone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  LogOut,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./context/ToastContext";
import { signIn } from "next-auth/react";

const QRScannerModal = dynamic(() => import("./components/QRScannerModal"), { ssr: false });

export default function HomePage() {
  const { data: session, status } = useSession();
  const [scannerOpen, setScannerOpen] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleQRScanned = async (scannedText: string) => {
    setScannerOpen(false);
    let token = scannedText.trim();
    try {
      if (token.includes("token=")) {
        const urlObj = new URL(token, window.location.origin);
        token = urlObj.searchParams.get("token") || token;
      }
    } catch {
      // url relativa ou token puro
    }

    addToast("QR Code detectado! Validando acesso de atendente...", "info");
    const res = await signIn("credentials", {
      qrToken: token,
      redirect: false,
    });

    if (res?.error) {
      addToast("QR Code inválido, já utilizado ou expirado.", "error");
    } else {
      addToast("Login de Atendente autorizado via QR Code!", "success");
      router.refresh();
      router.push("/atendente");
    }
  };

  const getDashboardLink = () => {
    const role = session?.user?.perfil;
    if (role === "ATENDENTE") return "/atendente";
    if (role === "COZINHA") return "/cozinha";
    if (role === "DEV") return "/dev";
    return "/adm";
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Navbar Superior */}
      <header className={styles.navbar}>
        <Link href="/" className={styles.brand}>
          <div className={styles.brandLogo}>
            <Zap size={22} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Sistema Hermes</span>
            <span className={styles.brandSubtitle}>Plataforma de Pedidos</span>
          </div>
        </Link>

        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.navQrBtn}
            onClick={() => setScannerOpen(true)}
            title="Escanear QR Code de Atendente"
          >
            <QrCode size={18} />
            <span>Escanear QR</span>
          </button>

          {status === "authenticated" ? (
            <>
              <Link href={getDashboardLink()} className={styles.navRegisterBtn}>
                <span>Meu Painel ({session?.user?.perfil})</span>
                <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className={styles.navLoginBtn}
                title="Sair do sistema"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLoginBtn}>
                <LogIn size={16} />
                <span>Entrar</span>
              </Link>
              <Link href="/login?mode=register" className={styles.navRegisterBtn}>
                <UserPlus size={16} />
                <span>Criar Conta</span>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Principal */}
      <main className={styles.heroSection}>
        <div className={styles.badge}>
          <span className={styles.liveIndicator}></span>
          <span>SISTEMA HERMES &bull; GESTÃO EM TEMPO REAL</span>
        </div>

        <h1 className={styles.headline}>
          O ecossistema definitivo para <br />
          <span className={styles.headlineGradient}>pedidos e atendimento</span>
        </h1>

        <p className={styles.subheadline}>
          Cardápios digitais para clientes, terminais ágeis para garçons, tela de cozinha KDS sincronizada e gestão administrativa em tempo real com acesso instantâneo via QR Code.
        </p>

        {/* Grupo de Ações Primárias (CTAs) */}
        <div className={styles.ctaGroup}>
          <Link href="/login" className={styles.primaryCta}>
            <LogIn size={20} />
            <span>Acessar o Sistema</span>
            <ArrowRight size={18} />
          </Link>

          <Link href="/login?mode=register" className={styles.secondaryCta}>
            <Sparkles size={18} color="#F59E0B" />
            <span>Criar Nova Conta</span>
          </Link>

          <button
            type="button"
            className={styles.qrScanCta}
            onClick={() => setScannerOpen(true)}
          >
            <QrCode size={20} />
            <span>Escanear QR Code de Atendente no Celular</span>
          </button>
        </div>

        {/* Visual Stage Showcase (Banner Dinâmico) */}
        <div className={styles.showcaseStage}>
          <div className={styles.showcaseInner}>
            <Image
              src="/images/branding/hermes-hero-banner.jpg"
              alt="Apresentação do Sistema Hermes em múltiplos dispositivos"
              fill
              priority
              unoptimized
              className={styles.showcaseImage}
            />
            {/* Badges Flutuantes Decorativos */}
            <div className={styles.floatingTagLeft}>
              <CheckCircle2 size={18} color="#10B981" />
              <span>Fila da Cozinha KDS: 0s de latência</span>
            </div>

            <div className={styles.floatingTagRight}>
              <Zap size={18} color="#F59E0B" />
              <span>Sincronização Instantânea via QR Code</span>
            </div>
          </div>
        </div>

        {/* Seção dos Módulos Principais */}
        <h2 className={styles.sectionTitle}>Módulos do Sistema Hermes</h2>
        <p className={styles.sectionSubtitle}>
          Projetado para garantir velocidade na tomada do pedido, clareza no preparo e controle total da operação.
        </p>

        <div className={styles.modulesGrid}>
          {/* Módulo 1: Totem do Cliente */}
          <div className={styles.moduleCard}>
            <div className={styles.moduleIcon} style={{ background: "rgba(244, 114, 182, 0.15)", color: "#F472B6" }}>
              <Smartphone size={28} />
            </div>
            <h3 className={styles.moduleTitle}>Totem &amp; Cardápio Mobile</h3>
            <p className={styles.moduleDesc}>
              Cardápio digital mobile para autoatendimento do cliente na mesa ou balcão, com fotos em alta definição e carrinho intuitivo.
            </p>
            <Link href="/totem/pastelaria-do-galo" className={styles.moduleAction}>
              <span>Ver Cardápio Demonstração</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Módulo 2: Terminal do Atendente */}
          <div className={styles.moduleCard}>
            <div className={styles.moduleIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B" }}>
              <Utensils size={28} />
            </div>
            <h3 className={styles.moduleTitle}>Terminal do Atendente</h3>
            <p className={styles.moduleDesc}>
              Interface 100% responsiva para celulares e tablets dos garçons. Lançamento rápido de pedidos e alertas de pratos prontos.
            </p>
            <Link href="/atendente" className={styles.moduleAction}>
              <span>Acessar Terminal</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Módulo 3: KDS Cozinha */}
          <div className={styles.moduleCard}>
            <div className={styles.moduleIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981" }}>
              <ChefHat size={28} />
            </div>
            <h3 className={styles.moduleTitle}>Display Cozinha (KDS)</h3>
            <p className={styles.moduleDesc}>
              Visão limpa da esteira de preparo em tempo real. Separação visual por status (Pendente, Preparando, Pronto) com avisos automáticos.
            </p>
            <Link href="/cozinha" className={styles.moduleAction}>
              <span>Acessar Fila da Cozinha</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Módulo 4: Painel Administrativo */}
          <div className={styles.moduleCard}>
            <div className={styles.moduleIcon} style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818CF8" }}>
              <LayoutDashboard size={28} />
            </div>
            <h3 className={styles.moduleTitle}>Painel Administrativo</h3>
            <p className={styles.moduleDesc}>
              Métricas de faturamento ao vivo, gerador de QR Codes de uso único para sincronizar novos atendentes e controle de cardápio.
            </p>
            <Link href="/adm" className={styles.moduleAction}>
              <span>Acessar Painel ADM</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Infográfico do Fluxo Operacional */}
        <div className={styles.pipelineSection}>
          <h2 className={styles.sectionTitle}>Fluxo de Operação Integrada</h2>
          <p className={styles.sectionSubtitle}>
            Como as informações viajam em tempo real entre o cliente, garçom, cozinha e a gerência.
          </p>
          <div className={styles.pipelineBanner}>
            <Image
              src="/images/branding/hermes-system-flow.jpg"
              alt="Fluxo de trabalho integrado do Sistema Hermes"
              fill
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Case de Sucesso Modelado: Pastelaria do Galo */}
        <div className={styles.caseCard}>
          <div className={styles.caseInfo}>
            <div className={styles.caseBadge}>
              <Sparkles size={14} />
              <span>CASE DE DEMONSTRAÇÃO ATIVO</span>
            </div>
            <h3 className={styles.caseTitle}>Pastelaria do Galo</h3>
            <p className={styles.caseText}>
              Este case prático opera sobre o Sistema Hermes utilizando cardápio artesanal com mais de 20 tipos de pastéis e bebidas, totens de mesa sincronizados e display de fritura em tempo real.
            </p>
          </div>
          <Link href="/totem/pastelaria-do-galo" className={styles.caseBtn}>
            <span>Explorar Totem do Case</span>
            <ExternalLink size={18} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Sistema Hermes &bull; Plataforma Inteligente de Gestão de Pedidos e Atendimento em Tempo Real.</p>
      </footer>

      {/* Modal de Leitura de QR Code */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleQRScanned}
      />
    </div>
  );
}
