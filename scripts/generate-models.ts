// Pre-genera retratos de los 8 modelos ficticios usando image-generation API
// Se ejecuta una sola vez para tener assets estáticos en /public/models/

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";
import { MODELS } from "../src/lib/models";

const OUT_DIR = path.join(process.cwd(), "public", "models");

async function generateAll() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const zai = await ZAI.create();

  for (const model of MODELS) {
    const outPath = path.join(OUT_DIR, `${model.id}.png`);
    if (fs.existsSync(outPath)) {
      console.log(`[skip] ${model.id}.png ya existe`);
      continue;
    }
    console.log(`[gen] Generando ${model.id} (${model.name})...`);
    try {
      const response = await zai.images.generations.create({
        prompt: model.portraitPrompt,
        size: "768x1344",
      });
      const base64 = response?.data?.[0]?.base64;
      if (!base64) {
        console.error(`[err] No data for ${model.id}`);
        continue;
      }
      const buffer = Buffer.from(base64, "base64");
      fs.writeFileSync(outPath, buffer);
      console.log(`[ok] Guardado en ${outPath}`);
    } catch (err: any) {
      console.error(`[fail] ${model.id}:`, err?.message || err);
    }
  }
  console.log("Done.");
}

generateAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
