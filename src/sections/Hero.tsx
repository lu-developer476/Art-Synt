export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-purple-400/30 bg-black/40 px-8 py-12 backdrop-blur">
      <div className="space-y-6">
        <div className="animate-float flex w-fit items-center justify-center rounded-3xl border border-purple-300/20 bg-white/5 p-4 shadow-[0_0_40px_rgba(168,85,247,0.18)]">
          <img
            src="/logo.svg"
            alt="A/S Nexus"
            className="h-24 w-24 md:h-32 md:w-32"
          />
        </div>

        <div className="space-y-4">
          <h1 className="max-w-5xl text-4xl font-semibold uppercase leading-tight tracking-wide text-purple-100 md:text-6xl">
            La carne y el metal, entrelazados. Aumenta tus propias capacidades
          </h1>

          <p className="max-w-3xl text-lg italic text-purple-200/90">
            “Potenciamos lo humano con precisión, criterio y control”
          </p>

          <p className="max-w-4xl text-base text-purple-100/80 md:text-lg">
            Implantes diseñados y calibrados para tu ritmo, exigencia y la forma en que la ciudad obliga a superarte.
          </p>
        </div>
      </div>
    </section>
  )
}
