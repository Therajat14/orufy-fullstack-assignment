import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/home/ProductCard'
import AddProductModal from '../components/products/AddProductModal'
import EditProductModal from '../components/products/EditProductModal'
import DeleteProductModal from '../components/products/DeleteProductModal'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Toast from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { GridEmptyIcon, PlusIcon } from '../components/icons'

export default function ProductsPage() {
  const { products, loading, addProduct, updateProduct, togglePublish, deleteProduct } = useProducts()
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

  const filtered = products

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 flex items-center justify-between bg-white">
        <h1 className="text-[22px] font-bold text-[#344054]">Products</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 text-[22px] font-medium text-[#344054] hover:text-[#1824e8] transition"
        >
          <PlusIcon size={20} />
          Add Products
        </button>
      </div>

      <div className="flex-1 px-8 pt-5 pb-8 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-[#1e1b8e] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<GridEmptyIcon />}
            title="Feels a little empty over here..."
            description="You can create products without connecting store you can add products to store anytime"
            action={
              <Button onClick={() => setShowAdd(true)} className="min-w-[315px]">Add your Products</Button>
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
