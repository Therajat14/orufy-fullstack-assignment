import { NavLink } from 'react-router-dom'
import { HomeIcon, ProductsIcon, SearchIcon } from '../icons'
import logo from '../../assets/logo/Logo.png'

export default function Sidebar() {
  return (
    <aside className="w-55 min-h-screen bg-[#1B1F3B] flex flex-col shrink-0">
      {/* Logo — inverted to white on dark bg */}
      <div className="px-5 pt-5 pb-4">
        <img src={logo} alt="Productr" className="h-7 w-auto brightness-0 invert" />
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <label className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5 text-gray-400 cursor-text">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-gray-300 placeholder-gray-500 text-sm outline-none w-full"
          />
        </label>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white/15 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`
          }
        >
          <HomeIcon />
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white/15 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
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
