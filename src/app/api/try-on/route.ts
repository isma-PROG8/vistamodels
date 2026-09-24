import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MODELS, buildTryOnPrompt, type GarmentCategory } from "@/lib/models";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 300;

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

    const prompt = buildTryOnPrompt(model, garmentCategory, garmentDescription ?? "");

    // La prenda llega como "data:image/...;base64,...."
    const garment = splitDataUrl(garmentImage);

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Falta GEMINI_API_KEY en el archivo .env" },
        { status: 500 },
      );
    }

    // Llamada a Google Gemini: prompt + retrato + prenda → foto del look
    const geminiRes = await fetch(
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
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("[try-on] Error de Gemini:", geminiRes.status, errorText);
      return NextResponse.json(
        { error: `La IA devolvió un error (código ${geminiRes.status}). Mira la terminal.` },
        { status: 502 },
      );
    }

    const geminiJson: any = await geminiRes.json();

    // Busca la imagen dentro de la respuesta
    const parts: any[] = geminiJson?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p?.inlineData?.data || p?.inline_data?.data);
    const base64 = imagePart?.inlineData?.data ?? imagePart?.inline_data?.data;
    const returnedMime =
      imagePart?.inlineData?.mimeType ??
      imagePart?.inline_data?.mime_type ??
      "image/png";

    if (!base64) {
      return NextResponse.json(
        { error: "La IA no devolvió imagen. Intenta con otra prenda o descripción." },
        { status: 502 },
      );
    }

    // Guardar el look en disco + base de datos (igual que antes)
    const lookId = `look_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ext = returnedMime.includes("jpeg") ? "jpg" : "png";
    const looksDir = path.join(process.cwd(), "public", "looks");
    if (!fs.existsSync(looksDir)) {
      fs.mkdirSync(looksDir, { recursive: true });
    }
    const outFileName = `${lookId}.${ext}`;
    const outFsPath = path.join(looksDir, outFileName);
    fs.writeFileSync(outFsPath, Buffer.from(base64, "base64"));
    const resultPath = `/looks/${outFileName}`;

    // Save to DB (best-effort, don't fail if DB unavailable)
    try {
      await db.look.create({
        data: {
          modelId: model.id,
          modelName: model.name,
          modelGender: model.gender,
          garmentType: garmentCategory,
          garmentName: garmentName ?? garmentCategory,
          prompt,
          resultPath,
        },
      });
    } catch (dbErr) {
      console.error("[try-on] DB save failed:", dbErr);
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