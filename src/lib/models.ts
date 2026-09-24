// Catálogo de modelos ficticios con IA
// 4 mujeres + 4 hombres, diversos perfiles para mostrar prendas en distintos cuerpos

export type ModelGender = "mujer" | "hombre";

export type GarmentCategory =
  | "camiseta"
  | "camisa"
  | "chaqueta"
  | "abrigo"
  | "vestido"
  | "pantalon"
  | "falda"
  | "bolso"
  | "zapatos"
  | "complemento";

export interface FashionModel {
  id: string;
  name: string;
  gender: ModelGender;
  age: number;
  ethnicity: string;
  bodyType: string;
  height: string;
  hair: string;
  bio: string;
  // Prompt usado para generar el retrato base (referencia)
  portraitPrompt: string;
  // Path público del retrato generado
  portraitPath: string;
  // Tono de piel y rasgos para construir el prompt de try-on
  features: string[];
}

export const MODELS: FashionModel[] = [
  {
    id: "sofia",
    name: "Sofía",
    gender: "mujer",
    age: 26,
    ethnicity: "Caucásica mediterránea",
    bodyType: "Delgada",
    height: "176 cm",
    hair: "Castaño claro, liso, largo",
    bio: "Modelo editorial especializada en lookbook minimalista y campañas de lujo.",
    portraitPrompt:
      "Professional fashion studio portrait of a 26 year old Mediterranean Caucasian woman, slim athletic build, long straight light brown hair, fair skin, hazel eyes, neutral makeup, wearing a simple white tank top, standing centered, full body visible, plain warm beige seamless studio background, soft even fashion lighting, high-end editorial photography, photorealistic, sharp focus, full body framing",
    portraitPath: "/models/sofia.png",
    features: ["piel clara", "cabello castaño liso largo", "complexión delgada", "ojos avellana"],
  },
  {
    id: "carmen",
    name: "Carmen",
    gender: "mujer",
    age: 29,
    ethnicity: "Latina",
    bodyType: "Curvas",
    height: "170 cm",
    hair: "Negro, ondulado, media melena",
    bio: "Modelo de campañas de moda curvy y lifestyle, gran presencia en redes sociales.",
    portraitPrompt:
      "Professional fashion studio portrait of a 29 year old Latina woman, curvy figure, wavy medium length black hair, warm tan skin, brown eyes, natural makeup, wearing a fitted black dress, standing centered, full body visible, plain soft pink seamless studio background, soft even fashion lighting, high-end editorial photography, photorealistic, sharp focus, full body framing",
    portraitPath: "/models/carmen.png",
    features: ["piel canela", "cabello negro ondulado", "curvas", "ojos marrones"],
  },
  {
    id: "aisha",
    name: "Aisha",
    gender: "mujer",
    age: 24,
    ethnicity: "Afrodescendiente",
    bodyType: "Atlética",
    height: "178 cm",
    hair: "Rasta corta, negro",
    bio: "Modelo deportiva urbana, ideal para streetwear y accesorios de moda contemporánea.",
    portraitPrompt:
      "Professional fashion studio portrait of a 24 year old Black African woman, athletic toned build, short black locs hairstyle, deep melanin skin, dark brown eyes, minimal makeup, wearing a fitted beige bodysuit, standing centered, full body visible, plain warm terracotta seamless studio background, soft even fashion lighting, high-end editorial photography, photorealistic, sharp focus, full body framing",
    portraitPath: "/models/aisha.png",
    features: ["piel oscura", "rastas cortas", "complexión atlética", "ojos oscuros"],
  },
  {
    id: "mei",
    name: "Mei",
    gender: "mujer",
    age: 23,
    ethnicity: "Asiática oriental",
    bodyType: "Petite",
    height: "165 cm",
    hair: "Negro, liso, media melena",
    bio: "Modelo de pasarela asiática, especialista en alta costura y Looks editoriales.",
    portraitPrompt:
      "Professional fashion studio portrait of a 23 year old East Asian woman, petite slim build, straight medium length black hair, porcelain skin, dark eyes, natural makeup, wearing a simple grey turtleneck, standing centered, full body visible, plain cool grey seamless studio background, soft even fashion lighting, high-end editorial photography, photorealistic, sharp focus, full body framing",
    portraitPath: "/models/mei.png",
    features: ["piel porcelana", "cabello negro liso", "complexión petite", "ojos oscuros"],
  },
  {
    id: "lucas",
    name: "Lucas",
    gender: "hombre",
    age: 28,
    ethnicity: "Caucásica europea",
    bodyType: "Atlético",
    height: "185 cm",
    hair: " Rubio, corto, moderno",
    bio: "Modelo masculino de pasarela y editoriales, ideal para trajes y prendas estructuradas.",
    portraitPrompt:
      "Professional fashion studio portrait of a 28 year old European Caucasian man, athletic slim build, short modern blonde haircut, fair skin, blue eyes, light stubble beard, wearing a plain white t-shirt, standing centered, full body visible, plain warm beige seamless studio background, soft even fashion lighting, high-end editorial photography, photorealistic, sharp focus, full body framing",
    portraitPath: "/models/lucas.png",
    features: ["piel clara", "cabello rubio corto", "complexión atlética", "ojos azules", "barba ligera"],
  },
  {
    id: "marco",
    name: "Marco",
    gender: "hombre",
    age: 31,
    ethnicity: "Latina mediterránea",
    bodyType: "Delgado",
    height: "183 cm",
    hair: "Negro, corto, con flequillo",
    bio: "Modelo de lifestyle y moda casual, perfecto para streetwear y complementos urbanos.",
    portraitPrompt:
      "Professional fashion studio portrait of a 31 year old Latino Mediterranean man, slim build, short black hair with fringe, olive skin, brown eyes, clean shaven, wearing a simple charcoal grey t-shirt, standing centered, full body visible, plain soft taupe seamless studio background, soft even fashion lighting, high-end editorial photography, photorealistic, sharp focus, full body framing",
    portraitPath: "/models/marco.png",
    features: ["piel oliva", "cabello negro corto", "complexión delgada", "ojos marrones"],
  },
  {
    id: "omar",
    name: "Omar",
    gender: "hombre",
    age: 27,
    ethnicity: "Afrodescendiente",
    bodyType: "Musculoso",
    height: "188 cm",
    hair: "Negro rapado",
    bio: "Modelo fitness y editorial, ideal para ropa deportiva y prendas ajustadas.",
    portraitPrompt:
      "Professional fashion studio portrait of a 27 year old Black African man, muscular athletic build, shaved black hair, deep melanin skin, dark brown eyes, well groomed short beard, wearing a fitted black tank top, standing centered, full body visible, plain warm terracotta seamless studio background, soft even fashion lighting, high-end editorial photography, photorealistic, sharp focus, full body framing",
    portraitPath: "/models/omar.png",
    features: ["piel oscura", "cabello rapado", "complexión musculosa", "barba corta"],
  },
  {
    id: "kenji",
    name: "Kenji",
    gender: "hombre",
    age: 25,
    ethnicity: "Asiática oriental",
    bodyType: "Delgado",
    height: "180 cm",
    hair: "Negro, liso, media melena",
    bio: "Modelo asiático contemporáneo, ideal para moda minimalista y prendas de corte moderno.",
    portraitPrompt:
      "Professional fashion studio portrait of a 25 year old East Asian man, slim build, medium length straight black hair, porcelain skin, dark eyes, clean shaven, wearing a simple white shirt, standing centered, full body visible, plain cool grey seamless studio background, soft even fashion lighting, high-end editorial photography, photorealistic, sharp focus, full body framing",
    portraitPath: "/models/kenji.png",
    features: ["piel porcelana", "cabello negro liso media melena", "complexión delgada", "ojos oscuros"],
  },
];

export const GARMENT_CATEGORIES: { id: GarmentCategory; label: string; emoji: string }[] = [
  { id: "camiseta", label: "Camiseta", emoji: "👕" },
  { id: "camisa", label: "Camisa", emoji: "👔" },
  { id: "chaqueta", label: "Chaqueta", emoji: "🧥" },
  { id: "abrigo", label: "Abrigo", emoji: "🧥" },
  { id: "vestido", label: "Vestido", emoji: "👗" },
  { id: "pantalon", label: "Pantalón", emoji: "👖" },
  { id: "falda", label: "Falda", emoji: "👗" },
  { id: "bolso", label: "Bolso", emoji: "👜" },
  { id: "zapatos", label: "Zapatos", emoji: "👟" },
  { id: "complemento", label: "Complemento", emoji: "💍" },
];

export function buildTryOnPrompt(
  model: FashionModel,
  garmentCategory: GarmentCategory,
  garmentDescription: string,
): string {
  const featuresText = model.features.join(", ");
  const garmentText = garmentDescription.trim()
    ? garmentDescription.trim()
    : `the ${garmentCategory} shown in the reference image`;

  return [
    `Virtual fitting room photo edit.`,
    `Keep the model's face, body, height, pose, ${featuresText}, hair and skin tone EXACTLY the same as in the original portrait.`,
    `Replace the current top / outfit with ${garmentText}, which is the ${garmentCategory} shown in the second reference image.`,
    `Apply the garment naturally on the model's body with realistic fabric draping, accurate folds, correct proportions, soft studio lighting, natural shadows and proper color reproduction matching the reference garment photo.`,
    `Keep the same plain studio background, same camera angle (full body), same photographic quality.`,
    `Result must look like a professional fashion lookbook photo, photorealistic, sharp focus, no distortion, no artifacts.`,
  ].join(" ");
}
