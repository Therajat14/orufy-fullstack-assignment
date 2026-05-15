import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/home/ProductCard";
import AddProductModal from "../components/products/AddProductModal";
import EditProductModal from "../components/products/EditProductModal";
import DeleteProductModal from "../components/products/DeleteProductModal";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import { GridEmptyIcon } from "../components/layout";

export default function ProductsPage() {
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    togglePublish,
    deleteProduct,
  } = useProducts();
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast, clearToast } = useToast();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  const filtered = q
    ? products.filter((p) => p.name?.toLowerCase().includes(q))
    : products;

  const handleAdd = (product) => {
    addProduct(product);
    setShowAdd(false);
    showToast("Product added successfully");
  };

  const handleEditSave = (updated) => {
    updateProduct(updated);
    setEditProduct(null);
    showToast("Product updated successfully");
  };

  const handleDeleteConfirm = async () => {
    const ok = await deleteProduct(deleteTarget);
    if (ok) showToast("Product deleted successfully");
    setDeleteTarget(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Page header — only shown when products exist */}
      {!loading && products.length > 0 && (
        <div
          style={{
            padding: "20px 28px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: "#1a1f2e",
              letterSpacing: "-0.01em",
            }}
          >
            Products
          </h1>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#1a1f2e",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3b4cca")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1f2e")}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
            Add Products
          </button>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: products.length > 0 ? "0 28px 28px" : "0",
          overflowY: "auto",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "240px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                border: "3px solid #e0e7ff",
                borderTopColor: "#1e1b8e",
                borderRadius: "50%",
                animation: "spin 0.75s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<GridEmptyIcon />}
            title="Feels a little empty over here..."
            description={`You can create products without connecting store\nyou can add products to store anytime`}
            action={
              <Button
                onClick={() => setShowAdd(true)}
                style={{
                  width: "315px",
                  height: "42px",
                  fontSize: "14px",
                  borderRadius: "8px",
                }}
              >
                Add your Products
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<GridEmptyIcon />}
            title="No products found"
            description={`No products match "${q}"`}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
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

      {showAdd && (
        <AddProductModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
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
  );
}
