import { useRef, useState, useEffect } from "react";

const PRODUCT_TYPES = [
  "Foods",
  "Electronics",
  "Clothes",
  "Beauty Products",
  "Others",
];
const ELIGIBILITY = ["Yes", "No"];

const inputStyle = (hasError) => ({
  height: "36px",
  width: "100%",
  border: `1px solid ${hasError ? "#ef4444" : "#E2E6EE"}`,
  borderRadius: "6px",
  padding: "0 11px",
  fontSize: "12.5px",
  color: "#1a1f2e",
  backgroundColor: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s, box-shadow 0.15s",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "textfield",
});

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#1a1f2e",
  marginBottom: "5px",
};

const css = `
  .pf-input:focus { border-color: #3b4cca !important; box-shadow: 0 0 0 3px rgba(59,76,202,0.09); }
  .pf-input::placeholder { color: #C5CAD5; font-size: 12px; }
  .pf-input[type=number]::-webkit-inner-spin-button,
  .pf-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  .pf-dd-option:hover { background-color: #F0F4FF; }
  .pf-upload-zone:hover { border-color: #8a8fd6 !important; background: rgba(238,240,255,0.2) !important; }
`;

function CustomSelect({ value, onChange, options, placeholder, hasError }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const match = options.find((o) => (o.value ?? o) === value);
  const displayLabel = match ? (match.label ?? match) : null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          ...inputStyle(hasError),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          color: displayLabel ? "#1a1f2e" : "#C5CAD5",
          background: "#fff",
        }}
      >
        <span style={{ fontSize: "12.5px" }}>
          {displayLabel ?? placeholder}
        </span>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6l4 4 4-4"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 3px)",
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            border: "1px solid #E8ECF2",
            borderRadius: "7px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
            zIndex: 200,
            overflow: "hidden",
            padding: "3px 0",
          }}
        >
          {options.map((opt) => {
            const val = opt.value ?? opt;
            const lbl = opt.label ?? opt;
            const isSelected = val === value;
            return (
              <div
                key={val}
                className="pf-dd-option"
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
                style={{
                  padding: "7px 12px",
                  fontSize: "12.5px",
                  color: "#1a1f2e",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#EEF2FF" : "transparent",
                  fontWeight: isSelected ? 500 : 400,
                  transition: "background 0.1s",
                }}
              >
                {lbl}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductForm({
  form,
  onChange,
  errors = {},
  images = [],
  onAddImages,
  onRemoveImage,
}) {
  const fileRef = useRef();
  const set = (f) => (e) => onChange(f, e.target.value);
  const setVal = (f) => (val) => onChange(f, val);
  const handleFiles = (e) => {
    onAddImages(Array.from(e.target.files));
    e.target.value = "";
  };

  return (
    <>
      <style>{css}</style>
      <div
        style={{
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "13px",
        }}
      >
        {/* Product Name */}
        <div>
          <label style={labelStyle}>Product Name</label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="CakeZone Walnut Brownie"
            className="pf-input"
            style={inputStyle(errors.name)}
          />
          {errors.name && (
            <span
              style={{
                fontSize: "11px",
                color: "#ef4444",
                marginTop: "3px",
                display: "block",
              }}
            >
              {errors.name}
            </span>
          )}
        </div>

        {/* Product Type */}
        <div>
          <label style={labelStyle}>Product Type</label>
          <CustomSelect
            value={form.productType}
            onChange={setVal("productType")}
            options={PRODUCT_TYPES}
            placeholder="Select product type"
            hasError={!!errors.productType}
          />
          {errors.productType && (
            <span
              style={{
                fontSize: "11px",
                color: "#ef4444",
                marginTop: "3px",
                display: "block",
              }}
            >
              {errors.productType}
            </span>
          )}
        </div>

        {/* Quantity Stock */}
        <div>
          <label style={labelStyle}>Quantity Stock</label>
          <input
            type="number"
            value={form.quantityStock}
            onChange={set("quantityStock")}
            placeholder="Total numbers of Stock available"
            className="pf-input"
            style={inputStyle(errors.quantityStock)}
          />
          {errors.quantityStock && (
            <span
              style={{
                fontSize: "11px",
                color: "#ef4444",
                marginTop: "3px",
                display: "block",
              }}
            >
              {errors.quantityStock}
            </span>
          )}
        </div>

        {/* MRP */}
        <div>
          <label style={labelStyle}>MRP</label>
          <input
            type="number"
            value={form.mrp}
            onChange={set("mrp")}
            placeholder="Total numbers of Stock available"
            className="pf-input"
            style={inputStyle(errors.mrp)}
          />
          {errors.mrp && (
            <span
              style={{
                fontSize: "11px",
                color: "#ef4444",
                marginTop: "3px",
                display: "block",
              }}
            >
              {errors.mrp}
            </span>
          )}
        </div>

        {/* Selling Price */}
        <div>
          <label style={labelStyle}>Selling Price</label>
          <input
            type="number"
            value={form.sellingPrice}
            onChange={set("sellingPrice")}
            placeholder="Total numbers of Stock available"
            className="pf-input"
            style={inputStyle(errors.sellingPrice)}
          />
          {errors.sellingPrice && (
            <span
              style={{
                fontSize: "11px",
                color: "#ef4444",
                marginTop: "3px",
                display: "block",
              }}
            >
              {errors.sellingPrice}
            </span>
          )}
        </div>

        {/* Brand Name */}
        <div>
          <label style={labelStyle}>Brand Name</label>
          <input
            type="text"
            value={form.brandName}
            onChange={set("brandName")}
            placeholder="Total numbers of Stock available"
            className="pf-input"
            style={inputStyle(errors.brandName)}
          />
          {errors.brandName && (
            <span
              style={{
                fontSize: "11px",
                color: "#ef4444",
                marginTop: "3px",
                display: "block",
              }}
            >
              {errors.brandName}
            </span>
          )}
        </div>

        {/* Upload Product Images */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <label style={{ ...labelStyle, margin: 0 }}>
              Upload Product Images
            </label>
            {images.length > 0 && (
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#26324b",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Add More Photos
              </button>
            )}
          </div>

          {images.length > 0 ? (
            <div
              style={{
                minHeight: "60px",
                borderRadius: "6px",
                border: "1.5px dashed #D7DCE5",
                padding: "8px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {images.map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={img.preview}
                    alt=""
                    style={{
                      width: "44px",
                      height: "44px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      border: "1px solid #E2E6EE",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(i)}
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "#fff",
                      border: "1px solid #CFD5DF",
                      color: "#26324b",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.10)",
                      lineHeight: 1,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#ef4444")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#26324b")
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="pf-upload-zone"
              onClick={() => fileRef.current.click()}
              style={{
                minHeight: "68px",
                border: "1.5px dashed #D7DCE5",
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "border-color 0.15s, background 0.15s",
                gap: "1px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#B8BEC9",
                  textAlign: "center",
                }}
              >
                Enter Description
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1a1f2e",
                  textAlign: "center",
                }}
              >
                Browse
              </p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFiles}
          />
        </div>

        {/* Exchange or return eligibility */}
        <div>
          <label style={labelStyle}>Exchange or return eligibility</label>
          <CustomSelect
            value={form.exchangeEligibility}
            onChange={setVal("exchangeEligibility")}
            options={ELIGIBILITY}
          />
        </div>
      </div>
    </>
  );
}
