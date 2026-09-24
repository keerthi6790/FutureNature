import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { orderApi } from "@/api/orderApi";
import AdminGuard from "@/components/AdminGuard";
import styles from "@/styles/AdminOrders.module.scss";

interface OrderItem {
  id: string;
  productId: string;
  selected_quantity: string;
  total_price: string;
  product?: {
    id: string;
    product_name: string;
    imageUrl?: string[];
    selling_price: string;
  };
}

interface OrderAddress {
  receiverName?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  phone_number?: string;
}

interface Order {
  id: string;
  userId?: string;
  total_price: string;
  mrp_price?: string;
  discounted_price?: string;
  shippingPrice?: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt?: string;
  address?: OrderAddress;
  items?: OrderItem[];
}

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAllOrders();
      if (response?.data?.status) {
        setOrders(response.data.data || []);
      } else {
        toast.error(response?.data?.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      toast.error("Failed to load customer orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Format and clean address components
  const formatAddress = (addr?: OrderAddress) => {
    if (!addr) return "No shipping address attached";
    const parts = [
      addr.address1,
      addr.address2,
      addr.address3,
      addr.address4,
      addr.city,
      addr.district,
      addr.state,
    ].filter((p) => p && p.trim() !== "" && p !== "null" && p !== "undefined");

    const street = parts.join(", ");
    return street ? `${street} - ${addr.pincode || ""}` : (addr.pincode || "—");
  };

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalCount = orders.length;
    const totalRevenue = orders.reduce((acc, order) => {
      const num = parseFloat(order.total_price || "0");
      return acc + (isNaN(num) ? 0 : num);
    }, 0);

    const totalItems = orders.reduce((acc, order) => {
      const itemsCount =
        order.items?.reduce(
          (sum, item) => sum + (parseInt(item.selected_quantity) || 1),
          0,
        ) || 0;
      return acc + itemsCount;
    }, 0);

    const avgOrderValue = totalCount > 0 ? Math.round(totalRevenue / totalCount) : 0;

    return { totalCount, totalRevenue, totalItems, avgOrderValue };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase().trim();

    return orders.filter((order) => {
      const orderIdMatch = order.id.toLowerCase().includes(q);
      const nameMatch = order.address?.receiverName?.toLowerCase().includes(q);
      const phoneMatch = order.address?.phone_number?.toLowerCase().includes(q);
      const cityMatch = order.address?.city?.toLowerCase().includes(q);
      const stateMatch = order.address?.state?.toLowerCase().includes(q);
      const itemMatch = order.items?.some((it) =>
        it.product?.product_name?.toLowerCase().includes(q),
      );

      return (
        orderIdMatch ||
        nameMatch ||
        phoneMatch ||
        cityMatch ||
        stateMatch ||
        itemMatch
      );
    });
  }, [orders, searchQuery]);

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`Copied ${label} to clipboard!`);
    }
  };

  return (
    <AdminGuard>
      <Head>
        <title>Customer Orders - FutureNature Admin</title>
        <meta name="description" content="Manage and view customer orders" />
      </Head>

      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <span className={styles.categoryTag}>Fulfillment & Archives</span>
              <h1 className={styles.title}>Customer Orders</h1>
              <p className={styles.subHeader}>
                Real-time harvest purchases and customer shipping registry
              </p>
            </div>

            <div className={styles.navGroup}>
              <Link href="/admin/manageProducts" className={styles.backBtn}>
                <span>←</span> Manage Products
              </Link>
              <Link href="/admin/manageBanners" className={styles.backBtn}>
                Hero Banners
              </Link>
              <button
                onClick={fetchOrders}
                className={styles.secondaryBtn}
                title="Refresh order records"
              >
                ↻ Refresh Orders
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Total Orders</span>
              <span className={styles.kpiValue}>{stats.totalCount}</span>
              <span className={styles.kpiMeta}>Confirmed paid batches</span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Gross Harvest Revenue</span>
              <span className={styles.kpiValue} style={{ color: "#A0522D" }}>
                ₹{Math.round(stats.totalRevenue).toLocaleString("en-IN")}
              </span>
              <span className={styles.kpiMeta}>Processed through Razorpay</span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Items Dispatched</span>
              <span className={styles.kpiValue}>{stats.totalItems}</span>
              <span className={styles.kpiMeta}>Botanical units reserved</span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Average Order Value</span>
              <span className={styles.kpiValue}>
                ₹{stats.avgOrderValue.toLocaleString("en-IN")}
              </span>
              <span className={styles.kpiMeta}>Per customer basket</span>
            </div>
          </div>

          {/* Controls / Search Bar */}
          <div className={styles.controlsBar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, customer, phone, or product..."
                className={styles.searchInput}
              />
            </div>

            <span className={styles.orderCountText}>
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>

          {/* Content States */}
          {loading ? (
            <div className={styles.stateContainer}>
              <div className={styles.stateIcon}>🏺</div>
              <h2 className={styles.stateTitle}>Loading Order Records...</h2>
              <p className={styles.stateDesc}>
                Retrieving harvest fulfillment history from the secure ledger.
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.stateContainer}>
              <div className={styles.stateIcon}>📜</div>
              <h2 className={styles.stateTitle}>
                {searchQuery ? "No Matching Orders Found" : "No Orders Placed Yet"}
              </h2>
              <p className={styles.stateDesc}>
                {searchQuery
                  ? "Try searching with a different term or clear the filter."
                  : "Customer orders will appear here once purchases are completed."}
              </p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer</th>
                    <th>Delivery Destination</th>
                    <th>Harvest Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Placed Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const shortId = order.id.slice(0, 8).toUpperCase();
                    const phone = order.address?.phone_number || "—";
                    const receiver = order.address?.receiverName || "Valued Customer";
                    const formattedAddr = formatAddress(order.address);

                    return (
                      <tr key={order.id}>
                        {/* Order ID */}
                        <td>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(order.id, "Order ID")}
                            className={styles.orderIdBadge}
                            title="Click to copy full UUID"
                          >
                            <span>#{shortId}</span>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                        </td>

                        {/* Customer */}
                        <td>
                          <p className={styles.customerName}>{receiver}</p>
                          <p className={styles.customerPhone}>{phone}</p>
                        </td>

                        {/* Address */}
                        <td>
                          <div className={styles.addressBlock}>
                            <span>{formattedAddr}</span>
                          </div>
                        </td>

                        {/* Items */}
                        <td>
                          <div className={styles.itemPillGroup}>
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, idx) => (
                                <div key={item.id || idx} className={styles.itemPill}>
                                  <img
                                    src={
                                      item.product?.imageUrl?.[0] ||
                                      "/Assets/Products/15.png"
                                    }
                                    alt={item.product?.product_name || "Product"}
                                    className={styles.itemImg}
                                  />
                                  <span className={styles.itemName}>
                                    {item.product?.product_name || "Harvest Blend"}
                                  </span>
                                  <span className={styles.itemQty}>
                                    × {item.selected_quantity}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <span style={{ color: "#8B8680", fontStyle: "italic" }}>
                                Direct harvest purchase
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td>
                          <span className={styles.amountText}>
                            ₹{Math.round(parseFloat(order.total_price || "0"))}
                          </span>
                        </td>

                        {/* Payment Status */}
                        <td>
                          <span className={styles.statusPaid}>
                            ● {order.paymentStatus || "PAID"}
                          </span>
                        </td>

                        {/* Placed Date */}
                        <td>
                          <span className={styles.timestampText}>
                            {formatDate(order.createdAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className={styles.viewBtn}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <span className={styles.categoryTag}>Harvest Receipt</span>
                  <h3 className={styles.modalTitle}>
                    Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className={styles.closeModalBtn}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* Order Meta Card */}
                <div className={styles.modalCard}>
                  <h4 className={styles.modalSectionTitle}>Customer & Dispatch Details</h4>
                  <p style={{ margin: "0 0 6px 0", fontSize: "1.1rem", fontWeight: 700, color: "#36454F" }}>
                    {selectedOrder.address?.receiverName || "Valued Customer"}
                  </p>
                  <p style={{ margin: "0 0 4px 0", fontFamily: "'JetBrains Mono', monospace", color: "#8B8680" }}>
                    📞 Contact: {selectedOrder.address?.phone_number || "—"}
                  </p>
                  <p style={{ margin: "0 0 8px 0", color: "#36454F", lineHeight: "1.5" }}>
                    📍 {formatAddress(selectedOrder.address)}
                  </p>
                  <div style={{ display: "flex", gap: "16px", marginTop: "12px", borderTop: "1px solid rgba(139, 134, 128, 0.15)", paddingTop: "8px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#8B8680", fontFamily: "'JetBrains Mono', monospace" }}>
                      Date: {formatDate(selectedOrder.createdAt)}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7B3A", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                      Payment: {selectedOrder.paymentStatus || "PAID"} (Razorpay)
                    </span>
                  </div>
                </div>

                {/* Items List Card */}
                <div className={styles.modalCard}>
                  <h4 className={styles.modalSectionTitle}>Ordered Harvest Items</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {selectedOrder.items?.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid rgba(139, 134, 128, 0.12)",
                          paddingBottom: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={
                              item.product?.imageUrl?.[0] ||
                              "/Assets/Products/15.png"
                            }
                            alt={item.product?.product_name || "Product"}
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "contain",
                              backgroundColor: "#FAF0E6",
                              border: "1px solid rgba(139, 134, 128, 0.25)",
                              padding: "2px",
                            }}
                          />
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: "#36454F" }}>
                              {item.product?.product_name || "Artisan Blend"}
                            </p>
                            <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#8B8680" }}>
                              Quantity: {item.selected_quantity}
                            </p>
                          </div>
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#A0522D" }}>
                          ₹{item.total_price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {selectedOrder.mrp_price && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#8B8680", fontSize: "0.95rem" }}>
                        <span>Subtotal (MRP)</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>₹{selectedOrder.mrp_price}</span>
                      </div>
                    )}
                    {selectedOrder.discounted_price && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#6B7B3A", fontSize: "0.95rem" }}>
                        <span>Discount Applied</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>-₹{selectedOrder.discounted_price}</span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px dashed rgba(139, 134, 128, 0.3)",
                        paddingTop: "10px",
                        marginTop: "6px",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#36454F",
                      }}
                    >
                      <span>Grand Total</span>
                      <span style={{ color: "#A0522D", fontFamily: "'JetBrains Mono', monospace" }}>
                        ₹{selectedOrder.total_price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    style={{
                      backgroundColor: "#36454F",
                      color: "#FAF0E6",
                      border: "1px solid #36454F",
                      padding: "10px 24px",
                      borderRadius: "0px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
