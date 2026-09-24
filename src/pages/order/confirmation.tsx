import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { orderApi, OrderData } from "@/api/orderApi";

const SuccessIcon = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6B7B3A"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
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
      <div style={{ minHeight: "100vh", backgroundColor: "#FAF0E6", color: "#36454F", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        <Navbar />
        <main style={{ textAlign: "center", padding: "100px 20px", minHeight: "50vh" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", color: "#8B8680" }}>
            Loading harvest confirmation...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAF0E6", color: "#36454F", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        <Navbar />
        <main style={{ textAlign: "center", padding: "100px 20px", minHeight: "50vh" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "#36454F" }}>Order Not Found</h1>
          <p style={{ color: "#8B8680", fontSize: "1.1rem" }}>We couldn't retrieve the details for this order.</p>
          <Link
            href="/products"
            style={{
              marginTop: "24px",
              display: "inline-block",
              backgroundColor: "#A0522D",
              color: "#FAF0E6",
              padding: "12px 30px",
              textDecoration: "none",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontSize: "0.9rem",
            }}
          >
            Back to Catalogue
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF0E6", color: "#36454F", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <Head>
        <title>Order Confirmed - FutureNature</title>
      </Head>
      <Navbar />

      <main
        style={{ maxWidth: "800px", margin: "40px auto 80px", padding: "0 24px", width: "100%" }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <SuccessIcon />
          <span
            style={{
              display: "block",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "#6B7B3A",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginTop: "12px",
            }}
          >
            Harvest Batch Reserved
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              fontWeight: "700",
              marginTop: "8px",
              color: "#36454F",
            }}
          >
            Thank you for your order
          </h1>
          <p style={{ color: "#8B8680", fontSize: "1.1rem", marginTop: "8px" }}>
            Your order{" "}
            <strong style={{ fontFamily: "'JetBrains Mono', monospace", color: "#A0522D" }}>
              #{order.id.slice(0, 8).toUpperCase()}
            </strong>{" "}
            has been placed successfully.
          </p>
        </div>

        {/* Summary Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "0px",
            border: "1px solid rgba(139, 134, 128, 0.25)",
            boxShadow: "0 2px 12px rgba(54, 69, 79, 0.05)",
            padding: "32px",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: "700",
              color: "#36454F",
              marginBottom: "20px",
              borderBottom: "1px solid rgba(139, 134, 128, 0.2)",
              paddingBottom: "12px",
            }}
          >
            Order Summary
          </h2>

          {order.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(139, 134, 128, 0.12)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <img
                  src={item.product?.imageUrl?.[0] || "/Assets/Products/15.png"}
                  alt={item.product?.product_name || "Product"}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "0px",
                    objectFit: "contain",
                    backgroundColor: "#FAF0E6",
                    border: "1px solid rgba(139, 134, 128, 0.3)",
                    padding: "4px",
                  }}
                />
                <div>
                  <p style={{ fontWeight: "700", fontSize: "1.05rem", color: "#36454F", margin: 0 }}>
                    {item.product?.product_name}
                  </p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#8B8680", margin: "4px 0 0 0" }}>
                    Qty: {item.selected_quantity}
                  </p>
                </div>
              </div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", color: "#36454F", margin: 0, fontSize: "1.05rem" }}>
                ₹{item.total_price}
              </p>
            </div>
          ))}

          <div
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(139, 134, 128, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                color: "#8B8680",
                fontSize: "1rem",
              }}
            >
              <span>Subtotal (MRP)</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>₹{order.mrp_price}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                color: "#8B8680",
                fontSize: "1rem",
              }}
            >
              <span>Discount</span>
              <span style={{ color: "#6B7B3A", fontFamily: "'JetBrains Mono', monospace" }}>
                -₹{Math.max(0, Number(order.mrp_price) - Number(order.total_price))}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px dashed rgba(139, 134, 128, 0.3)",
                fontSize: "1.35rem",
                fontWeight: "700",
                color: "#36454F",
              }}
            >
              <span>Total</span>
              <span style={{ color: "#A0522D", fontFamily: "'JetBrains Mono', monospace" }}>₹{order.total_price}</span>
            </div>
          </div>
        </div>

        {/* Address & Payment Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "0px",
              border: "1px solid rgba(139, 134, 128, 0.25)",
              padding: "24px",
              boxShadow: "0 2px 10px rgba(54, 69, 79, 0.03)",
            }}
          >
            <h3 style={{ fontWeight: "700", fontSize: "1.2rem", color: "#36454F", marginBottom: "12px" }}>
              Shipping Address
            </h3>
            <p style={{ color: "#8B8680", lineHeight: "1.6", margin: 0 }}>
              {order.address.address1}
              {order.address.address2 ? `, ${order.address.address2}` : ""}
              <br />
              {order.address.city}, {order.address.state}
              <br />
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{order.address.pincode}</span>
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "0px",
              border: "1px solid rgba(139, 134, 128, 0.25)",
              padding: "24px",
              boxShadow: "0 2px 10px rgba(54, 69, 79, 0.03)",
            }}
          >
            <h3 style={{ fontWeight: "700", fontSize: "1.2rem", color: "#36454F", marginBottom: "12px" }}>
              Payment Info
            </h3>
            <p style={{ color: "#8B8680", margin: "0 0 6px 0" }}>
              Method: <span style={{ color: "#36454F", fontWeight: 600 }}>Razorpay Secure</span>
            </p>
            <p style={{ color: "#8B8680", margin: 0 }}>
              Status:{" "}
              <span style={{ color: "#6B7B3A", fontWeight: "700", fontFamily: "'JetBrains Mono', monospace" }}>
                {order.paymentStatus || "PAID"}
              </span>
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/products"
            style={{
              display: "inline-block",
              backgroundColor: "#A0522D",
              color: "#FAF0E6",
              padding: "14px 40px",
              borderRadius: "0px",
              fontSize: "1rem",
              fontWeight: 600,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "1px",
              border: "1px solid #A0522D",
              transition: "all 0.2s ease-out",
            }}
          >
            Continue Exploring Catalogue
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
