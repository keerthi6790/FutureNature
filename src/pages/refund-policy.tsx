import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/styles/RefundPolicy.module.scss";

export default function RefundPolicy() {
  return (
    <>
      <Head>
        <title>Refund &amp; Replacement Policy | Future Nature</title>
        <meta
          name="description"
          content="Review the official Future Nature Refund &amp; Replacement Policy. Learn about our commitment to quality honey, conditions for replacement or refund, and how to request support."
        />
        <meta
          name="keywords"
          content="Future Nature, refund policy, replacement policy, pure honey, customer satisfaction, Vidhiya Sri"
        />
        <meta property="og:title" content="Refund & Replacement Policy | Future Nature" />
        <meta
          property="og:description"
          content="Review the official Future Nature Refund & Replacement Policy. Brand Owner: Vidhiya Sri."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://futurenature.in/refund-policy" />
      </Head>

      <div className={styles.pageWrapper}>
        <Navbar />

        <main className={styles.mainContent}>
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <div className={styles.heroHoneycomb}></div>
            <div className={styles.container}>
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
                <Link href="/">Home</Link>
                <span className={styles.separator}>/</span>
                <span>Policies</span>
                <span className={styles.separator}>/</span>
                <span className={styles.current}>Refund &amp; Replacement</span>
              </nav>

              <div className={styles.heroBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
                Official Brand Policy
              </div>

              <h1 className={styles.heroTitle}>
                Refund &amp; <span className={styles.goldText}>Replacement Policy</span>
              </h1>

              <div className={styles.brandOwnerText}>
                Brand Owner: <strong>Vidhiya Sri</strong>
              </div>

              <div className={styles.heroMeta}>
                <span className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Customer-First Guarantee
                </span>
                <span className={styles.bulletSeparator}>•</span>
                <span className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  futurenature.in
                </span>
                <span className={styles.bulletSeparator}>•</span>
                <span className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Verified Purchases
                </span>
              </div>
            </div>
          </section>

          <div className={styles.container}>
            {/* Highlights Grid */}
            <div className={styles.highlightsGrid}>
              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className={styles.highlightTitle}>Damage Covered</h3>
                <p className={styles.highlightDesc}>
                  Protection for products that arrive damaged, leaked, or broken.
                </p>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <h3 className={styles.highlightTitle}>Simple Verification</h3>
                <p className={styles.highlightDesc}>
                  Share clear photos/video of the issue and your order details.
                </p>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </div>
                <h3 className={styles.highlightTitle}>Zero-Cost Replacement</h3>
                <p className={styles.highlightDesc}>
                  Approved replacement products are sent at no additional product cost.
                </p>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 12l-4-4-4 4M12 8v8" />
                  </svg>
                </div>
                <h3 className={styles.highlightTitle}>Fair Resolutions</h3>
                <p className={styles.highlightDesc}>
                  Eligible refunds processed through appropriate payment methods.
                </p>
              </div>
            </div>

            {/* Main Policy Card Container */}
            <article className={styles.policyCard}>
              {/* Section 1: Our Commitment */}
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIconWrapper}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <h2 className={styles.sectionTitle}>Our Commitment</h2>
                </div>
                <p className={styles.sectionText}>
                  At Future Nature, we are committed to providing quality honey products and a positive customer experience. If your order arrives damaged, leaked, or broken, please contact us so we can review the issue.
                </p>
              </section>

              {/* Section 2: When Is a Refund or Replacement Available? */}
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIconWrapper}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <h2 className={styles.sectionTitle}>When Is a Refund or Replacement Available?</h2>
                </div>
                <p className={styles.sectionText}>
                  If a product is delivered damaged, leaked, or broken, you may request either a refund or a replacement, subject to verification.
                </p>
              </section>

              {/* Section 3: How to Request Help */}
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIconWrapper}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <h2 className={styles.sectionTitle}>How to Request Help</h2>
                </div>

                <div className={styles.stepsList}>
                  <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <h4>Step 1: Contact Promptly</h4>
                      <p>Contact Future Nature as soon as possible after delivery.</p>
                    </div>
                  </div>

                  <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <h4>Step 2: Share Details &amp; Visual Evidence</h4>
                      <p>Share your order details and clear photos or a video showing the damaged product and its packaging.</p>
                    </div>
                  </div>

                  <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                      <h4>Step 3: Review &amp; Resolution</h4>
                      <p>We will review the information and confirm whether a refund or replacement can be provided.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Refunds */}
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIconWrapper}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h2 className={styles.sectionTitle}>Refunds</h2>
                </div>
                <p className={styles.sectionText}>
                  Once your request is approved, the eligible amount will be refunded using an appropriate refund method. The time taken for the amount to appear may depend on your payment provider.
                </p>
              </section>

              {/* Section 5: Replacement Products */}
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIconWrapper}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <h2 className={styles.sectionTitle}>Replacement Products</h2>
                </div>
                <p className={styles.sectionText}>
                  If a replacement is approved, Future Nature will arrange to send a replacement product at no additional product cost to the customer.
                </p>
              </section>

              {/* Section 6: Important Notes */}
              <section className={styles.sectionBlock}>
                <div className={styles.importantCallout}>
                  <div className={styles.calloutHeader}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Important Notes
                  </div>
                  <p className={styles.calloutBody}>
                    Please keep the product and its packaging until your request has been reviewed. Refunds or replacements are subject to verification. This policy applies to products that arrive damaged, leaked, or broken; it does not promise refunds for reasons not covered by this policy.
                  </p>
                </div>
              </section>
            </article>

            {/* Customer Support Callout Box */}
            <div className={styles.supportSection}>
              <h3 className={styles.supportTitle}>Need Assistance With Your Order?</h3>
              <p className={styles.supportTagline}>
                &ldquo;Customer satisfaction is our priority.&rdquo;
              </p>

              <div className={styles.actionButtons}>
                <a
                  href="https://wa.me/917418187578?text=Hello%20Future%20Nature%2C%20I%20need%20help%20with%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryButton}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </a>

                <a
                  href="mailto:futurenatureofficial@gmail.com?subject=Refund%20or%20Replacement%20Request"
                  className={styles.secondaryButton}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email Support
                </a>

                <Link href="/contact" className={styles.outlineButton}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Contact Page
                </Link>


              </div>

              <div className={styles.supportFooterMeta}>
                <span>
                  <strong>Official Website:</strong>{" "}
                  <a href="https://futurenature.in" target="_blank" rel="noopener noreferrer">
                    futurenature.in
                  </a>
                </span>
                <span className={styles.metaDivider}>•</span>
                <span>
                  <strong>Support Phone:</strong>{" "}
                  <a href="tel:+917418187578">+91 7418187578</a>
                </span>
                <span className={styles.metaDivider}>•</span>
                <span>
                  <strong>Brand Owner:</strong> Vidhiya Sri
                </span>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
