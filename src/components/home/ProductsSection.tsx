import type { Product } from '../../data/products'
import { formatPrice } from '../../lib/home'

interface ProductsSectionProps {
  cartTotal: number
  error: string | null
  loading: boolean
  onAddToCart: (product: Product) => void
  onSelectProduct: (product: Product | null) => void
  products: Product[]
  selectedProduct: Product | null
}

export default function ProductsSection({
  cartTotal,
  error,
  loading,
  onAddToCart,
  onSelectProduct,
  products,
  selectedProduct,
}: ProductsSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-purple-100">Productos</h2>
          <p className="mt-1 text-sm text-purple-200">
            Revisá cada mejora, personalizá tu pedido y autorizá la compra cuando estés listo.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-400/60 bg-red-950/60 p-4 text-sm text-red-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="h-[340px] animate-pulse rounded-2xl border border-purple-300/50 bg-purple-900/30"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-purple-300/50 bg-black/50 transition hover:-translate-y-1 hover:border-purple-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-android text-xl font-semibold text-purple-50">{product.name}</h3>
                  <span className="rounded-full bg-purple-900/60 px-3 py-1 text-xs uppercase tracking-widest text-purple-200">
                    {product.category}
                  </span>
                </div>
                <p className="text-lg font-bold text-purple-200">{formatPrice(product.price)}</p>
                <p className="font-android text-sm text-purple-300">{product.description}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="rounded-lg border border-purple-300 px-3 py-2 text-sm text-purple-100 hover:bg-purple-800/40"
                    onClick={() => onSelectProduct(product)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="rounded-lg bg-purple-700 px-3 py-2 text-sm text-white hover:bg-purple-800"
                    onClick={() => onAddToCart(product)}
                  >
                    Agregar al carrito · Total: {formatPrice(cartTotal)}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedProduct ? (
        <section className="rounded-2xl border border-purple-300/50 bg-purple-950/60 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-android text-2xl font-semibold text-purple-100">{selectedProduct.name}</h3>
              <p className="font-android mt-2 text-purple-200">{selectedProduct.description}</p>
              <p className="mt-3 text-lg font-bold text-purple-100">Precio: {formatPrice(selectedProduct.price)}</p>
            </div>
            <button
              className="rounded-lg border border-purple-300 px-3 py-2 text-sm text-purple-100 hover:bg-purple-900/50"
              onClick={() => onSelectProduct(null)}
            >
              Cerrar detalles
            </button>
          </div>
        </section>
      ) : null}
    </section>
  )
}
