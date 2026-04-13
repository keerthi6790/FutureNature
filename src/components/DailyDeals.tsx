import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartContext";

export default function DailyDeals() {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({
    1: 1,
    2: 1,
    3: 1,
  });
  const products = [
    {
      id: 1,
      name: "Naming Ceremony Honey",
      nameTamil: "(மலை தேன்)",
      image: "/Assets/Products/2.png",
      rating: 4.5,
      weight: "250 gms",
      price: 1300,
      originalPrice: 1000,
      badge: "Daily Deals",
    },
    {
      id: 2,
      name: "Forest Honey",
      nameTamil: "(மலை தேன்)",
      image: "/Assets/Products/1.png",
      rating: 3.5,
      weight: "350 gms",
      price: 1800,
      originalPrice: 1200,
      badge: "Daily Deals",
    },
    {
      id: 3,
      name: "Moringa Atta",
      nameTamil: "(மலை தேன்)",
      image: "/Assets/Products/3.png",
      rating: 3.3,
      weight: "150 gms",
      price: 800,
      originalPrice: 700,
      badge: "Daily Deals",
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} style={{ color: "#10b981", fontSize: "14px" }}>
          ★
        </span>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" style={{ color: "#10b981", fontSize: "14px" }}>
          ★
        </span>,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ color: "#d1d5db", fontSize: "14px" }}>
          ★
        </span>,
      );
    }

    return stars;
  };

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "60px auto",
        padding: "0 24px",
      }}
    >
      {/* Section Header */}
      <h2
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#fbbf24",
          textAlign: "center",
          marginBottom: "50px",
          letterSpacing: "1px",
        }}
      >
        DAILY DEALS
      </h2>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              transition: "all 0.3s",
              cursor: "pointer",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(0, 0, 0, 0.16)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(0, 0, 0, 0.12)";
            }}
          >
            {/* Badge */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                backgroundColor: "white",
                color: "#000",
                padding: "8px 18px",
                borderRadius: "25px",
                fontSize: "13px",
                fontWeight: "500",
                zIndex: 1,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              {product.badge}
            </div>

            {/* Product Image */}
            <div
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                padding: "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "350px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={350}
                  height={350}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))",
                  }}
                />
              </div>
            </div>

            {/* Product Details */}
            <div
              style={{
                padding: "24px 24px 28px",
              }}
            >
              {/* Product Name */}
              <div style={{ marginBottom: "12px" }}>
                <h3
                  style={{
                    fontSize: "19px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: "0 0 6px 0",
                    lineHeight: "1.3",
                  }}
                >
                  {product.name}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  {product.nameTamil}
                </p>
              </div>

              {/* Rating and Weight */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {renderStars(product.rating)}
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#10b981",
                      marginLeft: "2px",
                      fontWeight: "500",
                    }}
                  >
                    {product.rating}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "15px",
                    color: "#374151",
                    fontWeight: "500",
                  }}
                >
                  {product.weight}
                </span>
              </div>

              {/* Price and Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "26px",
                      fontWeight: "700",
                      color: "#111827",
                      lineHeight: "1",
                    }}
                  >
                    ₹ {product.price}
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      color: "#9ca3af",
                      textDecoration: "line-through",
                      marginTop: "4px",
                    }}
                  >
                    ₹{product.originalPrice}
                  </div>
                </div>

                <button
                  style={{
                    backgroundColor: "#fbbf24",
                    color: "#000",
                    border: "none",
                    borderRadius: "10px",
                    padding: "14px 26px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => {
                    addToCart(
                      product.id.toString(),
                      quantities[product.id] || 1,
                    );
                    setQuantities((prev) => ({
                      ...prev,
                      [product.id]: 1,
                    }));
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#000";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fbbf24";
                    e.currentTarget.style.color = "#000";
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
