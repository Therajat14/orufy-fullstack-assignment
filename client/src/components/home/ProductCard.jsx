import { useState } from "react";
import { ChevronLeft, ChevronRight, TrashIcon } from "../icons";

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          color: "#98A2B3",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {label} -
      </span>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#344054",
          textAlign: "right",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "55%",
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function ProductCard({
  product,
  onPublishToggle,
  onEdit,
  onDelete,
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = product.images || [];

  const prev = (e) => {
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #EAECF0",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#C8CDD5";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#EAECF0";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          height: "148px",
          backgroundColor: "#F5F6FA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIndex]}
              alt={product.name}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
                padding: "10px",
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  style={{
                    position: "absolute",
                    left: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#fff",
                    borderRadius: "50%",
                    border: "1px solid #EAECF0",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <ChevronLeft size={10} />
                </button>
                <button
                  onClick={next}
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#fff",
                    borderRadius: "50%",
                    border: "1px solid #EAECF0",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <ChevronRight size={10} />
                </button>
                <div
                  style={{
                    position: "absolute",
                    bottom: "7px",
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        backgroundColor: i === imgIndex ? "#111652" : "#D0D5DD",
                        transition: "background 0.15s",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D0D5DD"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontSize: "10px", color: "#98A2B3" }}>No image</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Name */}
        <h3
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 700,
            color: "#101828",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </h3>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Row label="Product type" value={product.productType} />
          <Row label="Quantity Stock" value={product.quantityStock} />
          <Row label="MRP" value={`₹ ${product.mrp}`} />
          <Row label="Selling Price" value={`₹ ${product.sellingPrice}`} />
          <Row label="Brand Name" value={product.brandName} />
          <Row label="Total Number of images" value={images.length} />
          <Row
            label="Exchange Eligiblity"
            value={product.exchangeEligibility ?? "YES"}
          />
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            paddingTop: "2px",
          }}
        >
          <button
            onClick={() => onPublishToggle(product)}
            style={{
              flex: 1,
              height: "34px",
              borderRadius: "7px",
              border: "none",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.15s",
              backgroundColor: product.published ? "#12B76A" : "#111652",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {product.published ? "Unpublish" : "Publish"}
          </button>

          <button
            onClick={() => onEdit(product)}
            style={{
              height: "34px",
              padding: "0 14px",
              borderRadius: "7px",
              border: "1px solid #D0D5DD",
              backgroundColor: "#ffffff",
              color: "#344054",
              fontSize: "12.5px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#F9FAFB")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ffffff")
            }
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(product)}
            style={{
              height: "34px",
              width: "34px",
              flexShrink: 0,
              borderRadius: "7px",
              border: "1px solid #D0D5DD",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#667085",
              transition: "all 0.15s",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FEF2F2";
              e.currentTarget.style.borderColor = "#FECACA";
              e.currentTarget.style.color = "#EF4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#D0D5DD";
              e.currentTarget.style.color = "#667085";
            }}
          >
            <TrashIcon size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
