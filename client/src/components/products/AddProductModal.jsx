import { useState, useRef } from 'react'
import api from '../../services/api'

const PRODUCT_TYPES = ['Foods', 'Electronics', 'Clothing', 'Books', 'Sports', 'Beauty', 'Home & Garden', 'Toys', 'Other']

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', productType: '', quantityStock: '', mrp: '',
    sellingPrice: '', brandName: '', exchangeEligibility: 'Yes',
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: '' }))
  }

  const handleFiles = (files) => {
    const newFiles = Array.from(files)
    setImages((prev) => [...prev, ...newFiles])
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f))
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter product name'
    if (!form.productType) e.productType = 'Select product type'
    if (!form.quantityStock) e.quantityStock = 'Required'
    if (!form.mrp) e.mrp = 'Required'
    if (!form.sellingPrice) e.sellingPrice = 'Required'
    if (!form.brandName.trim()) e.brandName = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach((img) => fd.append('images', img))
      const { data } = await api.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onAdd(data)
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to create product' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          <Field label="Product Name" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="Enter product name"
              className={inputCls(errors.name)}
            />
          </Field>

          <Field label="Product Type" error={errors.productType}>
            <select value={form.productType} onChange={set('productType')} className={inputCls(errors.productType)}>
              <option value="">Select product type</option>
              {PRODUCT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Quantity Stock" error={errors.quantityStock}>
            <input type="number" value={form.quantityStock} onChange={set('quantityStock')}
              placeholder="Total numbers of Stock available" className={inputCls(errors.quantityStock)} />
          </Field>

          <Field label="MRP" error={errors.mrp}>
            <input type="number" value={form.mrp} onChange={set('mrp')}
              placeholder="Maximum Retail Price" className={inputCls(errors.mrp)} />
          </Field>

          <Field label="Selling Price" error={errors.sellingPrice}>
            <input type="number" value={form.sellingPrice} onChange={set('sellingPrice')}
              placeholder="Selling price" className={inputCls(errors.sellingPrice)} />
          </Field>

          <Field label="Brand Name" error={errors.brandName}>
            <input type="text" value={form.brandName} onChange={set('brandName')}
              placeholder="Brand name" className={inputCls(errors.brandName)} />
          </Field>

          <Field label="Upload Product Images">
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} className="w-16 h-16 object-cover rounded-lg border" alt="" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-white rounded-full border border-gray-300 text-gray-500 hover:text-red-500 w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-400 transition text-xl"
                >
                  +
                </button>
              </div>
            )}
            {previews.length === 0 && (
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition"
              >
                <p className="text-sm text-gray-400">Enter Description</p>
                <p className="text-sm font-semibold text-gray-600">Browse</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </Field>

          <Field label="Exchange or return eligibility">
            <select value={form.exchangeEligibility} onChange={set('exchangeEligibility')} className={inputCls()}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </Field>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#1e1b8e] hover:bg-[#17158a] text-white font-semibold px-8 py-2 rounded-lg transition disabled:opacity-60 text-sm"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const inputCls = (err) =>
  `w-full border rounded-lg px-3 py-2 text-sm outline-none transition ${
    err ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
  }`
