import { ReactNode, useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface MainLayoutProps {
  children: ReactNode
}

const menuItems = [
  { to: '/', label: 'Inicio' },
  { to: '/acceso', label: 'Acceso' },
  { to: '/productos', label: 'Productos' },
  { to: '/contacto', label: 'Contacto' },
]

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const menuId = useId()
  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col px-4 py-6 text-purple-100 sm:px-6 md:px-8 md:py-8 xl:px-10">
      <header className="mx-auto mb-6 w-full max-w-6xl rounded-3xl border border-purple-400/40 bg-black/65 px-4 py-4 shadow-[0_0_35px_rgba(168,85,247,0.12)] backdrop-blur md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="rounded-xl px-1 py-1 text-lg font-bold tracking-[0.18em] text-purple-100 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-xl"
            aria-label="Ir al inicio de A/S Nexus"
          >
            <span className="font-android text-cyber-gold">A/S</span>{' '}
            <span className="font-android text-purple-100">Nexus</span>
          </Link>

          <nav
            ref={navRef}
            className="relative flex items-center"
            aria-label="Navegación principal"
          >
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-purple-300/60 bg-purple-900/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-purple-50 shadow-[0_0_20px_rgba(91,33,182,0.2)] transition hover:border-cyan-300/80 hover:bg-purple-800/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:hidden"
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
              aria-haspopup="true"
              aria-label={isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span aria-hidden="true">{isMenuOpen ? '✕' : '☰'}</span>
            </button>

            <div
              id={menuId}
              className={[
                'absolute right-0 top-[calc(100%+0.75rem)] z-30 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-purple-400/60 bg-black/95 p-2 shadow-[0_0_40px_rgba(147,51,234,0.22)] transition duration-200 md:static md:w-auto md:border-none md:bg-transparent md:p-0 md:shadow-none',
                isMenuOpen
                  ? 'visible translate-y-0 opacity-100'
                  : 'invisible -translate-y-2 opacity-0 md:visible md:translate-y-0 md:opacity-100',
              ].join(' ')}
            >
              <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2 lg:gap-3">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.to

                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={[
                          'flex min-h-11 items-center rounded-xl px-4 py-2 text-base tracking-[0.08em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:text-sm md:uppercase md:tracking-[0.18em]',
                          isActive
                            ? 'bg-purple-700/75 text-white shadow-[0_0_24px_rgba(168,85,247,0.28)]'
                            : 'text-purple-100 hover:bg-purple-800/70 hover:text-white',
                        ].join(' ')}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-12 border-t border-purple-500/40 pt-6 text-center text-xs leading-relaxed tracking-wide text-purple-200 md:text-sm">
        <span className="text-cyber-gold">©</span> {new Date().getFullYear()} Todos los derechos reservados • Built with React.js, Next.js, TypeScript & Tailwind CSS • UX/UI Interface • Database and Deploy by Firebase ®
      </footer>
    </div>
  )
}
