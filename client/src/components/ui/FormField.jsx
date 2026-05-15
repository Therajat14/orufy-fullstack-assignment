export default function FormField({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[#26324b] mb-2">{label}</label>
      {children}
      {error && <p className="text-[#ff3b30] text-sm mt-1.5">{error}</p>}
    </div>
  )
}
