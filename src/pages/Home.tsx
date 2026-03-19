import { useState, type FormEvent } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import AccessSection from '../components/home/AccessSection'
import CartSection from '../components/home/CartSection'
import ContactSection from '../components/home/ContactSection'
import ProductsSection from '../components/home/ProductsSection'
import { db } from '../firebase/config'
import { useAuthState } from '../hooks/useAuthState'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { addNotification } from '../lib/home'
import HeroSection from '../sections/Hero'

type HomeSection = 'acceso' | 'productos' | 'contacto'

interface HomeProps {
  showHero?: boolean
  singleSection?: HomeSection
}

export default function Home({ showHero = true, singleSection }: HomeProps) {

  const auth = useAuthState()
  const products = useProducts()
  const cart = useCart()

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactDescription, setContactDescription] = useState('')
  const [contactMessage, setContactMessage] = useState<string | null>(null)


  const handleContactSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setContactMessage(null)

    if (contactDescription.trim().length < 20) {
      setContactMessage('Tu presentación debe tener al menos 20 caracteres para poder evaluarla.')
      return
    }

    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: contactName,
        email: contactEmail,
        description: contactDescription,
        createdAt: serverTimestamp(),
      })

      await addDoc(collection(db, 'mail'), {
        to: [contactEmail],
        message: {
          subject: 'Postulación recibida en la red',
          text: `Hola ${contactName}, recibimos tu perfil para futuras operaciones en Night City: "${contactDescription}"`,
        },
      })

      await addNotification(db, 'Nueva postulación', 'Se recibió una solicitud para unirse a la red', {
        email: contactEmail,
      })

      setContactName('')
      setContactEmail('')
      setContactDescription('')
      setContactMessage('Postulación enviada con éxito. Nuestro equipo de reclutamiento te contactará pronto.')
    } catch {
      setContactMessage('No pudimos enviar tu postulación. Intentá nuevamente en unos minutos.')
    }
  }

  const sections = {
    acceso: (
      <section>
        <AccessSection
          authEmail={auth.authEmail}
          authMessage={auth.authMessage}
          authPassword={auth.authPassword}
          onEmailChange={auth.setAuthEmail}
          onPasswordChange={auth.setAuthPassword}
          onSignIn={auth.handleSignIn}
          onSignOut={auth.signOut}
          onSignUp={auth.handleSignUp}
          user={auth.user}
        />
      </section>
    ),
    productos: (
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
    ),
    contacto: (
      <section>
        <ContactSection
          contactDescription={contactDescription}
          contactEmail={contactEmail}
          contactMessage={contactMessage}
          contactName={contactName}
          onDescriptionChange={setContactDescription}
          onEmailChange={setContactEmail}
          onNameChange={setContactName}
          onSubmit={handleContactSubmit}
        />
      </section>
    ),
  }

  const visibleSections = singleSection ? [sections[singleSection]] : Object.values(sections)

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-16">
      {showHero ? <HeroSection /> : null}

      {showHero ? (
        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard label="Productos" value={products.products.length || 10} />
          <InfoCard label="Mejoras en carrito" value={cart.cart.length} />
          <InfoCard label="Estado" value={products.loading ? 'Sincronizando' : 'Activo'} />
        </section>
      ) : null}

      {visibleSections}
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-2xl border border-purple-400/40 bg-black/50 p-5 backdrop-blur">
      <p className="text-sm uppercase tracking-[0.3em] text-purple-300">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-purple-50">{value}</p>
    </article>
  )
}
