import { useEffect } from "react";
import { XIcon } from "../icons";

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "#ffffff",
        border: "1px solid #E4E7EC",
        borderRadius: "14px",
        padding: "10px 16px 10px 12px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.13)",
        whiteSpace: "nowrap",
      }}
    >
      {/* Rounded square green check */}
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          backgroundColor: "#12B76A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2.5 7l3.5 3.5 5.5-6"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Message */}
      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#344054",
        }}
      >
        {message}
      </span>

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 0 0 4px",
          color: "#98A2B3",
          display: "flex",
          alignItems: "center",
          lineHeight: 1,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#344054")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#98A2B3")}
      >
        <XIcon size={16} />
      </button>
    </div>
  );
}
