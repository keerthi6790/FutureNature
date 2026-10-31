import { orderApi } from "@/api/orderApi";
import AdminGuard from "@/components/AdminGuard";
import styles from "@/styles/AddProduct.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAllOrders();
      console.log({ response });
      if (response?.data?.status) {
        setOrders(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load order data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await orderApi.updateOrderStatus(orderId, newStatus);
      if (response?.data?.status) {
        toast.success("Order status updated successfully");
        setOrders((prevOrders: any[]) =>
          prevOrders.map((order: any) =>
            order.id === orderId ? { ...order, order_status: newStatus } : order,
          ),
        );
      } else {
        toast.error(response?.data?.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminGuard>
      <div className={styles.pageWrapper}>
        {/* Header */}
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <button
                onClick={() => router.push("/admin/manageProducts")}
                className={styles.backBtn}
              >
                <span>&larr;</span> Orders
              </button>
              <p className={styles.subHeader}>View your orders</p>
            </div>
            <div className={styles.btnGroup}>
              <button
                onClick={() => router.push("/")}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Order No</th>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Address</th>
              <th className={styles.th}>Phone Number</th>
              <th className={styles.th}>order Items</th>
              <th className={styles.th}>Total amount</th>
              <th className={styles.th}>Timestamp</th>
              <th className={styles.th}>order_status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => {
              const {
                address1,
                address2,
                address3,
                address4,
                city,
                district,
                state,
                pincode,
                phone_number,
              } = order?.address || {};

              const orderItems = order?.items?.map(
                (item: any) =>
                  `${item?.product?.product_name}${item?.variant?.name ? ` [${item.variant.name}]` : ""}(${item.selected_quantity}qty)`,
              );
              return (
                <tr key={order?.id} className={styles.tr}>
                  <td className={styles.td}>{order?.id}</td>
                  <td className={styles.td}>{order?.address?.receiverName}</td>
                  <td
                    className={styles.td}
                  >{`${address1 || ""}, ${address2 || ""}, ${address3 || ""}, ${address4 || ""}, ${city || ""}, ${district || ""}, ${state || ""} ${pincode || ""}`}</td>
                  <td className={styles.td}>{phone_number}</td>
                  <td className={styles.td}>{orderItems?.join(", ")}</td>
                  <td className={styles.td}>{order?.total_price}</td>
                  <td className={styles.td}>{order?.createdAt}</td>
                  <td className={styles.td}>
                    <select
                      name="order_status"
                      value={(order?.order_status || "pending").toLowerCase()}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#fff",
                        color: "#111827",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: updatingId === order.id ? "not-allowed" : "pointer",
                        outline: "none",
                      }}
                    >
                      <option value="pending">pending</option>
                      <option value="shipped">shipped</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminGuard>
  );
};

export default AdminOrders;
