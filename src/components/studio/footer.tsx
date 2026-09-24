"use client";

import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight text-background">
                  VistaModels
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-background/60">
                  AI Try-On Studio
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-background/70">
              Plataforma de virtual try-on para marcas de moda. Sube tus prendas, elige un modelo
              IA y obtén sesiones editoriales en segundos, sin coste de estudio.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterCol
              title="Producto"
              links={[
                { label: "Cómo funciona", href: "#como-funciona" },
                { label: "Modelos", href: "#modelos" },
                { label: "Estudio", href: "#estudio" },
                { label: "Historial", href: "#historial" },
              ]}
            />
            <FooterCol
              title="Casos de uso"
              links={[
                { label: "Ropa", href: "#estudio" },
                { label: "Bolsos", href: "#estudio" },
                { label: "Calzado", href: "#estudio" },
                { label: "Complementos", href: "#estudio" },
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                { label: "Términos", href: "#" },
                { label: "Privacidad", href: "#" },
                { label: "Uso de IA", href: "#" },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-background/10 pt-6 text-xs text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VistaModels. Demo construida con Next.js + IA generativa.</p>
          <p>
            Las imágenes son generadas con IA. Los modelos son ficticios y no representan personas
            reales.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-background/80">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-sm text-background/70 transition-colors hover:text-background"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
