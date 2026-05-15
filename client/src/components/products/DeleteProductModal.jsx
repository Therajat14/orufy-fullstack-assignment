import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function DeleteProductModal({ product, onClose, onConfirm }) {
  return (
    <Modal
      title="Delete Product"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </>
      }
    >
      <div className="px-6 py-6">
        <p className="text-sm text-gray-600 leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">"{product.name}"</span>?
          This action cannot be undone.
        </p>
      </div>
    </Modal>
  )
}
