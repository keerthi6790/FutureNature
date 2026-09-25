import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy & Terms"
        description="Learn how FutureNature protects customer privacy, handles secure payments, and respects data integrity."
        canonical="/privacy-policy"
        noindex
      />

      <div style={{ minHeight: "100vh", backgroundColor: "#FAF0E6", color: "#36454F", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px 80px", flex: 1, width: "100%" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#A0522D", letterSpacing: "2px", textTransform: "uppercase" }}>
            Legal & Security
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2.5rem", fontWeight: 700, margin: "8px 0 24px 0" }}>
            Privacy Policy
          </h1>

          <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(139, 134, 128, 0.25)", padding: "32px", lineHeight: "1.8", fontSize: "1rem" }}>
            <p style={{ margin: "0 0 16px 0" }}>
              At <strong>FutureNature</strong>, accessible from https://futurenature.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by FutureNature and how we use it.
            </p>

            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, margin: "24px 0 8px 0", color: "#A0522D" }}>
              Information We Collect
            </h2>
            <p style={{ margin: "0 0 16px 0" }}>
              When you register for an account or place an order for pure honey and botanical harvests, we collect your name, email address, phone number, and delivery address to fulfill and dispatch your orders.
            </p>

            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, margin: "24px 0 8px 0", color: "#A0522D" }}>
              Payment Security
            </h2>
            <p style={{ margin: "0 0 16px 0" }}>
              All online payments are processed through encrypted, industry-standard gateways (Razorpay). FutureNature does not store your credit card, debit card, or banking credentials on our servers.
            </p>

            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, margin: "24px 0 8px 0", color: "#A0522D" }}>
              Contact Us
            </h2>
            <p style={{ margin: 0 }}>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at support@futurenature.in.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
