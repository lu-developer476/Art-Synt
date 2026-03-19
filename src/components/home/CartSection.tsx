import type { User } from 'firebase/auth'
import type { CartItem } from '../../lib/home'
import { formatPrice } from '../../lib/home'

interface CartSectionProps {
  cart: CartItem[]
  message: string | null
  onConfirmPurchase: () => Promise<void>
  user: User | null
}

export default function CartSection({ cart, message, onConfirmPurchase, user }: CartSectionProps) {
  return (
    <section className="rounded-3xl border border-purple-400/50 bg-gradient-to-br from-purple-950/80 via-black/70 to-slate-900/70 p-6">
      <h3 className="text-xl font-semibold text-purple-100">Detalles de compra</h3>
      {cart.length === 0 ? (
        <p className="mt-4 text-sm text-purple-200">Todavía no agregaste productos al carrito.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {cart.map((item) => (
            <li
              key={item.product.id}
              className="flex items-center justify-between rounded-lg border border-purple-300/40 px-4 py-3"
            >
              <span className="text-sm text-purple-100">
                {item.product.name} x {item.quantity}
              </span>
              <span className="text-sm font-semibold text-purple-100">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => void onConfirmPurchase()}
        disabled={!user || cart.length === 0}
        className="mt-5 rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-purple-950"
      >
        Confirmar compra
      </button>
      {message ? <p className="mt-3 text-sm text-purple-200">{message}</p> : null}
    </section>
  )
}
