import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import AuthModal from "./AuthModal";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
  
  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}>
          <Image 
            src="/Assets/logo.png" 
            alt="FutureNature Logo" 
            width={150} 
            height={60}
            style={{ objectFit: 'contain' }}
          />
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px'
        }}>
          <Link href="/" style={{
            color: router.pathname === '/' ? '#f59e0b' : '#374151',
            fontSize: '16px',
            fontWeight: router.pathname === '/' ? '600' : '500',
            textDecoration: 'none',
            transition: 'color 0.2s',
            position: 'relative',
            paddingBottom: '8px',
            borderBottom: router.pathname === '/' ? '3px solid #f59e0b' : '3px solid transparent'
          }}>
            Home
          </Link>
          <Link href="/products" style={{
            color: router.pathname === '/products' ? '#f59e0b' : '#374151',
            fontSize: '16px',
            fontWeight: router.pathname === '/products' ? '600' : '500',
            textDecoration: 'none',
            transition: 'color 0.2s',
            position: 'relative',
            paddingBottom: '8px',
            borderBottom: router.pathname === '/products' ? '3px solid #f59e0b' : '3px solid transparent'
          }}>
            Products
          </Link>
          <Link href="/blog" style={{
            color: router.pathname === '/blog' ? '#f59e0b' : '#374151',
            fontSize: '16px',
            fontWeight: router.pathname === '/blog' ? '600' : '500',
            textDecoration: 'none',
            transition: 'color 0.2s',
            position: 'relative',
            paddingBottom: '8px',
            borderBottom: router.pathname === '/blog' ? '3px solid #f59e0b' : '3px solid transparent'
          }}>
            Blog
          </Link>
          <Link href="/about" style={{
            color: router.pathname === '/about' ? '#f59e0b' : '#374151',
            fontSize: '16px',
            fontWeight: router.pathname === '/about' ? '600' : '500',
            textDecoration: 'none',
            transition: 'color 0.2s',
            position: 'relative',
            paddingBottom: '8px',
            borderBottom: router.pathname === '/about' ? '3px solid #f59e0b' : '3px solid transparent'
          }}>
            About Us
          </Link>
          <Link href="/contact" style={{
            color: router.pathname === '/contact' ? '#f59e0b' : '#374151',
            fontSize: '16px',
            fontWeight: router.pathname === '/contact' ? '600' : '500',
            textDecoration: 'none',
            transition: 'color 0.2s',
            position: 'relative',
            paddingBottom: '8px',
            borderBottom: router.pathname === '/contact' ? '3px solid #f59e0b' : '3px solid transparent'
          }}>
            Contact Us
          </Link>
        </div>

        {/* Cart and Login */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <Link href="/cart" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'transparent',
            color: '#000',
            border: 'none',
            padding: '0',
            fontSize: '18px',
            fontWeight: '400',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textDecoration: 'none',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Image
                src="/Assets/Svg/cart.svg"
                alt="Cart"
                width={42}
                height={42}
              />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {cartItemCount}
                </span>
              )}
            </div>
            Cart
          </Link>
          
          <span style={{ color: '#d1d5db', fontSize: '24px', fontWeight: '300' }}>|</span>
          
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'transparent',
            color: '#000',
            border: 'none',
            padding: '0',
            fontSize: '18px',
            fontWeight: '400',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Login
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                src="/Assets/Svg/profile.svg"
                alt="Login"
                width={42}
                height={42}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
