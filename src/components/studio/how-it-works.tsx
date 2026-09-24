"use client";

import { MousePointerClick, Upload, Wand2 } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    title: "Sube tu prenda",
    description:
      "Arrastra la foto de tu producto (ropa, bolso o complemento) con fondo limpio. JPG o PNG hasta 10 MB. Cuanto mejor iluminada esté la prenda, mejor encajará en el modelo.",
  },
  {
    icon: MousePointerClick,
    title: "Elige un modelo IA",
    description:
      "Selecciona entre 8 modelos ficticios diversos: 4 mujeres y 4 hombres con distintas etnias, complexiones y alturas. Cada modelo está pensado para representar un segmento real de clientela.",
  },
  {
    icon: Wand2,
    title: "Genera el look",
    description:
      "La IA viste la prenda sobre el modelo manteniendo rostro, cuerpo y rasgos intactos. Obtienes una imagen editorial en alta resolución lista para catálogo, e-commerce o redes sociales.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">
            Cómo funciona
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            De foto de producto a editorial en 3 pasos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sin contratar modelos. Sin reservar estudio. Sin sesiones de posado. Solo sube, elige
            y descarga.
          </p>
        </div>

        <ol className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {STEPS.map((step, idx) => (
            <li
              key={step.title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute right-4 top-4 text-5xl font-black text-muted/40 transition-colors group-hover:text-rose-200">
                0{idx + 1}
              </div>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
