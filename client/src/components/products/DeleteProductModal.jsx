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
          <Button variant="danger" onClick={onConfirm} className="min-w-[76px]">Delete</Button>
        </>
      }
    >
      <div className="px-6 pt-4 pb-7">
        <p className="text-sm text-[#344054] leading-6">
          Are you sure you really want to delete this Product
          <br />
          “ <span className="font-semibold">{product.name}</span> ” ?
        </p>
      </div>
    </Modal>
  )
}
