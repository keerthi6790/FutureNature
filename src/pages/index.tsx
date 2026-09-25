import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import DailyDeals from "@/components/DailyDeals";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import HoneyProcess from "@/components/HoneyProcess";
import Footer from "@/components/Footer";
import Tile from "@/components/Tile";
import SEO from "@/components/SEO";
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

  const homeJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "FutureNature",
      url: "https://futurenature.in",
      logo: "https://futurenature.in/favicon.ico",
      description:
        "Artisanal beekeeping and 100% pure, raw, and unpasteurized honey harvests from the Western Ghats of Tamil Nadu.",
      foundingDate: "2024",
      founder: {
        "@type": "Person",
        name: "Vidhya Sri",
        jobTitle: "Founder & Head Beekeeper",
      },
      address: {
        "@type": "PostalAddress",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        availableLanguage: ["English", "Tamil"],
      },
      sameAs: [
        "https://www.instagram.com/futurenature",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "FutureNature",
      url: "https://futurenature.in",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://futurenature.in/products?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <>
      <SEO
        title="Pure Raw Honey & Artisanal Botanical Harvests"
        description="Experience 100% pure, unheated, single-origin raw honey harvested ethically from the pristine flora of Tamil Nadu. FSSAI certified organic beekeeping."
        canonical="/"
        jsonLd={homeJsonLd}
        noindex
      />

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
        <button
          className={styles.backToTopButton}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
        >
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
