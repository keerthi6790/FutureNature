import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { productApi } from "@/api/productApi";
import styles from "@/styles/ManageProducts.module.scss";
import AdminGuard from "@/components/AdminGuard";

interface Product {
    id: string;
    product_name: string;
    product_name_tamil: string;
    imageUrl: string[];
    selling_price: string;
    isDailyDeals: boolean;
}

export default function DailyDeals() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyDeals();
    }, [])

    const fetchDailyDeals = async () => {
        setLoading(true);
        try {
            const response = await productApi.getDailyDeals();
            if (response.data.status) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching daily deals:", error);
            toast.error("Failed to load daily deals");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            const response = await productApi.toggleDailyDeal(id, false);
            if (response.data.status) {
                toast.success("Removed from Daily Deals");
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error("Error removing from daily deals:", error);
            toast.error("Failed to remove product");
        }
    };

    return (
        <AdminGuard>
            <div className={styles.pageWrapper}>
                <Toaster />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div>
                            <button onClick={() => router.push("/admin/manageProducts")} className={styles.backBtn}>
                                &larr; Back to Manage Products
                            </button>
                            <h1 className={styles.title}>Daily Deals</h1>
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.loadingState}>Loading daily deals...</div>
                    ) : products.length === 0 ? (
                        <div className={styles.emptyState}>No daily deals active.</div>
                    ) : (
                        <div className={styles.productGrid}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <div className={styles.imageArea}>
                                        <Image
                                            src={product.imageUrl?.[0] || "/Assets/Products/15.png"}
                                            alt={product.product_name}
                                            fill
                                            unoptimized
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h2 className={styles.productTitle}>{product.product_name}</h2>
                                        <p className={styles.tamilTitle}>{product.product_name_tamil}</p>
                                        <span className={styles.price}>₹{product.selling_price}</span>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => handleRemove(product.id)}
                                                className={styles.deleteBtn}
                                            >
                                                Remove from Deals
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
