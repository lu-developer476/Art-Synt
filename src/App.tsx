import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Access from './pages/Access'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Header from './components/Header'
import Footer from './components/Footer'

function AppContent() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/acceso" element={<Access />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/contacto" element={<Contact />} />
        </Routes>
      </main>

      {isHome && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
