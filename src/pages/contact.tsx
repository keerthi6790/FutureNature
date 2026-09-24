import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ Name: "", email: "", message: "" });
  };

  return (
    <>
      <Head>
        <title>Contact Our Sanctuary - FutureNature</title>
        <meta
          name="description"
          content="Get in touch with FutureNature for pure honey inquiries and artisan batch orders."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ minHeight: "100vh", backgroundColor: "#FAF0E6" }}>
        <Navbar />

        {/* Hero Section */}
        <section
          style={{
            margin: "30px auto 40px",
          }}
          className="wabi-container"
        >
          <div
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
              Direct Conversation
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
              Get in Touch with Our Apiary
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
              Whether inquiring about seasonal harvests, bulk ceramic vessels, or beekeeping practices, we welcome your thoughts.
            </p>
          </div>
        </section>

        {/* Main Content Form & Info */}
        <section
          className="wabi-container"
          style={{
            margin: "0 auto 70px",
          }}
        >
          <div className="wabi-contact-grid" style={{ alignItems: "stretch" }}>
            {/* Left Section - Form */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(139, 134, 128, 0.25)",
                borderRadius: "0px",
                padding: "32px",
                boxShadow: "0 2px 12px rgba(54, 69, 79, 0.05)",
              }}
            >
              <div style={{ marginBottom: "24px" }}>
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
                  Send a Message
                </span>
                <h2
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#36454F",
                    margin: 0,
                  }}
                >
                  We are here to help
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {/* Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#36454F",
                      marginBottom: "6px",
                    }}
                  >
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #8B8680",
                      borderRadius: "0px",
                      fontSize: "0.95rem",
                      backgroundColor: "#FAF0E6",
                      color: "#36454F",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#36454F",
                      marginBottom: "6px",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #8B8680",
                      borderRadius: "0px",
                      fontSize: "0.95rem",
                      backgroundColor: "#FAF0E6",
                      color: "#36454F",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#36454F",
                      marginBottom: "6px",
                    }}
                  >
                    Write your inquiry
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #8B8680",
                      borderRadius: "0px",
                      fontSize: "0.95rem",
                      backgroundColor: "#FAF0E6",
                      color: "#36454F",
                      fontFamily: "inherit",
                      resize: "vertical",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#A0522D",
                    color: "#FAF0E6",
                    padding: "12px 28px",
                    border: "1px solid #A0522D",
                    borderRadius: "0px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    transition: "all 0.2s ease-out",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    marginTop: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#36454F";
                    e.currentTarget.style.borderColor = "#D4AF37";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#A0522D";
                    e.currentTarget.style.borderColor = "#A0522D";
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Section - Contact Info Card */}
            <div
              style={{
                backgroundColor: "#36454F",
                color: "#FAF0E6",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                borderRadius: "0px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "24px",
                boxShadow: "0 2px 12px rgba(54, 69, 79, 0.05)",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.8rem",
                    color: "#D4AF37",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Sanctuary Coordinates
                </span>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#FAF0E6",
                    margin: "0 0 20px 0",
                  }}
                >
                  Office & Farm
                </h3>

                {/* Address */}
                <div style={{ marginBottom: "16px" }}>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#D4AF37",
                      margin: "0 0 4px 0",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    Address
                  </h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#C8C3BC",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    1226, Karumapuram (P.O), Tiruchengode (Taluk), Namakkal (District), Tamil Nadu - 637302.
                  </p>
                </div>

                {/* Telephone */}
                <div style={{ marginBottom: "16px" }}>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#D4AF37",
                      margin: "0 0 4px 0",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    Direct Telephone
                  </h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#C8C3BC",
                      lineHeight: "1.6",
                      margin: 0,
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    +91 7418187578
                  </p>
                </div>

                {/* Email */}
                <div>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#D4AF37",
                      margin: "0 0 4px 0",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    Inquiry Email
                  </h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#C8C3BC",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    futurenatureofficial@gmail.com
                  </p>
                </div>
              </div>

              {/* Social Channels */}
              <div
                style={{
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(139, 134, 128, 0.25)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#D4AF37",
                    fontFamily: "JetBrains Mono, monospace",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Follow Our Harvest Journey
                </span>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[
                    { name: "WhatsApp", href: "https://whatsapp.com" },
                    { name: "Instagram", href: "https://instagram.com" },
                    { name: "YouTube", href: "https://youtube.com" },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#FAF0E6",
                        fontSize: "0.85rem",
                        padding: "4px 10px",
                        border: "1px solid rgba(139, 134, 128, 0.3)",
                        transition: "all 0.2s ease-out",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#D4AF37";
                        e.currentTarget.style.color = "#D4AF37";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(139, 134, 128, 0.3)";
                        e.currentTarget.style.color = "#FAF0E6";
                      }}
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}