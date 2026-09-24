import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Input from "./Input";
import { constantsApi } from "@/api/constantsApi";
import styles from "@/styles/AdminModal.module.scss";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [showConstantsModal, setShowConstantModal] = useState(false);
  const [constantsData, setConstantsData] = useState({
    freeDelivery: "FALSE",
    deliveryChargeTamilNadu: "0",
    deliveryChargeOutsideTamilNadu: "0",
  });
  const [constants, setConstants] = useState({
    freeDelivery: "FALSE",
    deliveryChargeTamilNadu: "0",
    deliveryChargeOutsideTamilNadu: "0",
  });

  const handleOptionClick = (optionId: string) => {
    onClose();
    if (optionId === "banners") {
      router.push("/admin/manageBanners");
    } else if (optionId === "add-product") {
      router.push("/admin/addProduct");
    } else if (optionId === "edit-product") {
      router.push("/admin/manageProducts");
    } else if (optionId === "orders") {
      router.push("/admin/orders");
    } else if (optionId === "constants") {
      setShowConstantModal(true);
    }
  };

  const getConstants = async () => {
    try {
      const data = await constantsApi.getConstants();

      if (data?.data?.status) {
        const freeDelivery =
          data?.data?.data?.find(
            (consta: any) => consta.name === "FREE_DELIVERY",
          )?.boolean || "FALSE";
        const deliveryChargeTamilNadu =
          data?.data?.data?.find(
            (consta: any) => consta.name === "DELIVERY_CHARGE_TAMILNADU",
          )?.boolean || "0";

        const deliveryChargeOutsideTamilNadu =
          data?.data?.data?.find(
            (consta: any) =>
              consta.name === "DELIVERY_CHARGE_OUTSIDE_TAMILNADU",
          )?.boolean || "0";

        setConstantsData({
          deliveryChargeOutsideTamilNadu,
          deliveryChargeTamilNadu,
          freeDelivery,
        });

        setConstants({
          deliveryChargeOutsideTamilNadu,
          deliveryChargeTamilNadu,
          freeDelivery,
        });
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const saveConstants = async (data: any) => {
    const payload: any = {};

    if (constantsData.freeDelivery !== data.freeDelivery) {
      payload.freeDelivery = String(data.freeDelivery);
    }
    if (
      constantsData.deliveryChargeTamilNadu !== data.deliveryChargeTamilNadu
    ) {
      payload.deliveryChargeTamilNadu = String(data.deliveryChargeTamilNadu);
    }
    if (
      constantsData.deliveryChargeOutsideTamilNadu !==
      data.deliveryChargeOutsideTamilNadu
    ) {
      payload.deliveryChargeOutsideTamilNadu = String(
        data.deliveryChargeOutsideTamilNadu,
      );
    }

    try {
      const resp = await constantsApi.editConstants(payload);
      if (resp?.data?.status) {
        setShowConstantModal(false);
      }
    } catch (er) {
      console.log({ er });
    }
  };

  useEffect(() => {
    if (showConstantsModal) {
      getConstants();
    }
  }, [showConstantsModal]);

  const adminOptions = [
    {
      id: "add-product",
      title: "Add New Product",
      description: "Create and publish new harvest batches to the store",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
          <circle cx="18" cy="18" r="3" fill="#FAF0E6" />
          <line x1="18" y1="16.5" x2="18" y2="19.5" />
          <line x1="16.5" y1="18" x2="19.5" y2="18" />
        </svg>
      ),
    },
    {
      id: "edit-product",
      title: "Manage Products",
      description: "Update catalog, edit details & restore deleted products",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      id: "banners",
      title: "Manage Banners",
      description: "Configure desktop & mobile hero carousel banners",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="0" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <circle cx="8" cy="8" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ),
    },
    {
      id: "orders",
      title: "Customer Orders",
      description: "Inspect customer purchase ledger & fulfillment registry",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      id: "constants",
      title: "Store Constants",
      description: "Configure delivery fees & free shipping rules",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  if (!isOpen && !showConstantsModal) return null;

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Logo & Title */}
            <div className={styles.headerArea}>
              <div style={{ marginBottom: "16px" }}>
                <Image
                  src="https://futurenature.s3.ap-south-1.amazonaws.com/others/logo.png"
                  alt="FutureNature Logo"
                  width={130}
                  height={52}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>

              <span className={styles.categoryTag}>Administration Portal</span>
              <h2 className={styles.title}>Welcome Back, Admin</h2>
              <p className={styles.subtitle}>
                Manage your store settings, catalogue, banners, and fulfillment registry
              </p>
            </div>

            {/* Options Grid */}
            <div className={styles.tilesGrid}>
              {adminOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={styles.tileCard}
                >
                  <div className={styles.tileContent}>
                    <h3 className={styles.tileTitle}>{option.title}</h3>
                    <p className={styles.tileDescription}>{option.description}</p>
                  </div>
                  <div className={styles.tileIcon}>
                    {option.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={styles.footerControls}>
              <button onClick={onClose} className={styles.closeBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STORE CONSTANTS SUBMODAL --- */}
      {showConstantsModal && (
        <div
          className={styles.subModalOverlay}
          onClick={() => setShowConstantModal(false)}
        >
          <div
            className={styles.subModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.subModalHeader}>
              <h3 className={styles.subModalTitle}>Edit Store Constants</h3>
              <button
                onClick={() => setShowConstantModal(false)}
                className={styles.closeIconBtn}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className={styles.subModalBody}>
              <label className={styles.checkboxCard}>
                <input
                  type="checkbox"
                  checked={constants.freeDelivery === "TRUE"}
                  onChange={() =>
                    setConstants((prev) => ({
                      ...prev,
                      freeDelivery:
                        prev.freeDelivery === "TRUE" ? "FALSE" : "TRUE",
                    }))
                  }
                />
                <span>Enable Free Delivery Storewide</span>
              </label>

              <Input
                label="Delivery Charge In Tamil Nadu (₹)"
                name="Delivery Charge In TamilNadu"
                value={constants.deliveryChargeTamilNadu}
                type="number"
                onChange={(e) =>
                  setConstants((prev) => ({
                    ...prev,
                    deliveryChargeTamilNadu: e.target.value,
                  }))
                }
                placeholder="e.g. 50"
                required
              />

              <Input
                label="Delivery Charge Outside Tamil Nadu (₹)"
                name="Delivery Charge Outside TamilNadu"
                value={constants.deliveryChargeOutsideTamilNadu}
                type="number"
                onChange={(e) =>
                  setConstants((prev) => ({
                    ...prev,
                    deliveryChargeOutsideTamilNadu: e.target.value,
                  }))
                }
                placeholder="e.g. 100"
                required
              />
            </div>

            <div className={styles.subModalActions}>
              <button
                onClick={() => setShowConstantModal(false)}
                className={styles.cancelActionBtn}
              >
                Cancel
              </button>
              <button
                onClick={() => saveConstants(constants)}
                className={styles.saveActionBtn}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
