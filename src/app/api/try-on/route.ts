import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
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

    // Resolve model portrait as data URL (image-edit needs reachable image URLs)
    const portraitFsPath = path.join(process.cwd(), "public", model.portraitPath);
    if (!fs.existsSync(portraitFsPath)) {
      return NextResponse.json({ error: "Retrato del modelo no disponible" }, { status: 500 });
    }
    const portraitBuffer = fs.readFileSync(portraitFsPath);
    const portraitDataUrl = `data:image/png;base64,${portraitBuffer.toString("base64")}`;

    const prompt = buildTryOnPrompt(model, garmentCategory, garmentDescription ?? "");

    const zai = await ZAI.create();
    const response = await zai.images.generations.edit({
      prompt,
      images: [{ url: portraitDataUrl }, { url: garmentImage }],
      size: "768x1344",
    });

    const base64 = response?.data?.[0]?.base64;
    if (!base64) {
      return NextResponse.json(
        { error: "La IA no devolvió imagen. Intenta con otra prenda o descripción." },
        { status: 502 },
      );
    }

    // Persist the generated look to disk + DB
    const lookId = `look_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const looksDir = path.join(process.cwd(), "public", "looks");
    if (!fs.existsSync(looksDir)) {
      fs.mkdirSync(looksDir, { recursive: true });
    }
    const outFileName = `${lookId}.png`;
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
