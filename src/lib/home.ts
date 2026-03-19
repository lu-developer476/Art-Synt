import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
import type { Product } from '../data/products'

export interface CartItem {
  product: Product
  quantity: number
}


export const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace('US$', '€$')

export async function addNotification(
  db: Firestore,
  title: string,
  body: string,
  metadata: Record<string, string>,
) {
  await addDoc(collection(db, 'notifications'), {
    title,
    body,
    metadata,
    createdAt: serverTimestamp(),
  })
}
