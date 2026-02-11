import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { productApi } from "@/api/productApi";
import { reviewApi } from "@/api/reviewApi";
import { GetServerSidePropsContext } from "next";
import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import { wishlistApi } from "@/api/wishlistApi";
import Cookies from "js-cookie";
import styles from "@/styles/Details.module.scss";

interface Product {
    id: string
    product_name: string
    product_name_tamil: string
    description: string
    description_tamil: string
    imageUrl: string[]
    price: string
    discounted_type: string
    discounted_amount: string
    selling_price: string
    available_quantity: number
    overall_rating: number
    review_count: number
    reviews: {
        id: string;
        rating: number;
        review: string;
        addedBy: {
            firstName: string;
            lastName: string;
        };
    }[]
    isBestSeller?: boolean
    benefits?: string[]
    benefitsTamil?: string[]
}

export default function ViewProduct({ product }: { product: Product }) {
    const { cart, addToCart, updateQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const reviewsRef = useRef<HTMLDivElement>(null);
    const [reviews, setReviews] = useState(product.reviews || []);
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [hasFetchedReviews, setHasFetchedReviews] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [pendingWishlist, setPendingWishlist] = useState(false);

    useEffect(() => {
        const checkWishlist = async () => {
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
    }, [product.id]);

    const handleToggleWishlist = useCallback(async () => {
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
    }, [product.id]);

    useEffect(() => {
        const token = Cookies.get("token");
        if (token && pendingWishlist) {
            handleToggleWishlist();
            setPendingWishlist(false);
        }
    }, [pendingWishlist, handleToggleWishlist]);

    // Check if product is in cart
    const cartItem = cart.find(item => item.id === product.id);
    const isInCart = !!cartItem;

    // Sync quantity with cart
    useEffect(() => {
        if (cartItem) {
            setQuantity(cartItem.quantity);
        } else {
            setQuantity(1);
        }
    }, [cartItem]);

    const handleQuantityChange = (change: number) => {
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
        addToCart(product.id, 1, {
            name: product.product_name,
            price: parseFloat(product.selling_price),
            image: product.imageUrl[0]
        });
        setQuantity(1);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.product_name,
                    text: `Check out this ${product.product_name} on FutureNature!`,
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

    const fetchReviews = useCallback(async () => {
        if (hasFetchedReviews) return;
        try {
            const response = await reviewApi.getReviewsByProductId(product.id);
            if (response.data.status) {
                setReviews(response.data.data);
                setHasFetchedReviews(true);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    }, [hasFetchedReviews, product.id]);

    const handlePostReview = async () => {
        if (!newReview.trim()) {
            toast.error("Please enter a review message");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await reviewApi.postReview(product.id, {
                message: newReview,
                rating: newRating
            });
            if (response.data.status) {
                toast.success("Review posted successfully!");
                setNewReview("");
                setNewRating(5);
                // Refresh reviews
                const updatedReviews = await reviewApi.getReviewsByProductId(product.id);
                if (updatedReviews.data.status) {
                    setReviews(updatedReviews.data.data);
                }
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { data?: { msg?: string } } } };
            console.error("Error posting review:", error);
            toast.error(err?.response?.data?.data?.msg || "Failed to post review. Please login first.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 450 && !hasFetchedReviews) {
                fetchReviews();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasFetchedReviews, fetchReviews]);

    // Auto-scroll reviews upward continuously
    useEffect(() => {
        const reviewsContainer = reviewsRef.current;
        if (!reviewsContainer) return;

        const scrollSpeed = 0.3; // Slow motion speed

        const autoScroll = () => {
            reviewsContainer.scrollTop += scrollSpeed;

            // Reset to top when reaching end of first review set for seamless loop
            const scrollableHeight = reviewsContainer.scrollHeight;
            const visibleHeight = reviewsContainer.clientHeight;
            const scrollThreshold = (scrollableHeight - visibleHeight) / 3;

            if (reviewsContainer.scrollTop >= scrollThreshold) {
                reviewsContainer.scrollTop = 0;
            }
        };

        const intervalId = setInterval(autoScroll, 20);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <>
            <Head>
                <title>{product.product_name} - FutureNature</title>
                <meta name="description" content={product.description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.pageWrapper}>
                <Navbar />

                {/* Product Detail Section */}
                <div className={styles.detailsContainer}>
                    {/* Breadcrumbs */}
                    <div className={styles.breadcrumbs}>
                        <span>Browse Products</span>
                        <span className={styles.separator}>›</span>
                        <span>Honey</span>
                        <span className={styles.separator}>›</span>
                        <span>{product.product_name}</span>
                    </div>

                    <div className={styles.productCard}>
                        {/* Left Column - Product Image */}
                        <div className={styles.imageSection}>
                            {/* Best Seller Badge */}
                            {product.isBestSeller && (
                                <div className={styles.bestSellerBadge}>
                                    Most seller
                                </div>
                            )}

                            <div className={styles.imageWrapper}>
                                {/* Decorative bees */}
                                <div className={`${styles.beeDecoration} ${styles.top}`}>
                                    🐝
                                </div>
                                <div className={`${styles.beeDecoration} ${styles.mid}`}>
                                    🐝
                                </div>

                                <Image
                                    src={product.imageUrl[selectedImageIndex]}
                                    alt={product.product_name}
                                    width={400}
                                    height={500}
                                    className={styles.productImg}
                                />
                            </div>

                            {/* Thumbnail Gallery */}
                            <div className={styles.thumbnailGallery}>
                                {product.imageUrl.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`${styles.thumbnail} ${idx === selectedImageIndex ? styles.active : ''}`}
                                        onClick={() => setSelectedImageIndex(idx)}
                                    >
                                        <Image src={img} alt={`${product.product_name} ${idx + 1}`} width={80} height={80} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Product Details */}
                        <div className={styles.infoSection}>
                            {/* Metadata Row */}
                            <div className={styles.metadataRow}>
                                <div className={`${styles.metaItem} ${styles.rating}`}>
                                    <span className={styles.star}>★</span>
                                    {product.overall_rating} Ratings
                                </div>
                                <span className={styles.separator}>•</span>
                                <div className={styles.metaItem}>
                                    {product.review_count}+ Reviews
                                </div>
                                <span className={styles.separator}>•</span>
                                <div className={styles.metaItem}>
                                    2.9K+ Sold
                                </div>
                            </div>

                            {/* Product Title */}
                            <div className={styles.titleWrapper}>
                                <h1>
                                    {product.product_name}
                                </h1>
                                <p>
                                    {product.product_name_tamil}
                                </p>
                            </div>

                            {/* Price Section */}
                            <div className={styles.priceSection}>
                                <div className={styles.sellingPrice}>
                                    ₹{product.selling_price}
                                </div>
                                <div className={styles.originalPrice}>
                                    ₹{product.price}
                                </div>
                                {product.discounted_amount && (
                                    <div className={styles.discountBadge}>
                                        {product.discounted_amount}% Discount
                                    </div>
                                )}
                                {product.available_quantity <= 0 && (
                                    <div style={{
                                        color: '#dc2626',
                                        fontWeight: '700',
                                        fontSize: '18px',
                                        marginTop: '10px'
                                    }}>
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                            {/* Rating */}
                            <div className={styles.ratingSection}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Rating initialValue={product.overall_rating} readonly size={20} allowFraction />
                                </div>
                                <span className={styles.reviewCount}>
                                    {product.review_count}
                                </span>
                            </div>

                            {/* Description */}
                            <div className={styles.descriptionBox}>
                                <p className={styles.mainDesc}>
                                    {product.description}
                                </p>
                                <p className={styles.tamilDesc}>
                                    {product.description_tamil}
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className={styles.benefitsBox}>
                                <p className={styles.mainBenefits}>
                                    {product?.benefits?.join(' ')}
                                </p>
                                <p className={styles.tamilBenefits}>
                                    {product?.benefitsTamil?.join(' ')}
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            {isInCart && (
                                <div className={styles.quantitySection}>
                                    <label>
                                        Quantity
                                    </label>
                                    <div className={styles.qtyControl}>
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className={styles.qtyBtn}
                                        >
                                            -
                                        </button>
                                        <div className={styles.qtyValue}>
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className={styles.qtyBtn}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className={styles.actionRow}>
                                {product.available_quantity <= 0 ? (
                                    <button
                                        disabled
                                        className={styles.addToCartBtn}
                                        style={{ backgroundColor: '#9ca3af', cursor: 'not-allowed' }}
                                    >
                                        Out of Stock
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        className={styles.addToCartBtn}
                                    >
                                        Add to Cart
                                    </button>
                                )}
                                <button
                                    onClick={handleShare}
                                    className={styles.shareBtn}
                                >
                                    Share
                                </button>
                                <button
                                    onClick={handleToggleWishlist}
                                    className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ""}`}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className={styles.reviewsWrapper}>
                    <div className={styles.reviewsHeader}>
                        <div className={styles.headerIcon}></div>
                        <h2 className={styles.reviewsTitle}>
                            REVIEWS
                        </h2>
                    </div>

                    <div
                        ref={reviewsRef}
                        className={styles.reviewsScrollArea}
                    >
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={review.id || index} className={styles.reviewCard}>
                                    <div className={styles.reviewAuthorRow}>
                                        <div className={styles.authorInfo}>
                                            <div className={styles.avatar}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                            <span className={styles.authorName}>
                                                {review.addedBy?.firstName} {review.addedBy?.lastName}
                                            </span>
                                        </div>
                                        <div className={styles.reviewRatingRow}>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                <Rating initialValue={review.rating} readonly size={18} allowFraction />
                                            </div>
                                            <span className={styles.ratingValue}>
                                                {review.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                    <p className={styles.reviewText}>
                                        {review.review}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noReviews}>
                                {hasFetchedReviews ? "No reviews yet. Be the first to review!" : "Scroll down to see reviews..."}
                            </p>
                        )}
                    </div>

                    {/* Write a Review Section */}
                    <div className={styles.writeReviewSection}>
                        <div className={styles.ratingPromptRow}>
                            <p>
                                Rate this product:
                            </p>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <Rating
                                    onClick={setNewRating}
                                    initialValue={newRating}
                                    size={32}
                                    transition
                                    allowFraction
                                />
                            </div>
                        </div>
                        <div className={styles.reviewInputWrapper}>
                            <div className={styles.avatarSmall}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <textarea
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                placeholder="Can you tell us more?"
                                className={styles.reviewTextarea}
                            />
                            <button
                                onClick={handlePostReview}
                                disabled={isSubmitting}
                                className={styles.submitReviewBtn}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const fullPath = context.params?.id;
    let response;
    if (typeof fullPath === "string")
        response = await productApi.getProductById(fullPath)

    return { props: { product: response?.data?.data } }
}
