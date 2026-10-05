import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/styles/Banner.module.scss";
import { Banner as BannerType, bannerApi } from "@/api/bannerApi";
import SkeletonBanner from "./SkeletonBanner";

export default function Banner() {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const device = isMobile ? "mobile" : "desktop";
        const response = await bannerApi.getBannersByDevice(device);
        if (response.status && response.data && response.data.length > 0) {
          setBanners(response.data);
        } else {
          // Default initial banners aligned with the reference design aesthetic
          setBanners([
            {
              id: "1",
              title: "Nature's Finest Butterfly Pea Flowers",
              desktopImageUrl:
                "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1920&auto=format&fit=crop",
              mobileImageUrl:
                "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop",
              desktopHref: "/products",
              mobileHref: "/products",
              isActive: true,
            },
            {
              id: "2",
              title: "Pure, Raw & Unfiltered Forest Honey",
              desktopImageUrl: "/Assets/Header_Images/Product.png",
              mobileImageUrl: "/Assets/Header_Images/Product.png",
              desktopHref: "/products",
              mobileHref: "/products",
              isActive: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching homepage banners:", error);
        setBanners([
          {
            id: "1",
            title: "Nature's Finest Butterfly Pea Flowers",
            desktopImageUrl: "/Assets/Header_Images/Product.png",
            desktopHref: "/products",
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [isMobile]);

  if (loading) {
    return <SkeletonBanner />;
  }

  if (banners.length === 0) return null;

  const settings = {
    infinite: banners.length > 1,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: banners.length > 1,
    autoplaySpeed: 5500,
    pauseOnHover: true,
    arrows: false,
    dots: banners.length > 1,
    dotsClass: `slick-dots ${styles.customDots}`,
    fade: false,
    cssEase: "ease-in-out",
  };

  const defaultSubtitle =
    "Handpicked and gently dried to preserve their vibrant colour, natural aroma, and purity.";

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {banners.map((banner) => {
          const bannerImg = isMobile
            ? banner.mobileImageUrl ||
              banner.desktopImageUrl ||
              banner.imageUrl ||
              "/Assets/Header_Images/Product.png"
            : banner.desktopImageUrl ||
              banner.imageUrl ||
              "/Assets/Header_Images/Product.png";

          const bannerHref = isMobile
            ? banner.mobileHref || banner.desktopHref || "/products"
            : banner.desktopHref || "/products";

          const headingText =
            banner.title || "Nature's Finest Butterfly Pea Flowers";

          return (
            <div key={banner.id} className={styles.bannerSlide}>
              <div className={styles.bannerCard}>
                {/* Background Hero Image */}
                <Image
                  src={bannerImg}
                  alt={headingText}
                  fill
                  className={styles.bannerImage}
                  priority
                  unoptimized
                />

                {/* Desktop Layout Overlay */}
                {!isMobile ? (
                  <div className={styles.desktopOverlay}>
                    <div className={styles.contentContainer}>
                      <div className={styles.contentWrapper}>
                        <h1 className={styles.mainHeading}>{headingText}</h1>
                        <p className={styles.subHeading}>{defaultSubtitle}</p>
                        <div className={styles.buttonRow}>
                          <Link href={bannerHref} className={styles.primaryCta}>
                            Explore Collection
                          </Link>
                          <Link href="/about" className={styles.secondaryCta}>
                            Our Story
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mobile Layout Overlay */
                  <div className={styles.mobileOverlay}>
                    <div className={styles.mobileContent}>
                      <h1 className={styles.mobileHeading}>{headingText}</h1>
                      <p className={styles.mobileSubHeading}>
                        {defaultSubtitle}
                      </p>
                      <Link href={bannerHref} className={styles.mobileCta}>
                        Shop Now
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
