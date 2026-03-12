import { useState, useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/styles/Banner.module.scss";
import { Banner as BannerType, bannerApi } from "@/api/bannerApi";
import SkeletonBanner from "./SkeletonBanner";

export default function Banner() {
  const [banners] = useState<BannerType[]>([
    {
      imageUrl:
        "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide2.png",
      isActive: true,
      id: "1",
    },
    {
      imageUrl:
        "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide1.png",
      isActive: true,
      id: "1",
    },
    {
      imageUrl:
        "https://futurenature.s3.ap-south-1.amazonaws.com/banners/Slide3.png",
      isActive: true,
      id: "1",
    },
  ]);

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
    dotsClass: `slick-dots ${styles.customDots}`,
    fade: false,
    cssEase: "ease-in-out",
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className={styles.bannerSlide}>
            <div
              className={styles.bannerCard}
              style={{ padding: 0, width: "100%", position: "relative" }}
            >
              <Image
                src={banner.imageUrl}
                alt="Banner"
                fill
                style={{ objectFit: "cover" }}
                priority
                unoptimized
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
