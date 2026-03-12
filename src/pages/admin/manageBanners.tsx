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
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const response = await bannerApi.updateBanner(editingId, {
          imageUrl,
          isActive,
        });
        if (response.status) {
          toast.success("Banner updated successfully");
          setEditingId(null);
        }
      } else {
        const response = await bannerApi.addBanner({ imageUrl, isActive });
        if (response.status) {
          toast.success("Banner added successfully");
        }
      }
      setImageUrl("");
      setIsActive(true);
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setImageUrl(banner.imageUrl);
    setIsActive(banner.isActive);
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

  const cancelEdit = () => {
    setEditingId(null);
    setImageUrl("");
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
          </div>

          <div className={styles.mainGrid}>
            {/* Left Side: Form */}
            <form className={styles.addForm} onSubmit={handleSubmit}>
              <h2>{editingId ? "Edit Banner" : "Create New Banner"}</h2>

              <div className={styles.formGroup}>
                <label>Banner Image</label>
                {!imageUrl ? (
                  <div
                    className={`${styles.dropZone} ${dragActive ? styles.dragActive : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("imageUpload")?.click()
                    }
                  >
                    <div className={styles.icon}>
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className={styles.text}>
                      <strong>Click to upload</strong> or drag and drop
                      <p
                        style={{
                          marginTop: "4px",
                          fontSize: "12px",
                          color: "#9ca3af",
                        }}
                      >
                        SVG, PNG, JPG (Recommended: 1560x360px)
                      </p>
                    </div>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                ) : (
                  <div className={styles.imagePreview}>
                    <Image src={imageUrl} alt="Preview" fill />
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => setImageUrl("")}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              <label className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Show this banner on homepage
              </label>

              <div className={styles.btnGroup}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Working..."
                    : editingId
                      ? "Update Banner"
                      : "Save Banner"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Right Side: List */}
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
                      <div className={styles.imageArea}>
                        <Image src={banner.imageUrl} alt="Banner" fill />
                      </div>
                      <div className={styles.cardContent}>
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
