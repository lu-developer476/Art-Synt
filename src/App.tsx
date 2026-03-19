import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Container from './components/Container'
import MainLayout from './layout/Main'

const Home = lazy(() => import('./pages/Home'))
const Access = lazy(() => import('./pages/Access'))
const Products = lazy(() => import('./pages/Products'))
const Contact = lazy(() => import('./pages/Contact'))

export default function App() {
  return (
    <MainLayout>
      <Container>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/acceso" element={<Access />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/contacto" element={<Contact />} />
          </Routes>
        </Suspense>
      </Container>
    </MainLayout>
  )
}

function RouteFallback() {
  return (
    <div
      className="mx-auto min-h-[60vh] max-w-6xl animate-pulse rounded-3xl border border-purple-400/40 bg-black/40"
      aria-hidden="true"
    />
  )
}
