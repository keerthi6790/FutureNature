import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { wishlistApi } from "@/api/wishlistApi";
import Link from "next/link";
import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import styles from "@/styles/Wishlist.module.scss";

interface Product {
  id: string;
  product_name: string;
  product_name_tamil: string;
  imageUrl: string[];
  overall_rating: number;
  review_count: number;
  price: string;
  selling_price: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistApi.getWishlist();
      if (response.data.status) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await wishlistApi.toggleWishlist(productId);
      if (response.data.status) {
        toast.success("Item removed");
        setWishlist((prev) => prev.filter((item) => item.id !== productId));
      }
    } catch (error) {
      toast.error("Could not remove item");
    }
  };

  return (
    <>
      <Head>
        <title>My Wishlist - FutureNature</title>
      </Head>

      <div className={styles.pageLayout}>
        <Navbar />

        <main className={styles.mainContent}>
          <div className={styles.container}>

            {/* --- PAGE HEADER --- */}
            <div className={styles.headerSection}>
              <h1 className={styles.pageTitle}>My Wishlist</h1>
              <p className={styles.itemCount}>
                You have <strong>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</strong> saved.
              </p>
            </div>

            {loading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
              </div>
            ) : wishlist.length === 0 ? (

              /* --- EMPTY STATE --- */
              <div className={styles.emptyState}>
                <div className={styles.emptyIconCircle}>
                  <span className={styles.heartBroken}>💔</span>
                </div>
                <h3>Your Wishlist is Empty</h3>
                <p>Looks like you haven&apos;t found your favorites yet.</p>

                {/* --- PROMINENT ACTION BUTTON --- */}
                <Link href="/products" className={styles.browseBtn}>
                  <span>Start Shopping Now</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIcon}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
              </div>

            ) : (

              /* --- WISHLIST GRID --- */
              <div className={styles.productGrid}>
                {wishlist.map((product) => (
                  <div key={product.id} className={styles.wishlistCard}>

                    {/* 1. Image Area */}
                    <Link href={`/details/${product.id}`} className={styles.cardMedia}>
                      <div className={styles.imgWrapper}>
                        <Image
                          src={product.imageUrl[0] || "/Assets/Products/15.png"}
                          alt={product.product_name}
                          fill
                          unoptimized
                          className={styles.productImg}
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => handleRemove(e, product.id)}
                        title="Remove from Wishlist"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </Link>

                    {/* 2. Content Area */}
                    <div className={styles.cardInfo}>
                      <div className={styles.infoTop}>
                        <h3 className={styles.name}>
                          <Link href={`/details/${product.id}`}>{product.product_name}</Link>
                        </h3>
                        <p className={styles.tamilName}>{product.product_name_tamil}</p>

                        <div className={styles.ratingBox}>
                          <Rating initialValue={product.overall_rating} readonly size={18} fillColor="#f59e0b" emptyColor="#d1d5db" allowFraction />
                          <span className={styles.reviewCount}>({product.review_count})</span>
                        </div>
                      </div>

                      <div className={styles.infoBottom}>
                        <div className={styles.priceBlock}>
                          <span className={styles.currentPrice}>₹{product.selling_price}</span>
                          {product.price && product.price !== product.selling_price && (
                            <span className={styles.originalPrice}>₹{product.price}</span>
                          )}
                        </div>

                        <Link href={`/details/${product.id}`} className={styles.viewBtn}>
                          View Product
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}