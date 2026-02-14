import React from "react";
import styles from "@/styles/SkeletonOrders.module.scss";

interface SkeletonOrdersProps {
    count?: number;
}

const SkeletonOrderCard = () => (
    <div className={styles.skeletonCard}>
        <div className={styles.skeletonCardHeader}>
            <div className={styles.skeletonInfo}>
                <div className={styles.skeletonOrderId}></div>
                <div className={styles.skeletonDate}></div>
            </div>
            <div className={styles.skeletonMeta}>
                <div className={styles.skeletonBadge}></div>
                <div className={styles.skeletonPrice}></div>
            </div>
        </div>

        <div className={styles.skeletonItemCount}></div>

        <div className={styles.skeletonItems}>
            <div className={styles.skeletonItemPreview}></div>
            <div className={styles.skeletonItemPreview}></div>
            <div className={styles.skeletonItemPreview}></div>
            <div className={styles.skeletonItemPreview}></div>
        </div>

        <div className={styles.skeletonCardFooter}>
            <div className={styles.skeletonAddress}>
                <div className={styles.skeletonAddressLabel}></div>
                <div className={styles.skeletonAddressText}></div>
            </div>
            <div className={styles.skeletonButton}></div>
        </div>
    </div>
);

export default function SkeletonOrders({ count = 3 }: SkeletonOrdersProps) {
    return (
        <div className={styles.skeletonWrapper}>
            <div className={styles.skeletonHeader}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonSubtitle}></div>
            </div>

            <div className={styles.skeletonGrid}>
                {Array.from({ length: count }).map((_, index) => (
                    <SkeletonOrderCard key={index} />
                ))}
            </div>
        </div>
    );
}
