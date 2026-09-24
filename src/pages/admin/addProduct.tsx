import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { productApi } from "@/api/productApi";
import { Category, categoryApi } from "@/api/categoryApi";
import styles from "@/styles/AddProduct.module.scss";
import AdminGuard from "@/components/AdminGuard";

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    productNameE: "",
    productNameT: "",
    descriptionE: "",
    descriptionT: "",
    price: "",
    salePrice: "",
    discountPercentage: "",
    availableQuantity: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = router.query;

  // Fetch categories on mount
  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const fetchCategoriesList = async () => {
    try {
      const response = await categoryApi.getCategories();
      if (response.status && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch product if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchProductData(id as string);
    }
  }, [id]);

  const fetchProductData = async (productId: string) => {
    setLoading(true);
    try {
      const response = await productApi.getProductById(productId);
      if (response.data.status) {
        const product = response.data.data;

        setFormData({
          productNameE: product.product_name || "",
          productNameT: product.product_name_tamil || "",
          descriptionE: product.description || "",
          descriptionT: product.description_tamil || "",
          price: product.price || "",
          salePrice: product.selling_price || "",
          discountPercentage: product.discounted_amount || "",
          availableQuantity: product.available_quantity || "",
          categoryId: product.categoryId || product.category?.id || "",
        });
        setUploadedImages(product.imageUrl || []);
        if (product.imageUrl && product.imageUrl.length > 0) {
          setMainImage(product.imageUrl[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  // Auto-calculate discount percentage
  useEffect(() => {
    const price = parseFloat(formData.price);
    const salePrice = parseFloat(formData.salePrice);

    if (price > 0 && salePrice > 0 && salePrice < price) {
      const discount = ((price - salePrice) / price) * 100;
      setFormData((prev) => ({
        ...prev,
        discountPercentage: discount.toFixed(2),
      }));
    } else if (salePrice >= price || !salePrice) {
      setFormData((prev) => ({
        ...prev,
        discountPercentage: "",
      }));
    }
  }, [formData.price, formData.salePrice]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const img = event.target.result as string;
            newImages.push(img);
            if (!mainImage) setMainImage(img);
            if (newImages.length === files.length) {
              setUploadedImages((prev) => [...prev, ...newImages].slice(0, 3));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const filtered = uploadedImages.filter((_, idx) => idx !== indexToRemove);
    setUploadedImages(filtered);
    if (mainImage === uploadedImages[indexToRemove]) {
      setMainImage(filtered[0] || "");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsCreatingCategory(true);
    try {
      const response = await categoryApi.addCategory({
        categoryName: newCategoryName.trim(),
        categoryImage: newCategoryImage || undefined,
      });

      if (response.status && response.data) {
        toast.success("Category created successfully!");
        setCategories((prev) => [response.data, ...prev]);
        setFormData((prev) => ({ ...prev, categoryId: response.data.id }));
        setNewCategoryName("");
        setNewCategoryImage("");
        setShowNewCategoryModal(false);
      } else {
        toast.error(response.message || "Failed to create category");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const validateForm = () => {
    if (!formData.productNameE.trim())
      return "Product Name (English) is required";
    if (!formData.productNameT.trim())
      return "Product Name (Tamil) is required";
    if (!formData.descriptionE.trim())
      return "Description (English) is required";
    if (!formData.descriptionT.trim()) return "Description (Tamil) is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      return "Valid Price is required";
    if (uploadedImages.length === 0)
      return "At least one product image is required";
    if (!formData.availableQuantity || parseInt(formData.availableQuantity) < 0)
      return "Valid Quantity is required";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        productName: formData.productNameE,
        productNameTamil: formData.productNameT,
        description: formData.descriptionE,
        descriptionTamil: formData.descriptionT,
        price: formData.price,
        discountedType: "percentage",
        discountedAmount: formData.discountPercentage || "0",
        imageUrl: uploadedImages,
        availableQuantity: formData.availableQuantity,
        categoryId: formData.categoryId || undefined,
      };

      const response = isEditMode
        ? await productApi.updateProduct(id as string, payload)
        : await productApi.addProduct(payload);

      if (response.data.status) {
        toast.success(
          isEditMode
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        setTimeout(() => {
          router.push("/admin/manageProducts");
        }, 1000);
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${isEditMode ? "update" : "add"} product`
        );
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

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
                <span>&larr;</span> Products
              </button>
              <p className={styles.subHeader}>
                {isEditMode ? "Edit Product Details" : "Add a New Product"}
              </p>
            </div>
            <div className={styles.btnGroup}>
              <button
                onClick={() => router.push("/admin/manageProducts")}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={styles.saveBtn}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                    ? "Update Product"
                    : "Save Product"}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainGrid}>
            {/* Left Column - Form */}
            <div className={styles.formColumn}>
              {/* General Information */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>General Information</h2>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label>Product Name (E) *</label>
                    <input
                      type="text"
                      name="productNameE"
                      value={formData.productNameE}
                      onChange={handleInputChange}
                      placeholder="Product name in English"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Product Name (T) *</label>
                    <input
                      type="text"
                      name="productNameT"
                      value={formData.productNameT}
                      onChange={handleInputChange}
                      placeholder="Product name in Tamil"
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Category Selection Row */}
                <div className={styles.row} style={{ marginTop: "16px" }}>
                  <div className={styles.fieldGroup} style={{ gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ margin: 0 }}>Category</label>
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryModal(true)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#A0522D",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        + Add New Category
                      </button>
                    </div>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.row} style={{ marginTop: "16px" }}>
                  <div className={styles.fieldGroup}>
                    <label>Description (E) *</label>
                    <textarea
                      name="descriptionE"
                      value={formData.descriptionE}
                      onChange={handleInputChange}
                      placeholder="Description in English"
                      rows={4}
                      className={styles.textarea}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Description (T) *</label>
                    <textarea
                      name="descriptionT"
                      value={formData.descriptionT}
                      onChange={handleInputChange}
                      placeholder="Description in Tamil"
                      rows={4}
                      className={styles.textarea}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Details */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Pricing & Inventory</h2>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="100"
                      step="0.01"
                      className={`${styles.input} ${styles.noSpinner}`}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Sale Price (₹)</label>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      placeholder="90"
                      step="0.01"
                      className={`${styles.input} ${styles.noSpinner}`}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label>Discount Percentage</label>
                    <input
                      type="text"
                      name="discountPercentage"
                      value={
                        formData.discountPercentage
                          ? `${formData.discountPercentage}%`
                          : ""
                      }
                      readOnly
                      placeholder="10.00%"
                      className={`${styles.input} ${styles.readOnlyInput}`}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Available Quantity *</label>
                    <input
                      type="number"
                      name="availableQuantity"
                      value={formData.availableQuantity}
                      onChange={handleInputChange}
                      placeholder="e.g 100"
                      min="0"
                      className={`${styles.input} ${styles.noSpinner}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <div className={styles.imageUpdateCard}>
                <h2 className={styles.cardTitle}>
                  Upload Product Images (0-3) *
                </h2>

                {/* Main Image Display */}
                <div className={styles.mainImageDisplay}>
                  {mainImage ? (
                    <img src={mainImage} alt="Product" />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <div>📷</div>
                      <p>Upload main image</p>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                <div className={styles.thumbnailGrid}>
                  {uploadedImages.map((img, index) => (
                    <div
                      key={index}
                      className={`${styles.thumbnailWrapper} ${
                        mainImage === img ? styles.active : ""
                      }`}
                      onClick={() => setMainImage(img)}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className={styles.deleteThumbnailBtn}
                        title="Delete image"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 3 && (
                    <label className={styles.addThumbnailButton}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                      <span>+</span>
                    </label>
                  )}
                </div>

                {/* Upload Button */}
                <div className={styles.uploadArea}>
                  <label className={styles.uploadBtn}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                    Choose Images
                  </label>
                  <p className={styles.uploadHint}>
                    Supported formats: JPG, PNG, WEBP (Max 3)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Category Modal */}
        {showNewCategoryModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "28px",
                width: "90%",
                maxWidth: "450px",
                borderRadius: "0px",
                border: "1px solid #D4AF37",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  color: "#36454F",
                }}
              >
                Create New Category
              </h3>
              <form onSubmit={handleCreateCategory}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "#374151",
                    }}
                  >
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flower Teas, Wild Honey"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #d1d5db",
                      borderRadius: "0px",
                    }}
                    autoFocus
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "#374151",
                    }}
                  >
                    Category Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setNewCategoryImage(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ width: "100%", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategoryModal(false);
                      setNewCategoryName("");
                      setNewCategoryImage("");
                    }}
                    style={{
                      padding: "10px 18px",
                      background: "#FAF0E6",
                      color: "#374151",
                      border: "1px solid #d1d5db",
                      borderRadius: "0px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingCategory}
                    style={{
                      padding: "10px 22px",
                      background: "#A0522D",
                      color: "#FAF0E6",
                      border: "none",
                      borderRadius: "0px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {isCreatingCategory ? "Creating..." : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
