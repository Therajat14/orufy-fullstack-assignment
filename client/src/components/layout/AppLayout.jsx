import { useState, useRef, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { HomeIcon, ProductsIcon, ChevronDown, LogoutIcon } from '../icons'

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

  return (
    <div className="flex min-h-screen bg-[#f8f8fc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top header */}
        <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-100 shrink-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <page.Icon size={15} />
            <span className="font-medium text-gray-700">{page.label}</span>
          </div>

          {/* User avatar + dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold select-none">
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
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
