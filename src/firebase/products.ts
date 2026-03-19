import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './config'
import {
  getProductSeedById,
  isProductCategory,
  isProductId,
  productsSeed,
  type Product,
  type ProductCategory,
  type ProductId,
} from '../data/products'

const productsCollection = collection(db, 'products')
const LEGACY_IMAGE_PATHS: Readonly<Record<string, Product['image']>> = {
  '/images/proyectile-ls.png': '/images/projectile-ls.png',
}

function parseProductPrice(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number(value)

  return Number.isFinite(parsed) ? parsed : fallback
}

function parseProductCategory(value: unknown, fallback: ProductCategory): ProductCategory {
  return isProductCategory(value) ? value : fallback
}

function parseProductImage(value: unknown, fallback: Product['image']): Product['image'] {
  if (typeof value !== 'string' || value.length === 0) {
    return fallback
  }

  return LEGACY_IMAGE_PATHS[value] ?? (value as Product['image'])
}

function normalizeProduct(snapshot: QueryDocumentSnapshot<DocumentData>): Product {
  const data = snapshot.data()
  const normalizedId = isProductId(data.id) ? data.id : snapshot.id

  if (!isProductId(normalizedId)) {
    throw new Error(`Producto inválido en Firestore: ${snapshot.id}`)
  }

  const seed = getProductSeedById(normalizedId)

  return {
    id: seed.id,
    name: typeof data.name === 'string' && data.name.length > 0 ? data.name : seed.name,
    price: parseProductPrice(data.price, seed.price),
    image: parseProductImage(data.image, seed.image),
    description:
      typeof data.description === 'string' && data.description.length > 0 ? data.description : seed.description,
    category: parseProductCategory(data.category, seed.category),
    ...(data.featured === true || seed.featured ? { featured: true } : {}),
  }
}

async function seedProductsCatalog(): Promise<Product[]> {
  const batch = writeBatch(db)

  productsSeed.forEach((product) => {
    batch.set(doc(productsCollection, product.id), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })

  await batch.commit()

  return productsSeed.map((product) => ({ ...product }))
}

export async function getOrSeedProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsCollection)

  if (snapshot.empty) {
    return seedProductsCatalog()
  }

  return snapshot.docs.map(normalizeProduct).sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
