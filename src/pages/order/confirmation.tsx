import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { orderApi, OrderData } from "@/api/orderApi";
import styles from "@/styles/Cart.module.scss";

// Reusing some styles from Cart for consistency, or we could create Confirmation.module.scss
// For speed and consistency, I'll use inline styles for the unique parts or generic global classes if available.

const SuccessIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <div className={styles.pageWrapper}>
                <Navbar />
                <main style={{ textAlign: 'center', padding: '100px' }}>
                    <p>Loading order details...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.pageWrapper}>
                <Navbar />
                <main style={{ textAlign: 'center', padding: '100px' }}>
                    <h1>Order Not Found</h1>
                    <p>We couldn't find the details for this order.</p>
                    <Link href="/products" className={styles.primaryBtn} style={{ marginTop: '20px', display: 'inline-block' }}>
                        Back to Shop
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <Head>
                <title>Order Confirmed - FutureNature</title>
            </Head>
            <Navbar />

            <main style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <SuccessIcon />
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginTop: '20px', color: '#111827' }}>
                        Thank you for your order!
                    </h1>
                    <p style={{ color: '#4b5563', fontSize: '18px', marginTop: '10px' }}>
                        Your order <strong>#{order.id.slice(0, 8).toUpperCase()}</strong> has been placed successfully.
                    </p>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '30px', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>
                        Order Summary
                    </h2>

                    {order.items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div style={{ display: 'flex' }}>
                                <img
                                    src={item.product.imageUrl[0] || "/Assets/Products/15.png"}
                                    alt={item.product.product_name}
                                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'contain', backgroundColor: '#f9fafb' }}
                                />
                                <div style={{ marginLeft: '15px' }}>
                                    <p style={{ fontWeight: '600', color: '#111827' }}>{item.product.product_name}</p>
                                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Quantity: {item.selected_quantity}</p>
                                </div>
                            </div>
                            <p style={{ fontWeight: '600' }}>₹{item.total_price}</p>
                        </div>
                    ))}

                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#4b5563' }}>Subtotal (MRP)</span>
                            <span>₹{order.mrp_price}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#4b5563' }}>Discount</span>
                            <span style={{ color: '#059669' }}>-₹{Number(order.mrp_price) - Number(order.total_price)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '20px', fontWeight: '800' }}>
                            <span>Total</span>
                            <span style={{ color: '#fbbf24' }}>₹{order.total_price}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '10px' }}>Shipping Address</h3>
                        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                            {order.address.address1}<br />
                            {order.address.city}, {order.address.state}<br />
                            {order.address.pincode}
                        </p>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '10px' }}>Payment Info</h3>
                        <p style={{ color: '#4b5563' }}>Mode: Razorpay</p>
                        <p style={{ color: '#4b5563' }}>Status: <span style={{ color: '#059669', fontWeight: '600' }}>{order.paymentStatus}</span></p>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link href="/products" className={styles.primaryBtn} style={{ padding: '15px 40px', fontSize: '18px' }}>
                        Continue Shopping
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
