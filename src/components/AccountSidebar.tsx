import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import styles from "@/styles/AccountSidebar.module.scss";

interface AccountSidebarProps {
    activeTab?: "address" | "orders";
}

const MenuIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AddressIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const OrdersIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const LogoutIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default function AccountSidebar({ activeTab = "address" }: AccountSidebarProps) {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("token");
        toast.success("Logged out successfully");
        router.push("/");
    };



    return (
        <>
            <aside className={`${styles.sidebar}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.headerTitle}>Hey, Keerthivasan</h2>
                    <p className={styles.headerSubtitle}>Manage your account</p>
                </div>
                <nav>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <Link
                                href="/address"
                                className={activeTab === "address" ? styles.active : ""}
                            >
                                <AddressIcon />
                                <span>My Addresses</span>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link
                                href="/orders"
                                className={activeTab === "orders" ? styles.active : ""}
                            >
                                <OrdersIcon />
                                <span>My Orders</span>
                            </Link>
                        </li>
                    </ul>

                    <div className={styles.divider} />

                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <button onClick={handleLogout} className={styles.logout}>
                                <LogoutIcon />
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}
