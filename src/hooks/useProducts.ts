import { useEffect, useState } from 'react'
import { getOrSeedProducts } from '../firebase/products'
import type { Product } from '../data/products'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const items = await getOrSeedProducts()
        setProducts(items)
      } catch {
        setError('No pudimos conectarte a la red. Revisá tu conexión e intentá de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return {
    error,
    loading,
    products,
    selectedProduct,
    setSelectedProduct,
  }
}
