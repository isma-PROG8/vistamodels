import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const HOURS_24 = 24 * 60 * 60 * 1000;

// Sirve la imagen de un look: /api/looks/{id}.png
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;

    // El id llega con extensión: "abc-123.png" → "abc-123" + "png"
    const lastDot = rawId.lastIndexOf(".");
    const lookId = lastDot > 0 ? rawId.slice(0, lastDot) : rawId;
    const ext = lastDot > 0 ? rawId.slice(lastDot + 1).toLowerCase() : "png";

    const look = await db.look.findUnique({ where: { id: lookId } });

    if (!look || !look.resultData) {
      return new NextResponse("Look no encontrado", { status: 404 });
    }

    // Expiración: más de 24h → borrar y responder 404
    if (Date.now() - look.createdAt.getTime() > HOURS_24) {
      await db.look.delete({ where: { id: lookId } }).catch(() => {});
      return new NextResponse("El look ha expirado (más de 24h)", { status: 404 });
    }

    const buffer = Buffer.from(look.resultData, "base64");
    const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("[looks] error:", err);
    return new NextResponse("Error sirviendo la imagen", { status: 500 });
  }
}