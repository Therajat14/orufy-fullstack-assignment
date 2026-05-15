import { useEffect } from 'react'
import { XIcon } from '../icons'

export default function Modal({ title, onClose, children, footer, size = 'md' }) {
  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClass[size]} max-h-[92vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition"
          >
            <XIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
