import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCart } from "./CartContext";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";
import AdminPanel from "./AdminPanel";
import { isAdminUser } from "@/utils/authUtils";
import { userApi } from "@/api/userApi";

interface IProfileData {
  id: string;
  phone_number: string;
  firstName: string;
  lastName: string;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
  dob: null;
  email: null;
  isWhatsappOptIn: false;
}

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
  const [profileData, setProfileData] = useState<IProfileData | null>(null);

  const getProfileData = async () => {
    try {
      const response = await userApi.getUserData();
      console.log({ response });

      if (response.data.status) {
        setProfileData(response.data.data.user);
        localStorage.setItem("firstName", response.data.data.user.firstName);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getProfileData();
    }
  }, [isLoggedIn]);

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
          backgroundColor: "rgba(250, 240, 230, 0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(139, 134, 128, 0.25)",
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(54, 69, 79, 0.05)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
      >
        <div
          className="navbar-container"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "75px",
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
              src="https://futurenature.s3.ap-south-1.amazonaws.com/others/logo.png"
              alt="FutureNature Logo"
              width={140}
              height={55}
              className="navbar-logo"
              style={{ objectFit: "contain" }}
              priority
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
              width: "32px",
              height: "26px",
              background: "transparent",
              border: "1px solid rgba(139, 134, 128, 0.3)",
              borderRadius: "0px",
              cursor: "pointer",
              padding: "4px",
              zIndex: 10,
            }}
            aria-label="Toggle menu"
          >
            <span
              style={{
                width: "100%",
                height: "2px",
                background: "#A0522D",
                borderRadius: "0px",
                transition: "all 0.3s",
                transformOrigin: "2px",
                transform: isMobileMenuOpen ? "rotate(45deg)" : "rotate(0)",
              }}
            />
            <span
              style={{
                width: "100%",
                height: "2px",
                background: "#A0522D",
                borderRadius: "0px",
                transition: "all 0.3s",
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: "100%",
                height: "2px",
                background: "#A0522D",
                borderRadius: "0px",
                transition: "all 0.3s",
                transformOrigin: "2px",
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
              gap: "36px",
            }}
          >
            {[
              { label: "Home", path: "/" },
              { label: "Products", path: "/products" },
              { label: "Blog", path: "/blog" },
              { label: "Wishlist", path: "/wishlist" },
              { label: "About Us", path: "/about" },
              { label: "Contact Us", path: "/contact" },
            ].map(({ label, path }) => {
              const isActive = router.pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: isActive ? "#A0522D" : "#36454F",
                    fontSize: "17px",
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: "none",
                    transition: "all 0.2s ease-out",
                    position: "relative",
                    paddingBottom: "4px",
                    borderBottom: isActive
                      ? "2px solid #A0522D"
                      : "2px solid transparent",
                    letterSpacing: "0.02em",
                  }}
                >
                  {label}
                </Link>
              );
            })}
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
                gap: "10px",
                backgroundColor: "transparent",
                color: "#36454F",
                border: "none",
                padding: "0",
                fontSize: "17px",
                fontWeight: "500",
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
                  src="https://futurenature.s3.ap-south-1.amazonaws.com/others/cart.svg"
                  alt="Cart"
                  width={36}
                  height={36}
                />
                {cartItemCount > 0 && (
                  <span
                    className="navbar-cart-badge mono-val"
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      backgroundColor: "#A0522D",
                      color: "#FAF0E6",
                      borderRadius: "0px",
                      padding: "1px 5px",
                      minWidth: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 600,
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
              style={{ color: "#8B8680", opacity: 0.4, fontSize: "20px", fontWeight: "300" }}
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
                    gap: "10px",
                    backgroundColor: "transparent",
                    color: "#36454F",
                    border: "none",
                    padding: "0",
                    fontSize: "17px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}
                >
                  <span className="navbar-login-text">
                    {profileData?.firstName || "Account"}
                  </span>
                  <div
                    className="profileWrapper mono-val"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#A0522D",
                      color: "#FAF0E6",
                      borderRadius: "0px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {profileData?.firstName?.[0]?.toUpperCase() || "U"}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "130%",
                      right: 0,
                      width: "200px",
                      backgroundColor: "#FAF0E6",
                      borderRadius: "0px",
                      boxShadow: "0 4px 16px rgba(54, 69, 79, 0.12)",
                      border: "1px solid rgba(139, 134, 128, 0.3)",
                      zIndex: 101,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: "4px 0" }}>
                      {isAdmin && (
                        <div
                          onClick={() => setIsAdminPanelOpen(true)}
                          style={{
                            display: "block",
                            padding: "10px 16px",
                            color: "#36454F",
                            textDecoration: "none",
                            fontSize: "15px",
                            transition: "background-color 0.2s",
                            cursor: "pointer",
                            borderBottom: "1px solid rgba(139, 134, 128, 0.15)",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "rgba(160, 82, 45, 0.08)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "transparent")
                          }
                        >
                          Admin Panel
                        </div>
                      )}
                      <Link
                        href="/orders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "10px 16px",
                          color: "#36454F",
                          textDecoration: "none",
                          fontSize: "15px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(160, 82, 45, 0.08)")
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
                          color: "#36454F",
                          textDecoration: "none",
                          fontSize: "15px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(160, 82, 45, 0.08)")
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
                          color: "#A0522D",
                          backgroundColor: "transparent",
                          border: "none",
                          borderRadius: "0px",
                          fontSize: "15px",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                          borderTop: "1px solid rgba(139, 134, 128, 0.15)",
                          fontFamily: "inherit",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(160, 82, 45, 0.12)")
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
                  gap: "10px",
                  backgroundColor: "transparent",
                  color: "#36454F",
                  border: "none",
                  padding: "0",
                  fontSize: "17px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
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
                    src="https://futurenature.s3.ap-south-1.amazonaws.com/others/profile.svg"
                    alt="Login"
                    width={36}
                    height={36}
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
    </>
  );
}
