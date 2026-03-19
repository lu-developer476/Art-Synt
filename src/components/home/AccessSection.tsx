import type { FormEvent } from 'react'
import type { User } from 'firebase/auth'

interface AccessSectionProps {
  authEmail: string
  authMessage: string | null
  authPassword: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSignIn: (event: FormEvent) => Promise<void>
  onSignOut: () => Promise<void>
  onSignUp: () => Promise<void>
  user: User | null
}

export default function AccessSection({
  authEmail,
  authMessage,
  authPassword,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  onSignOut,
  onSignUp,
  user,
}: AccessSectionProps) {
  return (
    <section className="grid gap-6 rounded-3xl border border-purple-400/50 bg-gradient-to-br from-purple-950/80 via-black/70 to-slate-900/70 p-6 md:grid-cols-2">
      <div>
        <h2 className="text-2xl font-semibold text-purple-100">Acceso</h2>
        <p className="mt-2 text-sm text-purple-200">Validá tu identidad para operar en la red.</p>
        {user ? (
          <div className="mt-4 space-y-3 rounded-xl bg-purple-900/40 p-4">
            <p className="text-sm text-purple-100">Sesión activa: {user.email}</p>
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
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800"
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => void onSignUp()}
            className="rounded-lg border border-purple-400 px-4 py-2 text-sm text-purple-100 hover:bg-purple-900/40"
          >
            Registrarse
          </button>
        </div>
      </form>
    </section>
  )
}
