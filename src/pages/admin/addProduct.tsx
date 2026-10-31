import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { productApi } from "@/api/productApi";
import { categoryApi, ICategory } from "@/api/categoryApi";
import { uploadImageToAWS, deleteImageFromAWS } from "@/utils/uploadToAws";
import { isAdminUser } from "@/utils/authUtils";
import Cookies from "js-cookie";
import styles from "@/styles/AddProduct.module.scss";
import AdminGuard from "@/components/AdminGuard";

export interface IVariantFormItem {
  id?: string;
  name: string;
  imageUrl: string;
  price: string;
  salePrice: string;
  discountPercentage: string;
  availableQuantity: string;
  isUploadingImage?: boolean;
}

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

  const [variants, setVariants] = useState<IVariantFormItem[]>([
    {
      name: "Standard",
      imageUrl: "",
      price: "",
      salePrice: "",
      discountPercentage: "",
      availableQuantity: "",
    },
  ]);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = router.query;

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();
        if (res.data?.status) {
          setCategories(res.data.data || []);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Fetch product if in edit mode
  useEffect(() => {
    if (!router.isReady) return;
    const productId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : (router.query.id as string);

    if (productId) {
      setIsEditMode(true);
      fetchProductData(productId);
    }
  }, [router.isReady, router.query.id]);

  const fetchProductData = async (productId: string) => {
    setIsFetchingProduct(true);
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

        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
          setVariants(
            product.variants.map((v: any) => ({
              id: v.id,
              name: v.name || "",
              imageUrl: v.imageUrl || "",
              price: String(v.price ?? ""),
              salePrice: String(v.selling_price ?? v.sellingPrice ?? v.price ?? ""),
              discountPercentage: String(v.discounted_amount ?? v.discountedAmount ?? "0"),
              availableQuantity: String(v.available_quantity ?? v.availableQuantity ?? "0"),
            }))
          );
        } else {
          setVariants([
            {
              name: "Standard",
              imageUrl: product.imageUrl?.[0] || "",
              price: String(product.price ?? ""),
              salePrice: String(product.selling_price ?? product.price ?? ""),
              discountPercentage: String(product.discounted_amount ?? "0"),
              availableQuantity: String(product.available_quantity ?? "0"),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product data");
    } finally {
      setIsFetchingProduct(false);
    }
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: "",
        imageUrl: "",
        price: "",
        salePrice: "",
        discountPercentage: "",
        availableQuantity: "",
      },
    ]);
  };

  const handleRemoveVariant = async (index: number) => {
    if (variants.length <= 1) {
      toast.error("Product must have at least one variant");
      return;
    }
    const variantToRemove = variants[index];
    if (variantToRemove.imageUrl && !uploadedImages.includes(variantToRemove.imageUrl)) {
      await deleteImageFromAWS(variantToRemove.imageUrl);
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof IVariantFormItem,
    value: string
  ) => {
    setVariants((prev) => {
      const updated = [...prev];
      const current = { ...updated[index], [field]: value };

      if (field === "price" || field === "salePrice") {
        const price = parseFloat(field === "price" ? value : current.price);
        const salePrice = parseFloat(field === "salePrice" ? value : current.salePrice);
        if (price > 0 && salePrice > 0 && salePrice < price) {
          current.discountPercentage = (((price - salePrice) / price) * 100).toFixed(2);
        } else {
          current.discountPercentage = "0";
        }
      }
      updated[index] = current;
      return updated;
    });
  };

  const handleVariantImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isUploadingImage: true };
      return updated;
    });

    const toastId = toast.loading("Uploading variant image to AWS S3...");
    try {
      const s3Url = await uploadImageToAWS(file, "products");
      setVariants((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          imageUrl: s3Url,
          isUploadingImage: false,
        };
        return updated;
      });
      toast.success("Variant image uploaded to AWS S3!", { id: toastId });
    } catch (err: any) {
      console.error("Variant image upload failed:", err);
      toast.error(err?.message || "Failed to upload variant image", { id: toastId });
      setVariants((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], isUploadingImage: false };
        return updated;
      });
    } finally {
      e.target.value = "";
    }
  };

  const handleRemoveVariantImage = async (index: number) => {
    const variant = variants[index];
    if (!variant) return;
    const oldUrl = variant.imageUrl;
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], imageUrl: "" };
      return updated;
    });
    if (oldUrl && !uploadedImages.includes(oldUrl)) {
      await deleteImageFromAWS(oldUrl);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 3 - uploadedImages.length;
    if (availableSlots <= 0) {
      toast.error("You can only upload up to 3 product images");
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);
    setIsUploadingImages(true);
    const toastId = toast.loading(`Uploading ${filesToUpload.length} image(s) to AWS S3...`);

    try {
      const uploadPromises = filesToUpload.map((file) =>
        uploadImageToAWS(file, "products")
      );
      const newS3Urls = await Promise.all(uploadPromises);

      setUploadedImages((prev) => {
        const combined = [...prev, ...newS3Urls].slice(0, 3);
        if (!mainImage && combined.length > 0) {
          setMainImage(combined[0]);
        }
        return combined;
      });

      if (!mainImage && newS3Urls.length > 0) {
        setMainImage(newS3Urls[0]);
      }

      toast.success("Images uploaded to AWS S3 successfully!", { id: toastId });
    } catch (err: any) {
      console.error("AWS S3 Upload Error:", err);
      toast.error(err?.message || "Failed to upload images to AWS S3", { id: toastId });
    } finally {
      setIsUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = uploadedImages[index];
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    if (mainImage === imageToRemove) {
      setMainImage(newImages[0] || "");
    }
    if (imageToRemove) {
      await deleteImageFromAWS(imageToRemove);
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
    if (uploadedImages.length === 0)
      return "At least one product image is required";

    if (!variants || variants.length === 0) {
      return "At least one product variation is required";
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.name.trim()) {
        return `Variation #${i + 1}: Name is required (e.g. 'Standard', '250g', '500g')`;
      }
      if (!v.price || parseFloat(v.price) <= 0) {
        return `Variation #${i + 1} (${v.name}): Valid Price is required`;
      }
      if (v.salePrice && parseFloat(v.salePrice) <= 0) {
        return `Variation #${i + 1} (${v.name}): Sale Price must be greater than 0`;
      }
      if (!v.availableQuantity || parseInt(v.availableQuantity) < 0) {
        return `Variation #${i + 1} (${v.name}): Valid Quantity is required`;
      }
    }
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
      const primaryVariant = variants[0];
      const basePrice = primaryVariant.price;
      const baseSalePrice = primaryVariant.salePrice || primaryVariant.price;
      const baseDiscount = primaryVariant.discountPercentage || "0";
      const totalQuantity = variants.reduce(
        (sum, v) => sum + (parseInt(v.availableQuantity) || 0),
        0
      );

      const variantsPayload = variants.map((v) => ({
        id: v.id,
        name: v.name.trim(),
        imageUrl: v.imageUrl || uploadedImages[0] || "",
        price: v.price,
        discountedType: "percentage",
        discountedAmount: v.discountPercentage || "0",
        sellingPrice: v.salePrice || v.price,
        availableQuantity: String(v.availableQuantity || "0"),
        discounted_type: "percentage",
        discounted_amount: v.discountPercentage || "0",
        selling_price: v.salePrice || v.price,
        available_quantity: parseInt(v.availableQuantity) || 0,
      }));

      // Construct payload matching backend schema
      const payload = {
        productName: formData.productNameE,
        productNameTamil: formData.productNameT,
        description: formData.descriptionE,
        descriptionTamil: formData.descriptionT,
        price: basePrice,
        discountedType: "percentage",
        discountedAmount: baseDiscount,
        sellingPrice: baseSalePrice,
        imageUrl: uploadedImages,
        availableQuantity: String(totalQuantity),
        categoryId: formData.categoryId || null,
        variants: variantsPayload,
      };

      const targetId = Array.isArray(router.query.id)
        ? router.query.id[0]
        : (router.query.id as string);

      const response = isEditMode && targetId
        ? await productApi.updateProduct(targetId, payload)
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
                disabled={loading || isUploadingImages || isFetchingProduct}
                className={styles.saveBtn}
              >
                {isUploadingImages
                  ? "Uploading Images..."
                  : loading
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
          {isFetchingProduct ? (
            <div style={{ padding: "80px 20px", textAlign: "center", color: "#6b7280", fontSize: 16 }}>
              Loading product details and variations...
            </div>
          ) : (
          <div className={styles.mainGrid}>
            {/* Left Column - Form */}
            <div className={styles.formColumn}>
              {/* General Information */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>General Information</h2>
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label>Product Name (E)</label>
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
                    <label>Product Name (T)</label>
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
                    <label>Description (E)</label>
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
                    <label>Description (T)</label>
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

              {/* Product Variations & Pricing */}
              <div className={styles.card}>
                <div className={styles.variantsHeader}>
                  <div>
                    <h2 className={styles.cardTitle} style={{ marginBottom: 4 }}>
                      Product Variations & Pricing
                    </h2>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                      Each product can have multiple variations (e.g. 250g, 500g, 1kg) with individual image, pricing, discount, and inventory.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className={styles.addVariantBtn}
                  >
                    + Add Variation
                  </button>
                </div>

                {variants.map((v, index) => (
                  <div key={v.id || index} className={styles.variantCard}>
                    <div className={styles.variantCardHeader}>
                      <div className={styles.variantCardTitle}>
                        <span className={styles.variantBadge}>#{index + 1}</span>
                        <span>{v.name ? v.name : `Variation ${index + 1}`}</span>
                      </div>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className={styles.removeVariantBtn}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className={styles.variantRow}>
                      <div className={styles.fieldGroup}>
                        <label>Variation Name *</label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) =>
                            handleVariantChange(index, "name", e.target.value)
                          }
                          placeholder="e.g. 250g / 500g / Standard"
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label>Variation Image (Stored in AWS S3)</label>
                        <div className={styles.variantImageUploadWrap}>
                          {v.imageUrl ? (
                            <div className={styles.variantImagePreview}>
                              <img src={v.imageUrl} alt={v.name} />
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantImage(index)}
                                className={styles.removeVariantImgBtn}
                                title="Remove Image"
                              >
                                ×
                              </button>
                            </div>
                          ) : null}
                          <label className={styles.variantUploadLabel}>
                            {v.isUploadingImage
                              ? "Uploading to AWS..."
                              : v.imageUrl
                              ? "Change S3 Image"
                              : "Upload Image (AWS S3)"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleVariantImageUpload(index, e)
                              }
                              disabled={v.isUploadingImage}
                              style={{ display: "none" }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className={styles.variantPricingGrid}>
                      <div className={styles.fieldGroup}>
                        <label>Price (MRP) *</label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", e.target.value)
                          }
                          placeholder="100"
                          step="0.01"
                          className={`${styles.input} ${styles.noSpinner}`}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label>Sale Price *</label>
                        <input
                          type="number"
                          value={v.salePrice}
                          onChange={(e) =>
                            handleVariantChange(index, "salePrice", e.target.value)
                          }
                          placeholder="90"
                          step="0.01"
                          className={`${styles.input} ${styles.noSpinner}`}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label>Discount %</label>
                        <input
                          type="text"
                          value={
                            v.discountPercentage
                              ? `${v.discountPercentage}%`
                              : ""
                          }
                          readOnly
                          placeholder="0%"
                          className={`${styles.input} ${styles.readOnlyInput}`}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label>Available Quantity *</label>
                        <input
                          type="number"
                          value={v.availableQuantity}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "availableQuantity",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 50"
                          min="0"
                          className={`${styles.input} ${styles.noSpinner}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Category</h2>
                <div className={styles.fieldGroup}>
                  <label>Product Category (Optional)</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={styles.input}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">— No Category —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name || cat.category_name}
                      </option>
                    ))}
                  </select>
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
                      className={`${styles.thumbnailWrapper} ${mainImage === img ? styles.active : ""}`}
                      onClick={() => setMainImage(img)}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} />
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
                <label
                  className={styles.uploadLabel}
                  style={{
                    opacity: isUploadingImages || uploadedImages.length >= 3 ? 0.6 : 1,
                    cursor: isUploadingImages || uploadedImages.length >= 3 ? "not-allowed" : "pointer",
                  }}
                >
                  {isUploadingImages
                    ? "Uploading to AWS S3..."
                    : uploadedImages.length >= 3
                    ? "Max 3 Images Reached"
                    : "Choose Images"}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImages || uploadedImages.length >= 3}
                    style={{ display: "none" }}
                  />
                </label>
                <p className={styles.uploadNote}>
                  You can upload up to 3 images (stored directly in AWS S3). Click on any thumbnail to set as main image.
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
