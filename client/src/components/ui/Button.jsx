const variants = {
  primary:   'bg-[#1824e8] hover:bg-[#1018bf] text-white shadow-[0_8px_18px_rgba(24,36,232,0.18)]',
  auth:      'bg-[#071074] hover:bg-[#050b5d] text-white',
  secondary: 'bg-white border border-[#d7dce5] text-[#344054] hover:bg-[#f8fafc]',
  danger:    'bg-[#1824e8] hover:bg-[#1018bf] text-white shadow-[0_8px_18px_rgba(24,36,232,0.18)]',
  ghost:     'text-[#667085] hover:bg-[#f2f4f7]',
}

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-10 px-5 text-sm',
  lg: 'h-11 px-7 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-1.5
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold rounded-lg transition-all active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `.trim()}
    >
      {children}
    </button>
  )
}
