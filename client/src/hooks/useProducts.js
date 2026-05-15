import { useState, useEffect, useCallback } from 'react'
import * as productsApi from '../api/products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await productsApi.getAll()
      setProducts(data)
    } catch { /* handled by axios interceptor */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 0)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  const addProduct = (product) =>
    setProducts((prev) => [...prev, product])

  const updateProduct = (updated) =>
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))

  const removeProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p._id !== id))

  const togglePublish = async (product) => {
    try {
      await productsApi.togglePublish(product._id, !product.published)
      updateProduct({ ...product, published: !product.published })
    } catch { /* silent */ }
  }

  const deleteProduct = async (product) => {
    try {
      await productsApi.remove(product._id)
      removeProduct(product._id)
      return true
    } catch {
      return false
    }
  }

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    removeProduct,
    togglePublish,
    deleteProduct,
    refresh: fetchProducts,
  }
}
