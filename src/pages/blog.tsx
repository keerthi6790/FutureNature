import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "@/styles/Blog.module.scss";

export interface IBlogItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  redirectionLink?: string | null;
  order?: number;
  isActive?: boolean;
}

export default function Blog({ blogs }: { blogs: IBlogItem[] }) {
  const router = useRouter();

  const handleNavigation = (targetLink?: string | null) => {
    const target = targetLink?.trim() || "/products";
    if (target.startsWith("http://") || target.startsWith("https://")) {
      window.open(target, "_blank", "noopener,noreferrer");
    } else {
      router.push(target);
    }
  };

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
            <h1 className={styles.mainTitle}>
              Nature’s <span className={styles.highlight}>Apothecary</span>
            </h1>
            <div className={styles.heroLine}></div>
            <p className={styles.mainDesc}>
              Pure, handcrafted blends for modern wellness.
            </p>
          </div>
        </header>

        {/* --- 2. COMPACT CARD GRID --- */}
        <section className={styles.catalogSection}>
          <div className={styles.container}>
            {blogs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#6b7280",
                  fontSize: "16px",
                }}
              >
                <p>No wellness blends available right now. Please check back soon!</p>
              </div>
            ) : (
              <div className={styles.cardList}>
                {blogs.map((item, index) => {
                  const isEven = index % 2 === 0;
                  const targetLink = item.redirectionLink?.trim() || "/products";

                  return (
                    <div
                      key={item.id}
                      className={`${styles.productCard} ${
                        isEven ? "" : styles.reverse
                      }`}
                    >
                      {/* Image Side */}
                      <div
                        className={styles.cardMedia}
                        onClick={() => handleNavigation(item.redirectionLink)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className={styles.imgContainer}>
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className={styles.coverImg}
                            sizes="(max-width: 768px) 100vw, 400px"
                            unoptimized
                          />
                        </div>
                      </div>

                      {/* Text Side */}
                      <div className={styles.cardBody}>
                        <div className={styles.cardContent}>
                          <div className={styles.tagRow}>
                            <span className={styles.idBadge}>
                              #{item.order && item.order > 0 ? item.order : index + 1}
                            </span>
                            <span className={styles.categoryTag}>
                              {item.subtitle}
                            </span>
                          </div>

                          <h2 className={styles.cardTitle}>{item.title}</h2>
                          <p className={styles.cardDesc}>{item.description}</p>

                          <div className={styles.cardFooter}>
                            <a
                              href={targetLink}
                              className={styles.shopLink}
                              onClick={(e) => {
                                if (
                                  !targetLink.startsWith("http://") &&
                                  !targetLink.startsWith("https://")
                                ) {
                                  e.preventDefault();
                                  router.push(targetLink);
                                }
                              }}
                              {...(targetLink.startsWith("http")
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                            >
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
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* --- 3. FOOTER CTA --- */}
        <section className={styles.footerCta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>
              Start your journey to better health.
            </h2>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";

  try {
    const response = await fetch(`${apiUrl}/blog`);
    if (response.ok) {
      const result = await response.json();
      if (result?.status && Array.isArray(result?.data)) {
        return {
          props: {
            blogs: result.data,
          },
        };
      }
    }
  } catch (error) {
    console.error("Error fetching blogs in getServerSideProps:", error);
  }

  // Graceful fallback if backend is momentarily unreachable
  return {
    props: {
      blogs: [],
    },
  };
};
