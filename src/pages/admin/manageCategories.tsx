import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import toast from "react-hot-toast";
import { categoryApi, ICategory } from "@/api/categoryApi";
import { productApi } from "@/api/productApi";
import AdminGuard from "@/components/AdminGuard";
import styles from "@/styles/ManageCategories.module.scss";

interface ProductItem {
  id: string;
  product_name: string;
  product_name_tamil?: string;
  imageUrl?: string[];
  selling_price?: string;
  categoryId?: string | null;
  category?: {
    id?: string;
    category_name?: string;
    name?: string;
  } | null;
}

export default function ManageCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assign Products Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningCategory, setAssigningCategory] = useState<ICategory | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        categoryApi.getAllCategories(),
        productApi.getAllProducts(),
      ]);

      if (catRes.data?.status) {
        setCategories(catRes.data.data || []);
      }
      if (prodRes.data?.status) {
        setProducts(prodRes.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories or products:", error);
      toast.error("Failed to load categories or products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage("");
    setShowCategoryModal(true);
  };

  const handleOpenEditModal = (category: ICategory) => {
    setEditingCategory(category);
    setCategoryName(category.name || category.category_name || "");
    setCategoryImage(category.image_url || category.category_image || "");
    setShowCategoryModal(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCategoryImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: categoryName.trim(),
        categoryName: categoryName.trim(),
        image_url: categoryImage || null,
        categoryImage: categoryImage || null,
      };

      if (editingCategory) {
        const res = await categoryApi.updateCategory(editingCategory.id, payload);
        if (res.data?.status) {
          toast.success("Category updated successfully!");
          setShowCategoryModal(false);
          fetchData();
        } else {
          toast.error(res.data?.message || "Failed to update category");
        }
      } else {
        const res = await categoryApi.addCategory(payload);
        if (res.data?.status) {
          toast.success("Category created successfully!");
          setShowCategoryModal(false);
          fetchData();
        } else {
          toast.error(res.data?.message || "Failed to create category");
        }
      }
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Products in this category will become unassigned.`)) {
      return;
    }

    try {
      const res = await categoryApi.deleteCategory(id);
      if (res.data?.status) {
        toast.success("Category deleted successfully!");
        fetchData();
      } else {
        toast.error(res.data?.message || "Failed to delete category");
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  // Open Assign Products Modal
  const handleOpenAssignModal = (category: ICategory) => {
    setAssigningCategory(category);
    // Find all products currently assigned to this category
    const initialSelected = products
      .filter((p) => p.categoryId === category.id || p.category?.id === category.id)
      .map((p) => p.id);
    setSelectedProductIds(initialSelected);
    setProductSearch("");
    setShowAssignModal(true);
  };

  const toggleProductSelect = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAllFiltered = (filteredList: ProductItem[]) => {
    const idsToSelect = filteredList.map((p) => p.id);
    setSelectedProductIds((prev) => Array.from(new Set([...prev, ...idsToSelect])));
  };

  const handleDeselectAllFiltered = (filteredList: ProductItem[]) => {
    const idsToRemove = new Set(filteredList.map((p) => p.id));
    setSelectedProductIds((prev) => prev.filter((id) => !idsToRemove.has(id)));
  };

  const handleSaveAssignments = async () => {
    if (!assigningCategory) return;

    setIsAssigning(true);
    try {
      // 1. Assign selected products to this category
      const res = await categoryApi.assignProducts(
        assigningCategory.id,
        selectedProductIds
      );

      // 2. Any product previously assigned to this category but now unchecked should be unassigned
      const previouslyAssigned = products
        .filter((p) => p.categoryId === assigningCategory.id || p.category?.id === assigningCategory.id)
        .map((p) => p.id);

      const unassignedIds = previouslyAssigned.filter(
        (id) => !selectedProductIds.includes(id)
      );

      if (unassignedIds.length > 0) {
        await Promise.all(
          unassignedIds.map((id) =>
            productApi.updateProduct(id, { categoryId: null })
          )
        );
      }

      if (res.data?.status) {
        toast.success("Products assigned successfully!");
        setShowAssignModal(false);
        fetchData();
      } else {
        toast.error(res.data?.message || "Failed to assign products");
      }
    } catch (error: any) {
      console.error("Error assigning products:", error);
      toast.error(error.response?.data?.message || "Failed to assign products");
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const term = productSearch.toLowerCase();
    return (
      p.product_name?.toLowerCase().includes(term) ||
      p.product_name_tamil?.toLowerCase().includes(term)
    );
  });

  return (
    <AdminGuard>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <button
                onClick={() => router.push("/")}
                className={styles.backBtn}
              >
                &larr; Back to Home
              </button>
              <h1 className={styles.title}>Manage Categories</h1>
              <p className={styles.subtitle}>
                Create, edit categories and assign products to categories
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className={styles.addBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New Category
            </button>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No Categories Found</h3>
              <p>Create your first product category to organize your store items.</p>
              <button onClick={handleOpenAddModal} className={styles.addBtn}>
                Add Category Now
              </button>
            </div>
          ) : (
            <div className={styles.categoryGrid}>
              {categories.map((cat) => {
                const displayName = cat.name || cat.category_name || "Unnamed Category";
                const displayImage = cat.image_url || cat.category_image;
                const productCount = cat._count?.products ?? 0;

                return (
                  <div key={cat.id} className={styles.categoryCard}>
                    <div className={styles.imageArea}>
                      {displayImage ? (
                        <Image
                          src={displayImage}
                          alt={displayName}
                          fill
                          unoptimized
                        />
                      ) : (
                        <svg className={styles.placeholderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      )}
                      <span className={styles.badge}>
                        {productCount} {productCount === 1 ? "Product" : "Products"}
                      </span>
                    </div>

                    <div className={styles.cardContent}>
                      <h3 className={styles.categoryTitle}>{displayName}</h3>
                      <p className={styles.categoryId}>ID: {cat.id}</p>

                      <div className={styles.actions}>
                        <button
                          onClick={() => handleOpenAssignModal(cat)}
                          className={styles.assignBtn}
                          title="Assign or unassign products to this category"
                        >
                          Assign Products ({productCount})
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, displayName)}
                          className={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- ADD / EDIT CATEGORY MODAL --- */}
        {showCategoryModal && (
          <div className={styles.modalOverlay} onClick={() => setShowCategoryModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
                <button
                  className={styles.closeBtn}
                  onClick={() => setShowCategoryModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveCategory}>
                <div className={styles.formGroup}>
                  <label htmlFor="catName">Category Name *</label>
                  <input
                    id="catName"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Wild Honey, Flower Teas..."
                    required
                    autoFocus
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Category Image (Optional)</label>
                  <label className={styles.uploadBox}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageFileChange}
                    />
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <div className={styles.uploadText}>
                      <span>Click to upload</span> or drag and drop
                    </div>
                    <div className={styles.uploadHint}>PNG, JPG, WEBP up to 5MB</div>
                  </label>

                  {categoryImage && (
                    <div className={styles.previewContainer}>
                      <Image
                        src={categoryImage}
                        alt="Category Preview"
                        fill
                        unoptimized
                      />
                      <button
                        type="button"
                        className={styles.removeImgBtn}
                        onClick={() => setCategoryImage("")}
                        title="Remove image"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- ASSIGN PRODUCTS MODAL --- */}
        {showAssignModal && assigningCategory && (
          <div className={styles.modalOverlay} onClick={() => setShowAssignModal(false)}>
            <div className={styles.assignModalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div>
                  <h2>Assign Products to Category</h2>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>
                    Category: <strong>{assigningCategory.name || assigningCategory.category_name}</strong>
                  </p>
                </div>
                <button
                  className={styles.closeBtn}
                  onClick={() => setShowAssignModal(false)}
                >
                  &times;
                </button>
              </div>

              {/* Search input */}
              <input
                type="text"
                className={styles.searchBar}
                placeholder="Search products by name..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />

              {/* Quick Select Bar */}
              <div className={styles.quickSelectBar}>
                <span>
                  <strong>{selectedProductIds.length}</strong> of {products.length} products selected
                </span>
                <div>
                  <button
                    type="button"
                    className={styles.btnText}
                    onClick={() => handleSelectAllFiltered(filteredProducts)}
                  >
                    Select All
                  </button>
                  |
                  <button
                    type="button"
                    className={styles.btnText}
                    onClick={() => handleDeselectAllFiltered(filteredProducts)}
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Product Checkbox List */}
              <div className={styles.productList}>
                {filteredProducts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                    No products match your search.
                  </div>
                ) : (
                  filteredProducts.map((prod) => {
                    const isSelected = selectedProductIds.includes(prod.id);
                    const prodCategoryName =
                      prod.category?.name ||
                      prod.category?.category_name ||
                      (prod.categoryId ? "Assigned" : "No Category");

                    return (
                      <div
                        key={prod.id}
                        className={`${styles.productItem} ${isSelected ? styles.selected : ""}`}
                        onClick={() => toggleProductSelect(prod.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent onClick
                          onClick={(e) => e.stopPropagation()}
                          onChangeCapture={() => toggleProductSelect(prod.id)}
                        />

                        <div className={styles.productThumb}>
                          {Array.isArray(prod.imageUrl) && prod.imageUrl.length > 0 ? (
                            <Image
                              src={prod.imageUrl[0]}
                              alt={prod.product_name}
                              fill
                              unoptimized
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: "#f3f4f6" }} />
                          )}
                        </div>

                        <div className={styles.productInfo}>
                          <div className={styles.prodName}>{prod.product_name}</div>
                          <div className={styles.prodMeta}>
                            <span>₹{prod.selling_price || "0"}</span>
                            <span className={styles.currentCategory}>
                              Current: {prodCategoryName}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.submitBtn}
                  onClick={handleSaveAssignments}
                  disabled={isAssigning}
                >
                  {isAssigning ? "Saving Assignments..." : "Save Product Assignments"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
