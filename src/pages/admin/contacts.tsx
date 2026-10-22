import { userApi } from "@/api/userApi";
import AdminGuard from "@/components/AdminGuard";
import styles from "@/styles/AddProduct.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ContactUser {
  id: string;
  phone_number: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: string;
}

const AdminContacts = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchContacts = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const response = await userApi.getContacts({ page: pageNumber, limit });
      if (response?.data?.status) {
        setContacts(response?.data?.data || []);
        if (response?.data?.pagination) {
          setTotalCount(response.data.pagination.total || 0);
          setTotalPages(response.data.pagination.totalPages || 1);
          setPage(response.data.pagination.page || 1);
        } else {
          const allData = response?.data?.data || [];
          setTotalCount(allData.length);
          setTotalPages(Math.ceil(allData.length / limit) || 1);
        }
      } else {
        toast.error(response?.data?.message || "Failed to load contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  if (loading && contacts.length === 0) {
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
                <span>&larr;</span> Contacts
              </button>
              <p className={styles.subHeader}>View customer contacts</p>
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
              <th className={styles.th}>#</th>
              <th className={styles.th}>Username</th>
              <th className={styles.th}>Phone Number</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr className={styles.tr}>
                <td
                  colSpan={5}
                  className={styles.td}
                  style={{ textAlign: "center", padding: "24px" }}
                >
                  No contacts found
                </td>
              </tr>
            ) : (
              contacts.map((user: ContactUser, index: number) => {
                const username =
                  [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
                  user.firstName ||
                  "N/A";
                const serialNumber = (page - 1) * limit + index + 1;

                return (
                  <tr key={user.id} className={styles.tr}>
                    <td className={styles.td}>{serialNumber}</td>
                    <td className={styles.td}>{username}</td>
                    <td className={styles.td}>{user.phone_number}</td>
                    <td className={styles.td}>{user.email || "N/A"}</td>
                    <td className={styles.td}>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination: show only first 20. If it exceeds 20, add pagination */}
        {totalCount > limit && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              padding: "14px 18px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalCount)} of {totalCount} contacts
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: page === 1 ? "#f3f4f6" : "#ffffff",
                  color: page === 1 ? "#9ca3af" : "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  const isActive = pageNum === page;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: isActive
                          ? "1px solid #fbbf24"
                          : "1px solid #d1d5db",
                        backgroundColor: isActive ? "#fbbf24" : "#ffffff",
                        color: isActive ? "#111827" : "#374151",
                        fontSize: "14px",
                        fontWeight: isActive ? "700" : "500",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                },
              )}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: page === totalPages ? "#f3f4f6" : "#ffffff",
                  color: page === totalPages ? "#9ca3af" : "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
};

export default AdminContacts;
