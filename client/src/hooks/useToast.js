import { useCallback, useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState('')

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }, [])

  return { toast, showToast, clearToast: () => setToast('') }
}
