import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
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
  selectedAddress: AddressData | undefined;
  setSelectedAddress: Dispatch<SetStateAction<AddressData | undefined>>;
}

const ShippingScreen: React.FC<ShippingScreenProps> = ({
  selectedAddress,
  setSelectedAddress,
}) => {
  console.log({ selectedAddress });
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingAddress, setEditingAddress] = useState<AddressData | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "40px 20px",
      }}
    >
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
