import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useCart } from "./components/CartContext";
import { useState } from "react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Sample product data - in real app, this would come from a database
  const products: { [key: number]: { name: string; price: number; image: string } } = {
    1: { name: "Cavity Honey", price: 1000, image: "/Assets/Products/3.png" },
    2: { name: "Moringa Atta", price: 800, image: "/Assets/Products/3.png" },
    3: { name: "Moringa Atta", price: 800, image: "/Assets/Products/3.png" }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const product = products[item.id];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const salesTax = Math.round(subtotal * 0.09);
  const total = subtotal + salesTax;

  return (
    <>
      <Head>
        <title>Shopping Cart - FutureNature</title>
        <meta name="description" content="Your shopping cart" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <Navbar />

        {/* Cart Container */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 24px',
          minHeight: 'calc(100vh - 80px - 200px)'
        }}>
          {cart.length === 0 ? (
            /* Empty Cart State */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '600px',
              gap: '40px'
            }}>
              {/* Empty Cart Illustration */}
              <div style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg
                  viewBox="0 0 400 300"
                  style={{
                    width: '100%',
                    height: 'auto'
                  }}
                >
                  {/* Background boxes */}
                  <rect x="120" y="100" width="60" height="60" fill="#fef3c7" rx="4" />
                  <rect x="200" y="80" width="70" height="70" fill="#fef3c7" rx="4" />
                  <rect x="130" y="180" width="50" height="50" fill="#fef3c7" rx="4" />
                  <rect x="210" y="190" width="60" height="40" fill="#fef3c7" rx="4" />

                  {/* Large box in center */}
                  <rect x="140" y="120" width="120" height="140" fill="#fbbf24" rx="6" stroke="#f59e0b" strokeWidth="3" />

                  {/* Woman illustration */}
                  <circle cx="200" cy="100" r="12" fill="#000" />
                  <rect x="190" y="115" width="20" height="30" fill="#fff" stroke="#000" strokeWidth="1.5" />
                  <circle cx="185" cy="125" r="5" fill="#000" />
                  <circle cx="215" cy="125" r="5" fill="#000" />
                  <rect x="190" y="150" width="20" height="25" fill="#1f2937" rx="2" />

                  {/* Woman's hand reaching for box */}
                  <path d="M 170 130 Q 160 120 155 115" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="155" cy="115" r="4" fill="#000" />

                  {/* Shelving/warehouse background */}
                  <rect x="90" y="110" width="250" height="2" fill="#d4a574" />
                  <rect x="90" y="140" width="250" height="2" fill="#d4a574" />
                  <rect x="90" y="170" width="250" height="2" fill="#d4a574" />

                  {/* Sun/light rays */}
                  <circle cx="80" cy="50" r="15" fill="#fbbf24" />
                  <line x1="80" y1="20" x2="80" y2="10" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                  <line x1="80" y1="80" x2="80" y2="90" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                  <line x1="50" y1="50" x2="38" y2="50" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                  <line x1="110" y1="50" x2="122" y2="50" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Empty Cart Message */}
              <div style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(24px, 6vw, 36px)',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Your cart is empty
                </h2>
                <p style={{
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Looks like you haven't added any honey products yet. Start shopping and add your favorite items!
                </p>

                {/* Continue Shopping Button */}
                <Link href="/products" style={{
                  display: 'inline-block',
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fbbf24';
                  e.currentTarget.style.color = '#000';
                }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            /* Cart with Items */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px'
            }}>
              {/* Cart Items Section */}
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#f59e0b',
                  marginBottom: '30px',
                  textTransform: 'uppercase'
                }}>
                  Your Cart Items ({cart.length})
                </h2>

                {/* Cart Table */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{
                        borderBottom: '2px solid #e5e7eb',
                        backgroundColor: '#f9fafb'
                      }}>
                        <th style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '700',
                          color: '#111827',
                          fontSize: '14px'
                        }}>
                          Item
                        </th>
                        <th style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '700',
                          color: '#111827',
                          fontSize: '14px',
                          width: '120px'
                        }}>
                          Price
                        </th>
                        <th style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '700',
                          color: '#111827',
                          fontSize: '14px',
                          width: '150px'
                        }}>
                          Quantity
                        </th>
                        <th style={{
                          padding: '16px',
                          textAlign: 'right',
                          fontWeight: '700',
                          color: '#111827',
                          fontSize: '14px',
                          width: '100px'
                        }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, index) => {
                        const product = products[item.id];
                        const itemTotal = product ? product.price * item.quantity : 0;

                        return (
                          <tr key={index} style={{
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            <td style={{
                              padding: '16px',
                              color: '#111827',
                              fontWeight: '500'
                            }}>
                              {product ? product.name : `Product ${item.id}`}
                            </td>
                            <td style={{
                              padding: '16px',
                              color: '#111827',
                              fontWeight: '500'
                            }}>
                              ₹{product ? product.price : 0}
                            </td>
                            <td style={{
                              padding: '16px'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: 'fit-content'
                              }}>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#374151'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                  }}
                                >
                                  −
                                </button>
                                <span style={{
                                  width: '30px',
                                  textAlign: 'center',
                                  backgroundColor: '#e5e7eb',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontWeight: '600',
                                  color: '#111827'
                                }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#374151'
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
                            </td>
                            <td style={{
                              padding: '16px',
                              textAlign: 'right',
                              color: '#111827',
                              fontWeight: '600'
                            }}>
                              ₹{itemTotal}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cart Summary Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 350px',
                gap: '30px',
                width: '100%'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '0px',
                  gridColumn: '1 / -1'
                }}>
                  Order Summary
                </h3>

                {/* Empty left column */}
                <div></div>

                {/* Right side summary box */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {/* Subtotal */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <span style={{
                      color: '#6b7280',
                      fontSize: '14px'
                    }}>
                      Subtotal
                    </span>
                    <span style={{
                      fontWeight: '700',
                      color: '#111827',
                      fontSize: '14px'
                    }}>
                      ₹{subtotal}
                    </span>
                  </div>

                  {/* Sales Tax */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <span style={{
                      color: '#6b7280',
                      fontSize: '14px'
                    }}>
                      Sales Tax
                    </span>
                    <span style={{
                      fontWeight: '700',
                      color: '#111827',
                      fontSize: '14px'
                    }}>
                      ₹{salesTax}
                    </span>
                  </div>

                  {/* Grand Total */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '10px'
                  }}>
                    <span style={{
                      color: '#f59e0b',
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>
                      Grand total
                    </span>
                    <span style={{
                      fontWeight: '700',
                      color: '#f59e0b',
                      fontSize: '16px'
                    }}>
                      ₹{total}
                    </span>
                  </div>

                  {/* Order Button */}
                  <button
                    style={{
                      width: '100%',
                      backgroundColor: '#f59e0b',
                      color: '#000',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginTop: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#d97706';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f59e0b';
                    }}
                  >
                    Order now
                  </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
