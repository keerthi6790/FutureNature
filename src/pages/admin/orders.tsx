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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAllOrders();
      console.log({ response });
      if (response?.data?.status) {
        setOrders(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product data");
    } finally {
      setLoading(false);
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
          <tr className={styles.tr}>
            <th className={styles.th}>Order No</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Address</th>
            <th className={styles.th}>Phone Number</th>
            <th className={styles.th}>order Items</th>
            <th className={styles.th}>Total amount</th>
            <th className={styles.th}>Timestamp</th>
          </tr>
          {orders.map((order: any) => {
            const {
              address1,
              address2,
              address3,
              address4,
              city,
              district,
              state,
              phone_number,
            } = order?.address;

            const orderItems = order?.items?.map(
              (item: any) =>
                `${item?.product?.product_name}(${item.selected_quantity}qty)`,
            );
            return (
              <tr className={styles.tr}>
                <td className={styles.td}>{order?.id}</td>
                <td className={styles.td}>{order?.address?.receiverName}</td>
                <td
                  className={styles.td}
                >{`${address1}, ${address2}, ${address3}, ${address4}, ${city}, ${district}, ${state}`}</td>
                <td className={styles.td}>{phone_number}</td>
                <td className={styles.td}>{orderItems?.join(", ")}</td>
                <td className={styles.td}>{order?.total_price}</td>
                <td className={styles.td}>{order?.createdAt}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </AdminGuard>
  );
};

export default AdminOrders;
