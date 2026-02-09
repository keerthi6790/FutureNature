import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { productApi } from "@/api/productApi";
import { isAdminUser } from "@/utils/authUtils";
import Cookies from "js-cookie";
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
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = router.query;

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

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    if (mainImage === uploadedImages[index]) {
      setMainImage(newImages[0] || "");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      // Construct payload matching backend schema
      const payload = {
        productName: formData.productNameE,
        productNameTamil: formData.productNameT,
        description: formData.descriptionE,
        descriptionTamil: formData.descriptionT,
        price: formData.price,
        discountedType: "percentage", // Defaulting to percentage based on UI logic
        discountedAmount: formData.discountPercentage || "0",
        imageUrl: uploadedImages,
        availableQuantity: formData.availableQuantity,
      };

      const response = isEditMode
        ? await productApi.updateProduct(id as string, payload)
        : await productApi.addProduct(payload);

      if (response.data.status) {
        toast.success(
          isEditMode
            ? "Product updated successfully!"
            : "Product added successfully!",
        );
        setTimeout(() => {
          router.push("/admin/manageProducts");
        }, 1000);
      } else {
        toast.error(
          response.data.message ||
          `Failed to ${isEditMode ? "update" : "add"} product`,
        );
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className={styles.pageWrapper}>
        <Toaster />

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
                <h2 className={styles.cardTitle}>
                  General Information
                </h2>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label>
                      Product Name (E)
                    </label>
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
                    <label>
                      Product Name (T)
                    </label>
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

                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label>
                      Description (E)
                    </label>
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
                    <label>
                      Description (T)
                    </label>
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
                <h2 className={styles.cardTitle}>
                  Pricing & Inventory
                </h2>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label>
                      Price
                    </label>
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
                    <label>
                      Sale Price
                    </label>
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
                    <label>
                      Discount Percentage
                    </label>
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
                    <label>
                      Available Quantity
                    </label>
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
                  Upload Product Images (0-3)
                </h2>

                {/* Main Image Display */}
                <div className={styles.mainImageDisplay}>
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt="Product"
                    />
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
                      className={`${styles.thumbnailWrapper} ${mainImage === img ? styles.active : ""}`}
                      onClick={() => setMainImage(img)}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className={styles.removeImageBtn}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {Array.from({
                    length: Math.max(0, 3 - uploadedImages.length),
                  }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className={styles.emptyThumbnail}
                    />
                  ))}
                </div>

                {/* Upload Button */}
                <label className={styles.uploadLabel}>
                  Choose Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
                <p className={styles.uploadNote}>
                  You can upload up to 3 images (Click on thumbnail to set as
                  main)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
