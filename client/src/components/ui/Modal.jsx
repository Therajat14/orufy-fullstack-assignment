import { useEffect } from "react";
import { XIcon } from "../icons";

export default function Modal({
  title,
  onClose,
  children,
  footer,
  size = "md",
}) {
  const sizeMap = { sm: "360px", md: "420px", lg: "500px" };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 22, 40, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 20px 48px rgba(0,0,0,0.20)",
          width: "100%",
          maxWidth: sizeMap[size],
          maxHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px 13px",
            borderBottom: "1px solid #ECEEF2",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 700,
              color: "#0f1623",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#6B7280",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#F3F4F6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <XIcon size={14} />
          </button>
        </div>

        {/* Scrollable body — scrollbar hidden */}
        <div
          className="modal-scroll-body"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`.modal-scroll-body::-webkit-scrollbar { display: none; }`}</style>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: "10px 18px",
              borderTop: "1px solid #ECEEF2",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
