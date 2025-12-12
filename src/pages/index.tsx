import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import DailyDeals from "./components/DailyDeals";
import WhatsAppBanner from "./components/WhatsAppBanner";
import HoneyProcess from "./components/HoneyProcess";
import Footer from "./components/Footer";
import Tile from "./components/Tile";

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

  const processes = [
    {
      title: "Honey Treatment",
      description:
        "Honey treatment enhances texture, removes impurities, preserves its golden essence.",
      icon: "🍯",
    },
    {
      title: "Bee Keeping",
      description:
        "Beekeeping is the art of nurturing bees to create nature's purest honey.",
      icon: "🏺",
    },
    {
      title: "Honey Shop",
      description:
        "A honey shop is where nature's sweetness meets pure craftsmanship.",
      icon: "🛒",
    },
    {
      title: "Flower Produce",
      description:
        "Flowers produce nectar, the natural source of sweetness for bees and honey.",
      icon: "🌸",
    },
    {
      title: "Home Delivery",
      description:
        "Enjoy the sweetness of nature with our fast and safe home delivery.",
      icon: "🏠",
    },
    {
      title: "Honey Production",
      description:
        "Bees craft honey inside the hive, turning nature's nectar into liquid gold.",
      icon: "🍯",
    },
  ];

  return (
    <>
      <Head>
        <title>FutureNature - Home</title>
        <meta name="description" content="Welcome to FutureNature" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <Navbar />
        <Banner />
        <DailyDeals />
        <WhatsAppBanner />

        {/* Honey Products Showcase Section */}
        <div
          style={{
            padding: "80px 20px",
            backgroundColor: "#f9fafb",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Section Title */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "42px",
                fontWeight: "700",
                color: "#fbbf24",
                margin: "0 0 12px 0",
                letterSpacing: "0.5px",
              }}
            >
              Honey Gallery
            </h2>
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
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "70px",
            height: "70px",
            clipPath:
              "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
            backgroundColor: "#FFB400",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 20px rgba(255, 180, 0, 0.4)",
            transition: "background-color 0.3s ease",
            zIndex: 1000,
            transform: "rotate(90deg)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFB400";
          }}
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
            style={{ transform: "rotate(-90deg)" }}
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}
    </>
  );
}
