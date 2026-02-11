import styles from "@/styles/SkeletonProducts.module.scss";

export default function SkeletonProducts() {
    const skeletonItems = Array.from({ length: 6 });

    return (
        <div className={styles.skeletonContainer}>
            {skeletonItems.map((_, index) => (
                <div key={index} className={`${styles.skeletonCard} ${styles.shimmer}`}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonTitle}></div>
                        <div className={styles.skeletonSubtitle}></div>
                        <div className={styles.skeletonMeta}></div>
                        <div className={styles.skeletonFooter}>
                            <div className={styles.skeletonPrice}></div>
                            <div className={styles.skeletonButton}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
