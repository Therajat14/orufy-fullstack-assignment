import { useState } from 'react'
import { create } from '../../api/products'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import ProductForm from './ProductForm'

const INITIAL_FORM = {
  name: '', productType: '', quantityStock: '',
  mrp: '', sellingPrice: '', brandName: '', exchangeEligibility: 'Yes',
}

export default function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [images, setImages] = useState([])
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
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name = 'Product name is required'
    if (!form.productType)     e.productType = 'Select a product type'
    if (!form.quantityStock)   e.quantityStock = 'Required'
    if (!form.mrp)             e.mrp = 'Required'
    if (!form.sellingPrice)    e.sellingPrice = 'Required'
    if (!form.brandName.trim()) e.brandName = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setSubmitError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach(({ file }) => fd.append('images', file))
      const data = await create(fd)
      onAdd(data)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Add Product"
      onClose={onClose}
      footer={
        <>
          {submitError && <p className="text-red-500 text-xs mr-auto">{submitError}</p>}
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating…' : 'Create'}
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
