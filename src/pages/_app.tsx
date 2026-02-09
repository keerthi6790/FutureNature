import "@/styles/globals.css";
import "@/styles/responsive.css";
import type { AppProps } from "next/app";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { Toaster } from "react-hot-toast";
import AuthModal from "@/components/AuthModal";

import { LoadingProvider } from "@/components/LoadingContext";

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
          <Toaster position="bottom-center" />
          <GlobalAuthModal />
          <Component {...pageProps} />
        </CartProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
