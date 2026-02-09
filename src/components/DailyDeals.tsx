import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { Rating } from "react-simple-star-rating";
import { productApi } from "@/api/productApi";
import styles from "@/styles/DailyDeals.module.scss"; // Adjust path if needed

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

export default function DailyDeals() {
    const { addToCart, updateQuantity } = useCart();
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [showQuantityControls, setShowQuantityControls] = useState<{ [key: string]: boolean }>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className={styles.sectionWrapper}><p>Loading daily deals...</p></div>;
    if (products.length === 0) return null;

    return (
        <div className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>DAILY DEALS</h2>

            <div className={styles.productsGrid}>
                {products.map((product) => (
                    <div key={product.id} className={styles.card}>

                        <div className={styles.badge}>Daily Deals</div>

                        <div className={styles.imageContainer}>
                            <Image
                                src={product.imageUrl?.[0] || "/Assets/Products/15.png"}
                                alt={product.product_name}
                                width={350}
                                height={350}
                                className={styles.productImg}
                                style={product.available_quantity <= 0 ? { filter: 'grayscale(1) opacity(0.6)' } : {}}
                            />
                            {product.available_quantity <= 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    zIndex: 2,
                                    fontSize: '14px'
                                }}>
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
                                    <Rating initialValue={product.overall_rating} readonly size={14} allowFraction />
                                    <span>{product.overall_rating}</span>
                                </div>
                                <span className={styles.weightTag}>Standard</span>
                            </div>

                            <div className={styles.actionRow}>
                                <div className={styles.priceBlock}>
                                    <div className={styles.currentPrice}>₹ {product.selling_price}</div>
                                    <div className={styles.oldPrice}>₹{product.price}</div>
                                </div>

                                {product.available_quantity <= 0 ? (
                                    <button
                                        className={styles.addBtn}
                                        disabled
                                        style={{ backgroundColor: '#9ca3af', cursor: 'not-allowed' }}
                                    >
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
                                        Add to Cart
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
        </div>
    );
}
