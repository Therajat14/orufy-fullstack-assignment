import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function DeleteProductModal({ product, onClose, onConfirm }) {
  return (
    <Modal
      title="Delete Product"
      onClose={onClose}
      size="sm"
      footer={
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      }
    >
      <div style={{ padding: "16px 18px 20px" }}>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#344054",
            lineHeight: "1.7",
          }}
        >
          Are you sure you really want to delete this Product
          <br />" <span style={{ fontWeight: 700 }}>{product.name}</span> " ?
        </p>
      </div>
    </Modal>
  );
}
