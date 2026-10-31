import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/styles/NotFound.module.scss";

export default function Custom404() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>404 - Page Not Found | FutureNature</title>
        <meta
          name="description"
          content="The page you are looking for doesn't exist or has taken a detour into nature. Explore pure organic honey, cold-pressed oils, and farm-fresh natural goods on FutureNature."
        />
        <meta name="robots" content="noindex, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageWrapper}>
        <Navbar />

        {/* Ambient Glows */}
        <div className={styles.bgGlowWrap}>
          <div className={styles.glowTopRight} />
          <div className={styles.glowBottomLeft} />
        </div>

        <main className={styles.mainContent}>
          {/* Hero Section */}
          <section className={styles.heroContainer}>
            {/* Pill Tag */}
            <div className={styles.badgePill}>
              <span className={styles.badgeIcon}>🌿</span>
              <span>Off The Beaten Path</span>
            </div>

            {/* Aesthetic 404 Display with Nature Emblem */}
            <div className={styles.codeIllustration} aria-label="404 Error">
              <span className={styles.errorCode}>4</span>
              <div className={styles.natureIconWrapper}>
                <div className={styles.leafEmblem} title="FutureNature Leaf & Honeybee">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.3L12 22l5.4-1.7c2.8-1.7 4.6-4.8 4.6-8.3 0-5.5-4.5-10-10-10z" />
                    <path d="M12 6v10" />
                    <path d="M8 10c1.5 1.5 4 1.5 4 1.5" />
                    <path d="M16 10c-1.5 1.5-4 1.5-4 1.5" />
                    <path d="M9 14c1.5 1.5 3 1.5 3 1.5" />
                    <path d="M15 14c-1.5 1.5-3 1.5-3 1.5" />
                  </svg>
                </div>
              </div>
              <span className={styles.errorCode}>4</span>
            </div>

            {/* Headings */}
            <h1 className={styles.title}>Trail Not Found</h1>
            <p className={styles.tamilSubtitle}>
              மன்னிக்கவும்! நீங்கள் தேடும் பக்கம் கிடைக்கவில்லை
            </p>
            <p className={styles.description}>
              Even the honeybees sometimes take a scenic detour! The page you were searching for may have been moved, renamed, or sprouted into something new.
            </p>

            {/* In-page Search Bar */}
            <form
              onSubmit={handleSearch}
              className={styles.searchForm}
              role="search"
              aria-label="Search products"
            >
              <svg
                className={styles.searchIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="search-input-404"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search natural honey, wood-pressed oils..."
                className={styles.searchInput}
              />
              <button
                id="search-submit-404"
                type="submit"
                className={styles.searchBtn}
              >
                Search
              </button>
            </form>

            {/* Action Buttons */}
            <div className={styles.actionButtonGroup}>
              <Link
                href="/"
                id="btn-return-home"
                className={styles.primaryHomeBtn}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Return to Home
              </Link>

              <button
                type="button"
                id="btn-go-back"
                onClick={handleGoBack}
                className={styles.secondaryBackBtn}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Previous Page
              </button>
            </div>
          </section>

          {/* Quick Helpful Destinations */}
          <section
            className={styles.quickLinksSection}
            aria-label="Helpful links"
          >
            <div className={styles.quickLinksHeader}>
              <h3>Popular Destinations</h3>
              <span>Find what you were looking for</span>
            </div>

            <div className={styles.quickCardsGrid}>
              {/* Card 1: All Products */}
              <Link
                href="/products"
                id="quicklink-products"
                className={styles.quickCard}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardIconWrap}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  <svg
                    className={styles.arrowIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <h4 className={styles.cardTitle}>Our Products</h4>
                <p className={styles.cardDesc}>
                  Raw forest honey, wood-pressed oils & traditional grains.
                </p>
              </Link>

              {/* Card 2: Daily Deals */}
              <Link
                href="/#daily-deals"
                id="quicklink-deals"
                className={styles.quickCard}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardIconWrap}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <svg
                    className={styles.arrowIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <h4 className={styles.cardTitle}>Daily Deals</h4>
                <p className={styles.cardDesc}>
                  Handcrafted combos and special discounts on pure harvest.
                </p>
              </Link>

              {/* Card 3: Our Story */}
              <Link
                href="/about"
                id="quicklink-about"
                className={styles.quickCard}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardIconWrap}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <svg
                    className={styles.arrowIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <h4 className={styles.cardTitle}>Our Story</h4>
                <p className={styles.cardDesc}>
                  Learn how Vidhya Sri brings the soul of nature to your home.
                </p>
              </Link>

              {/* Card 4: Contact & Help */}
              <Link
                href="/contact"
                id="quicklink-contact"
                className={styles.quickCard}
              >
                <div className={styles.cardTopRow}>
                  <div className={styles.cardIconWrap}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <svg
                    className={styles.arrowIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <h4 className={styles.cardTitle}>Need Help?</h4>
                <p className={styles.cardDesc}>
                  Questions about orders or products? We are here to help.
                </p>
              </Link>
            </div>

            {/* Assistance Note */}
            <p className={styles.helpNote}>
              Need immediate assistance?{" "}
              <Link href="/contact" id="contact-link-404">
                Chat with our support team
              </Link>{" "}
              or email us at <strong>contact@futurenature.in</strong>
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
