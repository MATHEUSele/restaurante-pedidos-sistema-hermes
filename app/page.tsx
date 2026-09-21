import Link from "next/link";

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>🍽️ Hermes</h1>
      <p style={{ color: 'var(--text-muted)' }}>Sistema de Pedidos para Restaurantes</p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/dev" style={linkStyle}>Workspace DEV</Link>
        <Link href="/adm" style={linkStyle}>Painel ADM</Link>
        <Link href="/cozinha" style={linkStyle}>Interface Cozinha</Link>
        <Link href="/atendente" style={linkStyle}>Totem Atendente</Link>
      </div>
    </main>
  );
}

const linkStyle = {
  padding: '1rem 2rem',
  backgroundColor: 'var(--primary)',
  color: 'white',
  borderRadius: '0.5rem',
  fontWeight: '500',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  transition: 'background-color 0.2s'
};
