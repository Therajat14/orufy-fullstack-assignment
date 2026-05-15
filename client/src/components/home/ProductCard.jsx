import { useState } from 'react'
import { ChevronLeft, ChevronRight, TrashIcon, EditIcon } from '../icons'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-0.75">
      <span className="text-[11px] text-gray-400">{label}</span>
      <span className="text-[11px] text-gray-700 font-medium">{value ?? '—'}</span>
    </div>
  )
}

export default function ProductCard({ product, onPublishToggle, onEdit, onDelete }) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = product.images || []

  const prev = (e) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + images.length) % images.length) }
  const next = (e) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % images.length) }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">

      {/* Image area */}
      <div className="relative h-44 bg-gray-50 flex items-center justify-center">
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIndex]}
              alt={product.name}
              className="h-full w-full object-contain p-3"
            />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow hover:bg-white transition">
                  <ChevronLeft size={13} />
                </button>
                <button onClick={next} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow hover:bg-white transition">
                  <ChevronRight size={13} />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition ${i === imgIndex ? 'bg-gray-500' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Published badge */}
        {product.published && (
          <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Published
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm mb-3 leading-snug">{product.name}</h3>

        <div className="divide-y divide-gray-50 flex-1">
          <Row label="Product type" value={product.productType} />
          <Row label="Quantity Stock" value={product.quantityStock} />
          <Row label="MRP" value={`₹ ${product.mrp}`} />
          <Row label="Selling Price" value={`₹ ${product.sellingPrice}`} />
          <Row label="Brand Name" value={product.brandName} />
          <Row label="Total Images" value={images.length} />
          <Row label="Exchange Eligible" value={product.exchangeEligibility ? 'YES' : 'NO'} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
          <button
            onClick={() => onPublishToggle(product)}
            className={`flex-1 text-[12px] font-semibold py-2 rounded-xl transition active:scale-[0.97] ${
              product.published
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-[#1e1b8e] hover:bg-[#17158a] text-white'
            }`}
          >
            {product.published ? 'Unpublish' : 'Publish'}
          </button>

          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition active:scale-[0.97]"
          >
            Edit
            <EditIcon />
          </button>

          <button
            onClick={() => onDelete(product)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition active:scale-[0.97]"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
