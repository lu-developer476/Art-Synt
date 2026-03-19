import { useMemo, useState } from 'react'
import { db } from '../firebase/config'
import { createPurchaseOrder } from '../firebase/commerce'
import type { Product } from '../data/products'
import type { CartItem } from '../lib/home'
import { addNotification } from '../lib/home'

interface PurchaseUser {
  uid: string
  email: string | null
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null)

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart],
  )

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.product.id === product.id)
      if (existing) {
        return currentCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...currentCart, { product, quantity: 1 }]
    })
  }

  const confirmPurchase = async (user: PurchaseUser | null) => {
    setPurchaseMessage(null)

    if (!user || cart.length === 0) {
      setPurchaseMessage('Necesitás una sesión activa y al menos una mejora en el carrito para confirmar la compra.')
      return
    }

    if (!user.email) {
      setPurchaseMessage('No pudimos confirmar la compra porque tu cuenta no tiene un correo válido.')
      return
    }

    try {
      await createPurchaseOrder(db, user.uid, user.email, cart)
      await addNotification(db, 'Compra en revisión', 'Tu pedido fue enviado para revisión', {
        email: user.email,
        total: String(cartTotal),
      })
      setCart([])
      setPurchaseMessage('Compra preconfirmada. Tu orden quedó registrada.')
    } catch {
      setPurchaseMessage('No pudimos guardar la orden. Vuelve a intentarlo en unos minutos.')
    }
  }

  return {
    addToCart,
    cart,
    cartTotal,
    confirmPurchase,
    purchaseMessage,
    setPurchaseMessage,
  }
}
