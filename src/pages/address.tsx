import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import toast,  from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountSidebar from "../components/AccountSidebar";
import { addressApi, AddressData } from "../api/addressApi";
import AddressList from "../components/AddressList";
import AddressForm from "../components/AddressForm";
import styles from "@/styles/Address.module.scss";

export default function AddressPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<AddressData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressData | undefined>(undefined);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await addressApi.getAllAddresses();
            if (response.data.status) {
                setAddresses(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            toast.error("Please login to view addresses");
            router.push('/');
            return;
        }
        fetchAddresses();
    }, []);

    const handleAdd = async (data: AddressData) => {
        try {
            const { id, ...payload } = data; // Ensure id is not sent for add
            const response = await addressApi.addAddress(payload);
            if (response.data.status) {
                toast.success("Address added successfully");
                fetchAddresses();
                setShowForm(false);
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
                fetchAddresses();
                setShowForm(false);
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
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            const response = await addressApi.deleteAddress(id);
            if (response.data.status) {
                toast.success("Address deleted successfully");
                fetchAddresses();
            } else {
                toast.error("Failed to delete address");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting address");
        }
    };

    const openEdit = (address: AddressData) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const openAdd = () => {
        setEditingAddress(undefined);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingAddress(undefined);
    };

    return (
        <div className={styles.pageWrapper}>
            <Head>
                <title>My Addresses | FutureNature</title>
            </Head>
            <Navbar />

            <div className={styles.layoutContainer}>
                <AccountSidebar activeTab="address" />

                <main className={styles.mainContent}>
                    {loading ? (
                        <div className={styles.loadingState}>Loading...</div>
                    ) : showForm ? (
                        <div className={styles.formWrapper}>
                            <h2 className={styles.formTitle}>
                                {editingAddress ? "Edit Address" : "Add New Address"}
                            </h2>
                            <AddressForm
                                initialData={editingAddress}
                                onSubmit={editingAddress ? handleEdit : handleAdd}
                                onCancel={closeForm}
                            />
                        </div>
                    ) : (
                        <AddressList
                            addresses={addresses}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            onAddNew={openAdd}
                        />
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}
