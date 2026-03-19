import CartSection from '../components/home/CartSection'
import ProductsSection from '../components/home/ProductsSection'
import { useAuthState } from '../hooks/useAuthState'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'

export default function ProductsPageSection() {
  const auth = useAuthState()
  const products = useProducts()
  const cart = useCart()

  return (
    <section className="space-y-6">
      <ProductsSection
        cartTotal={cart.cartTotal}
        error={products.error}
        loading={products.loading}
        onAddToCart={cart.addToCart}
        onSelectProduct={products.setSelectedProduct}
        products={products.products}
        selectedProduct={products.selectedProduct}
      />
      <CartSection
        cart={cart.cart}
        message={cart.purchaseMessage}
        onConfirmPurchase={() => cart.confirmPurchase(auth.user)}
        user={auth.user}
      />
    </section>
  )
}
