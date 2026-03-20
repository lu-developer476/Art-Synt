import type { FormEvent } from 'react'
import type { User } from 'firebase/auth'

interface AccessSectionProps {
  authEmail: string
  authMessage: string | null
  authPassword: string
  isAuthLoading: boolean
  isRegisterModalOpen: boolean
  onCloseRegisterModal: () => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSignIn: (event: FormEvent) => Promise<void>
  onSignOut: () => Promise<void>
  onSignUp: () => Promise<void>
  user: User | null
  verificationCenterUrl: string
}

export default function AccessSection({
  authEmail,
  authMessage,
  authPassword,
  isAuthLoading,
  isRegisterModalOpen,
  onCloseRegisterModal,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  onSignOut,
  onSignUp,
  user,
  verificationCenterUrl,
}: AccessSectionProps) {
  return (
    <>
      <section className="grid gap-6 rounded-3xl border border-purple-400/50 bg-gradient-to-br from-purple-950/80 via-black/70 to-slate-900/70 p-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-purple-100">Acceso</h2>
          <p className="mt-2 text-sm text-purple-200">
            Validá tu identidad para operar en la red. Solo las cuentas con correo verificado pueden ingresar.
          </p>
          <div className="mt-4 rounded-2xl border border-cyan-400/30 bg-cyan-950/20 p-4 text-sm text-cyan-100">
            <p className="font-semibold uppercase tracking-[0.2em] text-cyan-300">Flujo recomendado</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-purple-100/90">
              <li>Registrate con tu correo operativo.</li>
              <li>Revisá la bandeja de entrada y spam para ubicar el mail de validación.</li>
              <li>Abrí el enlace seguro y finalizá el acceso desde el centro de verificación.</li>
            </ol>
          </div>
          {user ? (
            <div className="mt-4 space-y-3 rounded-xl bg-purple-900/40 p-4">
              <p className="text-sm text-purple-100">Sesión activa: {user.email}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                Estado: {user.emailVerified ? 'correo validado' : 'pendiente de validación'}
              </p>
              <button
                onClick={() => void onSignOut()}
                className="rounded-lg border border-purple-300 px-3 py-2 text-sm text-purple-100 hover:bg-purple-800/50"
              >
                Cerrar sesión
              </button>
            </div>
          ) : null}
          {authMessage ? <p className="mt-3 text-sm text-purple-200">{authMessage}</p> : null}
        </div>

        <form className="space-y-3" onSubmit={(event) => void onSignIn(event)}>
          <label className="block text-sm text-purple-100">
            Correo
            <input
              type="email"
              value={authEmail}
              onChange={(event) => onEmailChange(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-purple-400 bg-black/30 px-3 py-2 text-purple-50"
            />
          </label>
          <label className="block text-sm text-purple-100">
            Clave
            <input
              type="password"
              value={authPassword}
              onChange={(event) => onPasswordChange(event.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-purple-400 bg-black/30 px-3 py-2 text-purple-50"
            />
          </label>
          <div className="rounded-2xl border border-purple-400/40 bg-black/20 p-4 text-xs leading-6 text-purple-200">
            Después del alta te enviaremos un correo real con Nodemailer y un enlace seguro de verificación gestionado por Firebase.
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isAuthLoading}
              className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthLoading ? 'Procesando...' : 'Ingresar'}
            </button>
            <button
              type="button"
              disabled={isAuthLoading}
              onClick={() => void onSignUp()}
              className="rounded-lg border border-purple-400 px-4 py-2 text-sm text-purple-100 hover:bg-purple-900/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Registrarse
            </button>
            <a
              href={verificationCenterUrl}
              className="rounded-lg border border-cyan-400/60 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-900/30"
            >
              Centro de verificación
            </a>
          </div>
        </form>
      </section>

      {isRegisterModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-400/50 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 shadow-[0_0_45px_rgba(34,211,238,0.18)]">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Cuenta creada</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Revisá el correo electrónico registrado</h3>
            <p className="mt-3 text-sm leading-6 text-purple-100">
              Ya enviamos el mail de validación. Abrí el enlace que recibiste para habilitar tu cuenta y, si querés, seguí el estado desde nuestro centro de verificación.
            </p>
            <div className="mt-5 rounded-2xl border border-purple-400/40 bg-black/30 p-4 text-sm text-purple-100">
              <p className="font-semibold text-cyan-300">Siguiente paso</p>
              <p className="mt-2 break-all">{verificationCenterUrl}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={verificationCenterUrl}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Abrir centro de verificación
              </a>
              <button
                type="button"
                onClick={onCloseRegisterModal}
                className="rounded-lg border border-purple-300 px-4 py-2 text-sm text-purple-100 hover:bg-purple-900/40"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
