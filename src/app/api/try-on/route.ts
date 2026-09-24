import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MODELS, buildTryOnPrompt, type GarmentCategory } from "@/lib/models";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

interface TryOnRequestBody {
  modelId: string;
  garmentCategory: GarmentCategory;
  garmentDescription?: string;
  garmentName?: string;
  garmentImage: string; // base64 data URL of the uploaded product photo
}

// Separa "data:image/png;base64,XXXX" en sus dos partes
function splitDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl.trim());
  if (!match) {
    throw new Error("Formato de imagen no válido (se esperaba data URL en base64)");
  }
  return { mimeType: match[1], data: match[2] };
}

const HOURS_24 = 24 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 2;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TryOnRequestBody;
    const { modelId, garmentCategory, garmentDescription, garmentName, garmentImage } = body;

    if (!modelId || !garmentCategory || !garmentImage) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: modelId, garmentCategory, garmentImage" },
        { status: 400 },
      );
    }

    const model = MODELS.find((m) => m.id === modelId);
    if (!model) {
      return NextResponse.json({ error: "Modelo no encontrado" }, { status: 404 });
    }

    // Retrato del modelo (leído del disco → base64)
    const portraitFsPath = path.join(process.cwd(), "public", model.portraitPath);
    if (!fs.existsSync(portraitFsPath)) {
      return NextResponse.json({ error: "Retrato del modelo no disponible" }, { status: 500 });
    }
    const portraitBase64 = fs.readFileSync(portraitFsPath).toString("base64");

    const garment = splitDataUrl(garmentImage);

    // Guardia: fotos demasiado grandes fallan en la API de Gemini
    if (garment.data.length > 15_000_000) {
      return NextResponse.json(
        { error: "La foto de la prenda es demasiado grande. Usa una imagen más ligera." },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Falta GEMINI_API_KEY en el .env" }, { status: 500 });
    }

    // Prompt reforzado: decimos CLARO qué hacer con cada imagen
    const basePrompt = buildTryOnPrompt(model, garmentCategory, garmentDescription ?? "");
    const prompt = [
      basePrompt,
      "",
      "CRITICAL INSTRUCTIONS:",
      "- Generate ONE completely NEW photorealistic photograph.",
      "- The FIRST attached image is the person (the model).",
      "- The SECOND attached image is the garment/product that this person must be WEARING.",
      "- Fit the garment naturally to the model's body, keeping its design, colors and details faithful to the second image.",
      "- NEVER return any of the attached images unmodified or without the garment worn.",
    ].join("\n");

    // Llamada a Gemini CON REINTENTOS
    let base64: string | undefined;
    let returnedMime = "image/png";
    let lastReason = "desconocido";

    for (let attempt = 1; attempt <= MAX_ATTEMPTS && !base64; attempt++) {
      let geminiRes: Response;

      try {
        geminiRes = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": process.env.GEMINI_API_KEY,
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: prompt },
                    { inlineData: { mimeType: "image/png", data: portraitBase64 } },
                    { inlineData: { mimeType: garment.mimeType, data: garment.data } },
                  ],
                },
              ],
              generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
            }),
          },
        );
      } catch (netErr: any) {
        console.error(`[try-on] Intento ${attempt}: fallo de red:`, netErr?.message);
        lastReason = "fallo de red";
        if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 1500));
        continue;
      }

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        console.error(`[try-on] Intento ${attempt}: error ${geminiRes.status}:`, errorText.slice(0, 500));
        lastReason = `código ${geminiRes.status}`;
        if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 1500));
        continue;
      }

      const geminiJson: any = await geminiRes.json();
      const parts: any[] = geminiJson?.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((p) => p?.inlineData?.data || p?.inline_data?.data);
      base64 = imagePart?.inlineData?.data ?? imagePart?.inline_data?.data;
      returnedMime =
        imagePart?.inlineData?.mimeType ??
        imagePart?.inline_data?.mime_type ??
        "image/png";

      if (!base64) {
        const finishReason = geminiJson?.candidates?.[0]?.finishReason;
        const blockReason = geminiJson?.promptFeedback?.blockReason;
        const textPreview = parts
          .map((p: any) => (typeof p?.text === "string" ? p.text : ""))
          .join(" ")
          .slice(0, 200);
        console.error(
          `[try-on] Intento ${attempt}: sin imagen →`,
          JSON.stringify({ finishReason, blockReason, textPreview }),
        );
        lastReason = finishReason ?? blockReason ?? "sin imagen";
        if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 1500));
      }
    }

    if (!base64) {
      return NextResponse.json(
        {
          error:
            `La IA no pudo generar la imagen tras ${MAX_ATTEMPTS} intentos (motivo: ${lastReason}). ` +
            "Prueba otra vez, o con otra foto de prenda (mejor sin personas) u otro modelo.",
        },
        { status: 502 },
      );
    }

    // Guardar la imagen en la base de datos
    const lookId = crypto.randomUUID();
    const ext = returnedMime.includes("jpeg") ? "jpg" : "png";
    const resultPath = `/api/looks/${lookId}.${ext}`;

    // Limpieza: borrar looks con más de 24h (best-effort)
    try {
      await db.look.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - HOURS_24) } },
      });
    } catch (cleanupErr) {
      console.error("[try-on] cleanup failed:", cleanupErr);
    }

    try {
      await db.look.create({
        data: {
          id: lookId,
          modelId: model.id,
          modelName: model.name,
          modelGender: model.gender,
          garmentType: garmentCategory,
          garmentName: garmentName ?? garmentCategory,
          prompt,
          resultPath,
          resultData: base64,
        },
      });
    } catch (dbErr) {
      console.error("[try-on] DB save failed:", dbErr);
      return NextResponse.json(
        { error: "No se pudo guardar el look en la base de datos" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      resultPath,
      resultUrl: resultPath,
      model: { id: model.id, name: model.name, gender: model.gender },
      prompt,
    });
  } catch (err: any) {
    console.error("[try-on] error:", err);
    return NextResponse.json(
      { error: err?.message || "Error procesando el try-on" },
      { status: 500 },
    );
  }
}