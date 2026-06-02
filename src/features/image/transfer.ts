"use server";
import fs from "node:fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const DELETE_DIR = path.join(process.cwd(), "public");
const DIR = path.join(process.cwd(), "public");
export async function transferFile(buffer: Buffer, destination: string) {
  try {
    const uploadPath = path.join(UPLOAD_DIR, destination);
    const fileName = uuidv4() + ".webp";
    await fs.mkdir(uploadPath, { recursive: true });

    const filePath = path.join(uploadPath, fileName);

    await fs.writeFile(filePath, buffer);

    return path.join("/uploads", destination, fileName).replaceAll("\\", "/");
  } catch (error) {
    console.log("an error:", error);
    throw new Error("Could not update character");
  }
}

export async function deleteFile(fileName: string) {
  try {
    const fileDestination = path.join(DELETE_DIR, fileName);
    await fs.unlink(fileDestination);
  } catch (error) {
    console.error(error);
  }
}

export async function encodeFileBase64(fileName: string) {
  const fileDestination = path.join(DIR, fileName);
  const imageBuffer = await fs.readFile(fileDestination);
  const base64 = imageBuffer.toString("base64");
  return base64;
}
