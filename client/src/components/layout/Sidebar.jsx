import { NavLink } from 'react-router-dom'

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const ProductsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export default function Sidebar() {
  return (
    <aside className="w-[210px] min-h-screen bg-[#1B1F3B] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">Productr</span>
          <svg width="26" height="18" viewBox="0 0 28 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#f97316" strokeWidth="2.5" fill="none" />
            <circle cx="18" cy="10" r="8" stroke="#f97316" strokeWidth="2.5" fill="none" />
          </svg>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 bg-[#2a2f52] rounded-lg px-3 py-2">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-gray-300 placeholder-gray-500 text-sm outline-none w-full"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#2a2f52] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#252a4a]'
            }`
          }
        >
          <HomeIcon />
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#2a2f52] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#252a4a]'
            }`
          }
        >
          <ProductsIcon />
          Products
        </NavLink>
      </nav>
    </aside>
  )
}
