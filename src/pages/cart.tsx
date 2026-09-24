import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart, CartItem } from "@/components/CartContext";
import ShippingScreen from "@/components/ShippingScreen";
import apiClient from "@/api/apiClient";
import toast from "react-hot-toast";
import styles from "@/styles/Cart.module.scss";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Cart() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    address,
    updateAddress,
    cartId,
    shippingPrice,
    totalPrice,
  } = useCart();

  const [paymentLoading, setPaymentLoading] = useState(false);

  // Compute subtotal from actual items in the cart
  const computedSubtotal = cart.reduce((sum, item) => {
    const itemPrice = typeof item.price === "number" ? item.price : 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  const numShipping = shippingPrice ? parseFloat(shippingPrice) : 0;
  const numGrandTotal = totalPrice ? parseFloat(totalPrice) : computedSubtotal + numShipping;

  const handlePayment = async () => {
    if (!address) {
      toast.error("Please select or add a delivery address below");
      return;
    }
    if (!cartId || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load secure payment gateway. Please check your connection.");
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await apiClient.post("/payment/create-order", {
        cartId,
        addressId: address.id,
        currency: "INR",
      });

      if (!response.data.status) {
        toast.error(response.data.message || "Failed to create payment order");
        setPaymentLoading(false);
        return;
      }

      const { data: orderData, orderId } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RyiEmClrvRZ2Ac",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "FutureNature",
        description: "Artisan Honey & Botanical Harvest",
        image: "/favicon.ico",
        order_id: orderData.id,
        handler: async function (paymentResponse: any) {
          try {
            const verifyRes = await apiClient.post("/payment/verify-payment", {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyRes.data.status) {
              clearCart();
              toast.success("Payment confirmed!");
              router.push(`/order/confirmation?orderId=${orderId}`);
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          contact: address.phone_number || "",
        },
        theme: {
          color: "#A0522D",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Shopping Cart - FutureNature</title>
        <meta name="description" content="Your artisan harvest cart" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.cartPage}>
        <Navbar />

        <main className={styles.cartContainer}>
          {cart.length === 0 ? (
            /* --- EMPTY CART STATE --- */
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏺</div>

              <div className={styles.emptyTextContainer}>
                <span className={styles.subheading}>Empty Vessel</span>
                <h2 className={styles.emptyTitle}>Your Cart is Currently Empty</h2>
                <p className={styles.emptyDescription}>
                  Discover the purest raw honey and handcrafted botanical blends in our harvest collection.
                </p>
              </div>

              <Link href="/products" className={styles.browseButton}>
                Browse Harvest Catalogue
              </Link>
            </div>
          ) : (
            /* --- CART WITH ITEMS --- */
            <div>
              <div className={styles.headerSection}>
                <span className={styles.subheading}>Reserved Batches</span>
                <h1 className={styles.pageTitle}>
                  Your Selected Harvest ({cart.length})
                </h1>
              </div>

              {/* Main Grid: Items & Address on Left, Summary on Right */}
              <div className={styles.cartGrid}>
                {/* Left Column: Cart Items & Shipping Address */}
                <div className={styles.leftColumn}>
                  {/* Cart Items Table */}
                  <div className={styles.tableCard}>
                    <table className={styles.cartTable}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left" }}>Product</th>
                          <th style={{ textAlign: "left", width: "110px" }}>Price</th>
                          <th style={{ textAlign: "left", width: "130px" }}>Quantity</th>
                          <th style={{ textAlign: "right", width: "120px" }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item: CartItem, index: number) => {
                          const itemPrice = typeof item.price === "number" ? item.price : 0;
                          const itemTotal = itemPrice * item.quantity;
                          const itemName = item.name || `Harvest Item #${index + 1}`;
                          const itemImg = item.image || "/Assets/Products/15.png";

                          return (
                            <tr key={item.id || index}>
                              {/* Product Info */}
                              <td>
                                <div className={styles.productCell}>
                                  <div className={styles.imageWrapper}>
                                    <Image
                                      src={itemImg}
                                      alt={itemName}
                                      fill
                                      style={{ objectFit: "contain", padding: "4px" }}
                                      unoptimized
                                    />
                                  </div>
                                  <div className={styles.productDetails}>
                                    <Link
                                      href={`/details/${item.id}`}
                                      className={styles.productTitle}
                                    >
                                      {itemName}
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.id, item.cartItemId)}
                                      className={styles.removeBtn}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Price */}
                              <td className={styles.priceText}>
                                ₹{Math.round(itemPrice)}
                              </td>

                              {/* Quantity Control */}
                              <td>
                                <div className={styles.quantityGroup}>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className={styles.qtyButton}
                                    aria-label="Decrease quantity"
                                  >
                                    −
                                  </button>
                                  <span className={styles.qtyValue}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className={styles.qtyButton}
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

                              {/* Item Subtotal */}
                              <td className={styles.subtotalText}>
                                ₹{Math.round(itemTotal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Shipping & Delivery Address Section */}
                  <div className={styles.addressCard}>
                    <h2 className={styles.sectionHeader}>Delivery Address</h2>
                    <ShippingScreen
                      selectedAddress={address || undefined}
                      setSelectedAddress={(addr: any) => {
                        if (addr?.id) {
                          updateAddress(addr.id);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Right Column: Order Summary */}
                <div>
                  <div className={styles.summaryCard}>
                    <h3 className={styles.sectionHeader} style={{ margin: "0 0 4px 0" }}>
                      Order Summary
                    </h3>

                    {/* Subtotal */}
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Subtotal</span>
                      <span className={styles.summaryValue}>
                        ₹{Math.round(computedSubtotal)}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Shipping</span>
                      <span
                        className={`${styles.summaryValue} ${
                          numShipping === 0 ? styles.freeShipping : ""
                        }`}
                      >
                        {numShipping === 0 ? "FREE" : `₹${Math.round(numShipping)}`}
                      </span>
                    </div>

                    {/* Grand Total */}
                    <div className={styles.grandTotalRow}>
                      <span className={styles.grandTotalLabel}>Grand Total</span>
                      <span className={styles.grandTotalValue}>
                        ₹{Math.round(numGrandTotal)}
                      </span>
                    </div>

                    {/* Delivery Notification Badge */}
                    {numShipping === 0 && (
                      <div className={styles.promoBadge}>
                        ✓ Complimentary Free Shipping Applied
                      </div>
                    )}

                    {/* Address Selection Warning */}
                    {!address && (
                      <p className={styles.addressPrompt}>
                        * Please select or add an address to proceed
                      </p>
                    )}

                    {/* Checkout Button */}
                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading || !address}
                      className={styles.checkoutBtn}
                    >
                      {paymentLoading ? "Initiating Secure Gateway..." : "Proceed to Checkout"}
                    </button>

                    <div className={styles.secureBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>100% Encrypted & Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
