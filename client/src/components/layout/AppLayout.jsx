import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { ChevronDown, LogoutIcon, SearchIcon } from "../icons";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    user?.name?.[0]?.toUpperCase() ||
    user?.identifier?.[0]?.toUpperCase() ||
    "U";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#1D222B",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          minWidth: 0,
          backgroundColor: "#ffffff",
        }}
      >
        {/* ── Navbar ── */}
        <header
          style={{
            height: "52px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            position: "relative",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {/* Gradient mesh */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `
                radial-gradient(ellipse 40% 200% at 0% 50%,   rgba(255,210,190,0.45) 0%, transparent 70%),
                radial-gradient(ellipse 35% 200% at 42% 50%,  rgba(255,245,190,0.35) 0%, transparent 65%),
                radial-gradient(ellipse 30% 200% at 78% 50%,  rgba(230,235,245,0.15) 0%, transparent 60%),
                #ffffff
              `,
            }}
          />

          {/* Left — page icon + label (spacer) */}
          <div style={{ flex: 1, position: "relative", zIndex: 1 }} />

          {/* Center — Search bar */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              flex: "0 0 260px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                backgroundColor: "rgba(255,255,255,0.7)",
                border: "1px solid #E8ECF2",
                borderRadius: "8px",
                padding: "0 12px",
                height: "32px",
                backdropFilter: "blur(4px)",
              }}
            >
              <SearchIcon
                size={13}
                style={{ color: "#9CA3AF", flexShrink: 0 }}
              />
              <input
                type="text"
                placeholder="Search Services, Products"
                value={searchQuery}
                onChange={(e) =>
                  setSearchParams(
                    e.target.value ? { q: e.target.value } : {},
                    { replace: true }
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontSize: "12.5px",
                  color: "#1a1f2e",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Right — Avatar + dropdown */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              position: "relative",
              zIndex: 1,
            }}
            ref={dropdownRef}
          >
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #818cf8 100%)",
                  border: "1.5px solid rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#fff",
                  userSelect: "none",
                }}
              >
                {initials}
              </div>
              <ChevronDown size={13} style={{ color: "#9CA3AF" }} />
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 10px)",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "10px",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
                  padding: "6px 0",
                  width: "192px",
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid #F2F4F7",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#344054",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.name || "User"}
                  </p>
                  <p
                    style={{
                      margin: "3px 0 0",
                      fontSize: "11.5px",
                      color: "#98A2B3",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.identifier}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "9px 14px",
                    fontSize: "13px",
                    color: "#f87171",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(248,113,113,0.07)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <LogoutIcon size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
