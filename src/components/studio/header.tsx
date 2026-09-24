"use client";

import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 shadow-lg shadow-rose-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">VistaModels</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              AI Try-On Studio
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="#como-funciona"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Cómo funciona
          </a>
          <a
            href="#modelos"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Modelos
          </a>
          <a
            href="#estudio"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Estudio
          </a>
          <a
            href="#historial"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Historial
          </a>
        </nav>

        <a
          href="#estudio"
          className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
        >
          Empezar
        </a>
      </div>
    </header>
  );
}
