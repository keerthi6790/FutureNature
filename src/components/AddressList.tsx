import { useState, useRef, useEffect } from "react";
import { AddressData } from "../api/addressApi";
import styles from "@/styles/AddressList.module.scss";

interface AddressListProps {
    addresses: AddressData[];
    onEdit: (address: AddressData) => void;
    onDelete: (id: string) => void;
    onAddNew: () => void;
    onSelect?: (address: AddressData) => void;
    selectedId?: string;
}

const PlusIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const LocationIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PhoneIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const MoreIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
);

const EditIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const DeleteIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const EmptyIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

interface MoreOptionsProps {
    address: AddressData;
    onEdit: () => void;
    onDelete: () => void;
}

function MoreOptions({ address, onEdit, onDelete }: MoreOptionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={styles.moreOptions} ref={dropdownRef}>
            <button
                className={`${styles.moreButton} ${isOpen ? styles.active : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="More options"
            >
                <MoreIcon />
            </button>

            <div className={`${styles.dropdown} ${isOpen ? styles.open : ""}`}>
                <button
                    className={styles.dropdownItem}
                    onClick={() => {
                        onEdit();
                        setIsOpen(false);
                    }}
                >
                    <EditIcon />
                    <span>Edit</span>
                </button>
                <button
                    className={`${styles.dropdownItem} ${styles.delete}`}
                    onClick={() => {
                        onDelete();
                        setIsOpen(false);
                    }}
                >
                    <DeleteIcon />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
}

export default function AddressList({ addresses, onEdit, onDelete, onAddNew, onSelect, selectedId }: AddressListProps) {
    if (addresses.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>My Addresses</h2>
                    <button className={styles.addButton} onClick={onAddNew}>
                        <PlusIcon />
                        <span>Add New Address</span>
                    </button>
                </div>

                <div className={styles.emptyState}>
                    <EmptyIcon />
                    <h3>No Addresses Yet</h3>
                    <p>Add your first address to get started</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>My Addresses</h2>
                <button className={styles.addButton} onClick={onAddNew}>
                    <PlusIcon />
                    <span>Add New Address</span>
                </button>
            </div>

            <div className={styles.addressList}>
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={`${styles.addressItem} ${selectedId === addr.id ? styles.selected : ""}`}
                        onClick={() => onSelect?.(addr)}
                        style={{ cursor: onSelect ? "pointer" : "default" }}
                    >
                        <div className={styles.addressContent}>
                            <div className={styles.addressHeader}>
                                <div className={styles.addressIcon}>
                                    <LocationIcon />
                                </div>
                                <span className={styles.addressLabel}>{addr.label || "Home"}</span>
                            </div>

                            <div className={styles.addressDetails}>
                                {addr.receiverName && (
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>
                                        {addr.receiverName}
                                    </h3>
                                )}
                                <p className={styles.mainAddress}>
                                    {addr.address1}, {addr.address2}
                                </p>
                                <p className={styles.subAddress}>
                                    {addr.address3 && `${addr.address3}, `}
                                    {addr.city}, {addr.district}
                                </p>
                                <p className={styles.subAddress}>
                                    {addr.state} - {addr.pincode}
                                </p>
                                <p className={styles.phone}>
                                    <PhoneIcon />
                                    <strong>Phone:</strong> {addr.mobileNumber}
                                </p>
                            </div>
                        </div>

                        <MoreOptions
                            address={addr}
                            onEdit={() => onEdit(addr)}
                            onDelete={() => addr.id && onDelete(addr.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
