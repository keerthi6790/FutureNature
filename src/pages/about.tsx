import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Assuming Footer component is used, though commented out in original.
import styles from "@/styles/About.module.scss";

export default function About() {
  return (
    <>
      <Head>
        <title>Our Story - FutureNature</title>
        <meta
          name="description"
          content="Certified purity. The story behind FutureNature honey."
        />
      </Head>

      <div className={styles.pageWrapper}>
        <Navbar />

        {/* --- 1. HERO SECTION --- */}
        <header className={styles.heroSection}>
          <div className={styles.heroBgPattern}></div>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <span className={styles.heroSubtitle}>
                EST. 2024 • TAMIL NADU
              </span>
              <h1 className={styles.heroTitle}>
                Preserving <br />
                <span className={styles.goldText}>Nature&apos;s Soul</span>
              </h1>
              <div className={styles.heroLine}></div>
              <p className={styles.heroDesc}>
                An artisan journey from the wildflowers of the Western Ghats to
                the sanctuary of your home.
              </p>
            </div>
          </div>
        </header>

        {/* --- 2. FOUNDER STORY (Moved Up) --- */}
        <section className={styles.storySection}>
          <div className={styles.container}>
            <div className={styles.storyWrapper}>
              {/* Background Image Block */}
              <div className={styles.storyBgImg}>
                <Image
                  src="https://futurenature.s3.ap-south-1.amazonaws.com/others/About us.png"
                  alt="Beekeeping Background"
                  fill
                  className={styles.bgImg}
                />
                <div className={styles.overlay}></div>
              </div>

              {/* Floating Content Card */}
              <div className={styles.storyCard}>
                <span className={styles.cardTag}>THE KEEPER&apos;S NOTE</span>
                <h2 className={styles.cardTitle}>Vidhya Sri</h2>
                <p className={styles.cardRole}>Founder & Head Beekeeper</p>

                <div className={styles.cardBody}>
                  <p>
                    <span className={styles.dropCap}>H</span>oney is the only
                    food on the planet that never spoils. It is nature&apos;s
                    way of preserving energy. My mission isn&apos;t just to
                    harvest it, but to protect the tiny architects who build it.
                  </p>
                  <p>
                    At FutureNature, we stepped away from industrial farming. We
                    embraced the wild. Every jar you hold is a result of ethical
                    patience harvested only when the bees have stored enough for
                    themselves.
                  </p>
                </div>

                <div className={styles.signature}>— Vidhya Sri</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. THE TRUST ANCHOR (FSSAI) - NOW ABOVE STANDARDS --- */}
        <section className={styles.trustAnchor}>
          <div className={styles.container}>
            <div className={styles.fssaiBanner}>
              {/* Left: The Seal */}
              <div className={styles.sealContainer}>
                <div className={styles.sealRing}>
                  <div className={styles.sealInner}>
                    <span className={styles.fssaiLogoText}>fssai</span>
                  </div>
                </div>
              </div>

              {/* Center: The Certificate Details */}
              <div className={styles.certDetails}>
                <h3 className={styles.certHead}>GOVERNMENT CERTIFIED PURITY</h3>
                <p className={styles.certSub}>
                  Food Safety & Standards Authority of India
                </p>
                <div className={styles.licenceBox}>
                  <span className={styles.licLabel}>LICENSE NUMBER</span>
                  <span className={styles.licNo}>22424445000161</span>
                </div>
              </div>

              {/* Right: The Promise */}
              <div className={styles.purityPromise}>
                <ul className={styles.checkList}>
                  <li>✓ 100% Antibiotic Free</li>
                  <li>✓ No Added Sugar</li>
                  <li>✓ Lab Tested Quality</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. CORE PILLARS (Golden Standards) --- */}
        <section className={styles.pillarsSection}>
          <div className={styles.container}>
            <div className={styles.pillarsHeader}>
              <h2>Our Golden Standards</h2>
              <p className={styles.pillarsSub}>
                The principles we live by, validated by our certification.
              </p>
            </div>

            <div className={styles.pillarsGrid}>
              {/* Pillar 1 */}
              <div className={styles.pillarCard}>
                <div className={styles.pillarNum}>01</div>
                <h3>Raw & Unfiltered</h3>
                <p>
                  We never heat our honey. We filter it lightly just to remove
                  wax, keeping all the pollen and enzymes alive.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className={`${styles.pillarCard} ${styles.middleCard}`}>
                <div className={styles.pillarNum}>02</div>
                <h3>Single Origin</h3>
                <p>
                  We don't blend honeys from different sources. You taste the
                  specific flora of a specific season in Tamil Nadu.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className={styles.pillarCard}>
                <div className={styles.pillarNum}>03</div>
                <h3>Cruelty Free</h3>
                <p>
                  We use smoke-free methods and never harvest during dearth
                  periods. The bees' well-being comes before profit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <Footer /> */}
        <Footer />
      </div>
    </>
  );
}
