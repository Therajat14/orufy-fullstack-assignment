export default function FormField({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export const inputCls = (error) =>
  `w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none transition bg-white ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
      : 'border-gray-200 focus:border-[#1e1b8e] focus:ring-2 focus:ring-indigo-100'
  }`
