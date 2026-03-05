import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { addressApi, AddressData } from "../api/addressApi";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useCart } from "./CartContext";

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Define ArrowLeftIcon component
const ArrowLeftIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// Define the shape of data expected by the Payment component or parent
export interface ShippingFormData {
  firstName: string; // Not in addressData, might need to extract or hardcode
  lastName: string; // Not in addressData
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

interface ShippingScreenProps {
  onContinue?: () => void; // Changed signature as we don't pass data anymore but complete payment
  onClose?: () => void;
}

const ShippingScreen: React.FC<ShippingScreenProps> = ({
  onContinue,
  onClose,
}) => {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingAddress, setEditingAddress] = useState<AddressData | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<
    AddressData | undefined
  >(undefined);
  const router = useRouter();
  const { cartId, clearCart } = useCart();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (token) {
        const response = await addressApi.getAllAddresses();
        if (response.data.status) {
          setAddresses(response.data.data);
          // Auto-select default or first address if available
          //   if (response.data.data.length > 0) {
          //     setSelectedAddress(response.data.data[0]);
          //   }
        }
      }
    } catch (error) {
      console.error("Failed to load addresses", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async (data: AddressData) => {
    try {
      const { id, ...payload } = data;
      const response = await addressApi.addAddress(payload);
      if (response.data.status) {
        toast.success("Address added successfully");
        await fetchAddresses();
        setView("list");
      } else {
        toast.error(response.data.message || "Failed to add address");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding address");
    }
  };

  const handleEdit = async (data: AddressData) => {
    if (!data.id) return;
    try {
      const response = await addressApi.editAddress(data.id, data);
      if (response.data.status) {
        toast.success("Address updated successfully");
        await fetchAddresses();
        setView("list");
        setEditingAddress(undefined);
      } else {
        toast.error(response.data.message || "Failed to update address");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating address");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      const response = await addressApi.deleteAddress(id);
      if (response.data.status) {
        toast.success("Address deleted successfully");
        fetchAddresses();
        if (selectedAddress?.id === id) {
          setSelectedAddress(undefined);
        }
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting address");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cartId) {
      toast.error("Cart not found");
      return;
    }

    setLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const token = Cookies.get("token");
      if (!token) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }

      // Create Order
      const orderUrl = `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`;
      const { data: orderData } = await axios.post(
        orderUrl,
        {
          cartId: cartId,
          currency: "INR",
          addressId: selectedAddress.id, // Pass selected address ID
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!orderData.status) {
        toast.error("Failed to create order");
        setLoading(false);
        return;
      }

      const { amount, id: razorpay_order_id, currency } = orderData.data;
      const internalOrderId = orderData.orderId; // Our internal DB order ID

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "FutureNature",
        description: "Pure Honey & Nature's Best",
        image: "/Assets/futurenature-logo.png",
        order_id: razorpay_order_id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          // Verify Payment
          try {
            const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/payment/verify-payment`;
            const verifyRes = await axios.post(verifyUrl, data, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (verifyRes.data.status) {
              toast.success("Payment Successful!");
              clearCart();
              // Redirect to confirmation page with orderId
              router.push(`/order/confirmation?orderId=${internalOrderId}`);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Payment verification failed");
            console.error(error);
          }
        },
        prefill: {
          name: "Test User",
          email: "test.user@example.com",
          contact: selectedAddress.mobileNumber, // Pre-fill with selected address mobile
        },
        notes: {
          address: `${selectedAddress.address1}, ${selectedAddress.city}`,
        },
        theme: {
          color: "#fbbf24",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong initializing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "40px 20px",
      }}
    >
      <Toaster />
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "1000px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginBottom: "30px",
          gap: "8px",
        }}>
          {onClose && (
            <button
              onClick={() => {
                if (view === "list") {
                  onClose();
                } else {
                  setView("list");
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
                lineHeight: "1",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            >
              <ArrowLeftIcon />
            </button>
          )}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              textAlign: "center",
            }}
          >
            {view === "list"
              ? "SELECT DELIVERY ADDRESS"
              : view === "add"
                ? "ADD NEW ADDRESS"
                : "EDIT ADDRESS"}
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            {/* Spinner or simple text */}
            <p>Processing...</p>
          </div>
        ) : view === "list" ? (
          <>
            {addresses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                  No saved addresses found.
                </p>
                <button
                  onClick={() => {
                    setView("add");
                    setEditingAddress(undefined);
                  }}
                  style={{
                    backgroundColor: "#fbbf24",
                    color: "#000",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Add New Address
                </button>
              </div>
            ) : (
              <AddressList
                addresses={addresses}
                onEdit={(addr) => {
                  setEditingAddress(addr);
                  setView("edit");
                }}
                onDelete={handleDelete}
                onAddNew={() => {
                  setEditingAddress(undefined);
                  setView("add");
                }}
                onSelect={setSelectedAddress}
                selectedId={selectedAddress?.id}
              />
            )}

            {addresses.length > 0 && (
              <button
                onClick={handlePayment} // Trigger payment instead of just continue
                disabled={!selectedAddress}
                style={{
                  width: "100%",
                  backgroundColor: selectedAddress ? "#fbbf24" : "#d1d5db",
                  color: selectedAddress ? "#000" : "#9ca3af",
                  border: "none",
                  padding: "16px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: selectedAddress ? "pointer" : "not-allowed",
                  marginTop: "40px",
                  transition: "all 0.2s",
                  opacity: selectedAddress ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (selectedAddress) {
                    e.currentTarget.style.backgroundColor = "#000";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAddress) {
                    e.currentTarget.style.backgroundColor = "#fbbf24";
                    e.currentTarget.style.color = "#000";
                  }
                }}
              >
                Proceed to Pay
              </button>
            )}
          </>
        ) : (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <AddressForm
              initialData={editingAddress}
              onSubmit={editingAddress ? handleEdit : handleAddNew}
              onCancel={() => {
                setView("list");
                setEditingAddress(undefined);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingScreen;
