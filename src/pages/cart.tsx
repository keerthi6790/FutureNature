import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShippingScreen from "@/components/ShippingScreen";
import { useCart, CartItem } from "@/components/CartContext";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Cart.module.scss";

// --- ICONS ---
const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

// --- MODERN EMPTY CART ILLUSTRATION (SVG) ---
const EmptyCartSVG = () => (
  <svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.floatingSvg}>
    {/* Floating Elements Background */}
    <circle cx="120" cy="100" r="90" fill="#FEF3C7" fillOpacity="0.5" />
    <circle cx="40" cy="60" r="10" fill="#FDE68A" />
    <circle cx="200" cy="140" r="15" fill="#FDE68A" />

    {/* Basket */}
    <path d="M70 70 L170 70 L160 160 C160 171.046 151.046 180 140 180 H100 C88.9543 180 80 171.046 80 160 L70 70 Z" fill="white" stroke="#F59E0B" strokeWidth="4" />

    {/* Handle */}
    <path d="M90 70 C90 70 90 30 120 30 C150 30 150 70 150 70" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />

    {/* Sad Face */}
    <circle cx="105" cy="120" r="4" fill="#F59E0B" />
    <circle cx="135" cy="120" r="4" fill="#F59E0B" />
    <path d="M105 145 C105 145 112 138 120 138 C128 138 135 145 135 145" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />

    {/* Dotted Line / Leaf */}
    <path d="M165 40 C175 30 190 35 195 45" stroke="#D97706" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [showShipping, setShowShipping] = useState(false);
  const router = useRouter();

  // --- Calculations ---
  const subtotal = cart.reduce((sum: number, item: CartItem) => {
    return sum + ((item.price || 0) * item.quantity);
  }, 0);

  const salesTax = Math.round(subtotal * 0.05);
  const shippingThreshold = 5000;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 150;
  const total = subtotal + salesTax + shippingCost;
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100);

  if (showShipping) {
    return (
      <>
        <Head><title>Shipping - FutureNature</title></Head>
        <Navbar />
        <ShippingScreen onClose={() => setShowShipping(false)} onContinue={() => { setShowShipping(false); router.push('/'); }} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart ({cart.length}) - FutureNature</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.pageWrapper}>
        <Navbar />

        <main className={styles.mainContainer}>
          {cart.length === 0 ? (
            /* --- MODERN EMPTY STATE --- */
            <div className={styles.emptyContainer}>
              <div className={styles.emptyCard}>
                <div className={styles.illustrationArea}>
                  <EmptyCartSVG />
                </div>

                <h1 className={styles.emptyTitle}>Your cart is empty</h1>
                <p className={styles.emptySubtitle}>
                  Looks like you haven&apos;t added any honey products yet.
                  <br />Nature&apos;s sweetness is waiting for you!
                </p>

                <div className={styles.actionButtons}>
                  <Link href="/products" className={styles.primaryBtn}>
                    Explore Products
                  </Link>
                  {/* Daily Deals Button Removed */}
                </div>
              </div>
            </div>
          ) : (
            /* --- CART CONTENT --- */
            <div className={styles.contentGrid}>

              {/* LEFT COLUMN: Items */}
              <div className={styles.cartItemsSection}>
                <div className={styles.headerRow}>
                  <h1 className={styles.pageTitle}>Shopping Cart</h1>
                  <span className={styles.itemCount}>{cart.length} Items</span>
                </div>



                <div className={styles.itemsList}>
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className={styles.cartItemCard}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.image || "/Assets/Products/15.png"}
                          alt={item.name || "Product Image"}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </div>

                      <div className={styles.itemInfo}>
                        <div className={styles.infoTop}>
                          <Link href={`/product/${item.id}`} className={styles.itemName}>
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id, item.cartItemId)}
                            className={styles.removeBtn}
                          >
                            <TrashIcon />
                          </button>
                        </div>


                        <div className={styles.infoBottom}>
                          <div className={styles.qtyStepper}>
                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                          <div className={styles.itemPrice}>₹{(item.price || 0) * item.quantity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/products" className={styles.continueLink}>
                  <ArrowLeftIcon /> Continue Shopping
                </Link>
              </div>

              {/* RIGHT COLUMN: Summary */}
              <div className={styles.summarySection}>
                <div className={styles.summaryCard}>
                  <h2 className={styles.summaryTitle}>Order Summary</h2>
                  <div className={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <div className={styles.summaryRow}><span>Tax Estimate (5%)</span><span>₹{salesTax}</span></div>
                  <div className={styles.summaryRow}><span>Shipping</span><span className={isFreeShipping ? styles.freeText : ''}>{isFreeShipping ? 'FREE' : `₹${shippingCost}`}</span></div>
                  <div className={styles.divider}></div>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><span>₹{total}</span></div>
                  <button onClick={() => setShowShipping(true)} className={styles.checkoutBtn}>Proceed to Checkout</button>
                  <div className={styles.trustBadge}><ShieldCheckIcon /><span>Secure Checkout</span></div>
                </div>
              </div>

            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}