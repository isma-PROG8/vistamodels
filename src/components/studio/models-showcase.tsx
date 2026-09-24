"use client";

import Image from "next/image";
import { MODELS } from "@/lib/models";

export function ModelsShowcase() {
  return (
    <section id="modelos" className="border-t border-border/60 bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">
            Catálogo
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Nuestros modelos IA
          </h2>
          <p className="mt-4 text-muted-foreground">
            Una selección inclusiva de 8 modelos ficticios generados con IA, con perfiles
            diversos en etnia, edad, complexión y altura. Ideal para representar distintas
            segmentos de clientela sin necesidad de sesiones de fotos reales.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {MODELS.map((m) => (
            <article
              key={m.id}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[3/5] w-full overflow-hidden bg-muted">
                <Image
                  src={m.portraitPath}
                  alt={`Modelo IA ${m.name}`}
                  fill
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3">
                  <p className="text-sm font-semibold text-white">{m.name}</p>
                  <p className="text-[10px] text-white/80">
                    {m.age} años · {m.height}
                  </p>
                </div>
              </div>
              <div className="p-3">
                <dl className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Género</dt>
                    <dd className="font-medium capitalize">{m.gender}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Complexión</dt>
                    <dd className="font-medium">{m.bodyType}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Etnia</dt>
                    <dd className="font-medium">{m.ethnicity}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Cabello</dt>
                    <dd className="font-medium truncate">{m.hair}</dd>
                  </div>
                </dl>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          Estos modelos son ficticios y generados íntegramente por IA. No representan personas
          reales. Puedes utilizarlos libremente en catálogos, e-commerce y campañas de marketing.
        </p>
      </div>
    </section>
  );
}
