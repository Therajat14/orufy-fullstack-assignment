const variants = {
  primary:   'bg-[#1e1b8e] hover:bg-[#17158a] text-white',
  secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
  danger:    'bg-[#1e1b8e] hover:bg-[#17158a] text-white',
  ghost:     'text-gray-600 hover:bg-gray-100',
}

const sizes = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-sm',
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
        font-semibold rounded-xl transition-all active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `.trim()}
    >
      {children}
    </button>
  )
}
