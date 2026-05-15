export default function EmptyState({ icon, title, description, action }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "420px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      <div style={{ color: "#111652" }}>{icon}</div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 600,
            color: "#344054",
            lineHeight: "1.2",
          }}
        >
          {title}
        </p>
        {description && (
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              color: "#98A2B3",
              lineHeight: "1.5",
              maxWidth: "280px",
              whiteSpace: "pre-line",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {action && <div style={{ marginTop: "8px" }}>{action}</div>}
    </div>
  );
}
