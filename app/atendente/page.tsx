"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./atendente.module.css";
import { usePedidosApi } from "../hooks/usePedidosApi";
import { Store, ShoppingCart, Plus, Minus, Trash2, CheckCircle2, Image as ImageIcon, Menu, X, Clock, User, FileText } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "🏠 Home" },
  { href: "/dev", label: "💻 Workspace DEV" },
  { href: "/adm", label: "🛠️ Painel ADM" },
  { href: "/cozinha", label: "🍳 Cozinha" },
  { href: "/atendente", label: "🧾 Atendente" },
];

// Mock Data baseado no cardápio "Pastelaria do Galo"
const MOCK_CATEGORIES = ["Salgados", "Especiais", "Doces", "Bebidas"];

export const MOCK_PRODUCTS = [
  { id: "1", name: "Carne", price: 8.0, category: "Salgados", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "2", name: "Queijo", price: 8.0, category: "Salgados", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "3", name: "Frango", price: 8.0, category: "Salgados", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "4", name: "Camarão", price: 13.0, category: "Salgados", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "5", name: "Carne de Sol", price: 11.0, category: "Salgados", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  
  { id: "6", name: "Carne de Sol + Queijo", price: 13.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "7", name: "Carne de Sol + Catupiry", price: 13.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "8", name: "Frango + Queijo", price: 9.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "9", name: "Frango + Catupiry", price: 9.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "10", name: "Carne + Queijo", price: 9.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "11", name: "Carne + Catupiry", price: 9.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "12", name: "Camarão + Catupiry", price: 15.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "13", name: "Camarão + Queijo", price: 15.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "14", name: "2 Queijos", price: 9.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
  { id: "15", name: "Misto", price: 9.0, category: "Especiais", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },

  { id: "16", name: "Banana c/ Nutella", price: 12.0, category: "Doces", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80" },
  { id: "17", name: "Romeu e Julieta", price: 12.0, category: "Doces", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80" },

  { id: "18", name: "Coca-Cola Zero", price: 6.0, category: "Bebidas", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { id: "19", name: "Coca-Cola Lata", price: 6.0, category: "Bebidas", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { id: "20", name: "Coca-Cola 1 Litro", price: 10.0, category: "Bebidas", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { id: "21", name: "Suco Maracujá 300ml", price: 4.0, category: "Bebidas", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { id: "22", name: "Suco Maracujá 500ml", price: 5.0, category: "Bebidas", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { id: "23", name: "Caldo de Cana 300ml", price: 3.0, category: "Bebidas", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { id: "24", name: "Caldo de Cana 500ml", price: 4.0, category: "Bebidas", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
];

type CartItem = {
  product: typeof MOCK_PRODUCTS[0];
  quantity: number;
};

function AtendenteInterface() {
  const { pedidos, criarPedido, atualizarStatus } = usePedidosApi({ restauranteId: "rest-pastelaria-do-galo" });
  
  const [activeTab, setActiveTab] = useState<"cardapio" | "prontos">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("atendente_activeTab") as any) || "cardapio";
    }
    return "cardapio";
  });

  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("atendente_activeCategory") || "Salgados";
    }
    return "Salgados";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("atendente_activeTab", activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("atendente_activeCategory", activeCategory);
    }
  }, [activeCategory]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Modals
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  
  // Campos Opcionais do Carrinho
  const [clienteNome, setClienteNome] = useState("");
  const [nota, setNota] = useState("");
  const [agendadoPara, setAgendadoPara] = useState("");

  const pedidosProntos = pedidos.filter(p => p.status === "PRONTO");

  const filteredProducts = MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const addToCart = (product: typeof MOCK_PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (item: CartItem) => {
    if (item.quantity === 1) {
      setItemToRemove(item);
    } else {
      setCart(prev => prev.map(i => 
        i.product.id === item.product.id ? { ...i, quantity: i.quantity - 1 } : i
      ));
    }
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      setCart(prev => prev.filter(i => i.product.id !== itemToRemove.product.id));
      setItemToRemove(null);
    }
  };

  const cancelRemove = () => {
    setItemToRemove(null);
  };

  const handleConfirmarPedido = async () => {
    if (cart.length === 0) return;
    
    // Mapear para o formato da API
    const itens = cart.map(i => ({
      nomeProduto: i.product.name,
      precoUnitario: i.product.price,
      quantidade: i.quantity
    }));

    const success = await criarPedido({
      restauranteId: "rest-pastelaria-do-galo",
      clienteNome: clienteNome.trim() || undefined,
      nota: nota.trim() || undefined,
      agendadoPara: agendadoPara || undefined,
      itens
    });
    
    if (success) {
      setCart([]);
      setClienteNome("");
      setNota("");
      setAgendadoPara("");
      setCheckoutModal(false);
      setOrderSuccessModal(true);
    } else {
      alert("Erro ao criar pedido. Tente novamente.");
    }
  };

  const closeSuccessModal = () => {
    setOrderSuccessModal(false);
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className={styles.container}>

      {/* Hamburger Nav — Temporário para dev */}
      <div className={styles.burgerWrapper}>
        <button className={styles.burgerBtn} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        {menuOpen && (
          <nav className={styles.burgerMenu}>
            <p className={styles.burgerTitle}>Navegar para</p>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} className={styles.burgerLink} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Toast Not removido em prol de feedback nativo */}
      
      {/* Main Content (Left) */}
      <div className={styles.main}>
        {/* Header / Categories */}
        <header className={styles.header}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1.5rem" }}>
            <h1 className={styles.title} style={{ margin: 0 }}>
              <Store size={24} /> Pastelaria do Galo
            </h1>
            <div style={{ display: "flex", background: "#E5E7EB", padding: "0.25rem", borderRadius: "0.5rem" }}>
              <button 
                onClick={() => setActiveTab("cardapio")}
                style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "0.25rem", fontWeight: "bold", cursor: "pointer", background: activeTab === "cardapio" ? "white" : "transparent", boxShadow: activeTab === "cardapio" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", color: activeTab === "cardapio" ? "#111827" : "#6B7280" }}
              >
                Cardápio
              </button>
              <button 
                onClick={() => setActiveTab("prontos")}
                style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "0.25rem", fontWeight: "bold", cursor: "pointer", background: activeTab === "prontos" ? "white" : "transparent", boxShadow: activeTab === "prontos" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", color: activeTab === "prontos" ? "#10B981" : "#6B7280", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                ✅ Prontos
                {pedidosProntos.length > 0 && (
                  <span style={{ background: "#EF4444", color: "white", padding: "0.1rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem" }}>{pedidosProntos.length}</span>
                )}
              </button>
            </div>
          </div>

          {activeTab === "cardapio" && (
            <div className={styles.categories}>
              {MOCK_CATEGORIES.map(category => (
                <button 
                  key={category}
                  className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </header>

        {activeTab === "cardapio" ? (
          <div className={`${styles.productsScroll} ${styles.animateFadeIn}`}>
            <div className={styles.productsGrid}>
              {filteredProducts.map(product => (
                <div key={product.id} className={`${styles.productCard} ${styles.animateFadeIn}`}>
                  <div className={styles.productImage}>
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={48} opacity={0.3} />
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                  </div>
                  <button className={styles.addButton} onClick={() => addToCart(product)}>
                    <Plus size={20} /> Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: "1rem" }}>
            {pedidosProntos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#6B7280" }}>
                <CheckCircle2 size={64} opacity={0.2} style={{ marginBottom: "1rem" }} />
                <h2>Nenhum pedido pronto no momento</h2>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                {pedidosProntos.map(pedido => (
                  <div key={pedido.id} style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "2px solid #10B981", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.5rem", color: "#111827" }}>
                        {pedido.clienteNome ? pedido.clienteNome.toUpperCase() : `PEDIDO #${pedido.id}`}
                      </h3>
                      <span style={{ background: "#D1FAE5", color: "#059669", padding: "0.25rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "bold" }}>
                        PRONTO
                      </span>
                    </div>
                    
                    <p style={{ margin: "0 0 1.5rem 0", color: "#6B7280" }}>
                      {pedido.itens?.length || 0} itens • {formatPrice(pedido.total)}
                    </p>

                    <button 
                      onClick={() => atualizarStatus(pedido.id, "ENTREGUE")}
                      style={{ width: "100%", padding: "1rem", background: "#10B981", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", fontSize: "1.1rem" }}
                    >
                      <CheckCircle2 size={20} /> Entregar Pedido
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Sidebar (Right) */}
      <aside className={styles.cartSidebar}>
        <div className={styles.cartHeader}>
          <ShoppingCart size={24} color="#7A1E2E" />
          <h2>Pedido Atual</h2>
        </div>

        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingCart size={48} opacity={0.2} />
              <p>Nenhum item adicionado ao pedido.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  <h4 className={styles.cartItemName}>{item.product.name}</h4>
                  <p className={styles.cartItemPrice}>{formatPrice(item.product.price)}</p>
                </div>
                <div className={styles.cartItemActions}>
                  <button 
                    className={`${styles.qtyBtn} ${item.quantity === 1 ? styles.remove : ''}`}
                    onClick={() => decreaseQuantity(item)}
                  >
                    {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                  </button>
                  <span className={styles.cartItemQty}>{item.quantity}</span>
                  <button className={styles.qtyBtn} onClick={() => addToCart(item.product)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatPrice(total)}</span>
          </div>
          <button 
            className={`${styles.confirmBtn} ${cart.length > 0 ? styles.animatePulse : ''}`} 
            disabled={cart.length === 0}
            onClick={() => setCheckoutModal(true)}
          >
            <CheckCircle2 size={24} /> Confirmar Pedido
          </button>
        </div>
      </aside>

      {/* Remove Item Modal */}
      {itemToRemove && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Remover Item?</h3>
            <p className={styles.modalText}>
              Tem certeza que deseja remover <strong>{itemToRemove.product.name}</strong> do pedido?
            </p>
            <div className={styles.modalActions}>
              <button className={`${styles.modalBtn} ${styles.cancel}`} onClick={cancelRemove}>
                Cancelar
              </button>
              <button className={`${styles.modalBtn} ${styles.remove}`} onClick={confirmRemove}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Checkout Options Modal */}
      {checkoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: "400px" }}>
            <h3 className={styles.modalTitle} style={{ marginBottom: "1.5rem" }}>Detalhes Adicionais</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", color: "#4B5563", fontWeight: 600 }}>Nome do Cliente (Para chamar)</label>
                <input 
                  type="text" 
                  placeholder="Ex: João Silva" 
                  value={clienteNome}
                  onChange={e => setClienteNome(e.target.value)}
                  style={{ padding: "0.75rem", border: "1px solid #D1D5DB", borderRadius: "0.5rem", fontSize: "1rem" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", color: "#4B5563", fontWeight: 600 }}>Observação (Para a Cozinha)</label>
                <textarea 
                  placeholder="Ex: Sem cebola, bem passado" 
                  value={nota}
                  onChange={e => setNota(e.target.value)}
                  style={{ padding: "0.75rem", border: "1px solid #D1D5DB", borderRadius: "0.5rem", fontSize: "1rem", minHeight: "80px", resize: "none" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", color: "#4B5563", fontWeight: 600 }}>Agendar Horário (Opcional)</label>
                <input 
                  type="time" 
                  value={agendadoPara}
                  onChange={e => setAgendadoPara(e.target.value)}
                  style={{ padding: "0.75rem", border: "1px solid #D1D5DB", borderRadius: "0.5rem", fontSize: "1rem" }}
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={`${styles.modalBtn} ${styles.cancel}`} onClick={() => setCheckoutModal(false)}>
                Voltar
              </button>
              <button className={`${styles.modalBtn} ${styles.confirm}`} onClick={handleConfirmarPedido} style={{ background: "#10B981", color: "white" }}>
                Enviar Pedido ({formatPrice(total)})
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Order Success Modal with Stepper */}
      {orderSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: "500px", textAlign: "center" }}>
            <CheckCircle2 size={64} color="#10B981" style={{ margin: "0 auto 1rem auto" }} />
            <h3 className={styles.modalTitle}>Pedido Enviado com Sucesso!</h3>
            <p className={styles.modalText}>Seu pedido foi registrado e enviado para a cozinha.</p>
            
            <div className={styles.stepperContainer}>
              <div className={styles.stepperLine}></div>
              
              <div className={styles.stepperStep}>
                <div className={`${styles.stepCircle} ${styles.active}`}><CheckCircle2 size={16} /></div>
                <span className={`${styles.stepLabel} ${styles.active}`}>Pago</span>
              </div>
              <div className={styles.stepperStep}>
                <div className={styles.stepCircle}>2</div>
                <span className={styles.stepLabel}>Em preparo</span>
              </div>
              <div className={styles.stepperStep}>
                <div className={styles.stepCircle}>3</div>
                <span className={styles.stepLabel}>Pronto</span>
              </div>
              <div className={styles.stepperStep}>
                <div className={styles.stepCircle}>4</div>
                <span className={styles.stepLabel}>Entregue</span>
              </div>
            </div>

            <button 
              onClick={closeSuccessModal}
              style={{ width: "100%", padding: "1rem", background: "#10B981", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem" }}
            >
              Novo Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { RequireAuth } from "../components/RequireAuth";
export default function Page() {
  return (
    <RequireAuth allowedRoles={["ADM", "ATENDENTE", "DEV"]}>
      <AtendenteInterface />
    </RequireAuth>
  );
}
