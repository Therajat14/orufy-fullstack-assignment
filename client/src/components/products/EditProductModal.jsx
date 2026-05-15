import { useState } from 'react'
import { update } from '../../api/products'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import ProductForm from './ProductForm'

export default function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name:               product.name || '',
    productType:        product.productType || '',
    quantityStock:      product.quantityStock ?? '',
    mrp:                product.mrp ?? '',
    sellingPrice:       product.sellingPrice ?? '',
    brandName:          product.brandName || '',
    exchangeEligibility: product.exchangeEligibility ? 'Yes' : 'No',
  })

  // Existing server images stored as { preview: url } (no .file = not new)
  const [images, setImages] = useState(
    (product.images || []).map((url) => ({ preview: url }))
  )

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const handleAddImages = (files) => {
    setImages((prev) => [
      ...prev,
      ...files.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
    ])
  }

  const handleRemoveImage = (idx) => {
    setImages((prev) => {
      if (prev[idx].file) URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setSubmitError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      // Only send new (file-bearing) images; existing ones stay on server
      images.forEach(({ file }) => { if (file) fd.append('images', file) })
      const data = await update(product._id, fd)
      onSave(data)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Edit Product"
      onClose={onClose}
      footer={
        <>
          {submitError && <p className="text-red-500 text-xs mr-auto">{submitError}</p>}
          <Button onClick={handleSubmit} disabled={loading} className="ml-auto min-w-[78px]">
            {loading ? 'Saving…' : 'Update'}
          </Button>
        </>
      }
    >
      <ProductForm
        form={form}
        onChange={handleChange}
        errors={errors}
        images={images}
        onAddImages={handleAddImages}
        onRemoveImage={handleRemoveImage}
      />
    </Modal>
  )
}
