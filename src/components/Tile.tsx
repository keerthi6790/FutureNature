import Image from "next/image";
import React from "react";
import styles from "../styles/Tile.module.scss";

const Tile = () => {
  const HoverOverlay = () => <div className={styles.overlay}></div>;

  return (
    <div className={styles.tileSection}>
      <div className={styles.tileHeader}>
        <h2 className={styles.sectionTitle}>
          Our <span className={styles.highlight}>Gallery</span>
        </h2>
      </div>

      <div className={styles.tileGrid}>
        {/* Item 1: Tall (Row Span 2) */}
        <div className={`${styles.tileItem} ${styles.tallItem}`}>
          <Image
            src="https://futurenature.s3.ap-south-1.amazonaws.com/others/T1.jpg"
            alt="Honey Product"
            width={400}
            height={800}
            className={styles.tileImg}
            sizes="(max-width: 600px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
          <HoverOverlay />
        </div>

        {/* Item 2: Standard */}
        <div className={styles.tileItem}>
          <Image
            src="https://futurenature.s3.ap-south-1.amazonaws.com/others/T2.jpg"
            alt="Honey Product"
            width={300}
            height={300}
            className={styles.tileImg}
            sizes="(max-width: 600px) 50vw, 25vw"
          />
          <HoverOverlay />
        </div>

        {/* Item 3: Standard */}
        <div className={styles.tileItem}>
          <Image
            src="https://futurenature.s3.ap-south-1.amazonaws.com/others/T3.jpg"
            alt="Honey Product"
            width={300}
            height={300}
            className={styles.tileImg}
            sizes="(max-width: 600px) 50vw, 25vw"
          />
          <HoverOverlay />
        </div>

        {/* Item 4: Standard */}
        <div className={styles.tileItem}>
          <Image
            src="https://futurenature.s3.ap-south-1.amazonaws.com/others/T6.jpg"
            alt="Honey Product"
            width={300}
            height={300}
            className={styles.tileImg}
            sizes="(max-width: 600px) 50vw, 25vw"
          />
          <HoverOverlay />
        </div>

        {/* Item 5: Wide (Col Span 2) */}
        <div className={`${styles.tileItem} ${styles.wideItem}`}>
          <Image
            src="https://futurenature.s3.ap-south-1.amazonaws.com/others/T5.jpg"
            alt="Honey Product"
            width={600}
            height={300}
            className={styles.tileImg}
            sizes="(max-width: 600px) 100vw, 50vw"
          />
          <HoverOverlay />
        </div>

        {/* Item 6: Standard (Will fill the gap created by the Wide item) */}
        <div className={styles.tileItem}>
          <Image
            src="https://futurenature.s3.ap-south-1.amazonaws.com/others/T4.jpg"
            alt="Honey Product"
            width={300}
            height={300}
            className={styles.tileImg}
            sizes="(max-width: 600px) 50vw, 25vw"
          />
          <HoverOverlay />
        </div>
      </div>
    </div>
  );
};

export default Tile;
