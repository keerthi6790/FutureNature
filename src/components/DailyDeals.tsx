import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { productApi } from "@/api/productApi";
import styles from "@/styles/DailyDeals.module.scss";
import SkeletonDeals from "./SkeletonDeals";
import Link from "next/link";
import toast from "react-hot-toast";
import VariantSelectionDrawer, {
  IVariantOption,
} from "./VariantSelectionDrawer";

interface Product {
  id: string;
  product_name: string;
  product_name_tamil: string;
  imageUrl: string[];
  price: string;
  selling_price: string;
  overall_rating: number;
  available_quantity: number;
  variants?: {
    id: string;
    name: string;
    imageUrl?: string;
    price: string;
    selling_price: string;
    available_quantity: number;
  }[];
}

// --- HEXAGONAL ARROW ICONS ---
const HexChevronLeft = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const HexChevronRight = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function DailyDeals() {
  const { addToCart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showQuantityControls, setShowQuantityControls] = useState<{
    [key: string]: boolean;
  }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerProduct, setDrawerProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, [products]);

  const scrollByAmount = (amount: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleDrawerAddToCart = (
    prod: any,
    selectedVariant: IVariantOption
  ) => {
    addToCart(prod.id, 1, {
      name: `${prod.name} (${selectedVariant.name})`,
      price: parseFloat(selectedVariant.selling_price),
      image: selectedVariant.imageUrl || prod.image,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
    });
    toast.success("Added to cart!");
  };

  if (loading) return <SkeletonDeals />;
  if (products.length === 0) return null;

  return (
    <div className={styles.sectionWrapper}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "30px",
          alignItems: "center",
        }}
      >
        <h2 className={styles.sectionTitle}>DAILY DEALS</h2>

        <Link href={"/products"} className={styles.seeAllOption}>
          See all
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>

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
                  style={
                    product.available_quantity <= 0
                      ? { filter: "grayscale(1) opacity(0.6)" }
                      : {}
                  }
                />
                {product.available_quantity <= 0 && (
                  <div className={styles.outOfStockOverlay}>OUT OF STOCK</div>
                )}
              </div>

              <div className={styles.details}>
                <div className={styles.productName}>
                  <h3>{product.product_name}</h3>
                  <p>{product.product_name_tamil}</p>
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.weightTag}>{product.variants?.[0]?.name || "Standard"}</span>
                </div>

                <div className={styles.actionRow}>
                  <div className={styles.priceBlock}>
                    <div className={styles.currentPrice}>
                      ₹ {Math.round(parseFloat(product.selling_price))}
                    </div>
                    <div className={styles.oldPrice}>
                      ₹{Math.round(parseFloat(product.price))}
                    </div>
                  </div>

                  {product.available_quantity <= 0 ? (
                    <button
                      className={styles.addBtn}
                      disabled
                      style={{
                        backgroundColor: "#9ca3af",
                        cursor: "not-allowed",
                      }}
                    >
                      Sold Out
                    </button>
                  ) : (
                    <button
                      className={styles.addBtn}
                      onClick={() => {
                        setDrawerProduct({
                          id: product.id,
                          name: product.product_name,
                          nameTamil: product.product_name_tamil,
                          image: product.imageUrl?.[0] || "",
                          price: parseFloat(product.selling_price),
                          originalPrice: parseFloat(product.price),
                          variants: product.variants,
                        });
                        setIsDrawerOpen(true);
                      }}
                    >
                      ADD TO CART
                    </button>
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

      {/* Variant Selection Drawer */}
      <VariantSelectionDrawer
        isOpen={isDrawerOpen}
        product={drawerProduct}
        onClose={() => setIsDrawerOpen(false)}
        onAddToCart={handleDrawerAddToCart}
      />
    </div>
  );
}
