import { useRef } from 'react'
import FormField, { inputCls } from '../ui/FormField'
import { UploadIcon } from '../icons'

const PRODUCT_TYPES = [
  'Foods', 'Electronics', 'Clothing', 'Books',
  'Sports', 'Beauty', 'Home & Garden', 'Toys', 'Other',
]

/**
 * images: { preview: string, file?: File }[]
 * onAddImages: (File[]) => void
 * onRemoveImage: (index: number) => void
 */
export default function ProductForm({ form, onChange, errors = {}, images = [], onAddImages, onRemoveImage }) {
  const fileRef = useRef()

  const set = (field) => (e) => onChange(field, e.target.value)

  const handleFiles = (e) => {
    onAddImages(Array.from(e.target.files))
    e.target.value = ''
  }

  return (
    <div className="px-6 py-5 space-y-4">
      <FormField label="Product Name" error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={set('name')}
          placeholder="e.g. CakeZone Walnut Brownie"
          className={inputCls(errors.name)}
        />
      </FormField>

      <FormField label="Product Type" error={errors.productType}>
        <select
          value={form.productType}
          onChange={set('productType')}
          className={inputCls(errors.productType)}
        >
          <option value="">Select product type</option>
          {PRODUCT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </FormField>

      <div className="grid grid-cols-3 gap-3">
        <FormField label="Qty Stock" error={errors.quantityStock}>
          <input
            type="number"
            value={form.quantityStock}
            onChange={set('quantityStock')}
            placeholder="200"
            className={inputCls(errors.quantityStock)}
          />
        </FormField>
        <FormField label="MRP (₹)" error={errors.mrp}>
          <input
            type="number"
            value={form.mrp}
            onChange={set('mrp')}
            placeholder="2000"
            className={inputCls(errors.mrp)}
          />
        </FormField>
        <FormField label="Sell Price (₹)" error={errors.sellingPrice}>
          <input
            type="number"
            value={form.sellingPrice}
            onChange={set('sellingPrice')}
            placeholder="1500"
            className={inputCls(errors.sellingPrice)}
          />
        </FormField>
      </div>

      <FormField label="Brand Name" error={errors.brandName}>
        <input
          type="text"
          value={form.brandName}
          onChange={set('brandName')}
          placeholder="e.g. CakeZone"
          className={inputCls(errors.brandName)}
        />
      </FormField>

      <FormField label="Upload Product Images">
        {images.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img.preview}
                  alt=""
                  className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(i)}
                  className="absolute -top-1.5 -right-1.5 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-red-500 w-5 h-5 flex items-center justify-center text-xs shadow-sm transition"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-400 transition text-2xl"
            >
              +
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl py-7 flex flex-col items-center gap-2 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition group"
          >
            <UploadIcon className="text-gray-300 group-hover:text-indigo-400 transition" />
            <p className="text-sm text-gray-400">
              Drop images here or{' '}
              <span className="text-[#1e1b8e] font-medium">Browse</span>
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFiles}
        />
      </FormField>

      <FormField label="Exchange or Return Eligibility">
        <select
          value={form.exchangeEligibility}
          onChange={set('exchangeEligibility')}
          className={inputCls()}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </FormField>
    </div>
  )
}
