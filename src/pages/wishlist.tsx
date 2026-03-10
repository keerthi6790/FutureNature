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

      <div className={styles.pageWrapper}>
        <Navbar />

        {/* Opened with <main> */}
        <main className={styles.container}>
          
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span className={styles.current}>Wishlist</span>
          </nav>

          {/* Header Section with Honeycomb */}
          <div className={styles.headerSection}>
            <div className={styles.titleContainer}>
              <svg 
                className={styles.honeyComb} 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M28.8675 16.5C31.9615 11.141 37.735 7.80385 43.923 7.80385H66.077C72.265 7.80385 78.0385 11.141 81.1325 16.5L92.2094 35.6865C95.3034 41.0455 95.3034 47.7225 92.2094 53.0815L81.1325 72.268C78.0385 77.627 72.265 80.9641 66.077 80.9641H43.923C37.735 80.9641 31.9615 77.627 28.8675 72.268L17.7906 53.0815C14.6966 47.7225 14.6966 41.0455 17.7906 35.6865L28.8675 16.5Z" fill="#FFB800"/>
              </svg>
              <h1 className={styles.mainTitle}>MY WISHLIST</h1>
            </div>
            <p className={styles.subtitle}>
              You have {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved in your collection.
            </p>
          </div>

          <section className={styles.contentSection}>
            {loading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
              </div>
            ) : wishlist.length === 0 ? (

              /* Modern Empty State */
              <div className={styles.emptyStateCard}>
                <div className={styles.emptyIconCircle}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    <line x1="2" y1="2" x2="22" y2="22"></line>
                  </svg>
                </div>
                <h3>Your wishlist is empty</h3>
                <p>Looks like you haven&apos;t found your favorites yet. Start exploring our collection.</p>
                <Link href="/products" className={styles.btnPrimary}>
                  Explore Products
                </Link>
              </div>

            ) : (

              /* Wishlist Grid */
              <div className={styles.productsGrid}>
                {wishlist.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    
                    {/* Top Image Area */}
                    <div className={styles.cardImageWrap}>
                      <Link href={`/details/${product.id}`} style={{ display: 'block', height: '100%' }}>
                        <Image
                          src={product.imageUrl[0] || "/Assets/Products/15.png"}
                          alt={product.product_name}
                          fill
                          unoptimized
                          className={styles.productImg}
                        />
                      </Link>

                      {/* Remove Button */}
                      <button
                        className={styles.removeBtn}
                        onClick={(e) => handleRemove(e, product.id)}
                        title="Remove from Wishlist"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>

                    {/* Bottom Content Area */}
                    <div className={styles.cardContent}>
                      
                      {/* Meta: Rating */}
                      <div className={styles.ratingRowCard}>
                        <Rating
                          initialValue={product.overall_rating}
                          readonly
                          size={16}
                          allowFraction
                          fillColor="#FFB800"
                        />
                        <span className={styles.ratingNum}>({product.review_count || 0})</span>
                      </div>

                      {/* Title */}
                      <div className={styles.titleSection}>
                        <Link href={`/details/${product.id}`}>
                          <h3 className={styles.cardTitle}>{product.product_name}</h3>
                        </Link>
                        {product.product_name_tamil && (
                          <span className={styles.cardSubtitle}>{product.product_name_tamil}</span>
                        )}
                      </div>

                      <div className={styles.cardDivider}></div>

                      {/* Price Row and Action Button */}
                      <div className={styles.cardFooter}>
                        <div className={styles.priceCol}>
                          <span className={styles.sellingPrice}>₹{Math.round(parseFloat(product.selling_price))}</span>
                          {parseFloat(product.price) > parseFloat(product.selling_price) && (
                             <span className={styles.originalPrice}>₹{Math.round(parseFloat(product.price))}</span>
                          )}
                        </div>

                        <Link href={`/details/${product.id}`} className={styles.btnAdd}>
                          View Details
                        </Link>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main> {/* <-- This was incorrectly set to </div> previously! */}

        <Footer />
      </div>
    </>
  );
}