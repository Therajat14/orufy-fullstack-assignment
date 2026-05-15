import { useState, useEffect } from 'react'
import api from '../services/api'
import ProductCard from '../components/home/ProductCard'
import AddProductModal from '../components/products/AddProductModal'
import EditProductModal from '../components/products/EditProductModal'
import DeleteProductModal from '../components/products/DeleteProductModal'

const EmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect x="4" y="4" width="24" height="24" rx="4" stroke="#1e1b8e" strokeWidth="3" fill="none" />
    <rect x="36" y="4" width="24" height="24" rx="4" stroke="#1e1b8e" strokeWidth="3" fill="none" />
    <rect x="4" y="36" width="24" height="24" rx="4" stroke="#1e1b8e" strokeWidth="3" fill="none" />
    <line x1="48" y1="40" x2="48" y2="56" stroke="#1e1b8e" strokeWidth="3" strokeLinecap="round" />
    <line x1="40" y1="48" x2="56" y2="48" stroke="#1e1b8e" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" fill="#16a34a" stroke="none" />
    <polyline points="9 12 11 14 15 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products')
      setProducts(data)
    } catch { /* handled by interceptor */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleAdd = (product) => {
    setProducts((prev) => [...prev, product])
    setShowAdd(false)
    showToast('Product added Successfully')
  }

  const handlePublishToggle = async (product) => {
    try {
      await api.patch(`/products/${product._id}/publish`, { published: !product.published })
      setProducts((prev) =>
        prev.map((p) => p._id === product._id ? { ...p, published: !p.published } : p)
      )
    } catch { /* silent */ }
  }

  const handleEditSave = (updated) => {
    setProducts((prev) => prev.map((p) => p._id === updated._id ? updated : p))
    setEditProduct(null)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/products/${deleteProduct._id}`)
      setProducts((prev) => prev.filter((p) => p._id !== deleteProduct._id))
    } catch { /* silent */ }
    finally { setDeleteProduct(null) }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brandName || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header bar with search and add */}
      <div
        className="px-6 pt-4 pb-3 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(236,72,153,0.04) 50%, rgba(234,179,8,0.06) 100%)' }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          Products
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-64">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search Services, Products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm outline-none bg-transparent text-gray-600 placeholder-gray-400 w-full"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#1e1b8e] hover:text-indigo-700 transition"
          >
            <span className="text-lg leading-none">+</span>
            Add Products
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <EmptyIcon />
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-lg">Feels a little empty over here...</p>
              <p className="text-sm text-gray-400 mt-1">
                You can create products without connecting store<br />
                you can add products to store anytime
              </p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-[#1e1b8e] hover:bg-[#17158a] text-white font-semibold px-8 py-2.5 rounded-lg transition text-sm mt-2"
            >
              Add your Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPublishToggle={handlePublishToggle}
                onEdit={setEditProduct}
                onDelete={setDeleteProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={handleEditSave}
        />
      )}
      {deleteProduct && (
        <DeleteProductModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-lg px-5 py-3 z-50">
          <CheckCircleIcon />
          <span className="text-sm font-medium text-gray-800">{toast}</span>
          <button onClick={() => setToast('')} className="text-gray-400 hover:text-gray-600 ml-2">×</button>
        </div>
      )}
    </div>
  )
}
