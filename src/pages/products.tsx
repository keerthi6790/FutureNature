import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { productApi } from "@/api/productApi";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import { wishlistApi } from "@/api/wishlistApi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import styles from "@/styles/Products.module.scss";

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
}

export default function Products({ products = [] }: { products: Product[] }) {
    const { cart, addToCart, updateQuantity } = useCart();
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [pendingWishlistId, setPendingWishlistId] = useState<string | null>(null);
    console.log({ products })
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

    const handleToggleWishlist = useCallback(async (productId: string, e?: React.MouseEvent) => {
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
    }, []);

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
            setQuantities(prev => ({ ...prev, [productId]: 1 }));
            updateQuantity(productId, 0);
        } else {
            setQuantities(prev => ({ ...prev, [productId]: newQty }));
            updateQuantity(productId, newQty);
        }
    };

    const handleAddToCart = (product: Product) => {
        setQuantities(prev => ({ ...prev, [product.id]: 1 }));
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
                <meta name="description" content="Browse our natural honey products" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
            </Head>

            <div className={styles.pageWrapper}>
                <Navbar />

                {/* Hero / Header Section */}
                <header className={styles.pageHeader}>
                    <div className={styles.headerContent}>
                        <span className={styles.eyebrow}>THE HARVEST</span>
                        <h1 className={styles.pageTitle}>
                            Pure, Raw & <br /><em>Unfiltered.</em>
                        </h1>
                        <p className={styles.pageDesc}>
                            Direct from our hives to your home. No processing, no additives—just nature&apos;s liquid gold.
                        </p>
                    </div>
                </header>

                {/* Products Grid Section */}
                <section className={styles.catalogSection}>
                    <div className={styles.container}>

                        {/* Products Grid */}
                        <div className={styles.productsGrid}>
                            {products?.map((product, index) => (
                                <Link
                                    href={`/details/${product.id}`}
                                    key={product.id || index}
                                    className={styles.productCard}
                                >
                                    {/* Image Area */}
                                    <div className={styles.cardImageWrap}>
                                        <Image
                                            src={product.image || '/Assets/Products/15.png'}
                                            alt={product.name}
                                            width={400}
                                            height={320}
                                            className={styles.productImg}
                                        />

                                        {/* Wishlist Fab */}
                                        <button
                                            onClick={(e) => handleToggleWishlist(product.id.toString(), e)}
                                            className={`${styles.wishlistFab} ${wishlistIds.includes(product.id.toString()) ? styles.active : ''}`}
                                            aria-label="Add to wishlist"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlistIds.includes(product.id.toString()) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </button>

                                        {/* Discount Tag */}
                                        {product.discount && product.discount > 0 && product.availableQuantity > 0 && (
                                            <div className={styles.discountTag}>
                                                -{Math.round(product.discount)}%
                                            </div>
                                        )}

                                        {/* Out of Stock Badge */}
                                        {product.availableQuantity <= 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                backgroundColor: 'rgba(0,0,0,0.7)',
                                                color: 'white',
                                                padding: '8px 16px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                zIndex: 2,
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                Out of Stock
                                            </div>
                                        )}
                                    </div>
                                    {/* Content Area */}
                                    <div className={styles.cardContent}>
                                        <div className={styles.contentTop}>
                                            <h3 className={styles.cardTitle}>{product.name}</h3>
                                            {product.nameTamil && <span className={styles.cardSubtitle}>{product.nameTamil}</span>}
                                        </div>

                                        <div className={styles.cardMeta}>
                                            <div className={styles.ratingBox}>
                                                <Rating initialValue={product.rating} readonly size={14} allowFraction fillColor="#d97706" />
                                                <span className={styles.ratingNum}>({product.reviewCount || 0})</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <div className={styles.priceBox}>
                                                <span className={styles.priceCurr}>₹{product.price}</span>
                                                {product.originalPrice > product.price && (
                                                    <span className={styles.priceOld}>₹{product.originalPrice}</span>
                                                )}
                                            </div>

                                            {/* Cart Actions */}
                                            {product.availableQuantity <= 0 ? (
                                                <button
                                                    disabled
                                                    className={styles.btnPrimary}
                                                    style={{ backgroundColor: '#9ca3af', cursor: 'not-allowed' }}
                                                >
                                                    Sold Out
                                                </button>
                                            ) : !cart.find(item => item.id === product.id) ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleAddToCart(product);
                                                    }}
                                                    className={styles.btnPrimary}
                                                >
                                                    Add
                                                </button>
                                            ) : (
                                                <div
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    className={styles.qtySelector}
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleQuantityChange(product.id, -1);
                                                        }}
                                                        className={styles.qtyBtn}
                                                    >−</button>
                                                    <span className={styles.qtyVal}>
                                                        {cart.find(item => item.id === product.id)?.quantity || 1}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleQuantityChange(product.id, 1);
                                                        }}
                                                        className={styles.qtyBtn}
                                                    >+</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

// FIX: Robust getServerSideProps with NaN protection
export const getServerSideProps = async () => {
    try {
        const response = await productApi.getAllProducts();
        const data = response.data;
        console.log({ response })
        let products: Product[] = [];

        if (data && data.status && Array.isArray(data.data)) {
            const safeParseFloat = (val: any) => {
                const parsed = parseFloat(val);
                return isNaN(parsed) ? 0 : parsed;
            };
            console.log({ data })

            products = data.data.map((item: BackendProduct) => ({
                id: item.id?.toString() || "",
                name: item.product_name || "Unknown Product",
                nameTamil: item.product_name_tamil || "",
                image: Array.isArray(item.imageUrl) && item.imageUrl.length > 0
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
                availableQuantity: item.available_quantity || 0
            }));
        }
        return { props: { products } };
    } catch (error) {
        console.error("Error in getServerSideProps:", error);
        return { props: { products: [] } };
    }
}
