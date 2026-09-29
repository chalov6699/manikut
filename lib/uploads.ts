import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"]
]);

export async function saveImage(file: File) {
  if (!file || file.size === 0) {
    throw new Error("Файл изображения не выбран.");
  }

  const extension = ALLOWED_TYPES.get(file.type);
  if (!extension) {
    throw new Error("Разрешены только JPG, PNG и WEBP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Размер изображения не должен превышать 5 МБ.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}${extension}`;
  const fullPath = path.join(uploadDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(fullPath, bytes);
  return `/uploads/${filename}`;
}

export async function deleteLocalImage(imageUrl?: string | null) {
  if (!imageUrl?.startsWith("/uploads/")) return;

  const filename = path.basename(imageUrl);
  const fullPath = path.join(process.cwd(), "public", "uploads", filename);

  try {
    await unlink(fullPath);
  } catch {
    // Файл мог быть уже удалён вручную.
  }
}
