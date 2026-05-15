import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/home/ProductCard'
import EditProductModal from '../components/products/EditProductModal'
import DeleteProductModal from '../components/products/DeleteProductModal'
import EmptyState from '../components/ui/EmptyState'
import { GridEmptyIcon } from '../components/icons'

const TABS = ['Published', 'Unpublished']

export default function HomePage() {
  const { products, loading, togglePublish, updateProduct, deleteProduct } = useProducts()
  const [tab, setTab] = useState('Published')
  const [editProduct, setEditProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleEditSave = (updated) => {
    updateProduct(updated)
    setEditProduct(null)
  }

  const handleDeleteConfirm = async () => {
    await deleteProduct(deleteTarget)
    setDeleteTarget(null)
  }

  const filtered = products.filter((p) =>
    tab === 'Published' ? p.published : !p.published
  )

  return (
    <div className="flex flex-col h-full">

      {/* Tab bar */}
      <div className="px-6 pt-4 pb-0 border-b border-gray-100 bg-white">
        <div className="flex gap-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                tab === t ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e1b8e] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-[#1e1b8e] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<GridEmptyIcon />}
            title={`No ${tab} Products`}
            description={`Your ${tab.toLowerCase()} products will appear here. Create your first product to get started.`}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPublishToggle={togglePublish}
                onEdit={setEditProduct}
                onDelete={setDeleteTarget}
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
      {deleteTarget && (
        <DeleteProductModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  )
}
