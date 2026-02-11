import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "@/styles/Blog.module.scss";

interface IServerSideProsp {
  id: number;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export default function Blog({
  WELLNESS_BLENDS,
}: {
  WELLNESS_BLENDS: IServerSideProsp[];
}) {
  return (
    <>
      <Head>
        <title>The Wellness Journal - FutureNature</title>
        <meta
          name="description"
          content="Discover the healing benefits of our herbal honey blends."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageWrapper}>
        <Navbar />

        {/* --- 1. COMPACT HEADER --- */}
        <header className={styles.pageHeader}>
          <div className={styles.container}>
            <span className={styles.eyebrow}>THE WELLNESS JOURNAL</span>
            <h1 className={styles.mainTitle}>Nature’s Apothecary</h1>
            <p className={styles.mainDesc}>
              Pure, handcrafted blends for modern wellness.
            </p>
          </div>
        </header>

        {/* --- 2. COMPACT CARD GRID --- */}
        <section className={styles.catalogSection}>
          <div className={styles.container}>
            <div className={styles.cardList}>
              {WELLNESS_BLENDS.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id}
                    className={`${styles.productCard} ${isEven ? "" : styles.reverse}`}
                  >
                    {/* Image Side */}
                    <div className={styles.cardMedia}>
                      <div className={styles.imgContainer}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className={styles.coverImg}
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    </div>

                    {/* Text Side */}
                    <div className={styles.cardBody}>
                      <div className={styles.cardContent}>
                        <div className={styles.tagRow}>
                          <span className={styles.idBadge}>#{item.id}</span>
                          <span className={styles.categoryTag}>{item.tagline}</span>
                        </div>

                        <h2 className={styles.cardTitle}>{item.name}</h2>
                        <p className={styles.cardDesc}>{item.description}</p>

                        <div className={styles.cardFooter}>
                          <button className={styles.shopLink}>
                            View Details
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- 3. FOOTER CTA --- */}
        <section className={styles.footerCta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Start your journey to better health.</h2>
            <a href="/products" className={styles.shopBtn}>
              Visit The Shop
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const WELLNESS_BLENDS = [
    {
      id: 1,
      name: "GINGER HONEY",
      tagline: "The Energizer",
      description:
        "This blend is perfect for soothing sore throats, improving digestion, and warming the body. The bold combination of ginger and raw honey provides an energizing start to the day.",
      image: "/Assets/Tile/T1.jpg",
    },
    {
      id: 2,
      name: "GULKAND HONEY",
      tagline: "The Cooling Ritual",
      description:
        "A gentle fusion of rose petal preserve and raw honey. Gulkand naturally cools the system and supports digestion. Savor it as a calming evening ritual to promote tranquility.",
      image: "/Assets/Tile/T2.jpg",
    },
    {
      id: 3,
      name: "CAVITY HONEY",
      tagline: "Oral Defense",
      description:
        "Supports oral hygiene through selected ingredients. Perfect for oil pulling or daily use, promoting gum health and helping prevent tooth decay naturally.",
      image: "/Assets/Tile/T3.jpg",
    },
    {
      id: 4,
      name: "LEMON HONEY",
      tagline: "Immunity Spark",
      description:
        "Combining the freshness of lemon with the richness of raw honey. Perfect for boosting immunity and providing natural energy. A citrus twist for your morning tea.",
      image: "/Assets/Tile/T4.jpg",
    },
    {
      id: 5,
      name: "TURMERIC HONEY",
      tagline: "Golden Healer",
      description:
        "Known for its anti-inflammatory properties, turmeric honey is perfect for joint health and overall wellness. A perfect natural remedy for your body's defense system.",
      image: "/Assets/Tile/T5.jpg",
    },
    {
      id: 6,
      name: "BLACK SEED HONEY",
      tagline: "Respiratory Support",
      description:
        "Enriched with black seeds, this blend supports respiratory health and boosts immunity. Powerful natural wellness support with traditional herbs.",
      image: "/Assets/Tile/T6.jpg",
    },
    {
      id: 7,
      name: "CINNAMON HONEY",
      tagline: "Metabolic Balance",
      description:
        "Warm and aromatic, cinnamon honey helps with blood sugar balance and adds a delightful spice to your daily wellness routine.",
      image: "/Assets/Tile/T1.jpg",
    },
    {
      id: 8,
      name: "ASHWAGANDHA HONEY",
      tagline: "Stress Relief",
      description:
        "A powerful adaptogenic blend that helps manage stress and promotes mental clarity. Perfect for evening routines or whenever you need natural balance.",
      image: "/Assets/Tile/T2.jpg",
    },
    {
      id: 9,
      name: "BASIL HONEY",
      tagline: "Holy Vitality",
      description:
        "Holy basil infused honey promotes respiratory health and supports digestion. A sacred blend for holistic wellness and natural vitality.",
      image: "/Assets/Tile/T3.jpg",
    },
    {
      id: 10,
      name: "MULTIFLORAL HONEY",
      tagline: "Nature's Bouquet",
      description:
        "A blend of multiple flower nectars, offering diverse nutritional benefits. Perfect for those who want comprehensive wellness support from nature's bounty.",
      image: "/Assets/Tile/T4.jpg",
    },
    {
      id: 11,
      name: "EUCALYPTUS HONEY",
      tagline: "Breath of Life",
      description:
        "Perfect for respiratory support and clear breathing. This soothing blend is ideal for seasonal wellness and maintaining healthy airways naturally.",
      image: "/Assets/Tile/T5.jpg",
    },
    {
      id: 12,
      name: "HIBISCUS HONEY",
      tagline: "Heart Health",
      description:
        "Vibrant and energizing, hibiscus honey supports heart health and provides natural antioxidants. A delicious way to care for your cardiovascular wellness.",
      image: "/Assets/Tile/T6.jpg",
    },
    {
      id: 13,
      name: "APPLE CIDER HONEY",
      tagline: "Detox Blend",
      description:
        "Combining apple cider vinegar with raw honey, this blend supports digestion and detoxification. A powerful wellness tonic for daily use.",
      image: "/Assets/Tile/T1.jpg",
    },
    {
      id: 14,
      name: "BRAHMI HONEY",
      tagline: "Mind & Focus",
      description:
        "An ancient herb combined with honey for enhanced cognitive function and mental clarity. Perfect for students and professionals.",
      image: "/Assets/Tile/T2.jpg",
    },
    {
      id: 15,
      name: "SAFFRON HONEY",
      tagline: "Royal Glow",
      description:
        "A luxurious blend infused with the finest saffron threads. Known for promoting skin health, improving mood, and providing premium wellness support.",
      image: "/Assets/Tile/T3.jpg",
    },
    {
      id: 16,
      name: "FLORAL BLEND",
      tagline: "Pure Essence",
      description:
        "A premium selection of the finest floral honeys combined for ultimate wellness benefits. Perfect for those seeking the best of nature's offerings.",
      image: "/Assets/Tile/T4.jpg",
    },
  ];
  return { props: { WELLNESS_BLENDS } };
}
