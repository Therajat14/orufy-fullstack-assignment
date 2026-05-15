import { useState, useCallback } from 'react'
import { CheckCircleIcon, XIcon } from '../icons'

export default function Toast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-white border border-gray-200 rounded-2xl shadow-xl px-5 py-3.5 animate-fade-in">
      <CheckCircleIcon />
      <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-1 p-0.5 transition">
        <XIcon size={13} />
      </button>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState('')
  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }, [])
  return { toast, showToast, clearToast: () => setToast('') }
}
