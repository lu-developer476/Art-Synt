import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Access from './pages/Access'
import Products from './pages/Products'
import Contact from './pages/Contact'
import MainLayout from './layout/Main'

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acceso" element={<Access />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/contacto" element={<Contact />} />
      </Routes>
    </MainLayout>
  )
}
