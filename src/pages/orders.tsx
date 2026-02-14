import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";
import SkeletonOrders from "@/components/SkeletonOrders";
import { orderApi, OrderData } from "@/api/orderApi";
import styles from "@/styles/Orders.module.scss";

const EmptyOrdersIcon = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getMyOrders();
            if (response.data.status) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return styles.paid;
            case "pending":
                return styles.pending;
            case "failed":
                return styles.failed;
            default:
                return styles.pending;
        }
    };

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <Head>
                    <title>My Orders - FutureNature</title>
                </Head>
                <Navbar />
                <div className={styles.layoutContainer}>
                    <AccountSidebar activeTab="orders" />
                    <SkeletonOrders count={3} />
                </div>
                <Footer />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className={styles.pageWrapper}>
                <Head>
                    <title>My Orders - FutureNature</title>
                </Head>
                <Navbar />
                <div className={styles.layoutContainer}>
                    <AccountSidebar activeTab="orders" />
                    <main className={styles.mainContainer}>
                        <div className={styles.emptyContainer}>
                            <div className={styles.emptyCard}>
                                <div className={styles.emptyIcon}>
                                    <EmptyOrdersIcon />
                                </div>
                                <h1 className={styles.emptyTitle}>No Orders Yet</h1>
                                <p className={styles.emptySubtitle}>
                                    You haven&apos;t placed any orders yet. Start shopping to see your orders here!
                                </p>
                                <Link href="/products" className={styles.primaryBtn}>
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <Head>
                <title>My Orders - FutureNature</title>
                <meta name="description" content="View and track all your orders from FutureNature" />
            </Head>
            <Navbar />

            <div className={styles.layoutContainer}>
                <AccountSidebar activeTab="orders" />

                <main className={styles.mainContainer}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>My Orders</h1>
                        <p className={styles.pageSubtitle}>
                            View and track all your orders
                        </p>
                    </div>

                    <div className={styles.ordersGrid}>
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className={styles.orderCard}
                                onClick={() => router.push(`/order/confirmation?orderId=${order.id}`)}
                            >
                                <div className={styles.orderHeader}>
                                    <div className={styles.orderInfo}>
                                        <p className={styles.orderId}>
                                            Order #{order.id.slice(0, 8).toUpperCase()}
                                        </p>
                                        <h3 className={styles.orderDate}>
                                            {formatDate(order.createdAt)}
                                        </h3>
                                    </div>
                                    <div className={styles.orderMeta}>
                                        <span className={`${styles.statusBadge} ${getStatusClass(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                        <p className={styles.orderTotal}>₹{order.total_price}</p>
                                    </div>
                                </div>

                                <p className={styles.itemCount}>
                                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                </p>

                                <div className={styles.orderItems}>
                                    {order.items.slice(0, 5).map((item) => (
                                        <div key={item.id} className={styles.itemPreview}>
                                            <img
                                                src={item.product.imageUrl[0] || "/Assets/Products/15.png"}
                                                alt={item.product.product_name}
                                            />
                                        </div>
                                    ))}
                                    {order.items.length > 5 && (
                                        <div className={styles.itemPreview} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: '#6b7280'
                                        }}>
                                            +{order.items.length - 5}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.orderFooter}>
                                    <div className={styles.orderAddress}>
                                        <p className={styles.addressLabel}>Delivery Address</p>
                                        <p className={styles.addressText}>
                                            {order.address.city}, {order.address.state} - {order.address.pincode}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/order/confirmation?orderId=${order.id}`}
                                        className={styles.viewDetailsBtn}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
