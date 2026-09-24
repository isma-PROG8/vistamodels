# 🛍️ VistaModels — AI Try-On Studio

Plataforma web de **virtual try-on con IA** para marcas de moda, ropa, bolsos y complementos.
Sube una prenda, elige un modelo IA ficticio y genera una foto editorial en segundos.

---

## ✨ Características

- **8 modelos IA ficticios** (4 mujeres + 4 hombres), diversos en etnia, edad, complexión y altura
- **10 categorías de prenda** soportadas (camiseta, camisa, chaqueta, abrigo, vestido, pantalón, falda, bolso, zapatos, complemento)
- **Virtual try-on** con IA generativa (image-edit multimagen)
- **Historial persistente** de looks generados (SQLite)
- **Descarga PNG** de cualquier look
- **UI responsive** y accesible, en español
- **Drag & drop** para subir imágenes de productos

---

## 🚀 Instalación local

### 1. Requisitos previos

- **Node.js 18+** (recomendado 20+) → https://nodejs.org
- **Bun** (gestor de paquetes rápido) → https://bun.sh
  ```bash
  # Linux / macOS
  curl -fsSL https://bun.sh/install | bash
  # Windows (PowerShell)
  irm bun.sh/install.ps1 | iex
  ```
- **API Key de Z.ai** (para la IA generativa) → https://chat.z.ai

### 2. Instalar dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
bun install
```

> Si prefieres npm o pnpm, también funciona: `npm install` o `pnpm install`

### 3. Configurar variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

El archivo `.env` solo necesita:
```
DATABASE_URL="file:./db/custom.db"
```

### 4. Configurar la API key de Z.ai

El SDK `z-ai-web-dev-sdk` lee la API key desde un archivo JSON llamado `.z-ai-config`,
**NO** desde variable de entorno.

Copia la plantilla:

```bash
cp .z-ai-config.example .z-ai-config
```

Edita `.z-ai-config` y pon tu API key de Z.ai:
```json
{
  "baseUrl": "https://api.z.ai/api/paas/v4",
  "apiKey": "TU_API_KEY_AQUI"
}
```

> 🔑 **Cómo conseguir tu API key**:
> 1. Ve a https://chat.z.ai
> 2. Inicia sesión o crea cuenta
> 3. Entra en tu perfil → "API Keys" → "Create new key"
> 4. Copia el key y pégalo en `.z-ai-config`

> El SDK busca el archivo en este orden:
> 1. `<carpeta-del-proyecto>/.z-ai-config`
> 2. `~/.z-ai-config` (tu carpeta de usuario)
> 3. `/etc/.z-ai-config` (solo Linux/Mac)

### 5. Inicializar la base de datos

```bash
bun run db:push
```

### 6. (Opcional) Regenerar los retratos de los modelos

Los retratos de los 8 modelos **ya están incluidos** en `public/models/`. No necesitas regenerarlos.

Si quieres volver a generarlos (o añadir modelos nuevos editando `src/lib/models.ts`):

```bash
bun run scripts/generate-models.ts
```

> ⚠️ Esto consume llamadas a la API de IA. Solo es necesario si cambias los modelos.

### 7. Arrancar la app en modo desarrollo

```bash
bun run dev
```

Abre tu navegador en: **http://localhost:3000** ✅

### 8. Compilar para producción

```bash
bun run build
bun run start
```

---

## 📂 Estructura del proyecto

```
vistamodels/
├── prisma/
│   └── schema.prisma              ← Modelo de datos (Look)
├── public/
│   ├── models/                    ← 8 retratos PNG de modelos IA (¡ya incluidos!)
│   └── looks/                     ← Looks generados (se crean al usar la app)
├── scripts/
│   └── generate-models.ts         ← Script para (re)generar retratos
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── try-on/route.ts   ← POST: genera el look con IA
│   │   │   ├── history/route.ts  ← GET/DELETE historial
│   │   │   └── models/route.ts  ← GET catálogo de modelos
│   │   ├── layout.tsx            ← Layout + metadata
│   │   ├── page.tsx              ← Página principal
│   │   └── globals.css
│   ├── components/
│   │   ├── studio/               ← Componentes de la landing y estudio
│   │   └── ui/                   ← Componentes shadcn/ui
│   └── lib/
│       ├── models.ts             ← Catálogo de modelos + prompts
│       ├── db.ts                  ← Cliente Prisma
│       └── utils.ts
├── .env.example                   ← Plantilla .env
├── .z-ai-config.example           ← Plantilla .z-ai-config (API key)
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🌐 Despliegue en plataformas

### Importante: archivos secretos

Estos archivos **NO** deben subirse a Git público (están en `.gitignore`):
- `.env`
- `.z-ai-config`

En cada plataforma de despliegue, configura las variables como secretos.

> El SDK `z-ai-web-dev-sdk` busca `.z-ai-config` en el filesystem, no en variables de entorno.
> Para despliegues serverless (Vercel/Netlify) tienes dos opciones:
>
> **Opción 1 (fácil)**: Crea el archivo en tiempo de build con un script que lea una
> variable de entorno `ZAI_CONFIG_JSON`:
> ```bash
> # En el build script o preinstall:
> echo "$ZAI_CONFIG_JSON" > .z-ai-config
> ```
> Y en Vercel/Netlify añade la variable `ZAI_CONFIG_JSON` con el contenido JSON completo.
>
> **Opción 2 (limpia)**: Modifica el SDK o crea un wrapper que lea `process.env.ZAI_API_KEY`
> y `process.env.ZAI_BASE_URL` directamente.

### Opción A: Vercel (recomendada, gratis)

1. Sube el proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "VistaModels - AI Try-On Studio"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/vistamodels.git
   git push -u origin main
   ```
2. Ve a https://vercel.com e inicia sesión con GitHub
3. Click en **"Add New Project"** → importa tu repo
4. En **Environment Variables**, añade:
   - `DATABASE_URL` = `file:./db/custom.db` (o usa BD externa, ver abajo)
   - `ZAI_CONFIG_JSON` = `{"baseUrl":"https://api.z.ai/api/paas/v4","apiKey":"TU_KEY"}`
5. En **Build Command** añade la creación del archivo:
   ```
   echo "$ZAI_CONFIG_JSON" > .z-ai-config && bun run build
   ```
6. Click en **Deploy** ✅

> ⚠️ SQLite **NO persiste** en Vercel serverless. Para producción real,
> cambia la base de datos a PostgreSQL (ver sección "Migrar a PostgreSQL" abajo).

### Opción B: Railway / Render (con base de datos persistente)

Ideal si quieres SQLite persistente o PostgreSQL:

1. https://railway.app o https://render.com
2. Crea un nuevo servicio desde tu repo de GitHub
3. Añade un add-on de PostgreSQL (o volumen persistente para SQLite)
4. Configura variables:
   - `DATABASE_URL` = URL de PostgreSQL
   - `ZAI_CONFIG_JSON` = `{"baseUrl":"...","apiKey":"..."}`
5. Build command: `echo "$ZAI_CONFIG_JSON" > .z-ai-config && bun install && bun run db:push && bun run build`
6. Start command: `bun run start`
7. Deploy ✅

### Opción C: VPS propio (DigitalOcean, Hetzner, Contabo, etc.)

1. Conéctate por SSH a tu servidor
2. Instala Node.js 20+ y Bun
3. Clona el repo: `git clone https://github.com/TU_USUARIO/vistamodels.git`
4. `cd vistamodels && bun install`
5. Crea `.env` y `.z-ai-config` manualmente
6. `bun run db:push`
7. `bun run build`
8. Arranca con proceso manager (PM2 o systemd):
   ```bash
   pm2 start "bun run start" --name vistamodels
   pm2 save && pm2 startup
   ```
9. Configura Nginx/Caddy como reverse proxy al puerto 3000
10. Añade SSL con Let's Encrypt (gratis)

---

## 🔄 Migrar a PostgreSQL (recomendado para producción multiusuario)

1. Edita `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Crea una BD PostgreSQL gratis en:
   - https://neon.tech (recomendado, serverless)
   - https://supabase.com
   - https://railway.app
3. Copia la URL de conexión en `.env`:
   ```
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   ```
4. Ejecuta:
   ```bash
   bun run db:push
   ```

---

## 🎨 Personalización

### Cambiar / añadir modelos

Edita `src/lib/models.ts` y añade entradas al array `MODELS`:

```typescript
{
  id: "nuevo-modelo",
  name: "Nombre",
  gender: "mujer", // o "hombre"
  age: 25,
  ethnicity: "Descripcion",
  bodyType: "Tipo",
  height: "175 cm",
  hair: "Descripcion del cabello",
  bio: "Biografía corta",
  portraitPrompt: "Prompt para generar el retrato...",
  portraitPath: "/models/nuevo-modelo.png",
  features: ["rasgo 1", "rasgo 2"],
}
```

Después ejecuta `bun run scripts/generate-models.ts` para generar el retrato.

### Cambiar el estilo fotográfico

Edita `buildTryOnPrompt()` en `src/lib/models.ts` para ajustar:
- Estilo editorial vs. e-commerce
- Fondo del estudio (color, textura)
- Tipo de iluminación
- Encuadre (full body, medio cuerpo, etc.)

### Cambiar colores de la UI

Edita las variables CSS en `src/app/globals.css` (sección `:root` y `.dark`).

---

## 🛠️ Stack técnico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4 + shadcn/ui
- **Base de datos**: Prisma ORM + SQLite
- **IA generativa**: z-ai-web-dev-sdk (image-generation + image-edit)
- **Iconos**: lucide-react
- **Toasts**: sonner

---

## ⚠️ Notas legales

- Los 8 modelos son **ficticios y generados íntegramente por IA**. No representan personas reales.
- Las imágenes generadas pueden utilizarse libremente en catálogos, e-commerce y campañas.
- Se recomienda **transparencia con tu audiencia** sobre el uso de IA en materiales de marca.
- Asegúrate de tener los derechos de las fotos de producto que subas.

---

## ❓ Soporte

Si encuentras problemas:
1. Verifica que `.z-ai-config` existe en la raíz del proyecto con tu API key correcta
2. Ejecuta `bun run db:push` para inicializar la BD
3. Comprueba que `public/models/` contiene los 8 PNG (si no, ejecuta el script de generación)
4. Revisa la consola del navegador (F12) y la terminal donde corre `bun run dev`
5. Abre un issue en tu repositorio con el error detallado

¡Disfruta de VistaModels! 🛍️✨
