import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/home/ProductCard";
import EditProductModal from "../components/products/EditProductModal";
import DeleteProductModal from "../components/products/DeleteProductModal";
import EmptyState from "../components/ui/EmptyState";
import { GridEmptyIcon } from "../components/icons";

const TABS = ["Published", "Unpublished"];

export default function HomePage() {
  const { products, loading, togglePublish, updateProduct, deleteProduct } =
    useProducts();
  const [tab, setTab] = useState("Published");
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleEditSave = (updated) => {
    updateProduct(updated);
    setEditProduct(null);
  };

  const handleDeleteConfirm = async () => {
    await deleteProduct(deleteTarget);
    setDeleteTarget(null);
  };

  const [searchParams] = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  const filtered = products.filter((p) => {
    const tabMatch = tab === "Published" ? p.published : !p.published;
    const searchMatch = !q || p.name?.toLowerCase().includes(q);
    return tabMatch && searchMatch;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      {/* ── Tab bar ── */}
      <div
        style={{
          padding: "0 32px",
          borderBottom: "1px solid #E9ECF0",
          backgroundColor: "#ffffff",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: "24px" }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                position: "relative",
                paddingTop: "18px",
                paddingBottom: "16px",
                paddingLeft: 0,
                paddingRight: 0,
                fontSize: "13.5px",
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: tab === t ? "#1a1f2e" : "#98A2B3",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (tab !== t) e.currentTarget.style.color = "#667085";
              }}
              onMouseLeave={(e) => {
                if (tab !== t) e.currentTarget.style.color = "#98A2B3";
              }}
            >
              {t}
              {tab === t && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: 0,
                    right: 0,
                    height: "2px",
                    backgroundColor: "#1687ff",
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          flex: 1,
          padding: "28px 32px",
          overflowY: "auto",
          backgroundColor: "#ffffff",
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
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "3px solid #e0e7ff",
                borderTopColor: "#1e1b8e",
                animation: "spin 0.75s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<GridEmptyIcon />}
            title={`No ${tab} Products`}
            description={
              tab === "Published"
                ? "Your Published Products will appear here\nCreate your first product to publish"
                : "Your Unpublished Products will appear here"
            }
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
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
  );
}
