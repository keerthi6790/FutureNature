import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface AuthContextType {
  isLoginModalOpen: boolean;
  openLoginModal: (onSuccess?: () => void) => void;
  closeLoginModal: () => void;
  onLoginSuccessCallback: (() => void) | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [onLoginSuccessCallback, setOnLoginSuccessCallback] = useState<
    (() => void) | null
  >(null);

  const openLoginModal = useCallback((onSuccess?: () => void) => {
    if (onSuccess) {
      setOnLoginSuccessCallback(() => onSuccess);
    } else {
      setOnLoginSuccessCallback(null);
    }
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    // Don't clear callback immediately to allow it to run if needed,
    // but typically it runs before close or we clear it after run.
    // For safety, we can clear it after a short delay or let the consumer handle it.
    // Here we'll keep it simple and clear it when opening next time.
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        onLoginSuccessCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
