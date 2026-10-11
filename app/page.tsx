import Link from "next/link";
import { Store, Utensils, ChefHat, LayoutDashboard, QrCode, LogIn, Laptop } from "lucide-react";

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
      color: '#F8FAFC',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(245, 197, 24, 0.15)',
          color: '#FCD34D',
          padding: '0.4rem 1rem',
          borderRadius: '999px',
          fontSize: '0.875rem',
          fontWeight: 700,
          marginBottom: '1rem',
          border: '1px solid rgba(245, 197, 24, 0.3)'
        }}>
          🥟 PASTELARIA DO GALO &bull; SISTEMA HERMES
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 0.75rem 0', letterSpacing: '-0.025em' }}>
          Sistema de Pedidos Inteligente
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Plataforma completa e 100% responsiva para totens, celulares de atendentes, tela da cozinha e gestão administrativa com sincronização instantânea via QR Code.
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        width: '100%',
        maxWidth: '900px'
      }}>
        <Link href="/atendente" style={cardStyle('#7A1E2E', '#F5C518')}>
          <Utensils size={28} />
          <div>
            <div style={cardTitle}>Totem Atendente</div>
            <div style={cardSub}>Tirar pedidos no balcão ou celular</div>
          </div>
        </Link>

        <Link href="/cozinha" style={cardStyle('#1F2937', '#10B981')}>
          <ChefHat size={28} />
          <div>
            <div style={cardTitle}>Interface Cozinha</div>
            <div style={cardSub}>Fila ao vivo em tempo real</div>
          </div>
        </Link>

        <Link href="/adm" style={cardStyle('#312E81', '#818CF8')}>
          <LayoutDashboard size={28} />
          <div>
            <div style={cardTitle}>Painel Administrativo</div>
            <div style={cardSub}>Métricas &amp; Geração de QR Code</div>
          </div>
        </Link>

        <Link href="/login" style={cardStyle('#064E3B', '#34D399')}>
          <LogIn size={28} />
          <div>
            <div style={cardTitle}>Login / Escanear QR</div>
            <div style={cardSub}>Acesso com senha ou câmera</div>
          </div>
        </Link>

        <Link href="/totem/pastelaria-do-galo" style={cardStyle('#831843', '#F472B6')}>
          <QrCode size={28} />
          <div>
            <div style={cardTitle}>Totem do Cliente</div>
            <div style={cardSub}>Cardápio digital mobile</div>
          </div>
        </Link>

        <Link href="/dev" style={cardStyle('#1E293B', '#94A3B8')}>
          <Laptop size={28} />
          <div>
            <div style={cardTitle}>Workspace DEV</div>
            <div style={cardSub}>Simulação multi-lojas e testes</div>
          </div>
        </Link>
      </div>
    </main>
  );
}

const cardStyle = (bg: string, accent: string) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.25rem 1.5rem',
  backgroundColor: 'rgba(30, 41, 59, 0.7)',
  backdropFilter: 'blur(8px)',
  color: accent,
  borderRadius: '1rem',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  textDecoration: 'none',
  transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
});

const cardTitle = {
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#F8FAFC',
  marginBottom: '0.2rem'
};

const cardSub = {
  fontSize: '0.85rem',
  color: '#94A3B8'
};
