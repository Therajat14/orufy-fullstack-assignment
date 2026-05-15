import { useCallback, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg) => {
    setToast("");
    setTimeout(() => setToast(msg), 10);
  }, []);

  const clearToast = useCallback(() => {
    setToast("");
  }, []);

  return { toast, showToast, clearToast };
}
