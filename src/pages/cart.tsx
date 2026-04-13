import Head from "next/head";
import Image from "next/image";
import Cookies from "js-cookie";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShippingScreen from "@/components/ShippingScreen";
import { useCart, CartItem } from "@/components/CartContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Cart.module.scss";
import AddressList from "@/components/AddressList";
import axios from "axios";
import toast from "react-hot-toast";
import { AddressData } from "@/api/addressApi";
import Loader from "@/components/Loader";

// --- ICONS ---
const TrashIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#10b981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

// --- MODERN EMPTY CART ILLUSTRATION (SVG) ---
const EmptyCartSVG = () => (
  <svg
    width="240"
    height="200"
    viewBox="0 0 240 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.floatingSvg}
  >
    <circle cx="120" cy="100" r="90" fill="#FEF3C7" fillOpacity="0.5" />
    <circle cx="40" cy="60" r="10" fill="#FDE68A" />
    <circle cx="200" cy="140" r="15" fill="#FDE68A" />
    <path
      d="M70 70 L170 70 L160 160 C160 171.046 151.046 180 140 180 H100 C88.9543 180 80 171.046 80 160 L70 70 Z"
      fill="white"
      stroke="#FFB800"
      strokeWidth="4"
    />
    <path
      d="M90 70 C90 70 90 30 120 30 C150 30 150 70 150 70"
      stroke="#FFB800"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="105" cy="120" r="4" fill="#FFB800" />
    <circle cx="135" cy="120" r="4" fill="#FFB800" />
    <path
      d="M105 145 C105 145 112 138 120 138 C128 138 135 145 135 145"
      stroke="#FFB800"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M165 40 C175 30 190 35 195 45"
      stroke="#111827"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
  </svg>
);

export default function Cart() {
  const {
    cart,
    address,
    cartId,
    removeFromCart,
    shippingPrice,
    totalPrice,
    updateQuantity,
    clearCart,
    updateAddress,
  } = useCart();
  const router = useRouter();

  // --- Calculations ---
  const subtotal = cart.reduce((sum: number, item: CartItem) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const [loading, setLoading] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<
    AddressData | undefined
  >(undefined);

  useEffect(() => {
    if (address) {
      setSelectedAddress(address);
    }
  }, [address]);

  // Helper to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cartId) {
      toast.error("Cart not found");
      return;
    }

    setLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const token = Cookies.get("token");
      if (!token) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }

      // Create Order
      const orderUrl = `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`;
      const { data: orderData } = await axios.post(
        orderUrl,
        {
          cartId: cartId,
          currency: "INR",
          addressId: selectedAddress.id, // Pass selected address ID
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!orderData.status) {
        toast.error("Failed to create order");
        setLoading(false);
        return;
      }

      const { amount, id: razorpay_order_id, currency } = orderData.data;
      const internalOrderId = orderData.orderId; // Our internal DB order ID

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "FutureNature",
        description: "Pure Honey & Nature's Best",
        image: "/Assets/futurenature-logo.png",
        order_id: razorpay_order_id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          // Verify Payment
          try {
            const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/payment/verify-payment`;
            const verifyRes = await axios.post(verifyUrl, data, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (verifyRes.data.status) {
              toast.success("Payment Successful!");
              clearCart();
              // Redirect to confirmation page with orderId
              router.push(`/order/confirmation?orderId=${internalOrderId}`);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Payment verification failed");
            console.error(error);
          }
        },
        prefill: {
          name: "Test User",
          email: "test.user@example.com",
          contact: selectedAddress.mobileNumber, // Pre-fill with selected address mobile
        },
        notes: {
          address: `${selectedAddress.address1}, ${selectedAddress.city}`,
        },
        theme: {
          color: "#fbbf24",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong initializing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Shopping Cart ({cart.length}) - FutureNature</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.pageWrapper}>
        <Navbar />
        {loading && <Loader />}

        <main className={styles.container}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className={styles.current}>Shopping Cart</span>
          </nav>

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
              <h1 className={styles.mainTitle}>MY CART</h1>
            </div>
            <p className={styles.subtitle}>
              Review your items and proceed to secure checkout.
            </p>
          </div>

          {cart.length === 0 ? (
            /* --- MODERN EMPTY STATE --- */
            <div className={styles.emptyStateCard}>
              <div className={styles.illustrationArea}>
                <EmptyCartSVG />
              </div>
              <h3>Your cart is empty</h3>
              <p>
                Looks like you haven&apos;t added any honey products yet.
                Nature&apos;s sweetness is waiting for you!
              </p>
              <Link href="/products" className={styles.btnPrimary}>
                Explore Products
              </Link>
            </div>
          ) : (
            /* --- CART CONTENT GRID --- */
            <div className={styles.contentGrid}>
              {/* LEFT COLUMN: Items */}
              <div className={styles.cartItemsSection}>
                <div className={styles.itemsList}>
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className={styles.cartItemCard}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.image || "/Assets/Products/15.png"}
                          alt={item.name || "Product Image"}
                          fill
                          style={{ objectFit: "contain" }}
                          unoptimized
                        />
                      </div>

                      <div className={styles.itemInfo}>
                        <div className={styles.infoTop}>
                          <div>
                            <Link
                              href={`/details/${item.id}`}
                              className={styles.itemName}
                            >
                              {item.name}
                            </Link>
                          </div>
                          <button
                            onClick={() =>
                              removeFromCart(item.id, item.cartItemId)
                            }
                            className={styles.removeBtn}
                            title="Remove item"
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        <div className={styles.infoBottom}>
                          <div className={styles.qtySelector}>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              disabled={item.quantity <= 1}
                              className={styles.qtyBtn}
                            >
                              −
                            </button>
                            <span className={styles.qtyVal}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className={styles.qtyBtn}
                            >
                              +
                            </button>
                          </div>
                          <div className={styles.itemPrice}>
                            ₹{Math.round((item.price || 0) * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <ShippingScreen
                  selectedAddress={selectedAddress}
                  setSelectedAddress={(e: any) => {
                    updateAddress(e?.id);
                  }}
                />
              </div>

              {/* RIGHT COLUMN: Summary */}
              <div className={styles.summarySection}>
                <div className={styles.summaryCard}>
                  <h2 className={styles.summaryTitle}>Order Summary</h2>

                  <div className={styles.summaryDetails}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal</span>
                      <span>₹{Math.round(subtotal)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Shipping</span>
                      <span>
                        {shippingPrice ? `₹${shippingPrice}` : "FREE"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.divider}></div>

                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total</span>
                    <span>
                      {totalPrice ? `₹${Math.round(+totalPrice)}` : "FREE"}
                    </span>
                  </div>

                  <button
                    disabled={!selectedAddress}
                    style={{
                      width: "100%",
                      backgroundColor: selectedAddress ? "#fbbf24" : "#d1d5db",
                      color: selectedAddress ? "#000" : "#9ca3af",
                      border: "none",
                      padding: "16px 24px",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "700",
                      cursor: selectedAddress ? "pointer" : "not-allowed",
                      marginTop: "40px",
                      transition: "all 0.2s",
                      opacity: selectedAddress ? 1 : 0.6,
                    }}
                    onClick={() => handlePayment()}
                    className={styles.btnPrimaryFull}
                  >
                    Proceed to Checkout
                  </button>

                  <div className={styles.trustBadge}>
                    <ShieldCheckIcon />
                    <span>Secure & Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {selectedAddress && (
          <button
            disabled={!selectedAddress}
            style={{
              width: "100%",
              backgroundColor: selectedAddress ? "#fbbf24" : "#d1d5db",
              color: selectedAddress ? "#000" : "#9ca3af",
              border: "none",
              padding: "16px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: selectedAddress ? "pointer" : "not-allowed",
              marginTop: "40px",
              transition: "all 0.2s",
              opacity: selectedAddress ? 1 : 0.6,
            }}
            onClick={() => handlePayment()}
            className={styles.btnPrimaryFullMobile}
          >
            Proceed to Checkout
          </button>
        )}

        <Footer />
      </div>
    </>
  );
}
