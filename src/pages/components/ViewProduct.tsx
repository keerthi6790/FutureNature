import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useCart } from "./CartContext";

interface Product {
  id: number;
  name: string;
  nameTamil: string;
  image: string;
  rating: number;
  weight: string;
  price: number;
  originalPrice: number;
  description: string;
  descriptionTamil: string;
  benefits: string[];
  benefitsTamil: string[];
  isBestSeller?: boolean;
  discount?: number;
}

interface ViewProductProps {
  product: Product;
  onClose: () => void;
}

export default function ViewProduct({ product, onClose }: ViewProductProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("250 gms");

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setQuantity(1);
  };

  const handleShare = () => {
    console.log("Sharing product");
    // Add share logic here
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ color: '#d1d5db', fontSize: '18px' }}>★</span>
      );
    }

    return stars;
  };

  return (
    <>
      <Head>
        <title>{product.name} - FutureNature</title>
        <meta name="description" content={product.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Navbar />

        {/* Product Detail Section */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '100px 24px 80px'
        }}>
          {/* Back Button */}
          <button
            onClick={onClose}
            style={{
              marginBottom: '30px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ← Back to Products
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '60px',
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            {/* Left Column - Product Image */}
            <div style={{
              position: 'relative'
            }}>
              {/* Best Seller Badge */}
              {product.isBestSeller && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  backgroundColor: '#111827',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  zIndex: 10,
                  letterSpacing: '0.5px'
                }}>
                  Most seller
                </div>
              )}

              <div style={{
                backgroundColor: '#fef3c7',
                borderRadius: '16px',
                padding: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                minHeight: '500px'
              }}>
                {/* Decorative bees */}
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  left: '40px',
                  fontSize: '24px'
                }}>
                  🐝
                </div>
                <div style={{
                  position: 'absolute',
                  top: '60px',
                  right: '60px',
                  fontSize: '20px'
                }}>
                  🐝
                </div>

                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={500}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {/* Product Title */}
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 8px 0',
                  lineHeight: '1.2'
                }}>
                  {product.name}
                </h1>
                <p style={{
                  fontSize: '20px',
                  color: '#6b7280',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {product.nameTamil}
                </p>
              </div>

              {/* Weight Selection */}
              <div>
                <button
                  style={{
                    backgroundColor: '#fbbf24',
                    color: '#111827',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f59e0b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fbbf24';
                  }}
                >
                  {selectedWeight}
                </button>
              </div>

              {/* Price Section */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  ₹{product.price}
                </div>
                <div style={{
                  fontSize: '20px',
                  color: '#9ca3af',
                  textDecoration: 'line-through'
                }}>
                  ₹{product.originalPrice}
                </div>
                {product.discount && (
                  <div style={{
                    color: '#10b981',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {product.discount}% Discount
                  </div>
                )}
              </div>

              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {renderStars(product.rating)}
                </div>
                <span style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {product.rating}
                </span>
              </div>

              {/* Description */}
              <div style={{
                paddingTop: '8px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  {product.description}
                </p>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#6b7280',
                  margin: 0,
                  fontFamily: 'Arial, sans-serif'
                }}>
                  {product.descriptionTamil}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: '#374151',
                  margin: '0 0 8px 0'
                }}>
                  {product.benefits.join(' ')}
                </p>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#6b7280',
                  margin: 0,
                  fontFamily: 'Arial, sans-serif'
                }}>
                  {product.benefitsTamil.join(' ')}
                </p>
              </div>

              {/* Quantity Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Quantity
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    style={{
                      backgroundColor: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    -
                  </button>
                  <div style={{
                    padding: '10px 28px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    backgroundColor: 'white',
                    borderLeft: '2px solid #e5e7eb',
                    borderRight: '2px solid #e5e7eb',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    style={{
                      backgroundColor: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '8px'
              }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    backgroundColor: '#fbbf24',
                    color: '#111827',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f59e0b';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fbbf24';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleShare}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d97706';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f59e0b';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
