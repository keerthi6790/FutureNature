import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { productApi } from "@/api/productApi";
import { reviewApi } from "@/api/reviewApi";
import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import { wishlistApi } from "@/api/wishlistApi";
import Cookies from "js-cookie";
import styles from "@/styles/Details.module.scss";
import SkeletonDetail from "@/components/SkeletonDetail";

interface Product {
  id: string;
  product_name: string;
  product_name_tamil: string;
  description: string;
  description_tamil: string;
  imageUrl: string[];
  price: string;
  discounted_type: string;
  discounted_amount: string;
  selling_price: string;
  available_quantity: number;
  overall_rating: number;
  review_count: number;
  reviews: {
    id: string;
    rating: number;
    review: string;
    addedBy: {
      firstName: string;
      lastName: string;
    };
  }[];
  isBestSeller?: boolean;
  benefits?: string[];
  benefitsTamil?: string[];
}

export default function ViewProduct() {
  const router = useRouter();
  const { id } = router.query;
  const { cart, addToCart, updateQuantity } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // UI States
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullBenefits, setShowFullBenefits] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [reviews, setReviews] = useState<Product["reviews"]>([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [hasFetchedReviews, setHasFetchedReviews] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pendingWishlist, setPendingWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await productApi.getProductById(id as string);
        if (response.data.status) {
          setProduct(response.data.data);
          setReviews(response.data.data.reviews || []);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!product) return;
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await wishlistApi.getWishlist();
          if (response.data.status) {
            const isInWishlist = response.data.data.some((p: { id: string }) => p.id === product.id);
            setIsWishlisted(isInWishlist);
          }
        } catch (error) {
          console.error("Error checking wishlist:", error);
        }
      }
    };
    checkWishlist();
  }, [product]);

  const handleToggleWishlist = useCallback(async () => {
    if (!product) return;
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try {
      const response = await wishlistApi.toggleWishlist(product.id);
      if (response.data.status) {
        setIsWishlisted(response.data.action === "added");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  }, [product]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && pendingWishlist) {
      handleToggleWishlist();
      setPendingWishlist(false);
    }
  }, [pendingWishlist, handleToggleWishlist]);

  const cartItem = product ? cart.find((item) => item.id === product.id) : null;
  const isInCart = !!cartItem;

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showReviewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showReviewModal]);

  const handleQuantityChange = (change: number) => {
    if (!product) return;
    const newQty = quantity + change;
    if (newQty <= 0) {
      updateQuantity(product.id, 0);
      setQuantity(1);
    } else {
      setQuantity(newQty);
      updateQuantity(product.id, newQty);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id, quantity, {
      name: product.product_name,
      price: parseFloat(product.selling_price),
      image: product.imageUrl[0],
    });
    toast.success("Added to cart!");
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.product_name,
          text: `Check out ${product.product_name} on FutureNature!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const fetchReviews = async () => {
    if (hasFetchedReviews || !product) return;
    try {
      const response = await reviewApi.getReviewsByProductId(product.id);
      if (response.data.status) {
        setReviews(response.data.data);
        setHasFetchedReviews(true);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handlePostReview = async () => {
    if (!product) return;
    if (!newReview.trim()) {
      toast.error("Please enter a review message");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await reviewApi.postReview(product.id, {
        message: newReview,
        rating: newRating,
      });
      if (response.data.status) {
        toast.success("Review posted successfully!");
        setNewReview("");
        setNewRating(5);
        setShowReviewModal(false); // Close Modal on success
        const updatedReviews = await reviewApi.getReviewsByProductId(product.id);
        if (updatedReviews.data.status) {
          setReviews(updatedReviews.data.data);
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { data?: { msg?: string } } } };
      console.error("Error posting review:", error);
      toast.error(err?.response?.data?.data?.msg || "Failed to post review. Please login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedReviews) {
      fetchReviews();
    }
  }, [hasFetchedReviews, fetchReviews]);

  const truncateText = (text: string, limit: number) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <SkeletonDetail />
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <div className={styles.notFoundCard}>
          <h2>Product not found</h2>
          <button onClick={() => router.push('/')} className={styles.btnPrimary}>Return Home</button>
        </div>
        <Footer />
      </div>
    );
  }

  const descLimit = 150;
  const benefitsLimit = 100;

  return (
    <>
      <Head>
        <title>{product.product_name} - FutureNature</title>
        <meta name="description" content={product.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.pageWrapper}>
        <Navbar />

        <main className={styles.modernContainer}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumbs}>
            <span onClick={() => router.push('/')}>Home</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span>Products</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span className={styles.current}>{product.product_name}</span>
          </nav>

          <div className={styles.productGrid}>
            
            {/* Left: Image Gallery */}
            <div className={styles.galleryColumn}>
              <div className={styles.imageCard}>
                {product.isBestSeller && <div className={styles.badge}>Most Popular</div>}
                <Image
                  src={product.imageUrl[selectedImageIndex]}
                  alt={product.product_name}
                  fill
                  unoptimized
                  className={styles.mainImage}
                  priority
                />
              </div>
              <div className={styles.thumbnailTrack}>
                {product.imageUrl.map((img, idx) => (
                  <button
                    key={idx}
                    className={`${styles.thumbBtn} ${idx === selectedImageIndex ? styles.thumbActive : ""}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <Image unoptimized src={img} alt={`View ${idx + 1}`} fill className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details Cards */}
            <div className={styles.detailsColumn}>
              
              {/* Card 1: Main Info & Price */}
              <div className={styles.infoCard}>
                {/* Top Meta Row (Ratings, Reviews, Sold) */}
                <div className={styles.topMetaRow}>
                  <svg className={styles.starIcon} viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{product.overall_rating} Ratings</span>
                  <span className={styles.dot}>•</span>
                  <span>{product.review_count}+ Reviews</span>
                  <span className={styles.dot}>•</span>
                  <span>2.9K+ Sold</span>
                </div>

                {/* Title & Subtitle */}
                <div className={styles.titleSection}>
                  <h1 className={styles.title}>{product.product_name}</h1>
                  <h2 className={styles.subtitle}>{product.product_name_tamil}</h2>
                </div>

                {/* Price & Green Discount */}
                <div className={styles.priceRow}>
                  <span className={styles.sellingPrice}>₹{Math.round(parseFloat(product.selling_price))}</span>
                  <span className={styles.originalPrice}>₹{Math.round(parseFloat(product.price))}</span>
                  {product.discounted_amount && (
                    <span className={styles.discountText}>{product.discounted_amount}% Discount</span>
                  )}
                </div>

                {/* Bottom Stars */}
                <div className={styles.bottomRatingRow}>
                  <Rating initialValue={product.overall_rating} readonly size={22} allowFraction fillColor="#FFB800" />
                  <span className={styles.ratingCount}>{product.review_count}</span>
                </div>
              </div>

              {/* Card 2: Description */}
              <div className={styles.contentCard}>
                <h3 className={styles.cardHeader}>About this product</h3>
                <div className={styles.cardBody}>
                  <p className={styles.textPrimary}>
                    {showFullDesc ? product.description : truncateText(product.description, descLimit)}
                  </p>
                  <p className={styles.textSecondary}>
                    {showFullDesc ? product.description_tamil : truncateText(product.description_tamil, descLimit)}
                  </p>
                </div>
                {(product.description?.length > descLimit || product.description_tamil?.length > descLimit) && (
                  <button className={styles.textBtn} onClick={() => setShowFullDesc(!showFullDesc)}>
                    {showFullDesc ? "Read Less" : "Read More"}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showFullDesc ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Card 3: Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className={styles.contentCard}>
                  <h3 className={styles.cardHeader}>Key Benefits</h3>
                  <div className={styles.cardBody}>
                    <div className={styles.benefitsGrid}>
                      {showFullBenefits 
                        ? product.benefits.map((benefit, i) => (
                            <div key={i} className={styles.benefitItem}>
                              <div className={styles.checkIcon}>✓</div>
                              <span>{benefit}</span>
                            </div>
                          ))
                        : truncateText(product.benefits.join(" • "), benefitsLimit)}
                    </div>
                    <p className={styles.textSecondary} style={{marginTop: '12px'}}>
                      {showFullBenefits ? product.benefitsTamil?.join(" • ") : truncateText(product.benefitsTamil?.join(" • ") || "", benefitsLimit)}
                    </p>
                  </div>
                  {((product.benefits.join(" ").length > benefitsLimit) || (product.benefitsTamil && product.benefitsTamil.join(" ").length > benefitsLimit)) && (
                    <button className={styles.textBtn} onClick={() => setShowFullBenefits(!showFullBenefits)}>
                      {showFullBenefits ? "View Less" : "View All Benefits"}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showFullBenefits ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Card 4: Action Center */}
              <div className={styles.actionCard}>
                <div className={styles.quantityWrapper}>
                  <label>Quantity</label>
                  <div className={styles.quantityControl}>
                    <button onClick={() => handleQuantityChange(-1)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)}>+</button>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  {product.available_quantity <= 0 ? (
                    <button disabled className={styles.btnDisabled}>Out of Stock</button>
                  ) : (
                    <button onClick={handleAddToCart} className={styles.btnPrimary}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/><path d="M20 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      Add to Cart
                    </button>
                  )}
                  <div className={styles.iconButtons}>
                    <button onClick={handleToggleWishlist} className={`${styles.iconBtn} ${isWishlisted ? styles.activeWishlist : ""}`} title="Wishlist">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <button onClick={handleShare} className={styles.shareTextBtn}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Modern Review Dashboard */}
          <div className={styles.reviewDashboard}>
            <div className={styles.dashboardHeader}>
              <h2>Customer Reviews</h2>
              <button className={styles.btnOutline} onClick={() => setShowReviewModal(true)}>
                Write a Review
              </button>
            </div>

            <div className={styles.dashboardContent}>
              {/* Left: Stats Sidebar */}
              <div className={styles.reviewSidebar}>
                <div className={styles.statsCard}>
                  <div className={styles.bigScore}>{product.overall_rating}</div>
                  <div className={styles.starsWrapper}>
                    <Rating initialValue={product.overall_rating} readonly size={24} allowFraction fillColor="#FFB800" />
                  </div>
                  <p className={styles.reviewCount}>Based on {product.review_count} reviews</p>
                </div>
              </div>

              {/* Right: Review Cards List */}
              <div className={styles.reviewList}>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={review.id || index} className={styles.reviewCard}>
                      <div className={styles.reviewerInfo}>
                        <div className={styles.avatar}>
                          {review.addedBy?.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className={styles.rName}>{review.addedBy?.firstName} {review.addedBy?.lastName}</p>
                          <Rating initialValue={review.rating} readonly size={14} allowFraction fillColor="#FFB800" />
                        </div>
                      </div>
                      <p className={styles.rComment}>{review.review}</p>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <p>No reviews yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </main>

        {/* --- REVIEW POPUP MODAL --- */}
        {showReviewModal && (
          <div className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              
              <button className={styles.closeModalBtn} onClick={() => setShowReviewModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>

              <h3 className={styles.modalTitle}>Rate this product</h3>
              <p className={styles.modalSubtitle}>How was your experience with {product.product_name}?</p>
              
              <div className={styles.ratingInputCenter}>
                <Rating onClick={setNewRating} initialValue={newRating} size={36} transition allowFraction fillColor="#FFB800" />
              </div>
              
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your experience (optional but helpful!)"
                className={styles.modalTextarea}
              />
              
              <button onClick={handlePostReview} disabled={isSubmitting} className={styles.btnPrimaryFull}>
                {isSubmitting ? "Submitting..." : "Post Review"}
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}