"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Download,
  ImagePlus,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload as UploadIcon,
  Wand2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  GARMENT_CATEGORIES,
  MODELS,
  type FashionModel,
  type GarmentCategory,
} from "@/lib/models";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GeneratedLook {
  id: string;
  resultPath: string;
  modelId: string;
  modelName: string;
  modelGender: string;
  garmentType: string;
  garmentName: string;
  createdAt: string;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export function Studio() {
  const [selectedModelId, setSelectedModelId] = useState<string>(MODELS[0].id);
  const [genderFilter, setGenderFilter] = useState<"todos" | "mujer" | "hombre">("todos");
  const [garmentCategory, setGarmentCategory] = useState<GarmentCategory>("camiseta");
  const [garmentName, setGarmentName] = useState<string>("");
  const [garmentDescription, setGarmentDescription] = useState<string>("");
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [garmentFileName, setGarmentFileName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedLook | null>(null);
  const [history, setHistory] = useState<GeneratedLook[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history on mount
  useEffect(() => {
    refreshHistory();
  }, []);

  async function refreshHistory() {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (Array.isArray(data?.looks)) {
        setHistory(data.looks);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const selectedModel = useMemo<FashionModel>(
    () => MODELS.find((m) => m.id === selectedModelId) ?? MODELS[0],
    [selectedModelId],
  );

  const filteredModels = useMemo(
    () =>
      genderFilter === "todos"
        ? MODELS
        : MODELS.filter((m) => m.gender === genderFilter),
    [genderFilter],
  );

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("La imagen es demasiado grande. Máximo 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setGarmentImage(reader.result as string);
      setGarmentFileName(file.name);
      toast.success("Prenda cargada correctamente.");
    };
    reader.onerror = () => toast.error("No se pudo leer la imagen.");
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  async function handleGenerate() {
    if (!garmentImage) {
      toast.error("Sube una imagen de la prenda antes de generar.");
      return;
    }
    setIsGenerating(true);
    setCurrentResult(null);
    try {
      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel.id,
          garmentCategory,
          garmentDescription,
          garmentName: garmentName || garmentCategory,
          garmentImage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Error generando look");
      }
      const look: GeneratedLook = {
        id: data.resultPath,
        resultPath: data.resultPath,
        modelId: data.model.id,
        modelName: data.model.name,
        modelGender: data.model.gender,
        garmentType: garmentCategory,
        garmentName: garmentName || garmentCategory,
        createdAt: new Date().toISOString(),
      };
      setCurrentResult(look);
      setShowResultModal(true);
      toast.success(`Look generado en ${data.model.name}.`);
      refreshHistory();
    } catch (err: any) {
      toast.error(err?.message || "Error desconocido.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDeleteHistory(id: string, look: GeneratedLook) {
    try {
      await fetch(`/api/history?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((l) => l.id !== id && l.resultPath !== look.resultPath));
      toast.success("Look eliminado del historial.");
    } catch (e) {
      toast.error("No se pudo eliminar.");
    }
  }

  return (
    <section id="estudio" className="border-t border-border/60">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">
            Estudio Try-On
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Crea tu look en 3 pasos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sube tu prenda, selecciona un modelo IA y genera una foto editorial. Todo desde una
            sola pantalla.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
          {/* LEFT — garment upload + config */}
          <div className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-semibold">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                    1
                  </span>
                  Sube tu prenda
                </h3>
                {garmentImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setGarmentImage(null);
                      setGarmentFileName("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" /> Quitar
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                id="garment-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              <Label
                htmlFor="garment-upload"
                onDrop={onDrop}
                onDragOver={onDragOver}
                className={cn(
                  "group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                  garmentImage
                    ? "border-rose-300 bg-rose-50/40"
                    : "border-border bg-muted/30 hover:border-rose-300 hover:bg-rose-50/30",
                )}
              >
                {garmentImage ? (
                  <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
                    <img
                      src={garmentImage}
                      alt="Prenda subida"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                      <ImagePlus className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Arrastra tu prenda aquí o haz click
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        JPG, PNG o WEBP · máx. 10 MB · fondo limpio recomendado
                      </p>
                    </div>
                  </>
                )}
              </Label>
              {garmentFileName && (
                <p className="mt-2 truncate text-xs text-muted-foreground">
                  <UploadIcon className="mr-1 inline h-3 w-3" />
                  {garmentFileName}
                </p>
              )}
            </div>

            <div className="grid gap-4">
              <div>
                <Label className="mb-2 block text-sm font-medium">Tipo de prenda</Label>
                <div className="flex flex-wrap gap-2">
                  {GARMENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGarmentCategory(cat.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        garmentCategory === cat.id
                          ? "border-rose-500 bg-rose-500 text-white shadow-sm"
                          : "border-border bg-background hover:bg-accent",
                      )}
                    >
                      <span aria-hidden>{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="garment-name" className="mb-1.5 block text-sm font-medium">
                  Nombre del producto <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="garment-name"
                  placeholder="Ej. Abrigo de lana camel"
                  value={garmentName}
                  onChange={(e) => setGarmentName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="garment-desc" className="mb-1.5 block text-sm font-medium">
                  Descripción <span className="text-muted-foreground">(opcional, mejora el resultado)</span>
                </Label>
                <Textarea
                  id="garment-desc"
                  rows={3}
                  placeholder="Ej. Camiseta oversize de algodón color verde oliva con estampado minimalista en el pecho."
                  value={garmentDescription}
                  onChange={(e) => setGarmentDescription(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Materiales, colores, detalles y corte ayudan a la IA a representar la prenda con
                  mayor fidelidad.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — model selection + generate */}
          <div className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-semibold">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                    2
                  </span>
                  Elige un modelo IA
                </h3>
                <div className="inline-flex rounded-full border border-border bg-muted/30 p-0.5">
                  {(["todos", "mujer", "hombre"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGenderFilter(g)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                        genderFilter === g
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid max-h-[360px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {filteredModels.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModelId(m.id)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border bg-muted text-left transition-all",
                      selectedModelId === m.id
                        ? "border-rose-500 ring-2 ring-rose-500/30"
                        : "border-border hover:border-rose-300 hover:shadow-sm",
                    )}
                  >
                    <div className="relative aspect-[3/5] w-full overflow-hidden bg-muted">
                      <Image
                        src={m.portraitPath}
                        alt={`Modelo ${m.name}`}
                        fill
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                      {selectedModelId === m.id && (
                        <div className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                        <p className="text-xs font-semibold text-white">{m.name}</p>
                        <p className="text-[10px] text-white/80">
                          {m.age} años · {m.height}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected model details */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={selectedModel.portraitPath}
                    alt={selectedModel.name}
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{selectedModel.name}</p>
                    <Badge variant="secondary" className="capitalize">
                      {selectedModel.gender}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {selectedModel.ethnicity} · {selectedModel.bodyType} · {selectedModel.height}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {selectedModel.bio}
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={handleGenerate}
              disabled={!garmentImage || isGenerating}
              className="h-12 w-full gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-rose-500/30 hover:opacity-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generando look…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generar look en {selectedModel.name}
                </>
              )}
            </Button>
            {!garmentImage && (
              <p className="-mt-3 text-center text-xs text-muted-foreground">
                Sube una prenda para activar la generación.
              </p>
            )}
          </div>
        </div>

        {/* Current result inline preview */}
        {currentResult && !showResultModal && (
          <div className="mt-10">
            <ResultCard look={currentResult} onOpen={() => setShowResultModal(true)} />
          </div>
        )}
      </div>

      {/* Result modal */}
      {showResultModal && currentResult && (
        <ResultModal
          look={currentResult}
          onClose={() => setShowResultModal(false)}
          onRegenerate={() => {
            setShowResultModal(false);
            handleGenerate();
          }}
        />
      )}

      {/* History section */}
      <HistorySection history={history} onDelete={handleDeleteHistory} onOpen={(look) => {
        setCurrentResult(look);
        setShowResultModal(true);
      }} />
    </section>
  );
}

function ResultCard({
  look,
  onOpen,
}: {
  look: GeneratedLook;
  onOpen: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/30 shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="relative aspect-[3/5] w-32 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-24">
          <Image
            src={look.resultPath}
            alt={`Look en ${look.modelName}`}
            fill
            sizes="128px"
            className="object-cover object-top"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rose-500" />
            <p className="text-sm font-semibold">Look generado</p>
          </div>
          <p className="mt-1 text-base font-bold">
            {look.garmentName} · {look.modelName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {look.modelGender} · {look.garmentType} · {new Date(look.createdAt).toLocaleString()}
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={onOpen} className="rounded-full">
              Ver en grande
            </Button>
            <a
              href={look.resultPath}
              download={`look_${look.modelId}_${look.garmentType}.png`}
              className="inline-flex h-9 items-center justify-center gap-1 rounded-full border border-border bg-background px-3 text-sm font-medium hover:bg-accent"
            >
              <Download className="h-3.5 w-3.5" /> Descargar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultModal({
  look,
  onClose,
  onRegenerate,
}: {
  look: GeneratedLook;
  onClose: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow ring-1 ring-border hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid max-h-[88vh] grid-cols-1 overflow-hidden md:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-[3/5] w-full bg-muted md:aspect-auto md:h-[88vh]">
            <Image
              src={look.resultPath}
              alt={`Look en ${look.modelName}`}
              fill
              sizes="(max-width:768px) 100vw, 60vw"
              className="object-contain md:object-cover md:object-top"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto p-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-rose-500">Resultado</p>
              <h3 className="mt-1 text-2xl font-bold leading-tight">
                {look.garmentName}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Modelo: <span className="font-medium text-foreground">{look.modelName}</span>{" "}
                · {look.modelGender} · {look.garmentType}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Esta imagen ha sido generada por IA vistiendo la prenda sobre el modelo
                ficticio. Mantén siempre transparencia con tu audiencia sobre el uso de IA en
                campañas de marca.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={look.resultPath}
                download={`look_${look.modelId}_${look.garmentType}.png`}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90"
              >
                <Download className="h-4 w-4" /> Descargar PNG
              </a>
              <button
                type="button"
                onClick={onRegenerate}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
              >
                <RefreshCw className="h-4 w-4" /> Regenerar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistorySection({
  history,
  onDelete,
  onOpen,
}: {
  history: GeneratedLook[];
  onDelete: (id: string, look: GeneratedLook) => void;
  onOpen: (look: GeneratedLook) => void;
}) {
  return (
    <section id="historial" className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">
            Tu catálogo
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Historial de looks generados
          </h2>
          <p className="mt-4 text-muted-foreground">
            Todas las generaciones se guardan aquí para que puedas comparar, descargar o eliminar.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-dashed border-border bg-background p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">Aún no hay looks generados</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sube una prenda arriba y verás tus resultados aquí.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {history.map((look) => (
              <div
                key={look.id}
                className="group relative overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm"
              >
                <div className="relative aspect-[3/5] w-full overflow-hidden bg-muted">
                  <Image
                    src={look.resultPath}
                    alt={`Look en ${look.modelName}`}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between gap-2 p-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onOpen(look)}
                      className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-md bg-background/95 text-xs font-medium text-foreground shadow hover:bg-background"
                    >
                      Ver
                    </button>
                    <a
                      href={look.resultPath}
                      download={`look_${look.modelId}_${look.garmentType}.png`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/95 text-foreground shadow hover:bg-background"
                      aria-label="Descargar"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onDelete(look.id, look)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/95 text-rose-600 shadow hover:bg-background"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-semibold">{look.garmentName}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {look.modelName} · {look.garmentType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
