import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/home/ProductCard'
import AddProductModal from '../components/products/AddProductModal'
import EditProductModal from '../components/products/EditProductModal'
import DeleteProductModal from '../components/products/DeleteProductModal'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Toast, { useToast } from '../components/ui/Toast'
import { GridEmptyIcon, SearchIcon, PlusIcon } from '../components/icons'

export default function ProductsPage() {
  const { products, loading, addProduct, updateProduct, togglePublish, deleteProduct } = useProducts()
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const { toast, showToast, clearToast } = useToast()

  const handleAdd = (product) => {
    addProduct(product)
    setShowAdd(false)
    showToast('Product added successfully')
  }

  const handleEditSave = (updated) => {
    updateProduct(updated)
    setEditProduct(null)
    showToast('Product updated successfully')
  }

  const handleDeleteConfirm = async () => {
    const ok = await deleteProduct(deleteTarget)
    if (ok) showToast('Product deleted successfully')
    setDeleteTarget(null)
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brandName || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">

      {/* Page header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
        <h1 className="text-base font-semibold text-gray-900">Products</h1>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-56 cursor-text">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm outline-none bg-transparent text-gray-600 placeholder-gray-400 w-full"
            />
          </label>

          <Button onClick={() => setShowAdd(true)} size="sm">
            <PlusIcon size={13} />
            Add Products
          </Button>
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
            title={search ? `No results for "${search}"` : 'Feels a little empty over here…'}
            description={
              search
                ? 'Try a different search term.'
                : 'You can create products without connecting a store and add them to any store anytime.'
            }
            action={
              !search && (
                <Button onClick={() => setShowAdd(true)}>Add your Products</Button>
              )
            }
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

      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
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

      <Toast message={toast} onClose={clearToast} />
    </div>
  )
}
