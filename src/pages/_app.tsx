import { Noto_Sans } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/responsive.css";
import type { AppProps } from "next/app";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { Toaster } from "react-hot-toast";
import AuthModal from "@/components/AuthModal";

import { LoadingProvider } from "@/components/LoadingContext";

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans",
});

function GlobalAuthModal() {
  const { isLoginModalOpen, closeLoginModal, onLoginSuccessCallback } = useAuth();

  return (
    <AuthModal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      onLoginSuccess={onLoginSuccessCallback || undefined}
    />
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <CartProvider>
          <div className={noto_sans.className}>
            <Toaster position="bottom-center" />
            <GlobalAuthModal />
            <Component {...pageProps} />
          </div>
        </CartProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
