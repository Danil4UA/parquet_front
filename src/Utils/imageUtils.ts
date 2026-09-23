/**
 * Shrinks a photo in the browser before it is uploaded.
 *
 * Phone cameras produce 5–20 MB files (often HEIC on iPhones). The visualizer only needs
 * ~1500 px, so re-encoding on the device makes the upload 20–50× smaller and turns any
 * format the browser can decode into a plain JPEG. EXIF orientation is applied, so the
 * result is upright. If the browser cannot decode the file at all (HEIC in Chrome/Firefox)
 * an `ImageDecodeError` is thrown so the caller can convert it elsewhere; any other hiccup
 * returns the original file unchanged.
 */

export class ImageDecodeError extends Error {}

const DEFAULT_MAX_SIDE = 1600;
const JPEG_QUALITY = 0.86;

const decode = async (file: File): Promise<ImageBitmap | HTMLImageElement> => {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* fall back to <img>, which some browsers handle better for exotic formats */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Cannot decode image")); };
    img.src = url;
  });
};

export const downscaleImage = async (file: File, maxSide = DEFAULT_MAX_SIDE): Promise<File> => {
  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await decode(file);
  } catch {
    throw new ImageDecodeError(`Browser cannot decode ${file.type || "this file"}`);
  }
  try {
    const width = "naturalWidth" in source ? source.naturalWidth : source.width;
    const height = "naturalHeight" in source ? source.naturalHeight : source.height;
    if (!width || !height) return file;

    const scale = Math.min(1, maxSide / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(source, 0, 0, targetW, targetH);
    if ("close" in source) source.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob || blob.size === 0) return file;

    const name = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${name}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
};
