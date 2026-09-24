import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const HOURS_24 = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    // Limpieza: borrar caducados (+24h) y los viejos sin imagen guardada
    await db.look
      .deleteMany({
        where: {
          OR: [
            { createdAt: { lt: new Date(Date.now() - HOURS_24) } },
            { resultData: null },
          ],
        },
      })
      .catch(() => {});

    const looks = await db.look.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        id: true,
        modelId: true,
        modelName: true,
        modelGender: true,
        garmentType: true,
        garmentName: true,
        prompt: true,
        resultPath: true,
        createdAt: true,
        // resultData NO se incluye: es la imagen en base64 (pesa megas)
      },
    });
    return NextResponse.json({ looks });
  } catch (err: any) {
    console.error("[history GET] error:", err);
    return NextResponse.json({ looks: [] });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id requerido" }, { status: 400 });
    }
    await db.look.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[history DELETE] error:", err);
    return NextResponse.json({ error: err?.message || "error" }, { status: 500 });
  }
}