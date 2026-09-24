import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { productApi } from "@/api/productApi";
import { Category, categoryApi } from "@/api/categoryApi";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import { wishlistApi } from "@/api/wishlistApi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import styles from "@/styles/Products.module.scss";
import SkeletonProducts from "@/components/SkeletonProducts";

interface Product {
  id: string;
  name: string;
  nameTamil: string;
  image: string;
  rating: number;
  price: number;
  originalPrice: number;
  description: string;
  descriptionTamil: string;
  benefits: string[];
  benefitsTamil: string[];
  isBestSeller?: boolean;
  discount?: number;
  reviewCount?: number;
  availableQuantity: number;
  categoryId?: string;
}

interface BackendProduct {
  id: string;
  product_name: string;
  product_name_tamil: string;
  imageUrl: string[];
  overall_rating?: number;
  review_count?: number;
  selling_price: string;
  price: string;
  description: string;
  description_tamil: string;
  discounted_amount: string;
  available_quantity: number;
  categoryId?: string;
}

export default function Products() {
  const { cart, addToCart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [pendingWishlistId, setPendingWishlistId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Categories on Mount ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        if (response.status && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // --- Fetch Products with Categories Filter ---
  const fetchProducts = useCallback(async (categoryFilter: string[]) => {
    setLoading(true);
    try {
      const response = await productApi.getAllProducts(categoryFilter);
      const data = response.data;
      let productsData: Product[] = [];

      if (data && data.status && Array.isArray(data.data)) {
        const safeParseFloat = (val: any) => {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? 0 : parsed;
        };

        productsData = data.data.map((item: BackendProduct) => ({
          id: item.id?.toString() || "",
          name: item.product_name || "Unknown Product",
          nameTamil: item.product_name_tamil || "",
          image:
            Array.isArray(item.imageUrl) && item.imageUrl.length > 0
              ? item.imageUrl[0]
              : "/Assets/Products/15.png",
          rating: item.overall_rating || 0,
          reviewCount: item.review_count || 0,
          price: safeParseFloat(item.selling_price),
          originalPrice: safeParseFloat(item.price),
          description: item.description || "",
          descriptionTamil: item.description_tamil || "",
          benefits: [],
          benefitsTamil: [],
          discount: safeParseFloat(item.discounted_amount),
          isBestSeller: false,
          availableQuantity: item.available_quantity || 0,
          categoryId: item.categoryId,
        }));
      }
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategoryIds);
  }, [selectedCategoryIds, fetchProducts]);

  // --- Category Filter Handlers ---
  const handleSelectAll = () => {
    setSelectedCategoryIds([]);
  };

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // --- Wishlist Logic ---
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await wishlistApi.getWishlist();
          if (response.data.status) {
            setWishlistIds(response.data.data.map((p: { id: string }) => p.id));
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      }
    };
    fetchWishlist();
  }, []);

  const handleToggleWishlist = useCallback(
    async (productId: string, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please login to add to wishlist");
        return;
      }
      try {
        const response = await wishlistApi.toggleWishlist(productId);
        if (response.data.status) {
          if (response.data.action === "added") {
            setWishlistIds((prev) => [...prev, productId]);
            toast.success("Added to wishlist");
          } else {
            setWishlistIds((prev) => prev.filter((id) => id !== productId));
            toast.success("Removed from wishlist");
          }
        }
      } catch (error) {
        console.error("Error toggling wishlist:", error);
        toast.error("Failed to update wishlist");
      }
    },
    []
  );

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && pendingWishlistId) {
      const timer = setTimeout(() => {
        handleToggleWishlist(pendingWishlistId);
        setPendingWishlistId(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pendingWishlistId, handleToggleWishlist]);

  // --- Cart Logic ---
  const handleQuantityChange = (productId: string, change: number) => {
    const currentQty = quantities[productId] || 1;
    const newQty = currentQty + change;

    if (newQty === 0) {
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
      updateQuantity(productId, 0);
    } else {
      setQuantities((prev) => ({ ...prev, [productId]: newQty }));
      updateQuantity(productId, newQty);
    }
  };

  const handleAddToCart = (product: Product) => {
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    addToCart(product.id, 1, {
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success("Added to cart");
  };

  return (
    <>
      <Head>
        <title>Our Collection - FutureNature</title>
        <meta name="description" content="Browse our natural honey and herbal products" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageWrapper}>
        <Navbar />

        {/* --- FULL-WIDTH NATURAL SCALING BANNER --- */}
        <div className={styles.bannerWrapper}>
          <Image
            src="/Assets/Header_Images/Product.png"
            alt="Raw Honey & Hand Crafted"
            width={1920}
            height={600}
            priority
            unoptimized
            className={styles.bannerImage}
          />
        </div>

        <div className={styles.container}>
          {/* Header Section with Honeycomb */}
          <div className={styles.headerSection}>
            <div className={styles.titleContainer}>
              <svg
                className={styles.honeyComb}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28.8675 16.5C31.9615 11.141 37.735 7.80385 43.923 7.80385H66.077C72.265 7.80385 78.0385 11.141 81.1325 16.5L92.2094 35.6865C95.3034 41.0455 95.3034 47.7225 92.2094 53.0815L81.1325 72.268C78.0385 77.627 72.265 80.9641 66.077 80.9641H43.923C37.735 80.9641 31.9615 77.627 28.8675 72.268L17.7906 53.0815C14.6966 47.7225 14.6966 41.0455 17.7906 35.6865L28.8675 16.5Z"
                  fill="#FFB800"
                />
              </svg>
              <h1 className={styles.mainTitle}>OUR PRODUCTS</h1>
            </div>
            <p className={styles.subtitle}>
              Direct from our hives to your home. Pure, raw, and unfiltered nature.
            </p>
          </div>

          {/* Quick Category Filters */}
          <div className={styles.filterContainer}>
            <div className={styles.filterHeader}>
              <span className={styles.filterLabel}>Quick Filters</span>
              {selectedCategoryIds.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#A0522D",
                    fontSize: "13px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Clear Filters ({selectedCategoryIds.length})
                </button>
              )}
            </div>

            <div className={styles.filterTrack}>
              {/* ALL button */}
              <button
                className={`${styles.filterChip} ${selectedCategoryIds.length === 0 ? styles.filterChipActive : ""
                  }`}
                onClick={handleSelectAll}
              >
                <span className={styles.chipDot} />
                All
              </button>

              {/* Category multi-select buttons */}
              {categories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    className={`${styles.filterChip} ${isSelected ? styles.filterChipActive : ""
                      }`}
                    onClick={() => handleToggleCategory(cat.id)}
                  >
                    <span className={styles.chipDot} />
                    {cat.category_name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid Section */}
          <section className={styles.catalogSection}>
            {loading ? (
              <SkeletonProducts />
            ) : products.length === 0 ? (
              <div className={styles.emptyProducts}>
                <h3>No Products Found</h3>
                <p>There are currently no products available in the selected categories.</p>
                <button onClick={handleSelectAll}>Show All Products</button>
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {products?.map((product, index) => (
                  <Link
                    href={`/details/${product.id}`}
                    key={product.id || index}
                    className={styles.productCard}
                  >
                    {/* Top Image Area */}
                    <div className={styles.cardImageWrap}>
                      {/* Dark Discount Badge */}
                      {product.discount &&
                        product.discount > 0 &&
                        product.availableQuantity > 0 ? (
                        <div className={styles.discountBadgeImg}>
                          -{Math.round(product.discount)}%
                        </div>
                      ) : null}

                      {/* Wishlist Heart FAB */}
                      <button
                        onClick={(e) =>
                          handleToggleWishlist(product.id.toString(), e)
                        }
                        className={`${styles.wishlistFab} ${wishlistIds.includes(product.id.toString())
                          ? styles.activeWishlist
                          : ""
                          }`}
                        aria-label="Add to wishlist"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill={
                            wishlistIds.includes(product.id.toString())
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>

                      <Image
                        src={product.image || "/Assets/Products/15.png"}
                        alt={product.name}
                        width={400}
                        height={320}
                        unoptimized
                        className={`${styles.productImg} ${product.availableQuantity <= 0
                          ? styles.productImgOutOfStock
                          : ""
                          }`}
                      />

                      {/* Out of Stock Overlay */}
                      {product.availableQuantity <= 0 && (
                        <div className={styles.outOfStockBadge}>
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Bottom Content Area */}
                    <div className={styles.cardContent}>
                      {/* Title */}
                      <div className={styles.titleSection}>
                        <h3 className={styles.cardTitle}>{product.name}</h3>
                        {product.nameTamil && (
                          <span className={styles.cardSubtitle}>
                            {product.nameTamil}
                          </span>
                        )}
                      </div>

                      {/* Meta: Rating */}
                      <div className={styles.ratingRowCard}>
                        <Rating
                          initialValue={product.rating}
                          readonly
                          size={16}
                          allowFraction
                          fillColor="#D4AF37"
                        />
                        <span className={styles.ratingNum}>
                          ({product.reviewCount || 0})
                        </span>
                      </div>

                      <div className={styles.cardDivider}></div>

                      {/* Price Row and Action Button */}
                      <div className={styles.cardFooter}>
                        <div className={styles.priceCol}>
                          <span className={styles.sellingPrice}>
                            ₹{Math.round(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className={styles.originalPrice}>
                              ₹{Math.round(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {product.availableQuantity <= 0 ? (
                          <button disabled className={styles.btnAddDisabled}>
                            Out of Stock
                          </button>
                        ) : !quantities[product.id] ||
                          quantities[product.id] === 0 ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className={styles.btnAdd}
                          >
                            Add
                          </button>
                        ) : (
                          <div
                            className={styles.qtySelector}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <button
                              onClick={() =>
                                handleQuantityChange(product.id, -1)
                              }
                              className={styles.qtyBtn}
                            >
                              -
                            </button>
                            <span className={styles.qtyDisplay}>
                              {quantities[product.id]}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(product.id, 1)
                              }
                              className={styles.qtyBtn}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}