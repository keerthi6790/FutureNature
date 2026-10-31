import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import toast from "react-hot-toast";
import { productApi } from "@/api/productApi";
import apiClient from "@/api/apiClient";
import { isAdminUser } from "@/utils/authUtils";
import Cookies from "js-cookie";
import styles from "@/styles/ManageProducts.module.scss";
import AdminGuard from "@/components/AdminGuard";

interface Product {
  id: string;
  product_name: string;
  product_name_tamil: string;
  imageUrl: string[];
  selling_price: string;
  isDailyDeals: boolean;
  isDeleted?: boolean;
  variants?: {
    id: string;
    name: string;
    selling_price: string;
    available_quantity: number;
  }[];
}

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [showDeleted]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/product/products?includeDeleted=${showDeleted}`,
      );
      if (response.data.status) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDailyDeal = async (product: Product) => {
    try {
      const newStatus = !product.isDailyDeals;
      const response = await productApi.toggleDailyDeal(product.id, newStatus);
      if (response.data.status) {
        toast.success(response.data.message);
        setProducts(
          products.map((p) =>
            p.id === product.id ? { ...p, isDailyDeals: newStatus } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling daily deal:", error);
      toast.error("Failed to update daily deal status");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/addProduct?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await productApi.deleteProduct(id);
        if (response.data.status) {
          toast.success("Product deleted successfully");
          fetchProducts();
        } else {
          toast.error(response.data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await productApi.restoreProduct(id);
      if (response.data.status) {
        toast.success("Product restored successfully");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error restoring product:", error);
      toast.error("Failed to restore product");
    }
  };

  return (
    <AdminGuard>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerTitleSection}>
              <div className={styles.headerTop}>
                <button
                  onClick={() => router.push("/")}
                  className={styles.backBtn}
                >
                  &larr; Back to Home
                </button>
                <label className={styles.deletedCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={showDeleted}
                    onChange={(e) => setShowDeleted(e.target.checked)}
                  />
                  Show Deleted
                </label>
              </div>
              <h1 className={styles.title}>Manage Products</h1>
            </div>

            <div className={styles.headerControls}>
              <button
                onClick={() => router.push("/admin/manageCategories")}
                className={styles.manageCategoriesBtn}
              >
                🏷️ Manage Categories
              </button>
              <button
                onClick={() => router.push("/admin/addProduct")}
                className={styles.addBtn}
              >
                + Add New Product
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingState}>Loading products...</div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>No products found.</div>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.imageArea}>
                    {product.imageUrl?.[0] ? (
                      <Image
                        src={product.imageUrl[0]}
                        alt={product.product_name}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    ) : (
                      <div className={styles.placeholderImage}>No Image</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h2 className={styles.productTitle}>
                      {product.product_name}
                    </h2>
                    <p className={styles.tamilTitle}>
                      {product.product_name_tamil}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                      <span className={styles.price}>
                        ₹{Math.round(parseFloat(product.selling_price))}
                      </span>
                      {product.variants && product.variants.length > 0 && (
                        <span className={styles.variantPill}>
                          {product.variants.length} Variation{product.variants.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className={styles.actions}>
                      {product.isDeleted ? (
                        <button
                          onClick={() => handleRestore(product.id)}
                          className={styles.restoreBtn}
                        >
                          Restore
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggleDailyDeal(product)}
                            className={
                              product.isDailyDeals
                                ? styles.dealBtnActive
                                : styles.dealBtn
                            }
                          >
                            {product.isDailyDeals ? "Remove Deal" : "Add Deal"}
                          </button>
                          <button
                            onClick={() => handleEdit(product.id)}
                            className={styles.editBtn}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
