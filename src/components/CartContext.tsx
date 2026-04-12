import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { cartApi } from "@/api/cartApi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { AddressData } from "@/api/addressApi";

export interface CartItem {
  id: string; // Product ID
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
  cartItemId?: string; // Backend CartItem ID
}

interface CartContextType {
  cart: CartItem[];
  totalPrice: string | null;
  shippingPrice: string | null;
  address: AddressData | null;
  cartId: string | null;
  addToCart: (
    productId: string,
    quantity: number,
    productDetails?: Partial<CartItem>,
  ) => Promise<void>;
  updateAddress: (addressId: string) => Promise<void>;
  removeFromCart: (productId: string, cartItemId?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export interface BackendCartItem {
  id: string;
  selected_quantity: string;
  total_price: string;
  discounted_price: string;
  mrp_price: string;
  cartId: string;
  productId: string;
  product: {
    id: string;
    product_name: string;
    imageUrl: string[];
    selling_price: string;
  };
}

const mapBackendItemToCartItem = (item: BackendCartItem): CartItem => ({
  id: item.productId,
  quantity: parseInt(item.selected_quantity),
  name: item.product.product_name,
  price: parseFloat(item.product.selling_price),
  image: item.product.imageUrl[0] || "",
  cartItemId: item.id,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [shippingPrice, setShippingPrice] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState("0");
  const { openLoginModal } = useAuth();

  const fetchBackendCart = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const response = await cartApi.getCart();
        if (response.data.status) {
          const backendCart = response.data.data;
          const newCartId =
            response.data.cartId || (backendCart ? backendCart.id : null);
          setCartId(newCartId === "0" ? null : newCartId);
          setAddress(response.data.data.address || null);
          setShippingPrice(response.data.data.shippingPrice);
          setTotalPrice(response.data.data.total_price);

          if (backendCart) {
            const mappedItems: CartItem[] = backendCart.cart_item.map(
              mapBackendItemToCartItem,
            );
            setCart(mappedItems);
          } else {
            setCart([]);
          }
        }
      } catch (error) {
        console.error("Error fetching backend cart:", error);
      }
    } else {
      setCart([]);
      setCartId(null);
    }
  };

  // Fetch cart from backend if logged in
  useEffect(() => {
    fetchBackendCart();
  }, []);

  const addToCart = async (
    productId: string,
    quantity: number,
    productDetails?: Partial<CartItem>,
  ) => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const response = await cartApi.addToCart({
          productId,
          cartId: cartId || undefined,
        });

        if (response.data.status) {
          const newCartId =
            response.data.cartId ||
            (response.data.data ? response.data.data.id : cartId);
          setCartId(newCartId === "0" ? null : newCartId);

          const allCartResponse = await cartApi.getCart();
          if (allCartResponse.data.status) {
            const backendCart = allCartResponse.data.data;
            const syncCartId =
              allCartResponse.data.cartId ||
              (backendCart ? backendCart.id : null);
            setCartId(syncCartId === "0" ? null : syncCartId);

            if (backendCart) {
              const mappedItems: CartItem[] = backendCart.cart_item.map(
                mapBackendItemToCartItem,
              );
              setCart(mappedItems);
            } else {
              setCart([]);
            }
          }
          toast.success("Added to cart");
        }
      } catch (error) {
        console.error("Error adding to backend cart:", error);
        toast.error("Failed to sync with server");
      }
    } else {
      // Not logged in, open login modal with callback
      openLoginModal(() => {
        // This callback runs after successful login
        addToCart(productId, quantity, productDetails);
      });
    }
  };

  const removeFromCart = async (productId: string, cartItemId?: string) => {
    const token = Cookies.get("token");

    if (token && cartId) {
      try {
        const response = await cartApi.deleteCartItem({
          cartItemId: cartItemId || productId, // Fallback to productId if cartItemId not provided
          cartId: cartId,
        });

        if (response.data.status) {
          const newCartId = response.data.cartId;
          setCartId(newCartId === "0" ? null : newCartId);

          setCart((prevCart) =>
            prevCart.filter((item) => item.id !== productId),
          );
          toast.success("Removed from cart");
        }
      } catch (error) {
        console.error("Error removing from backend cart:", error);
        toast.error("Failed to sync with server");
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const token = Cookies.get("token");

    if (token && cartId) {
      if (quantity <= 0) {
        const item = cart.find((i) => i.id === productId);
        await removeFromCart(productId, item?.cartItemId);
        return;
      }

      try {
        const item = cart.find((i) => i.id === productId);
        const response = await cartApi.updateQuantity({
          cartId,
          cartItemId: item?.cartItemId || productId, // Fallback to productId
          quantity,
        });

        if (response.data.status) {
          const backendCart = response.data.data;
          if (backendCart) {
            const mappedItems: CartItem[] = backendCart.cart_item.map(
              mapBackendItemToCartItem,
            );
            setCart(mappedItems);
            setAddress(response.data.data.address || null);
            setShippingPrice(response.data.data.shippingPrice);
            setTotalPrice(response.data.data.total_price);
          }
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
      }
    } else {
      // Local state update for guests (if applicable) or if cartId missing
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const updateAddress = async (addressId: any) => {
    const token = Cookies.get("token");

    console.log({ addressId });

    if (token && cartId) {
      try {
        const response = await cartApi.updateAddress({
          cartId,
          addressId: addressId,
        });

        if (response?.data?.status) {
          fetchBackendCart();
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
      }
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartId(null);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        totalPrice,
        cart,
        address,
        shippingPrice,
        cartId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateAddress,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
