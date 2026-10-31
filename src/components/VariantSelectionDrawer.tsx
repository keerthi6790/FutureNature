import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/VariantSelectionDrawer.module.scss";

export interface IVariantOption {
  id: string;
  name: string;
  imageUrl?: string;
  price: string;
  selling_price: string;
  discounted_amount?: string;
  available_quantity: number;
}

export interface IProductForDrawer {
  id: string;
  name: string;
  nameTamil?: string;
  image: string;
  price: number;
  originalPrice?: number;
  variants?: IVariantOption[];
}

interface VariantSelectionDrawerProps {
  isOpen: boolean;
  product: IProductForDrawer | null;
  initialVariantId?: string;
  onClose: () => void;
  onAddToCart: (product: IProductForDrawer, selectedVariant: IVariantOption) => void;
}

export default function VariantSelectionDrawer({
  isOpen,
  product,
  initialVariantId,
  onClose,
  onAddToCart,
}: VariantSelectionDrawerProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  // When drawer opens, select initialVariantId if provided, or first in-stock variant
  useEffect(() => {
    if (!isOpen || !product) return;
    const vars: IVariantOption[] =
      product.variants && product.variants.length > 0
        ? product.variants
        : [
            {
              id: product.id,
              name: "Standard",
              imageUrl: product.image,
              price: String(product.originalPrice || product.price),
              selling_price: String(product.price),
              discounted_amount: "0",
              available_quantity: 99,
            },
          ];

    if (initialVariantId && vars.some((v) => v.id === initialVariantId)) {
      setSelectedVariantId(initialVariantId);
    } else {
      const inStock = vars.find((v) => v.available_quantity > 0);
      setSelectedVariantId(inStock ? inStock.id : (vars[0]?.id || ""));
    }
  }, [product, isOpen, initialVariantId]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const variants: IVariantOption[] =
    product.variants && product.variants.length > 0
      ? product.variants
      : [
          {
            id: product.id,
            name: "Standard",
            imageUrl: product.image,
            price: String(product.originalPrice || product.price),
            selling_price: String(product.price),
            discounted_amount: "0",
            available_quantity: 99,
          },
        ];

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];
  const isOutOfStock = !selectedVariant || selectedVariant.available_quantity <= 0;

  const handleConfirmAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    onAddToCart(product, selectedVariant);
    onClose();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer (Right on Desktop, Bottom on Mobile) */}
      <div
        className={`${styles.drawer} ${isOpen ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-product-title"
      >
        {/* Mobile drag handle indicator */}
        <div className={styles.dragIndicator} />

        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerProductInfo}>
            <div className={styles.headerImgWrap}>
              <Image
                src={
                  selectedVariant?.imageUrl ||
                  product.image ||
                  "/Assets/Products/15.png"
                }
                alt={product.name}
                fill
                unoptimized
                className={styles.headerImg}
              />
            </div>
            <div className={styles.headerTitles}>
              <h3 id="drawer-product-title" className={styles.headerProductName}>
                {product.name}
              </h3>
              {product.nameTamil && (
                <p className={styles.headerProductTamil}>{product.nameTamil}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Drawer Body: Options List */}
        <div className={styles.drawerBody}>
          <div className={styles.sectionHeading}>
            <h4>Select an Option</h4>
            <p>
              Choose from {variants.length} available{" "}
              {variants.length === 1 ? "option" : "options"}
            </p>
          </div>

          <div className={styles.variantList}>
            {variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              const outOfStock = v.available_quantity <= 0;
              const mrp = parseFloat(v.price);
              const sale = parseFloat(v.selling_price);
              const discount = parseFloat(v.discounted_amount || "0");

              return (
                <div
                  key={v.id}
                  className={`${styles.variantCard} ${
                    isSelected ? styles.selected : ""
                  } ${outOfStock ? styles.outOfStock : ""}`}
                  onClick={() => {
                    if (!outOfStock) {
                      setSelectedVariantId(v.id);
                    }
                  }}
                >
                  <div className={styles.variantLeft}>
                    {/* Radio Check Circle */}
                    <div
                      className={`${styles.radioIndicator} ${
                        isSelected ? styles.radioSelected : ""
                      }`}
                    >
                      <div className={styles.radioDot} />
                    </div>

                    {/* Thumbnail if provided */}
                    {v.imageUrl && (
                      <div className={styles.variantThumb}>
                        <img src={v.imageUrl} alt={v.name} />
                      </div>
                    )}

                    <div className={styles.variantInfo}>
                      <span className={styles.variantName}>{v.name}</span>
                      {outOfStock ? (
                        <span className={styles.stockNotice}>Currently Out of Stock</span>
                      ) : v.available_quantity <= 5 ? (
                        <span className={styles.stockNotice}>
                          Only {v.available_quantity} left in stock!
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className={styles.variantRight}>
                    <div className={styles.priceRow}>
                      <span className={styles.salePrice}>
                        ₹{Math.round(sale)}
                      </span>
                      {mrp > sale && (
                        <span className={styles.mrpPrice}>
                          ₹{Math.round(mrp)}
                        </span>
                      )}
                      {discount > 0 && mrp > sale && (
                        <span className={styles.discountBadge}>
                          -{Math.round(discount)}%
                        </span>
                      )}
                    </div>

                    {outOfStock && (
                      <span className={styles.outOfStockPill}>Sold Out</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer: Two Action Buttons */}
        <div className={styles.drawerFooter}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAddToCart}
            disabled={isOutOfStock}
            className={styles.addToBagBtn}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {isOutOfStock ? "Out of Stock" : "Add to Bag"}
          </button>
        </div>
      </div>
    </>
  );
}
