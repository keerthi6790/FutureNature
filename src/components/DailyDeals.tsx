import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { Rating } from "react-simple-star-rating";
import { productApi } from "@/api/productApi";
import styles from "@/styles/DailyDeals.module.scss";
import SkeletonDeals from "./SkeletonDeals";

interface Product {
  id: string;
  product_name: string;
  product_name_tamil: string;
  imageUrl: string[];
  price: string;
  selling_price: string;
  overall_rating: number;
  available_quantity: number;
}

// --- HEXAGONAL ARROW ICONS ---
const HexChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const HexChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function DailyDeals() {
  const { addToCart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showQuantityControls, setShowQuantityControls] = useState<{ [key: string]: boolean }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Slider State & Refs
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false); // Starts false
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchDailyDeals = async () => {
      try {
        const response = await productApi.getDailyDeals();
        if (response.data.status) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching daily deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyDeals();
  }, []);

  // --- SLIDER LOGIC ---
  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      // Added a 5px buffer so it strictly hides at the very start
      setCanScrollLeft(scrollLeft > 5); 
      // Give a buffer for rounding errors on the right side
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  };

  useEffect(() => {
    // Check initially when products load
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [products]);

  const scrollByAmount = (amount: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  if (loading) return <SkeletonDeals />;
  if (products.length === 0) return null;

  return (
    <div className={styles.sectionWrapper}>
      <h2 className={styles.sectionTitle}>DAILY DEALS</h2>

      <div className={styles.sliderContainer}>
        
        {/* Left Arrow - Now perfectly hidden at start */}
        {canScrollLeft && (
          <button 
            className={`${styles.navBtn} ${styles.navBtnLeft}`} 
            onClick={() => scrollByAmount(-350)}
            aria-label="Scroll Left"
          >
            <div className={styles.hexShape}>
              <HexChevronLeft />
            </div>
          </button>
        )}

        {/* Scrollable Track */}
        <div 
          className={styles.productsTrack} 
          ref={sliderRef}
          onScroll={checkScrollPosition}
        >
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.badge}>Daily Deals</div>

              <div className={styles.imageContainer}>
                <Image
                  src={product.imageUrl?.[0] || "/Assets/Products/15.png"}
                  alt={product.product_name}
                  width={350}
                  unoptimized
                  height={350}
                  className={styles.productImg}
                  style={product.available_quantity <= 0 ? { filter: 'grayscale(1) opacity(0.6)' } : {}}
                />
                {product.available_quantity <= 0 && (
                  <div className={styles.outOfStockOverlay}>
                    OUT OF STOCK
                  </div>
                )}
              </div>

              <div className={styles.details}>
                <div className={styles.productName}>
                  <h3>{product.product_name}</h3>
                  <p>{product.product_name_tamil}</p>
                </div>

                <div className={styles.metaRow}>
                  <div className={styles.ratingBox}>
                    <Rating initialValue={product.overall_rating} readonly size={14} allowFraction fillColor="#FFB800" />
                    <span>{product.overall_rating}</span>
                  </div>
                  <span className={styles.weightTag}>Standard</span>
                </div>

                <div className={styles.actionRow}>
                  <div className={styles.priceBlock}>
                    <div className={styles.currentPrice}>₹ {Math.round(parseFloat(product.selling_price))}</div>
                    <div className={styles.oldPrice}>₹{Math.round(parseFloat(product.price))}</div>
                  </div>

                  {product.available_quantity <= 0 ? (
                    <button className={styles.addBtn} disabled style={{ backgroundColor: '#9ca3af', cursor: 'not-allowed' }}>
                      Sold Out
                    </button>
                  ) : !showQuantityControls[product.id] ? (
                    <button
                      className={styles.addBtn}
                      onClick={() => {
                        setShowQuantityControls(prev => ({ ...prev, [product.id]: true }));
                        addToCart(product.id, 1);
                      }}
                    >
                      ADD TO CART
                    </button>
                  ) : (
                    <div className={styles.qtyControl}>
                      <button onClick={() => {
                        const newQty = (quantities[product.id] || 1) - 1;
                        if (newQty === 0) {
                          setShowQuantityControls(prev => ({ ...prev, [product.id]: false }));
                          setQuantities(prev => ({ ...prev, [product.id]: 1 }));
                          updateQuantity(product.id, 0);
                        } else {
                          setQuantities(prev => ({ ...prev, [product.id]: newQty }));
                          updateQuantity(product.id, newQty);
                        }
                      }}>−</button>

                      <div className={styles.qtyValue}>{quantities[product.id] || 1}</div>

                      <button onClick={() => {
                        const newQty = (quantities[product.id] || 1) + 1;
                        setQuantities(prev => ({ ...prev, [product.id]: newQty }));
                        updateQuantity(product.id, newQty);
                      }}>+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button 
            className={`${styles.navBtn} ${styles.navBtnRight}`} 
            onClick={() => scrollByAmount(350)}
            aria-label="Scroll Right"
          >
            <div className={styles.hexShape}>
              <HexChevronRight />
            </div>
          </button>
        )}

      </div>
    </div>
  );
}