"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./totem.module.css";
import { usePedido } from "../../context/PedidoContext";
import { ShoppingBag, Search, ImageIcon } from "lucide-react";
import { MOCK_PRODUCTS } from "../../atendente/page"; // Aproveitando mock para o exemplo

export default function TotemMobilePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restauranteInfo, setRestauranteInfo] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setError("Token não fornecido. Escaneie o QR Code novamente.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/qrcode/validar?token=${token}`);
        const data = await res.json();
        
        if (res.ok && data.valid && data.restaurante.slug === params.slug) {
          setRestauranteInfo(data.restaurante);
        } else {
          setError(data.error || "Token inválido para esta loja.");
        }
      } catch (err) {
        setError("Erro ao validar token. Verifique a conexão.");
      } finally {
        setLoading(false);
      }
    }

    validateToken();
  }, [token, params.slug]);

  if (loading) {
    return <div className={styles.fullPageCenter}><h2>Carregando acesso...</h2></div>;
  }

  if (error) {
    return (
      <div className={styles.fullPageCenter}>
        <h2 style={{ color: "#DC2626", marginBottom: "1rem" }}>Acesso Negado</h2>
        <p>{error}</p>
        <button onClick={() => router.push("/login")} style={{ marginTop: "2rem", padding: "0.75rem 1.5rem", background: "#374151", color: "white", borderRadius: "0.5rem", border: "none" }}>
          Ir para Login Manual
        </button>
      </div>
    );
  }

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <h1 className={styles.logoTitle}>{restauranteInfo?.nome || "Totem Mobile"}</h1>
        </div>
        <div>
          <Search size={24} />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.productsGrid}>
          {MOCK_PRODUCTS.map(product => (
            <div key={product.id} className={styles.productCard} onClick={() => addToCart(product)}>
              <div className={styles.productImage}>
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <ImageIcon size={32} opacity={0.3} />
                )}
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <span className={styles.productPrice}>R$ {product.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <button className={styles.fab} onClick={() => alert("Abrir carrinho (A ser implementado)")}>
        <ShoppingBag size={28} />
        {totalItems > 0 && <span className={styles.fabBadge}>{totalItems}</span>}
      </button>
    </div>
  );
}
