import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/home/ProductCard'
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

export default function HomePage() {
  const [tab, setTab] = useState('published')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products')
      setProducts(data)
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

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
    } catch { /* silent */ } finally {
      setDeleteProduct(null)
    }
  }

  const filtered = products.filter((p) =>
    tab === 'published' ? p.published : !p.published
  )

  return (
    <div className="flex flex-col h-full">
      {/* Gradient header */}
      <div
        className="px-6 pt-4 pb-0"
        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(236,72,153,0.04) 50%, rgba(234,179,8,0.06) 100%)' }}
      >
        {/* Page label */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          Home
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200">
          {['published', 'unpublished'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-semibold capitalize transition-colors relative ${
                tab === t ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e1b8e] rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <EmptyIcon />
            <div className="text-center">
              <p className="font-semibold text-gray-800">
                No {tab === 'published' ? 'Published' : 'Unpublished'} Products
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Your {tab} Products will appear here
                <br />
                Create your first product to {tab === 'published' ? 'publish' : 'publish'}
              </p>
            </div>
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
    </div>
  )
}
