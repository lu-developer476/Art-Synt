import { Link, useSearchParams } from 'react-router-dom'

const statusCopy = {
  ok: {
    eyebrow: 'Identidad validada',
    title: 'Correo verificado correctamente.',
    description:
      'La identidad se encuentra confirmada. Regresa a Acceso e iniciá sesión para operar dentro de A/S Nexus.',
  },
  pendiente: {
    eyebrow: 'Identidad pendiente de verificar acceso',
    title: 'Todavía falta abrir el enlace seguro del correo.',
    description:
      'Revisa la bandeja de entrada, spam o promociones del correo usado al registrarte para completar el estado final.',
  },
} as const

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('registro') === 'ok' ? 'ok' : 'pendiente'
  const content = statusCopy[status]

  return (
    <section className="mx-auto max-w-4xl pb-16">
      <div className="rounded-[2rem] border border-cyan-400/50 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8 shadow-[0_0_50px_rgba(34,211,238,0.12)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">{content.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">{content.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-purple-100">{content.description}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-purple-400/40 bg-black/30 p-5 text-sm text-purple-100">
            <p className="font-semibold text-cyan-300">Qué deberías ver en tu mail</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-6 text-purple-200">
              <li>Un correo emitido por Firebase Authentication.</li>
              <li>Un correo adicional de A/S Nexus con Nodemailer para guiar el proceso.</li>
              <li>Un enlace seguro que valida tu cuenta y te devuelve a esta interfaz.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-purple-400/40 bg-black/30 p-5 text-sm text-purple-100">
            <p className="font-semibold text-cyan-300">Siguiente acción</p>
            <p className="mt-3 leading-6 text-purple-200">
              Si ya validaste el correo, regresa a Acceso y tu login queda habilitado. Si no lo hiciste, vuelve a ingresar a tu casilla de mail registrado con el enlace pendiente.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/acceso"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Ir a Acceso
          </Link>
          <Link
            to="/contacto"
            className="rounded-lg border border-purple-300 px-4 py-2 text-sm text-purple-100 hover:bg-purple-900/40"
          >
            Hablar con soporte
          </Link>
        </div>
      </div>
    </section>
  )
}
