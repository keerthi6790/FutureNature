import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCart } from "./CartContext";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";
import AdminPanel from "./AdminPanel";
import { isAdminUser } from "@/utils/authUtils";

export default function Navbar() {
  const router = useRouter();
  const { openLoginModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = Cookies.get("token");
      setIsLoggedIn(!!token);
      setIsAdmin(isAdminUser(token));
    };

    // Check initially
    checkLoginStatus();

    // Check on interval to handle expiration or manual cookie deletion
    const interval = setInterval(checkLoginStatus, 1000);

    // Click outside listener for profile menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          className="navbar-container"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Image
              src="/Assets/logo.png"
              alt="FutureNature Logo"
              width={150}
              height={60}
              className="navbar-logo"
              style={{ objectFit: "contain" }}
            />
          </Link>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "space-around",
              width: "30px",
              height: "24px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              zIndex: 10,
            }}
            aria-label="Toggle menu"
          >
            <span
              style={{
                width: "30px",
                height: "3px",
                background: "#f59e0b",
                borderRadius: "10px",
                transition: "all 0.3s",
                transformOrigin: "1px",
                transform: isMobileMenuOpen ? "rotate(45deg)" : "rotate(0)",
              }}
            />
            <span
              style={{
                width: "30px",
                height: "3px",
                background: "#f59e0b",
                borderRadius: "10px",
                transition: "all 0.3s",
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: "30px",
                height: "3px",
                background: "#f59e0b",
                borderRadius: "10px",
                transition: "all 0.3s",
                transformOrigin: "1px",
                transform: isMobileMenuOpen ? "rotate(-45deg)" : "rotate(0)",
              }}
            />
          </button>

          {/* Navigation Links */}
          <div
            className={`navbar-links ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
            }}
          >
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: router.pathname === "/" ? "#f59e0b" : "#374151",
                fontSize: "16px",
                fontWeight: router.pathname === "/" ? "600" : "500",
                textDecoration: "none",
                transition: "color 0.2s",
                position: "relative",
                paddingBottom: "8px",
                borderBottom:
                  router.pathname === "/"
                    ? "3px solid #f59e0b"
                    : "3px solid transparent",
              }}
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: router.pathname === "/products" ? "#f59e0b" : "#374151",
                fontSize: "16px",
                fontWeight: router.pathname === "/products" ? "600" : "500",
                textDecoration: "none",
                transition: "color 0.2s",
                position: "relative",
                paddingBottom: "8px",
                borderBottom:
                  router.pathname === "/products"
                    ? "3px solid #f59e0b"
                    : "3px solid transparent",
              }}
            >
              Products
            </Link>
            
            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              prefetch
              style={{
                color: router.pathname === "/blog" ? "#f59e0b" : "#374151",
                fontSize: "16px",
                fontWeight: router.pathname === "/blog" ? "600" : "500",
                textDecoration: "none",
                transition: "color 0.2s",
                position: "relative",
                paddingBottom: "8px",
                borderBottom:
                  router.pathname === "/blog"
                    ? "3px solid #f59e0b"
                    : "3px solid transparent",
              }}
            >
              Blog
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: router.pathname === "/wishlist" ? "#f59e0b" : "#374151",
                fontSize: "16px",
                fontWeight: router.pathname === "/wishlist" ? "600" : "500",
                textDecoration: "none",
                transition: "color 0.2s",
                position: "relative",
                paddingBottom: "8px",
                borderBottom:
                  router.pathname === "/wishlist"
                    ? "3px solid #f59e0b"
                    : "3px solid transparent",
              }}
            >
              Wishlist
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: router.pathname === "/about" ? "#f59e0b" : "#374151",
                fontSize: "16px",
                fontWeight: router.pathname === "/about" ? "600" : "500",
                textDecoration: "none",
                transition: "color 0.2s",
                position: "relative",
                paddingBottom: "8px",
                borderBottom:
                  router.pathname === "/about"
                    ? "3px solid #f59e0b"
                    : "3px solid transparent",
              }}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: router.pathname === "/contact" ? "#f59e0b" : "#374151",
                fontSize: "16px",
                fontWeight: router.pathname === "/contact" ? "600" : "500",
                textDecoration: "none",
                transition: "color 0.2s",
                position: "relative",
                paddingBottom: "8px",
                borderBottom:
                  router.pathname === "/contact"
                    ? "3px solid #f59e0b"
                    : "3px solid transparent",
              }}
            >
              Contact Us
            </Link>
          </div>

          {/* Cart and Login - Desktop */}
          <div
            className="navbar-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >

            <Link
              href="/cart"
              className="navbar-cart-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "transparent",
                color: "#000",
                border: "none",
                padding: "0",
                fontSize: "18px",
                fontWeight: "400",
                cursor: "pointer",
                transition: "all 0.2s",
                textDecoration: "none",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Image
                  src="/Assets/Svg/cart.svg"
                  alt="Cart"
                  width={42}
                  height={42}
                />
                {cartItemCount > 0 && (
                  <span
                    className="navbar-cart-badge"
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      backgroundColor: "#f59e0b",
                      color: "white",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="navbar-cart-text">Cart</span>
            </Link>

            <span
              className="navbar-divider"
              style={{ color: "#d1d5db", fontSize: "24px", fontWeight: "300" }}
            >
              |
            </span>

            {isLoggedIn ? (
              <div style={{ position: "relative" }} ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="navbar-login-button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: "transparent",
                    color: "#000",
                    border: "none",
                    padding: "0",
                    fontSize: "18px",
                    fontWeight: "400",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span className="navbar-login-text">Profile</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src="/Assets/Svg/profile.svg"
                      alt="Profile"
                      width={42}
                      height={42}
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "120%",
                      right: 0,
                      width: "200px",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "1px solid #e5e7eb",
                      zIndex: 1001,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: "8px 0" }}>
                      {isAdmin && <div
                        onClick={() => setIsAdminPanelOpen(true)}
                        style={{
                          display: "block",
                          padding: "10px 16px",
                          color: "#374151",
                          textDecoration: "none",
                          fontSize: "15px",
                          transition: "background-color 0.2s",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f3f4f6")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        Admin
                      </div>}
                      <Link
                        href="/orders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "10px 16px",
                          color: "#374151",
                          textDecoration: "none",
                          fontSize: "15px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f3f4f6")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/address"
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "10px 16px",
                          color: "#374151",
                          textDecoration: "none",
                          fontSize: "15px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f3f4f6")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        My Addresses
                      </Link>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 16px",
                          color: "#ef4444",
                          backgroundColor: "transparent",
                          border: "none",
                          fontSize: "15px",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                          borderTop: "1px solid #f3f4f6",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fef2f2")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="navbar-login-button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  backgroundColor: "transparent",
                  color: "#000",
                  border: "none",
                  padding: "0",
                  fontSize: "18px",
                  fontWeight: "400",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <span className="navbar-login-text">Login</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src="/Assets/Svg/profile.svg"
                    alt="Login"
                    width={42}
                    height={42}
                  />
                </div>
              </button>
            )}
          </div>
        </div>

      </nav>
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
      <div className="navbar-spacer" />
    </>
  );
}
