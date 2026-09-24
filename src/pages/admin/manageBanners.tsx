import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import toast from "react-hot-toast";
import { Banner, bannerApi } from "@/api/bannerApi";
import styles from "@/styles/ManageBanners.module.scss";
import AdminGuard from "@/components/AdminGuard";

export default function ManageBanners() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [title, setTitle] = useState("");
  const [desktopImageUrl, setDesktopImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [desktopHref, setDesktopHref] = useState("");
  const [mobileHref, setMobileHref] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drag states
  const [dragDesktopActive, setDragDesktopActive] = useState(false);
  const [dragMobileActive, setDragMobileActive] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await bannerApi.getBanners();
      if (response.status) {
        setBanners(response.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const processFile = (file: File, type: "desktop" | "mobile") => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (type === "desktop") {
          setDesktopImageUrl(event.target.result as string);
        } else {
          setMobileImageUrl(event.target.result as string);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopImageUrl) {
      toast.error("Please upload a Desktop Banner image");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim() || undefined,
        desktopImageUrl,
        mobileImageUrl: mobileImageUrl.trim() || undefined,
        desktopHref: desktopHref.trim() || undefined,
        mobileHref: mobileHref.trim() || undefined,
        order: Number(order) || 0,
        isActive,
      };

      if (editingId) {
        const response = await bannerApi.updateBanner(editingId, payload);
        if (response.status) {
          toast.success("Banner updated successfully");
          resetForm();
        }
      } else {
        const response = await bannerApi.addBanner(payload);
        if (response.status) {
          toast.success("Banner added successfully");
          resetForm();
        }
      }
      fetchBanners();
    } catch (error: any) {
      console.error("Error saving banner:", error);
      toast.error(error.response?.data?.message || "Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setTitle(banner.title || "");
    setDesktopImageUrl(banner.desktopImageUrl || banner.imageUrl || "");
    setMobileImageUrl(banner.mobileImageUrl || "");
    setDesktopHref(banner.desktopHref || banner.href || "");
    setMobileHref(banner.mobileHref || "");
    setOrder(banner.order || 0);
    setIsActive(banner.isActive !== undefined ? banner.isActive : true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      const response = await bannerApi.deleteBanner(id);
      if (response.status) {
        toast.success("Banner deleted successfully");
        setBanners(banners.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDesktopImageUrl("");
    setMobileImageUrl("");
    setDesktopHref("");
    setMobileHref("");
    setOrder(0);
    setIsActive(true);
  };

  return (
    <AdminGuard>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <button
                onClick={() => router.push("/")}
                className={styles.backBtn}
              >
                <span>&larr;</span> Back to Home Page
              </button>
              <h1 className={styles.title}>Banner Management</h1>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/admin/orders")}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(139, 134, 128, 0.4)",
                  color: "#36454F",
                  padding: "10px 16px",
                  borderRadius: "0px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Customer Orders
              </button>
              <button
                onClick={() => router.push("/admin/manageProducts")}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(139, 134, 128, 0.4)",
                  color: "#36454F",
                  padding: "10px 16px",
                  borderRadius: "0px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Manage Products
              </button>
            </div>
          </div>

          <div className={styles.mainGrid}>
            {/* Left Side: Form */}
            <form className={styles.addForm} onSubmit={handleSubmit}>
              <h2>{editingId ? "Edit Banner" : "Create New Banner"}</h2>

              {/* Title & Order */}
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label>Banner Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Harvest Deal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Display Order</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Desktop Image Upload */}
              <div className={styles.formGroup}>
                <label>Desktop Banner Image *</label>
                {!desktopImageUrl ? (
                  <div
                    className={`${styles.dropZone} ${dragDesktopActive ? styles.dragActive : ""}`}
                    onDragEnter={(e) => { e.preventDefault(); setDragDesktopActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragDesktopActive(false); }}
                    onDragOver={(e) => { e.preventDefault(); setDragDesktopActive(true); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragDesktopActive(false);
                      if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0], "desktop");
                    }}
                    onClick={() => document.getElementById("desktopImageUpload")?.click()}
                  >
                    <div className={styles.icon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <div className={styles.text}>
                      <strong>Click to upload Desktop Image</strong> or drag & drop
                      <p>Recommended: 1920x600px or 1600x500px</p>
                    </div>
                    <input
                      id="desktopImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) processFile(e.target.files[0], "desktop");
                      }}
                      style={{ display: "none" }}
                    />
                  </div>
                ) : (
                  <div className={styles.imagePreview}>
                    <Image src={desktopImageUrl} alt="Desktop Preview" fill unoptimized />
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => setDesktopImageUrl("")}
                      title="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Image Upload */}
              <div className={styles.formGroup}>
                <label>Mobile Banner Image (Optional - Falls back to desktop image)</label>
                {!mobileImageUrl ? (
                  <div
                    className={`${styles.dropZone} ${dragMobileActive ? styles.dragActive : ""}`}
                    onDragEnter={(e) => { e.preventDefault(); setDragMobileActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragMobileActive(false); }}
                    onDragOver={(e) => { e.preventDefault(); setDragMobileActive(true); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragMobileActive(false);
                      if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0], "mobile");
                    }}
                    onClick={() => document.getElementById("mobileImageUpload")?.click()}
                  >
                    <div className={styles.icon}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                    </div>
                    <div className={styles.text}>
                      <strong>Click to upload Mobile Image</strong> or drag & drop
                      <p>Recommended: 800x800px or 750x600px portrait/square</p>
                    </div>
                    <input
                      id="mobileImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) processFile(e.target.files[0], "mobile");
                      }}
                      style={{ display: "none" }}
                    />
                  </div>
                ) : (
                  <div className={styles.imagePreview} style={{ height: "140px" }}>
                    <Image src={mobileImageUrl} alt="Mobile Preview" fill unoptimized />
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => setMobileImageUrl("")}
                      title="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              {/* Href Inputs for Desktop and Mobile */}
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label>Desktop Link URL (Href)</label>
                  <input
                    type="text"
                    placeholder="e.g. /products or /details/123"
                    value={desktopHref}
                    onChange={(e) => setDesktopHref(e.target.value)}
                  />
                  <p className={styles.hint}>Where desktop visitors are navigated on click</p>
                </div>

                <div className={styles.formGroup}>
                  <label>Mobile Link URL (Href)</label>
                  <input
                    type="text"
                    placeholder="e.g. /products or /details/123"
                    value={mobileHref}
                    onChange={(e) => setMobileHref(e.target.value)}
                  />
                  <p className={styles.hint}>Where mobile visitors are navigated on click</p>
                </div>
              </div>

              {/* Active Checkbox */}
              <label className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Show this banner on live homepage
              </label>

              {/* Buttons */}
              <div className={styles.btnGroup}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                      ? "Update Banner"
                      : "Publish Banner"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Right Side: List of Banners */}
            <div className={styles.bannerListCard}>
              <h2>Live Banners ({banners.length})</h2>
              {loading ? (
                <div className={styles.loadingState}>Refreshing banners...</div>
              ) : banners.length === 0 ? (
                <div className={styles.emptyState}>
                  No banners uploaded yet.
                </div>
              ) : (
                <div className={styles.bannerGrid}>
                  {banners.map((banner) => (
                    <div key={banner.id} className={styles.bannerItem}>
                      <div className={styles.imageGridDual}>
                        <div className={styles.imageArea}>
                          <span className={styles.imageLabel}>Desktop</span>
                          <Image
                            src={banner.desktopImageUrl || banner.imageUrl || "/Assets/Header_Images/Product.png"}
                            alt={banner.title || "Desktop Banner"}
                            fill
                            unoptimized
                          />
                        </div>
                        {banner.mobileImageUrl ? (
                          <div className={styles.imageArea}>
                            <span className={styles.imageLabel}>Mobile</span>
                            <Image
                              src={banner.mobileImageUrl}
                              alt={banner.title || "Mobile Banner"}
                              fill
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className={styles.imageArea} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF0E6" }}>
                            <span style={{ fontSize: "12px", color: "#8B8680", padding: "8px", textAlign: "center" }}>Same as desktop</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.cardContent}>
                        <div className={styles.metaInfo}>
                          {banner.title && <h3 className={styles.bannerTitleText}>{banner.title}</h3>}
                          <div className={styles.hrefLine}>
                            <strong>Desktop Link:</strong> {banner.desktopHref || banner.href || "None (Not clickable)"}
                          </div>
                          <div className={styles.hrefLine}>
                            <strong>Mobile Link:</strong> {banner.mobileHref || banner.desktopHref || banner.href || "None"}
                          </div>
                        </div>

                        <div className={styles.cardBottomRow}>
                          <span
                            className={`${styles.status} ${banner.isActive ? styles.active : styles.inactive}`}
                          >
                            {banner.isActive ? "Active / Visible" : "Hidden / Inactive"}
                          </span>
                          <div className={styles.actions}>
                            <button
                              onClick={() => handleEdit(banner)}
                              className={styles.editBtn}
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(banner.id)}
                              className={styles.deleteBtn}
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
