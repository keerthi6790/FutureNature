import styles from "@/styles/SkeletonDeals.module.scss";
import dealStyles from "@/styles/DailyDeals.module.scss";

export default function SkeletonDeals() {
    // Render 4 skeleton cards to fill the space
    const skeletonItems = Array.from({ length: 4 });

    return (
        <div className={dealStyles.sectionWrapper}>
            <h2 className={dealStyles.sectionTitle}>DAILY DEALS</h2>
            <div className={dealStyles.productsGrid}>
                {skeletonItems.map((_, index) => (
                    <div key={index} className={`${styles.skeletonCard} ${styles.shimmer}`}>
                        <div className={styles.skeletonBadge}></div>
                        <div className={styles.skeletonImage}></div>
                        <div className={styles.skeletonDetails}>
                            <div className={styles.skeletonTitle}></div>
                            <div className={styles.skeletonSubtitle}></div>
                            <div className={styles.skeletonMeta}>
                                <div className={styles.skeletonSmall}></div>
                                <div className={styles.skeletonSmall}></div>
                            </div>
                            <div className={styles.skeletonAction}>
                                <div className={styles.skeletonPrice}></div>
                                <div className={styles.skeletonButton}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
