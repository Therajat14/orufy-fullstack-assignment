const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function DeleteProductModal({ product, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Delete Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><XIcon /></button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you really want to delete this Product{' '}
          <span className="font-semibold">"{product.name}"</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm bg-[#1e1b8e] hover:bg-[#17158a] text-white font-semibold transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
