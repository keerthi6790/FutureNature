import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import toast from "react-hot-toast";
import { BlogItem, blogApi } from "@/api/blogApi";
import { uploadImageToAWS, deleteImageFromAWS } from "@/utils/uploadToAws";
import styles from "@/styles/ManageBlogs.module.scss";
import AdminGuard from "@/components/AdminGuard";

export default function ManageBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [redirectionLink, setRedirectionLink] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogApi.getBlogs(true);
      if (response.status) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blog entries");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    setIsUploadingImage(true);
    const toastId = toast.loading("Uploading image to AWS S3...");
    try {
      const s3Url = await uploadImageToAWS(file, "blogs");
      setImageUrl(s3Url);
      toast.success("Image uploaded to AWS S3 successfully!", { id: toastId });
    } catch (err: any) {
      console.error("AWS S3 Upload Error:", err);
      toast.error(err?.message || "Failed to upload image to AWS S3", { id: toastId });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!subtitle.trim()) {
      toast.error("Please enter a subtitle / tagline");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!imageUrl) {
      toast.error("Please upload or provide an image for the blog");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        imageUrl,
        redirectionLink: redirectionLink.trim() || undefined,
        order: Number(order) || 0,
        isActive,
      };

      if (editingId) {
        const response = await blogApi.updateBlog(editingId, payload);
        if (response.status) {
          toast.success("Blog article updated successfully!");
          resetForm();
          fetchBlogs();
        }
      } else {
        const response = await blogApi.addBlog(payload);
        if (response.status) {
          toast.success("Blog article created successfully!");
          resetForm();
          fetchBlogs();
        }
      }
    } catch (error: any) {
      console.error("Error saving blog article:", error);
      toast.error(error?.response?.data?.message || "Failed to save blog article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setImageUrl("");
    setRedirectionLink("");
    setOrder(0);
    setIsActive(true);
  };

  const handleEdit = (blog: BlogItem) => {
    setEditingId(blog.id);
    setTitle(blog.title || "");
    setSubtitle(blog.subtitle || "");
    setDescription(blog.description || "");
    setImageUrl(blog.imageUrl || "");
    setRedirectionLink(blog.redirectionLink || "");
    setOrder(blog.order || 0);
    setIsActive(blog.isActive !== undefined ? blog.isActive : true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveImage = async () => {
    const toDelete = imageUrl;
    setImageUrl("");
    if (toDelete) {
      await deleteImageFromAWS(toDelete);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog item?")) return;

    try {
      const blogToDelete = blogs.find((b) => b.id === id);
      const response = await blogApi.deleteBlog(id);
      if (response.status) {
        if (blogToDelete?.imageUrl) {
          await deleteImageFromAWS(blogToDelete.imageUrl);
        }
        toast.success("Blog item deleted successfully");
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error("Error deleting blog item:", error);
      toast.error("Failed to delete blog item");
    }
  };

  return (
    <AdminGuard>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <button
                onClick={() => router.push("/")}
                className={styles.backBtn}
              >
                <span>&larr;</span> Back to Home Page
              </button>
              <h1 className={styles.title}>Blog Management</h1>
              <p className={styles.subtitle}>
                Add, edit, or remove wellness journal items, product redirection links, and descriptions.
              </p>
            </div>
          </div>

          <div className={styles.mainGrid}>
            {/* Form */}
            <form className={styles.addForm} onSubmit={handleSubmit}>
              <div className={styles.formHeader}>
                <h2>{editingId ? "Edit Blog Article" : "Add New Blog Article"}</h2>
                {editingId && (
                  <span className={styles.editingBadge}>
                    Editing #{editingId.slice(0, 8)}...
                  </span>
                )}
              </div>

              <div className={styles.formGrid}>
                {/* Title */}
                <div className={styles.formGroup}>
                  <label htmlFor="blogTitle">Product / Blend Title *</label>
                  <input
                    id="blogTitle"
                    type="text"
                    placeholder="e.g. GINGER HONEY"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Subtitle */}
                <div className={styles.formGroup}>
                  <label htmlFor="blogSubtitle">Subtitle / Tagline *</label>
                  <input
                    id="blogSubtitle"
                    type="text"
                    placeholder="e.g. The Energizer or Daily Immunity"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    required
                  />
                </div>

                {/* Redirection Link */}
                <div className={styles.formGroup}>
                  <label htmlFor="redirectionLink">
                    Product Redirection Link (URL for &quot;View Details&quot;)
                  </label>
                  <input
                    id="redirectionLink"
                    type="text"
                    placeholder="e.g. /products or /product/123 or https://..."
                    value={redirectionLink}
                    onChange={(e) => setRedirectionLink(e.target.value)}
                  />
                </div>

                {/* Display Order */}
                <div className={styles.formGroup}>
                  <label htmlFor="displayOrder">Display Order</label>
                  <input
                    id="displayOrder"
                    type="number"
                    min="0"
                    placeholder="e.g. 1, 2, 3..."
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  />
                </div>

                {/* Description */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="blogDesc">Description & Wellness Benefits *</label>
                  <textarea
                    id="blogDesc"
                    rows={4}
                    placeholder="Describe the healing ingredients, benefits, and usage ritual..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Image Upload & Preview */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Product / Blog Image *</label>
                  <div className={styles.uploadCard}>
                    {!imageUrl ? (
                      <div
                        className={`${styles.dropZone} ${dragActive ? styles.dragActive : ""}`}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          setDragActive(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setDragActive(false);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragActive(true);
                        }}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("blogImageUpload")?.click()}
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
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                        <div className={styles.text}>
                          <strong>
                            {isUploadingImage
                              ? "Uploading to AWS S3..."
                              : "Click or Drag & Drop to Upload Image"}
                          </strong>
                          <p>
                            {isUploadingImage
                              ? "Please wait while your image is saved to AWS S3"
                              : "PNG, JPG, WEBP, or SVG formats (Uploaded to AWS S3)"}
                          </p>
                        </div>
                        <input
                          id="blogImageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isUploadingImage}
                          style={{ display: "none" }}
                        />
                      </div>
                    ) : (
                      <div className={styles.imagePreview}>
                        <Image
                          src={imageUrl}
                          alt="Blog Preview"
                          fill
                          unoptimized
                        />
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={handleRemoveImage}
                          title="Remove image from AWS S3"
                        >
                          &times;
                        </button>
                      </div>
                    )}

                    <div style={{ marginTop: "8px" }}>
                      <input
                        type="text"
                        placeholder="Or enter / paste direct Image URL directly"
                        value={imageUrl.startsWith("data:") ? "" : imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={{
                          fontSize: "13px",
                          padding: "8px 12px",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Visibility Checkbox */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    Visible on Blog Page (Active)
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.btnGroup}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting || isUploadingImage}
                >
                  {isUploadingImage
                    ? "Uploading Image..."
                    : isSubmitting
                      ? "Saving Article..."
                      : editingId
                        ? "Update Blog Article"
                        : "Add Blog Article"}
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

            {/* Existing Blogs List */}
            <div className={styles.listCard}>
              <div className={styles.listHeader}>
                <h2>Live Blog Items</h2>
                <span className={styles.countBadge}>
                  {blogs.length} Total ({blogs.filter((b) => b.isActive).length} Active)
                </span>
              </div>

              {loading ? (
                <div className={styles.loadingState}>Loading blog articles...</div>
              ) : blogs.length === 0 ? (
                <div className={styles.emptyState}>
                  No blog articles found. Add your first wellness product blend above!
                </div>
              ) : (
                <div className={styles.blogGrid}>
                  {blogs.map((item, index) => (
                    <div key={item.id} className={styles.blogCard}>
                      <div className={styles.blogCardMedia}>
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          unoptimized
                        />
                        <span className={styles.orderBadge}>
                          #{item.order !== undefined && item.order > 0 ? item.order : index + 1}
                        </span>
                        <span
                          className={`${styles.statusBadge} ${
                            item.isActive ? styles.active : styles.inactive
                          }`}
                        >
                          {item.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>

                      <div className={styles.blogCardBody}>
                        <span className={styles.blogCardTagline}>{item.subtitle}</span>
                        <h3 className={styles.blogCardTitle}>{item.title}</h3>
                        <p className={styles.blogCardDesc}>{item.description}</p>
                        
                        <div className={styles.blogCardLink}>
                          <span>Target:</span>
                          {item.redirectionLink ? (
                            <a
                              href={item.redirectionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.redirectionLink}
                            </a>
                          ) : (
                            <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                              Default (/products)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.blogCardActions}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
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
