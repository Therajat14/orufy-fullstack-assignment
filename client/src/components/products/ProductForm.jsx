import { useRef } from 'react'
import FormField from '../ui/FormField'
import { inputCls } from '../ui/formStyles'
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
    <div className="px-6 py-6 space-y-4">
      <FormField label="Product Name" error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={set('name')}
          placeholder="CakeZone Walnut Brownie"
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

      <FormField label="Quantity Stock" error={errors.quantityStock}>
        <input
          type="number"
          value={form.quantityStock}
          onChange={set('quantityStock')}
          placeholder="Total numbers of Stock available"
          className={inputCls(errors.quantityStock)}
        />
      </FormField>

      <FormField label="MRP" error={errors.mrp}>
        <input
          type="number"
          value={form.mrp}
          onChange={set('mrp')}
          placeholder="Total numbers of Stock available"
          className={inputCls(errors.mrp)}
        />
      </FormField>

      <FormField label="Selling Price" error={errors.sellingPrice}>
        <input
          type="number"
          value={form.sellingPrice}
          onChange={set('sellingPrice')}
          placeholder="Total numbers of Stock available"
          className={inputCls(errors.sellingPrice)}
        />
      </FormField>

      <FormField label="Brand Name" error={errors.brandName}>
        <input
          type="text"
          value={form.brandName}
          onChange={set('brandName')}
          placeholder="Total numbers of Stock available"
          className={inputCls(errors.brandName)}
        />
      </FormField>

      <FormField
        label={
          <div className="flex items-center justify-between">
            <span>Upload Product Images</span>
            {images.length > 0 && (
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="font-medium text-[#26324b]"
              >
                Add More Photos
              </button>
            )}
          </div>
        }
      >
        {images.length > 0 ? (
          <div className="min-h-20 rounded-lg border border-dashed border-[#d7dce5] px-3 py-3 flex flex-wrap gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img.preview}
                  alt=""
                  className="w-14 h-14 object-cover rounded-md border border-[#d7dce5]"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(i)}
                  className="absolute -top-2 -right-2 bg-white rounded-full border border-[#cfd5df] text-[#26324b] hover:text-red-500 w-5 h-5 flex items-center justify-center text-xs shadow-sm transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() => fileRef.current.click()}
            className="min-h-20 border border-dashed border-[#d7dce5] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#8a8fd6] hover:bg-indigo-50/30 transition group"
          >
            <UploadIcon className="hidden text-gray-300 group-hover:text-indigo-400 transition" />
            <p className="text-sm text-[#98a2b3] leading-5 text-center">
              Enter Description
              <br />
              <span className="font-semibold text-[#344054]">Browse</span>
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

      <FormField label="Exchange or return eligibility">
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
