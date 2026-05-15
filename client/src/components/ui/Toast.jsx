import { CheckCircleIcon, XIcon } from '../icons'

export default function Toast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="fixed bottom-[34px] left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 bg-white border border-[#d7dce5] rounded-lg shadow-[0_12px_34px_rgba(16,24,40,0.16)] px-3 py-2.5 animate-fade-in">
      <CheckCircleIcon />
      <span className="text-base font-semibold text-[#344054] whitespace-nowrap">{message}</span>
      <button onClick={onClose} className="text-[#344054] hover:text-[#101828] ml-1 p-0.5 transition">
        <XIcon size={18} />
      </button>
    </div>
  )
}
