import { NavLink } from 'react-router-dom'
import { HomeIcon, ProductsIcon, SearchIcon } from '../icons'
import logo from '../../assets/logo/Logo.png'

export default function Sidebar() {
  return (
    <aside className="w-[240px] min-h-screen bg-[#1b2029] flex flex-col shrink-0">
      <div className="px-4 pt-5 pb-[18px]">
        <img src={logo} alt="Productr" className="h-[25px] w-auto brightness-0 invert" />
      </div>

      <div className="px-2 pb-4 border-b border-white/[0.06]">
        <label className="flex h-[34px] items-center gap-2 rounded bg-[#2b313c] px-3 text-[#8f98a8] cursor-text">
          <SearchIcon size={15} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-[#c8ced9] placeholder:text-[#8f98a8] text-sm outline-none w-full"
          />
        </label>
      </div>

      <nav className="flex-1 px-4 pt-5 space-y-4">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center gap-3 text-[15px] font-medium transition-colors ${
              isActive
                ? 'text-white'
                : 'text-[#8f98a8] hover:text-white'
            }`
          }
        >
          <HomeIcon size={16} />
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 text-[15px] font-medium transition-colors ${
              isActive
                ? 'text-white'
                : 'text-[#8f98a8] hover:text-white'
            }`
          }
        >
          <ProductsIcon size={16} />
          Products
        </NavLink>
      </nav>
    </aside>
  )
}
