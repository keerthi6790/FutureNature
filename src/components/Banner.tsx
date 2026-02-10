import { useState, useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/styles/Banner.module.scss";
import { Banner as BannerType, bannerApi } from "@/api/bannerApi";

export default function Banner() {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await bannerApi.getBanners(true);
        if (response.status) {
          setBanners(response.data);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) return null;

  if (banners.length === 0) return null;

  const settings = {
    dots: true,
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
    cssEase: "ease-in-out"
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className={styles.bannerSlide}>
            <div className={styles.bannerCard} style={{ padding: 0, width: "100%", position: "relative" }}>
              <Image
                src={banner.imageUrl}
                alt="Banner"
                fill
                style={{ objectFit: "cover", borderRadius: "1.5em" }}
                priority
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
