import heic2any from "heic2any";
import { MAX_IMAGE_BYTES } from "./constants";

export async function normalizeImage(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("That photo is too large. Please choose an image under 15 MB.");
  const accepted = ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"];
  const looksHeic = /\.(heic|heif)$/i.test(file.name);
  if (!accepted.includes(file.type.toLowerCase()) && !looksHeic) throw new Error("Please choose a JPG, PNG, HEIC, or HEIF photo.");

  let source: Blob = file;
  if (looksHeic || /image\/(heic|heif)/i.test(file.type)) {
    try { source = (await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 })) as Blob; }
    catch { throw new Error("That HEIC photo could not be processed. Try a JPG or PNG instead."); }
  }

  const bitmap = await createImageBitmap(source);
  const max = 2400;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not prepare that photo.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return { dataUrl: canvas.toDataURL("image/jpeg", 0.9), width, height };
}
