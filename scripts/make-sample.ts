import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

async function main() {
  const zai = await ZAI.create();
  const out = path.join(process.cwd(), "scripts", "sample-garment.png");
  const r = await zai.images.generations.create({
    prompt:
      "Product photography of a women's olive green oversized cotton t-shirt with a minimalist geometric chest print, displayed on invisible mannequin, plain white seamless background, soft studio lighting, e-commerce catalog photo, sharp focus, high detail",
    size: "1024x1024",
  });
  const b64 = r?.data?.[0]?.base64;
  if (!b64) { console.error("no data"); process.exit(1); }
  fs.writeFileSync(out, Buffer.from(b64, "base64"));
  console.log("saved", out);
}
main().catch((e) => { console.error(e); process.exit(1); });
