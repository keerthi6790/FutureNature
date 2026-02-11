import styles from "@/styles/SkeletonBanner.module.scss";

export default function SkeletonBanner() {
    return (
        <div className={styles.skeletonBanner}>
            <div className={`${styles.skeletonCard} ${styles.shimmer}`}></div>
        </div>
    );
}
