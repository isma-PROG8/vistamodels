#!/bin/bash
# Empaqueta el proyecto VistaModels en un ZIP listo para descargar
set -e

PROJECT_DIR="/home/z/my-project"
OUT_ZIP="/home/z/my-project/download/vistamodels.zip"
STAGE_DIR="/home/z/my-project/.stage-zip"

echo "[1/5] Limpiando stage anterior..."
rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR/vistamodels"

echo "[2/5] Copiando archivos del proyecto..."
cd "$PROJECT_DIR"

# Copiar directorios necesarios
cp -r src "$STAGE_DIR/vistamodels/"
cp -r prisma "$STAGE_DIR/vistamodels/"
cp -r public "$STAGE_DIR/vistamodels/"
cp -r scripts "$STAGE_DIR/vistamodels/"

# Copiar archivos de configuración
cp package.json "$STAGE_DIR/vistamodels/"
cp bun.lock "$STAGE_DIR/vistamodels/" 2>/dev/null || true
cp next.config.ts "$STAGE_DIR/vistamodels/"
cp tsconfig.json "$STAGE_DIR/vistamodels/"
cp tailwind.config.ts "$STAGE_DIR/vistamodels/"
cp postcss.config.mjs "$STAGE_DIR/vistamodels/"
cp components.json "$STAGE_DIR/vistamodels/"
cp eslint.config.mjs "$STAGE_DIR/vistamodels/"
cp .gitignore "$STAGE_DIR/vistamodels/"
cp .env.example "$STAGE_DIR/vistamodels/"
cp .z-ai-config.example "$STAGE_DIR/vistamodels/"
cp README.md "$STAGE_DIR/vistamodels/"

# Eliminar looks generados (contenido dinámico del sandbox)
rm -rf "$STAGE_DIR/vistamodels/public/looks"
# Eliminar preview PNGs del sandbox si los hubiera
rm -f "$STAGE_DIR/vistamodels/public/preview-*.png"

# Eliminar .next (build cache)
# (no se copió)

echo "[3/5] Verificando contenido..."
echo "=== Archivos incluidos ==="
find "$STAGE_DIR/vistamodels" -maxdepth 2 -type d | head -30
echo "..."
echo "=== Total archivos: $(find "$STAGE_DIR/vistamodels" -type f | wc -l) ==="

echo "[4/5] Creando ZIP..."
mkdir -p "$(dirname "$OUT_ZIP")"
cd "$STAGE_DIR"
zip -rq "$OUT_ZIP" vistamodels

echo "[5/5] Verificando ZIP..."
ls -lh "$OUT_ZIP"
echo ""
echo "=== Contenido del ZIP (primeras 40 entradas) ==="
unzip -l "$OUT_ZIP" | head -50

echo ""
echo "✅ ZIP creado en: $OUT_ZIP"
