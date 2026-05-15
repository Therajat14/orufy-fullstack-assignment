import { useEffect } from 'react'
import { XIcon } from '../icons'

export default function Modal({ title, onClose, children, footer, size = 'md' }) {
  const sizeClass = { sm: 'max-w-[400px]', md: 'max-w-[472px]', lg: 'max-w-[560px]' }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-[#1f2a44]/45 flex items-start justify-center z-50 p-4 pt-[90px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-lg shadow-2xl w-full ${sizeClass[size]} max-h-[calc(100vh-120px)] flex flex-col overflow-hidden`}>
        <div className="flex items-center justify-between px-6 h-14 border-b border-[#edf0f4] shrink-0">
          <h2 className="text-lg font-medium text-[#26324b]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#26324b] hover:bg-[#f2f4f7] rounded-lg p-1.5 transition"
          >
            <XIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {children}
        </div>

        {footer && (
          <div className="px-6 h-[72px] border-t border-[#edf0f4] bg-[#f8f9fb] shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
