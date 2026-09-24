import Head from "next/head";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <Head>
        <title>About Our Sanctuary - FutureNature</title>
        <meta
          name="description"
          content="Learn about FutureNature and our mindful wabi-sabi beekeeping practices."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ minHeight: "100vh", backgroundColor: "#FAF0E6" }}>
        <Navbar />

        {/* Hero Banner */}
        <section
          style={{
            margin: "30px auto 50px",
          }}
          className="wabi-container"
        >
          <div
            className="wabi-about-hero-grid"
            style={{
              backgroundColor: "#36454F",
              color: "#FAF0E6",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              borderRadius: "0px",
              padding: "40px",
              boxShadow: "0 4px 20px rgba(54, 69, 79, 0.12)",
              position: "relative",
            }}
          >
            {/* Left Frame */}
            <div
              style={{
                width: "180px",
                height: "180px",
                backgroundColor: "#FAF0E6",
                border: "1px solid #D4AF37",
                borderRadius: "0px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "14px",
                  height: "14px",
                  borderTop: "2px solid #D4AF37",
                  borderLeft: "2px solid #D4AF37",
                }}
              />
              <Image
                src="/Assets/About us.png"
                alt="Beekeeper and Hive"
                width={160}
                height={160}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Right Text */}
            <div>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.8rem",
                  color: "#D4AF37",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Our Origins & Worldview
              </span>
              <h1
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3rem)",
                  fontWeight: 700,
                  color: "#FAF0E6",
                  margin: "0 0 10px 0",
                  lineHeight: "1.1",
                  letterSpacing: "-0.02em",
                }}
              >
                The Wabi-Sabi Harmony
              </h1>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#C8C3BC",
                  lineHeight: "1.6",
                  margin: 0,
                  maxWidth: "600px",
                }}
              >
                Honoring the imperfect beauty of nature. We let the bees follow their natural seasonal cadence without synthetic intrusion or over-processing.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section
          className="wabi-container"
          style={{
            margin: "0 auto 70px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Section 1: Beekeeper Info */}
            <div
              className="wabi-about-hero-grid"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(139, 134, 128, 0.25)",
                padding: "32px",
                borderRadius: "0px",
                boxShadow: "0 2px 12px rgba(54, 69, 79, 0.05)",
                alignItems: "center",
              }}
            >
              {/* Beekeeper Image */}
              <div
                style={{
                  width: "100%",
                  height: "240px",
                  border: "1px solid rgba(139, 134, 128, 0.3)",
                  backgroundColor: "#FAF0E6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/Assets/About us.png"
                  alt="Beekeeper Vidhya Sri"
                  width={300}
                  height={240}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Beekeeper Info */}
              <div>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.8rem",
                    color: "#A0522D",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Founder & Beekeeper
                </span>
                <h3
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#36454F",
                    marginBottom: "12px",
                    lineHeight: "1.2",
                  }}
                >
                  Meet Vidhya Sri
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#36454F",
                    lineHeight: "1.7",
                    margin: "0 0 10px 0",
                  }}
                >
                  My journey into beekeeping started with a deep reverence for nature and curiosity about the intricate geometry of hives. What began as a mindful practice soon evolved into a lifelong devotion: caring for native bee colonies, gently harvesting pure nectar in small batches, and upholding regenerative harmony.
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#8B8680",
                    lineHeight: "1.6",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  “In wabi-sabi, the crack in the ceramic is filled with gold. In our honey, every natural nuance is celebrated.”
                </p>
              </div>
            </div>

            {/* Section 2: Practices and Certification */}
            <div
              className="wabi-banner-grid"
              style={{
                alignItems: "stretch",
              }}
            >
              {/* Practices Card */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(139, 134, 128, 0.25)",
                  padding: "30px",
                  borderRadius: "0px",
                  boxShadow: "0 2px 12px rgba(54, 69, 79, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.8rem",
                    color: "#A0522D",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Mindful Stewardship
                </span>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#36454F",
                    marginBottom: "10px",
                  }}
                >
                  Our Ethical Beekeeping Practices
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#36454F",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                >
                  At FutureNature, we know that truly therapeutic honey can only come from undisturbed, healthy colonies. We adhere strictly to sustainable comb management, non-destructive extractions, and zero chemical heating, delivering raw honey in its most authentic, enzyme-dense state.
                </p>
              </div>

              {/* Certificate Section */}
              <div
                style={{
                  backgroundColor: "#36454F",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  padding: "30px",
                  borderRadius: "0px",
                  boxShadow: "0 2px 12px rgba(54, 69, 79, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.75rem",
                    color: "#D4AF37",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Food Safety Standard
                </span>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#FAF0E6",
                    fontStyle: "italic",
                    fontFamily: "Georgia, serif",
                    marginBottom: "6px",
                  }}
                >
                  fssai
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#D4AF37",
                    letterSpacing: "2px",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  22424445000161
                </div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#C8C3BC",
                    marginTop: "6px",
                  }}
                >
                  Certified Raw Agricultural Origin
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
