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
      <div className="px-8 pt-5 pb-0 border-b border-[#dfe4ec] bg-white">
        <div className="flex gap-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 px-0 text-sm font-semibold transition-colors relative ${
                tab === t ? 'text-[#344054]' : 'text-[#98a2b3] hover:text-[#667085]'
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#1687ff] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-8 pt-6 pb-8 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-[#1e1b8e] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<GridEmptyIcon />}
            title={`No ${tab} Products`}
            description={
              tab === 'Published'
                ? 'Your Published Products will appear here'
                : 'Your Unpublished Products will appear here Create your first product to publish'
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
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
