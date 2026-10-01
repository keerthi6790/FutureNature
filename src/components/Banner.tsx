import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/styles/Banner.module.scss";
import { Banner as BannerType, bannerApi } from "@/api/bannerApi";

const DEFAULT_BANNERS: BannerType[] = [
  {
    id: "default-1",
    desktopImageUrl: "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide2.png",
    mobileImageUrl: "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide2.png",
    isActive: true,
  },
  {
    id: "default-2",
    desktopImageUrl: "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide1.png",
    mobileImageUrl: "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide1.png",
    isActive: true,
  },
  {
    id: "default-3",
    desktopImageUrl: "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide3.png",
    mobileImageUrl: "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide3.png",
    isActive: true,
  },
];

export default function Banner() {
  const [banners, setBanners] = useState<BannerType[]>(DEFAULT_BANNERS);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await bannerApi.getBanners(true);
        if (response && response.status && Array.isArray(response.data) && response.data.length > 0) {
          setBanners(response.data);
        }
      } catch (error) {
        console.error("Error loading banners:", error);
      }
    };
    loadBanners();
  }, []);

  if (banners.length === 0) return null;

  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    dots: true,
    dotsClass: `slick-dots ${styles.customDots}`,
    fade: false,
    cssEase: "ease-in-out",
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {banners.map((banner) => {
          const desktopImg = banner.desktopImageUrl || banner.imageUrl || "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide1.png";
          const mobileImg = banner.mobileImageUrl || desktopImg;

          const content = (
            <div
              className={styles.bannerCard}
              style={{ padding: 0, width: "100%", position: "relative", cursor: banner.desktopHref || banner.mobileHref ? "pointer" : "default" }}
            >
              {/* Desktop Banner Image */}
              <div className={styles.desktopImage} style={{ width: "100%", height: "100%", position: "relative" }}>
                <Image
                  src={desktopImg}
                  alt={banner.title || "FutureNature Banner"}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  unoptimized
                />
              </div>

              {/* Mobile Banner Image */}
              <div className={styles.mobileImage} style={{ width: "100%", height: "100%", position: "relative" }}>
                <Image
                  src={mobileImg}
                  alt={banner.title || "FutureNature Banner"}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  unoptimized
                />
              </div>
            </div>
          );

          return (
            <div key={banner.id} className={styles.bannerSlide}>
              {banner.desktopHref ? (
                <Link href={banner.desktopHref} style={{ display: "block", width: "100%", textDecoration: "none" }}>
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
