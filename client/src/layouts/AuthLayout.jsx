import AuthLeftPanel from "../components/auth/AuthLeftPanel";

export default function AuthLayout({ children, bottomSlot }) {
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f8f9fc",
        padding: "32px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", height: "100%" }}>
        {/* Left panel — 40% */}
        <div
          style={{
            width: "40%",
            flexShrink: 0,
          }}
        >
          <AuthLeftPanel />
        </div>

        {/* Right panel — 60% */}
        <div
          style={{
            width: "60%",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "80px 40px 40px",
            overflow: "hidden",
          }}
        >
          {/* Form — centered */}
          <div style={{ width: "100%", maxWidth: "376px" }}>{children}</div>

          {/* Bottom slot */}
          {bottomSlot && (
            <div style={{ width: "100%", maxWidth: "376px" }}>{bottomSlot}</div>
          )}
        </div>
      </div>
    </div>
  );
}
