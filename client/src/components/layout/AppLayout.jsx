import { useState, useRef, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { HomeIcon, ProductsIcon, ChevronDown, LogoutIcon, SearchIcon } from '../icons'

const PAGE_META = {
  '/home':     { label: 'Home',     Icon: HomeIcon },
  '/products': { label: 'Products', Icon: ProductsIcon },
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const page = PAGE_META[pathname] || PAGE_META['/home']

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.[0]?.toUpperCase() || user?.identifier?.[0]?.toUpperCase() || 'U'

  const showProductsTools = pathname === '/products'

  return (
    <div className="flex min-h-screen bg-white text-[#344054]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-7 shrink-0 border-b border-[#eef0f5] bg-[linear-gradient(105deg,#fff7f5_0%,#fff_34%,#fbffe9_56%,#f8fbff_100%)]">
          <div className="flex items-center gap-2 text-sm text-[#26324b]">
            {showProductsTools && (
              <>
                <page.Icon size={14} />
                <span className="font-medium">{page.label}</span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-14">
            {showProductsTools && (
              <label className="hidden md:flex h-[34px] w-[340px] items-center gap-2 rounded bg-[#f4f5f8] px-3 text-[#667085] cursor-text">
                <SearchIcon size={15} />
                <input
                  type="text"
                  placeholder="Search Services, Products"
                  className="w-full bg-transparent text-sm text-[#344054] placeholder:text-[#667085] outline-none"
                />
              </label>
            )}

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-orange-300 via-pink-300 to-indigo-300 border border-white shadow-sm flex items-center justify-center text-white text-xs font-bold select-none">
                {initials}
              </div>
              <ChevronDown size={15} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-11 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 w-48 z-50">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{user?.identifier}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogoutIcon size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
