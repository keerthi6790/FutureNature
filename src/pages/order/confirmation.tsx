import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { orderApi, OrderData } from "@/api/orderApi";
import styles from "@/styles/Confirmation.module.scss";

const SuccessIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId as string);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await orderApi.getOrderById(id);
      if (response.data.status) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <main className={styles.stateContainer}>
          <h1>Loading Order Details</h1>
          <p>Please wait while we retrieve your order confirmation...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <main className={styles.stateContainer}>
          <h1>Order Not Found</h1>
          <p>We couldn&apos;t find the details for this order.</p>
          <Link href="/products" className={styles.primaryBtn}>
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const orderNumber = (order.id || "").slice(0, 8).toUpperCase();
  const mrp = Number(order.mrp_price || 0);
  const total = Number(order.total_price || 0);
  const discount = Math.max(0, mrp - total);

  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>Order Confirmed #{orderNumber} - FutureNature</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Navbar />

      <main className={styles.mainContainer}>
        {/* Success Header */}
        <div className={styles.headerSection}>
          <div className={styles.successIconWrapper}>
            <SuccessIcon />
          </div>
          <h1 className={styles.pageTitle}>Thank you for your order!</h1>
          <p className={styles.orderSubtitle}>
            Your order <span className={styles.orderCode}>#{orderNumber}</span> has been placed successfully.
          </p>
        </div>

        {/* Order Summary Card */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <PackageIcon />
              Order Summary
            </h2>
            <span className={styles.cardItemCount}>
              {order.items?.length || 0} {order.items?.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className={styles.itemsList}>
            {order.items?.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <div className={styles.itemLeft}>
                  <img
                    src={item.variant?.imageUrl || item.product?.imageUrl?.[0] || "/Assets/Products/15.png"}
                    alt={item.product?.product_name || "Product"}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemDetails}>
                    <p className={styles.itemName}>{item.product?.product_name}</p>
                    {item.variant?.name && (
                      <p style={{ fontSize: "12px", color: "#d97706", fontWeight: 600 }}>
                        Variant: {item.variant.name}
                      </p>
                    )}
                    <p className={styles.itemQty}>Quantity: {item.selected_quantity}</p>
                  </div>
                </div>
                <div className={styles.itemPrice}>₹{item.total_price}</div>
              </div>
            ))}
          </div>

          <div className={styles.priceSummary}>
            <div className={styles.priceRow}>
              <span>Subtotal (MRP)</span>
              <span>₹{order.mrp_price}</span>
            </div>
            {discount > 0 && (
              <div className={`${styles.priceRow} ${styles.discount}`}>
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className={`${styles.priceRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span className={styles.totalValue}>₹{order.total_price}</span>
            </div>
          </div>
        </section>

        {/* Info Grid (Shipping Address & Payment Info) */}
        <div className={styles.infoGrid}>
          {/* Shipping Address */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <LocationIcon />
              <h3>Shipping Address</h3>
            </div>
            <div className={styles.addressContent}>
              {order.address?.receiverName && (
                <div className={styles.receiverName}>{order.address.receiverName}</div>
              )}
              {order.address?.address1 && <div>{order.address.address1}</div>}
              {order.address?.address2 && <div>{order.address.address2}</div>}
              {order.address?.address3 && <div>{order.address.address3}</div>}
              <div>
                {[order.address?.city, order.address?.district, order.address?.state]
                  .filter(Boolean)
                  .join(", ")}
                {order.address?.pincode ? ` - ${order.address.pincode}` : ""}
              </div>
              {order.address?.phone_number && (
                <div className={styles.phone}>Phone: {order.address.phone_number}</div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <CreditCardIcon />
              <h3>Payment Info</h3>
            </div>
            <div className={styles.paymentContent}>
              <div className={styles.paymentRow}>
                <span>Payment Method</span>
                <strong>Razorpay</strong>
              </div>
              <div className={styles.paymentRow}>
                <span>Payment Status</span>
                <span
                  className={`${styles.badge} ${
                    order.paymentStatus?.toUpperCase() === "PAID" ? styles.paid : styles.pending
                  }`}
                >
                  {order.paymentStatus || "PENDING"}
                </span>
              </div>
              {order.order_status && (
                <div className={styles.paymentRow}>
                  <span>Order Status</span>
                  <span style={{ textTransform: "capitalize", fontWeight: 600, color: "#111827" }}>
                    {order.order_status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className={styles.actions}>
          <Link href="/products" className={styles.primaryBtn}>
            Continue Shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
