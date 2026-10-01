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

  // Form State
  const [title, setTitle] = useState("");
  const [desktopImageUrl, setDesktopImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [desktopHref, setDesktopHref] = useState("");
  const [mobileHref, setMobileHref] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drag states
  const [desktopDragActive, setDesktopDragActive] = useState(false);
  const [mobileDragActive, setMobileDragActive] = useState(false);

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

  const handleProcessFile = (file: File, target: "desktop" | "mobile") => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (target === "desktop") {
          setDesktopImageUrl(event.target.result as string);
        } else {
          setMobileImageUrl(event.target.result as string);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDesktopFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file, "desktop");
  };

  const handleMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file, "mobile");
  };

  const handleDesktopDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDesktopDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0], "desktop");
    }
  };

  const handleMobileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0], "mobile");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopImageUrl && !mobileImageUrl) {
      toast.error("Please upload at least one banner (Desktop or Mobile)");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim() || undefined,
        desktopImageUrl: desktopImageUrl || mobileImageUrl,
        mobileImageUrl: mobileImageUrl || undefined,
        desktopHref: desktopHref.trim() || undefined,
        mobileHref: mobileHref.trim() || undefined,
        isActive,
        order: Number(order) || 0,
      };

      if (editingId) {
        const response = await bannerApi.updateBanner(editingId, payload);
        if (response.status) {
          toast.success("Banner updated successfully");
          setEditingId(null);
        }
      } else {
        const response = await bannerApi.addBanner(payload);
        if (response.status) {
          toast.success("Banner created successfully");
        }
      }

      resetForm();
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDesktopImageUrl("");
    setMobileImageUrl("");
    setDesktopHref("");
    setMobileHref("");
    setIsActive(true);
    setOrder(0);
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setTitle(banner.title || "");
    setDesktopImageUrl(banner.desktopImageUrl || banner.imageUrl || "");
    setMobileImageUrl(banner.mobileImageUrl || "");
    setDesktopHref(banner.desktopHref || "");
    setMobileHref(banner.mobileHref || "");
    setIsActive(banner.isActive);
    setOrder(banner.order || 0);
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
          </div>

          <div className={styles.mainGrid}>
            {/* Form */}
            <form className={styles.addForm} onSubmit={handleSubmit}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>{editingId ? "Edit Banner" : "Create New Banner"}</h2>
                {editingId && (
                  <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>
                    Editing ID: {editingId.slice(0, 8)}...
                  </span>
                )}
              </div>

              {/* Title input */}
              <div className={styles.formGroup}>
                <label>Banner Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Harvest Festival"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Dual Upload Section */}
              <div className={styles.uploadGrid}>
                {/* 🖥️ Desktop Banner Card */}
                <div className={styles.uploadCard}>
                  <div className={styles.uploadHeader}>
                    <span className={styles.deviceTitle}>
                      🖥️ Desktop Banner
                    </span>
                    <span className={styles.deviceTag}>Desktop & Tablets</span>
                  </div>

                  {!desktopImageUrl ? (
                    <div
                      className={`${styles.dropZone} ${desktopDragActive ? styles.dragActive : ""}`}
                      onDragEnter={(e) => { e.preventDefault(); setDesktopDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setDesktopDragActive(false); }}
                      onDragOver={(e) => { e.preventDefault(); setDesktopDragActive(true); }}
                      onDrop={handleDesktopDrop}
                      onClick={() => document.getElementById("desktopImageUpload")?.click()}
                    >
                      <div className={styles.icon}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      </div>
                      <div className={styles.text}>
                        <strong>Upload Desktop Banner</strong>
                        <p style={{ marginTop: "4px", fontSize: "12px", color: "#9ca3af" }}>
                          Landscape format (1560 × 360px recommended)
                        </p>
                      </div>
                      <input
                        id="desktopImageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleDesktopFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  ) : (
                    <div className={styles.imagePreview}>
                      <Image src={desktopImageUrl} alt="Desktop Banner Preview" fill unoptimized />
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

                  <input
                    type="text"
                    placeholder="Desktop Target URL / Link (Optional)"
                    value={desktopHref}
                    onChange={(e) => setDesktopHref(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* 📱 Mobile Banner Card */}
                <div className={styles.uploadCard}>
                  <div className={styles.uploadHeader}>
                    <span className={styles.deviceTitle}>
                      📱 Mobile Banner
                    </span>
                    <span className={styles.deviceTag}>Phones & Mobile</span>
                  </div>

                  {!mobileImageUrl ? (
                    <div
                      className={`${styles.dropZone} ${mobileDragActive ? styles.dragActive : ""}`}
                      onDragEnter={(e) => { e.preventDefault(); setMobileDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setMobileDragActive(false); }}
                      onDragOver={(e) => { e.preventDefault(); setMobileDragActive(true); }}
                      onDrop={handleMobileDrop}
                      onClick={() => document.getElementById("mobileImageUpload")?.click()}
                    >
                      <div className={styles.icon}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                          <line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                      </div>
                      <div className={styles.text}>
                        <strong>Upload Mobile Banner</strong>
                        <p style={{ marginTop: "4px", fontSize: "12px", color: "#9ca3af" }}>
                          Vertically lengthy / portrait format (1080 × 1920px or 750 × 1200px, 9:16 / 3:4 ratio)
                        </p>
                      </div>
                      <input
                        id="mobileImageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleMobileFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  ) : (
                    <div className={styles.imagePreview}>
                      <Image src={mobileImageUrl} alt="Mobile Banner Preview" fill unoptimized />
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

                  <input
                    type="text"
                    placeholder="Mobile Target URL / Link (Optional)"
                    value={mobileHref}
                    onChange={(e) => setMobileHref(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Status & Ordering */}
              <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
                <label className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  Show this banner on homepage
                </label>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label style={{ fontSize: "14px", color: "#374151", fontWeight: 600 }}>Display Order:</label>
                  <input
                    type="number"
                    min="0"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    style={{
                      width: "80px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div className={styles.btnGroup}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving Banner..."
                    : editingId
                      ? "Update Banner"
                      : "Save Banner"}
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

            {/* Right / Bottom: Live Banners List */}
            <div className={styles.bannerListCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Live Banners ({banners.length})</h2>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>
                  {banners.filter((b) => b.isActive).length} active on store
                </span>
              </div>

              {loading ? (
                <div className={styles.loadingState}>Refreshing banners...</div>
              ) : banners.length === 0 ? (
                <div className={styles.emptyState}>
                  No banners uploaded yet. Upload desktop and mobile banners above!
                </div>
              ) : (
                <div className={styles.bannerGrid}>
                  {banners.map((banner) => {
                    const desktopImg = banner.desktopImageUrl || banner.imageUrl;
                    const mobileImg = banner.mobileImageUrl;

                    return (
                      <div key={banner.id} className={styles.bannerItem}>
                        {/* Dual Device Preview */}
                        <div className={styles.dualPreviewGrid}>
                          {/* Desktop Side */}
                          <div className={styles.devicePreview}>
                            <span className={styles.deviceLabel}>🖥️ Desktop</span>
                            <div className={styles.previewImgWrap}>
                              {desktopImg ? (
                                <Image src={desktopImg} alt="Desktop Banner" fill unoptimized />
                              ) : (
                                <div className={styles.fallbackBadge}>No Desktop Image</div>
                              )}
                            </div>
                          </div>

                          {/* Mobile Side */}
                          <div className={styles.devicePreview}>
                            <span className={styles.deviceLabel}>📱 Mobile</span>
                            <div className={`${styles.previewImgWrap} ${styles.mobilePreviewWrap}`}>
                              {mobileImg ? (
                                <Image src={mobileImg} alt="Mobile Banner" fill unoptimized />
                              ) : desktopImg ? (
                                <div className={styles.fallbackBadge}>
                                  Uses Desktop Image
                                </div>
                              ) : (
                                <div className={styles.fallbackBadge}>No Image</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={styles.cardContent}>
                          {banner.title && (
                            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "#111827" }}>
                              {banner.title}
                            </h3>
                          )}

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              className={`${styles.status} ${banner.isActive ? styles.active : styles.inactive}`}
                            >
                              {banner.isActive ? "Visible" : "Hidden"}
                            </span>

                            {banner.order !== undefined && banner.order > 0 && (
                              <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>
                                Order: #{banner.order}
                              </span>
                            )}
                          </div>

                          <div className={styles.actions}>
                            <button
                              onClick={() => handleEdit(banner)}
                              className={styles.editBtn}
                              title="Edit"
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#1f2937",
                                border: "none",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(banner.id)}
                              className={styles.deleteBtn}
                              title="Delete"
                              style={{
                                backgroundColor: "#fee2e2",
                                color: "#dc2626",
                                border: "none",
                              }}
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
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
