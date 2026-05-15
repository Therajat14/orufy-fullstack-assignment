import { useState } from 'react'
import { ChevronLeft, ChevronRight, TrashIcon } from '../icons'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-[3px]">
      <span className="text-[15px] leading-5 text-[#98a2b3]">{label} -</span>
      <span className="text-[15px] leading-5 text-[#344054] font-medium">{value ?? '—'}</span>
    </div>
  )
}

export default function ProductCard({ product, onPublishToggle, onEdit, onDelete }) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = product.images || []

  const prev = (e) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + images.length) % images.length) }
  const next = (e) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % images.length) }

  return (
    <div className="bg-white rounded-2xl border border-[#dfe4ec] shadow-[0_4px_14px_rgba(16,24,40,0.14)] hover:shadow-[0_8px_20px_rgba(16,24,40,0.16)] transition-shadow flex flex-col overflow-hidden">

      <div className="relative h-[198px] m-4 mb-2 rounded-lg border border-[#d7dce5] bg-[#f8fafc] flex items-center justify-center overflow-hidden">
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
                <div className="absolute bottom-[-11px] left-0 right-0 flex justify-center">
                  <div className="flex items-center gap-1 rounded-full border border-[#e6e9ef] bg-white px-2 py-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition ${i === imgIndex ? 'bg-[#ff6b3a]' : 'bg-[#d7dce5]'}`}
                    />
                  ))}
                  </div>
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

      </div>

      <div className="px-4 pb-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-black text-base mb-2 leading-snug">{product.name}</h3>

        <div className="flex-1">
          <Row label="Product type" value={product.productType || 'Food'} />
          <Row label="Quantity Stock" value={product.quantityStock} />
          <Row label="MRP" value={`₹ ${product.mrp}`} />
          <Row label="Selling Price" value={`₹ ${product.sellingPrice}`} />
          <Row label="Brand Name" value={product.brandName} />
          <Row label="Total Number of images" value={images.length} />
          <Row label="Exchange Eligibility" value={product.exchangeEligibility ? '.YES' : '.NO'} />
        </div>

        <div className="grid grid-cols-[1fr_1fr_40px] items-center gap-3 mt-4">
          <button
            onClick={() => onPublishToggle(product)}
            className={`h-10 text-sm font-semibold rounded-lg transition active:scale-[0.97] ${
              product.published
                ? 'bg-[#27c900] hover:bg-[#22ad00] text-white'
                : 'bg-[#1824e8] hover:bg-[#1018bf] text-white'
            }`}
          >
            {product.published ? 'Unpublish' : 'Publish'}
          </button>

          <button
            onClick={() => onEdit(product)}
            className="h-10 text-sm font-semibold rounded-lg border border-[#344054] text-[#344054] hover:bg-[#f8fafc] transition active:scale-[0.97]"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(product)}
            className="h-10 w-10 flex items-center justify-center text-[#98a2b3] border border-[#d7dce5] hover:text-red-500 hover:bg-red-50 rounded-lg transition active:scale-[0.97]"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
