import sharp from "sharp";
export class ImageFactory {
  private static allowedFormats = ["jpef", "jpg", "png", "webp", "gif"];
  public static async Create(file: File): Promise<Buffer> {
    const buffer = Buffer.from(await file.arrayBuffer());

    const image = sharp(buffer, { animated: true });
    const metaData = await image.metadata();
    if (!ImageFactory.allowedFormats.includes(metaData.format)) {
      throw new Error("Unsupported image format");
    }

    return await image
      .webp({
        quality: 100,
        effort: 4,
      })
      .toBuffer();
  }
}
