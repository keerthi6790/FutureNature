import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import styles from "@/styles/NotFound.module.scss";

export default function Custom404() {
  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page or harvest batch you are looking for does not exist or has returned to nature."
        noindex
      />

      <div className={styles.notFoundPage}>
        <Navbar />

        <main className={styles.contentWrapper}>
          <div className={styles.cardFrame}>
            {/* Wabi-Sabi Gold Corner Accents */}
            <div className={styles.cornerTL} />
            <div className={styles.cornerBR} />

            {/* Honeycomb Glyph */}
            <div className={styles.glyphContainer}>
              <svg
                className={styles.honeyGlyph}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l8.5 4.9v9.8L12 21.5 3.5 16.7V6.9L12 2z" />
                <path d="M12 22V12" />
                <path d="M20.5 7L12 12 3.5 7" />
              </svg>
            </div>

            <span className={styles.errorCode}>404 • Error Code</span>

            <h1 className={styles.errorTitle}>
              Lost in the <span className={styles.goldAccent}>Wild Flora</span>
            </h1>

            <div className={styles.dividerLine} />

            <p className={styles.description}>
              The path you followed does not lead to a known hive. The page or harvest
              batch you are seeking may have moved or returned to nature.
            </p>

            <div className={styles.actionGrid}>
              <Link href="/" className={styles.btnPrimary}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Return to Sanctuary
              </Link>

              <Link href="/products" className={styles.btnSecondary}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Browse Harvests
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
