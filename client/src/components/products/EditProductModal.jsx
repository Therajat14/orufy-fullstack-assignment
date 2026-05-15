import { useState, useRef } from 'react'
import api from '../../services/api'

const PRODUCT_TYPES = ['Foods', 'Electronics', 'Clothing', 'Books', 'Sports', 'Beauty', 'Home & Garden', 'Toys', 'Other']

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name || '',
    productType: product.productType || '',
    quantityStock: product.quantityStock ?? '',
    mrp: product.mrp ?? '',
    sellingPrice: product.sellingPrice ?? '',
    brandName: product.brandName || '',
    exchangeEligibility: product.exchangeEligibility ? 'Yes' : 'No',
  })
  const [existingImages] = useState(product.images || [])
  const [newImages, setNewImages] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleFiles = (files) => {
    const arr = Array.from(files)
    setNewImages((prev) => [...prev, ...arr])
    setNewPreviews((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      newImages.forEach((img) => fd.append('images', img))
      const { data } = await api.put(`/products/${product._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onSave(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Edit Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><XIcon /></button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          <Field label="Product Name">
            <input type="text" value={form.name} onChange={set('name')}
              className={inputCls()} placeholder="Product name" />
          </Field>

          <Field label="Product Type">
            <select value={form.productType} onChange={set('productType')} className={inputCls()}>
              <option value="">Select product type</option>
              {PRODUCT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Quantity Stock">
            <input type="number" value={form.quantityStock} onChange={set('quantityStock')} className={inputCls()} />
          </Field>

          <Field label="MRP">
            <input type="number" value={form.mrp} onChange={set('mrp')} className={inputCls()} />
          </Field>

          <Field label="Selling Price">
            <input type="number" value={form.sellingPrice} onChange={set('sellingPrice')} className={inputCls()} />
          </Field>

          <Field label="Brand Name">
            <input type="text" value={form.brandName} onChange={set('brandName')} className={inputCls()} />
          </Field>

          <Field label="Upload Product Images">
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((src, i) => (
                <img key={i} src={src} className="w-16 h-16 object-cover rounded-lg border" alt="" />
              ))}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative">
                  <img src={src} className="w-16 h-16 object-cover rounded-lg border" alt="" />
                  <button type="button" onClick={() => {
                    setNewImages((p) => p.filter((_, j) => j !== i))
                    setNewPreviews((p) => p.filter((_, j) => j !== i))
                  }} className="absolute -top-1.5 -right-1.5 bg-white rounded-full border border-gray-300 text-gray-500 hover:text-red-500 w-5 h-5 flex items-center justify-center text-xs">
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => fileRef.current.click()}
                className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-400 transition text-xl">
                +
              </button>
            </div>
            <button type="button" onClick={() => fileRef.current.click()}
              className="text-xs text-indigo-600 hover:underline">Add More Photos</button>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
              onChange={(e) => handleFiles(e.target.files)} />
          </Field>

          <Field label="Exchange or return eligibility">
            <select value={form.exchangeEligibility} onChange={set('exchangeEligibility')} className={inputCls()}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </Field>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button onClick={handleSubmit} disabled={loading}
            className="bg-[#1e1b8e] hover:bg-[#17158a] text-white font-semibold px-8 py-2 rounded-lg transition disabled:opacity-60 text-sm">
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls = () =>
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition'
