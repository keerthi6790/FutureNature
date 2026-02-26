import styles from "@/styles/SkeletonDetail.module.scss";

export default function SkeletonDetail() {
    return (
        <div className={styles.skeletonWrapper}>
            {/* Breadcrumbs */}
            <div className={styles.skeletonBreadcrumbs}>
                <div className={`${styles.breadcrumbItem} ${styles.shimmer}`}></div>
                <div className={`${styles.breadcrumbItem} ${styles.shimmer}`}></div>
                <div className={`${styles.breadcrumbItem} ${styles.shimmer}`}></div>
            </div>

            <div className={styles.skeletonCard}>
                {/* Left Column - Image */}
                <div className={styles.skeletonImageSection}>
                    <div className={`${styles.skeletonMainImage} ${styles.shimmer}`}></div>
                    <div className={styles.skeletonThumbnails}>
                        <div className={`${styles.skeletonThumbnail} ${styles.shimmer}`}></div>
                        <div className={`${styles.skeletonThumbnail} ${styles.shimmer}`}></div>
                        <div className={`${styles.skeletonThumbnail} ${styles.shimmer}`}></div>
                        <div className={`${styles.skeletonThumbnail} ${styles.shimmer}`}></div>
                    </div>
                </div>

                {/* Right Column - Info */}
                <div className={styles.skeletonInfoSection}>
                    <div className={styles.skeletonMetaRow}>
                        <div className={`${styles.metaItem} ${styles.shimmer}`}></div>
                        <div className={`${styles.metaItem} ${styles.shimmer}`}></div>
                        <div className={`${styles.metaItem} ${styles.shimmer}`}></div>
                    </div>

                    <div>
                        <div className={`${styles.skeletonTitle} ${styles.shimmer}`}></div>
                        <div className={`${styles.skeletonSubtitle} ${styles.shimmer}`}></div>
                    </div>

                    <div className={styles.skeletonPriceRow}>
                        <div className={`${styles.priceItem} ${styles.shimmer}`}></div>
                        <div className={`${styles.priceItem} ${styles.shimmer}`}></div>
                    </div>

                    <div className={styles.skeletonDescription}>
                        <div className={`${styles.descLine} ${styles.shimmer}`}></div>
                        <div className={`${styles.descLine} ${styles.shimmer}`}></div>
                        <div className={`${styles.descLine} ${styles.shimmer}`}></div>
                        <div className={`${styles.descLine} ${styles.shimmer}`}></div>
                    </div>

                    <div className={styles.skeletonActions}>
                        <div className={`${styles.actionBtn} ${styles.shimmer}`}></div>
                        <div className={`${styles.actionBtn} ${styles.shimmer}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
