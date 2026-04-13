import Head from "next/head";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import DailyDeals from "@/components/DailyDeals";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import HoneyProcess from "@/components/HoneyProcess";
import Footer from "@/components/Footer";
import Tile from "@/components/Tile";
import styles from "@/styles/Home.module.scss";

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>FutureNature - Home</title>
        <meta name="description" content="Welcome to FutureNature" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.homeWrapper}>
        <Navbar />
        <Banner />
        <DailyDeals />
        <WhatsAppBanner />

        {/* Honey Products Showcase Section */}
        <div className={styles.honeyShowcaseSection}>
          {/* Section Title */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Honey Gallery</h2>
          </div>

          {/* Tile Grid Layout */}
          <Tile />
        </div>
      </div>

      {/* Honey Process Timeline Section */}
      <HoneyProcess />

      <Footer />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button className={styles.backToTopButton} onClick={scrollToTop}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}
    </>
  );
}
