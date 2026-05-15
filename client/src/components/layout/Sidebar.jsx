import { NavLink } from "react-router-dom";
import { HomeIcon, ProductsIcon, SearchIcon } from ".";
import logo from "../../assets/logo/Logo2.png";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        height: "100vh",
        backgroundColor: "#1A1F27",
        borderRight: "1px solid #252B35",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px" }}>
        <img
          src={logo}
          alt="Productr"
          style={{ height: "28px", width: "auto", objectFit: "contain" }}
        />
      </div>

      {/* Search */}
      <div
        style={{
          padding: "0 12px 16px",
          borderBottom: "1px solid #252B35",
        }}
      >
        <div
          style={{
            height: "34px",
            borderRadius: "6px",
            backgroundColor: "#252B35",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: "8px",
          }}
        >
          <SearchIcon size={14} style={{ color: "#4B5563", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search"
            style={{
              background: "transparent",
              outline: "none",
              border: "none",
              width: "100%",
              fontSize: "13px",
              fontWeight: 400,
              color: "#F9FAFB",
              caretColor: "#F9FAFB",
            }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          padding: "16px 10px 0",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <NavLink
          to="/home"
          style={({ isActive }) => ({
            height: "34px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 10px",
            fontSize: "13.5px",
            fontWeight: 500,
            textDecoration: "none",
            color: isActive ? "#F9FAFB" : "#6B7280",
            backgroundColor: isActive ? "#252B35" : "transparent",
            transition: "color 0.15s ease, background-color 0.15s ease",
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.color = "#D1D5DB";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.color = "#6B7280";
            }
          }}
        >
          {({ isActive }) => (
            <>
              <HomeIcon
                size={14}
                style={{
                  flexShrink: 0,
                  color: isActive ? "#F9FAFB" : "#6B7280",
                }}
              />
              <span>Home</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/products"
          style={({ isActive }) => ({
            height: "34px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 10px",
            fontSize: "13.5px",
            fontWeight: 500,
            textDecoration: "none",
            color: isActive ? "#F9FAFB" : "#6B7280",
            backgroundColor: isActive ? "#252B35" : "transparent",
            transition: "color 0.15s ease, background-color 0.15s ease",
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.color = "#D1D5DB";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.color = "#6B7280";
            }
          }}
        >
          {({ isActive }) => (
            <>
              <ProductsIcon
                size={14}
                style={{
                  flexShrink: 0,
                  color: isActive ? "#F9FAFB" : "#6B7280",
                }}
              />
              <span>Products</span>
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
}
