import { useState } from 'react'

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default function ProductCard({ product, onPublishToggle, onEdit, onDelete }) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = product.images || []

  const prevImg = () => setImgIndex((i) => (i - 1 + images.length) % images.length)
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Image carousel */}
      <div className="relative h-44 bg-gray-50 flex items-center justify-center">
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIndex]}
              alt={product.name}
              className="h-full w-full object-contain p-2"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-0.5 shadow hover:bg-white transition"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-0.5 shadow hover:bg-white transition"
                >
                  <ChevronRight />
                </button>
              </>
            )}
            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition ${i === imgIndex ? 'bg-gray-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-300 text-sm">No image</div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>

        <div className="space-y-1 text-xs">
          <Row label="Product type" value={product.productType} />
          <Row label="Quantity Stock" value={product.quantityStock} />
          <Row label="MRP" value={`₹ ${product.mrp}`} />
          <Row label="Selling Price" value={`₹ ${product.sellingPrice}`} />
          <Row label="Brand Name" value={product.brandName} />
          <Row label="Total Number of images" value={images.length} />
          <Row label="Exchange Eligibility" value={product.exchangeEligibility ? 'YES' : 'NO'} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <button
            onClick={() => onPublishToggle(product)}
            className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition ${
              product.published
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-[#1e1b8e] hover:bg-[#17158a] text-white'
            }`}
          >
            {product.published ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex-1 text-xs font-semibold py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1"
          >
            Edit
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label} -</span>
      <span className="text-gray-800 font-medium">{value ?? '—'}</span>
    </div>
  )
}
