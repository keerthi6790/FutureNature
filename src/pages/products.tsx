import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ViewProduct from "./components/ViewProduct";
import { useCart } from "./components/CartContext";

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

export default function Products() {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: "Cavity Honey",
      nameTamil: "(அருங்குக்கு தேன்)",
      image: "/Assets/Products/3.png",
      rating: 3.5,
      weight: "250 gms",
      price: 1000,
      originalPrice: 1300,
      isBestSeller: true,
      discount: 23,
      description: "Cavity honey is typically harvested directly from the wild with minimal human intervention.",
      descriptionTamil: "குகையில் நேரடியாக இயற்கைப் பாதுகாக்கப்பட்ட மனித குறைந்தபட்ச தலையிடுதலுடன் அறுவடை செய்யப்படும் தேன்.",
      benefits: [
        "The flavor of cavity honey is influenced by the local flora where the bees forage. As a result, it can have a richer, more complex taste compared to farmed honey, often making it a premium choice for honey enthusiasts.",
        "This product goes beyond being just a sweetener. In fact, it supports oral hygiene through natural ingredients, making it ideal for oil pulling or even daily use. Moreover, by promoting gum health and helping prevent tooth decay, it actively contributes to maintaining a healthy mouth with its gentle yet effective properties."
      ],
      benefitsTamil: [
        "குழி தேன் சுவை உள்ளாடாக்கு தளங்களுக்கு வழிநடத்தும் மலர்கள் குறித்துள்ளது. இதனால் விவசாய தேன் ஒப்பிடும்போது ஒரு பணக்கார, முடிவுசெய்யும் சுவை கொடுக்கும், வேளாண்மை நகரங்களை விட பெரும் விருப்பத்தை அளிக்கலாம்.",
        "இந்த தயாரிப்பு இனிப்பு உடல் மட்டுமல்லாமல், உண்மையில், அது இயற்கை பொருட்கள் மூலம் வாய் சுகாதாரத்தையும் ஆதரிக்கிறது, எண்ணெய் இழுப்பிற்கு அல்லது தினமும் உபயோகத்திற்கு சிறந்தது. மேலும், ஈறுகள் நலத்தை மேம்படுத்த மற்றும் பல் அழுக்கு தடுக்கும் முயற்சிகளில், அது நிலையான வாயை பராமரிப்பதற்கு அமைதியான ஆனால் திறமையான பண்புகளால் பங்களிக்கிறது."
      ]
    },
    {
      id: 2,
      name: "Moringa Atta",
      nameTamil: "(முருங்கை கீரை)",
      image: "/Assets/Products/3.png",
      rating: 3.3,
      weight: "100 gms",
      price: 800,
      originalPrice: 1000,
      description: "Fresh moringa flour packed with essential nutrients and minerals for healthy living.",
      descriptionTamil: "ஆரோக்கியமான வாழ்விற்கு அத்தியாவசிய ஊட்டச்சத்து மற்றும் தாது உப்புகள் நிறைந்த புதிய முருங்கை மாவு.",
      benefits: [
        "Rich in vitamins and minerals, supports immune health and overall wellness.",
        "Natural antioxidants help protect cells from damage."
      ],
      benefitsTamil: [
        "வைட்டமின்கள் மற்றும் தாதுக்கள் நிறைந்தது, நோய் எதிர்ப்பு சக்தி மற்றும் ஒட்டுமொத்த நலத்தை ஆதரிக்கிறது.",
        "இயற்கை ஆக்ஸிஜனேற்றிகள் செல்களை சேதத்திலிருந்து பாதுகாக்க உதவுகின்றன."
      ]
    },
    {
      id: 3,
      name: "Moringa Atta",
      nameTamil: "(முருங்கை கீரை)",
      image: "/Assets/Products/3.png",
      rating: 3.5,
      weight: "100 gms",
      price: 800,
      originalPrice: 1000,
      description: "Fresh moringa flour packed with essential nutrients and minerals for healthy living.",
      descriptionTamil: "ஆரோக்கியமான வாழ்விற்கு அத்தியாவசிய ஊட்டச்சத்து மற்றும் தாது உப்புகள் நிறைந்த புதிய முருங்கை மாவு.",
      benefits: [
        "Rich in vitamins and minerals, supports immune health and overall wellness.",
        "Natural antioxidants help protect cells from damage."
      ],
      benefitsTamil: [
        "வைட்டமின்கள் மற்றும் தாதுக்கள் நிறைந்தது, நோய் எதிர்ப்பு சக்தி மற்றும் ஒட்டுமொத்த நலத்தை ஆதரிக்கிறது.",
        "இயற்கை ஆக்ஸிஜனேற்றிகள் செல்களை சேதத்திலிருந்து பாதுகாக்க உதவுகின்றன."
      ]
    }
  ];

  const handleQuantityChange = (productId: number, change: number) => {
    // Removed - no longer needed
  };

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
  };

  const isInCart = (productId: number) => {
    // Removed - no longer needed
    return false;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} style={{ color: '#fbbf24', fontSize: '16px' }}>★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" style={{ color: '#fbbf24', fontSize: '16px' }}>★</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ color: '#d1d5db', fontSize: '16px' }}>★</span>
      );
    }

    return stars;
  };

  return (
    <>
      {selectedProduct ? (
        <ViewProduct 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      ) : (
        <>
          <Head>
            <title>Products - FutureNature</title>
            <meta name="description" content="Browse our natural honey products" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Navbar />

        {/* Hero Section */}
        <div style={{
          backgroundImage: 'url(/Assets/product.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
          padding: '160px 84px',
          marginTop: '0px',
          marginBottom: '80px',
          width: '100%',
          height: '600px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Left Content */}
            <div style={{ maxWidth: '700px' }}>
              <h1 style={{
                fontSize: '64px',
                fontWeight: '900',
                color: 'white',
                margin: '0',
                lineHeight: '1.1',
                textShadow: '3px 3px 10px rgba(0,0,0,0.3)',
                letterSpacing: '2px'
              }}>
                RAW HONEY &<br />HAND CRAFTED
              </h1>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 80px'
        }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: '800',
              color: '#f59e0b',
              marginBottom: '10px',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              OUR PRODUCTS
            </h2>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedProduct(product)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                }}
              >
                {/* Product Image */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '320px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={320}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>

                {/* Product Details */}
                <div style={{
                  padding: '24px'
                }}>
                  {/* Product Name */}
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 4px 0'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {product.nameTamil}
                    </p>
                  </div>

                  {/* Rating and Weight */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {renderStars(product.rating)}
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginLeft: '4px'
                      }}>
                        {product.rating}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      {product.weight}
                    </span>
                  </div>

                  {/* Price */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#111827'
                    }}>
                      ₹ {product.price}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: '#9ca3af',
                      textDecoration: 'line-through'
                    }}>
                      ₹ {product.originalPrice}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f59e0b';
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
        </>
      )}
    </>
  );
}
