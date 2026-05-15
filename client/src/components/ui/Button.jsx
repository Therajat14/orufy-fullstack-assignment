export default function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  fullWidth = false,
  className = "",
  style: styleProp = {},
  type = "button",
  ...props
}) {
  const bgColor =
    {
      primary: disabled ? "#a5b4fc" : "#3b4cca",
      danger: disabled ? "#fca5a5" : "#3b4cca",
      auth: disabled ? "#a5b4fc" : "#1e2a8a",
    }[variant] ?? "#3b4cca";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center",
        "rounded-lg border-none font-semibold text-white",
        "transition-opacity duration-150 whitespace-nowrap",
        "text-[13px] h-9",
        fullWidth ? "w-full px-0" : "px-[22px]",
        disabled ? "cursor-not-allowed" : "cursor-pointer hover:opacity-[0.88]",
        className,
      ].join(" ")}
      style={{
        backgroundColor: bgColor,
        ...styleProp,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
