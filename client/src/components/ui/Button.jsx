export default function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
  style: styleProp = {},
  ...props
}) {
  const bgColor =
    {
      primary: disabled ? "#a5b4fc" : "#3b4cca",
      danger: disabled ? "#fca5a5" : "#3b4cca", // matches Figma — delete button is also indigo
    }[variant] ?? "#3b4cca";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        height: "36px",
        padding: "0 22px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: bgColor,
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.15s",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...styleProp,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "0.88";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
      {...props}
    >
      {children}
    </button>
  );
}
