"use client";

import { ArrowRight, ImageIcon, Wand2, Users } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-200/50 via-pink-200/40 to-orange-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-40 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl"
      />

      <div className="container relative mx-auto px-4 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-1 text-xs font-medium text-rose-700 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
            Plataforma AI para marcas de moda
          </div>

          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Sube tu prenda.
            <br />
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Vela en modelos IA
            </span>{" "}
            en segundos.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            VistaModels es el estudio de probador virtual para marcas de ropa, bolsos y
            complementos. Elige uno de nuestros modelos ficticios, sube tu producto y deja que la
            IA genere una sesión editorial completa, sin casting ni sesiones de fotos.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#estudio"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background shadow-lg transition-transform hover:scale-[1.03]"
            >
              Probar ahora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#modelos"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Ver modelos
            </a>
          </div>

          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 text-left sm:gap-10">
            <Stat
              icon={<Users className="h-4 w-4" />}
              value="8"
              label="Modelos ficticios con IA (hombre y mujer)"
            />
            <Stat
              icon={<ImageIcon className="h-4 w-4" />}
              value="10+"
              label="Tipos de prenda soportados"
            />
            <Stat
              icon={<Wand2 className="h-4 w-4" />}
              value="<60s"
              label="Por generación de look"
            />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-rose-500">{icon}</div>
      <dt className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</dt>
      <dd className="text-xs leading-tight text-muted-foreground">{label}</dd>
    </div>
  );
}
