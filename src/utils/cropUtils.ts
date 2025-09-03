const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function getRadianAngle(degreeValue: number = 0): number {
  return (degreeValue * Math.PI) / 180;
}

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Returns a cropped image as a File object.
 * @param imageSrc - Image URL
 * @param pixelCrop - Crop area provided by react-easy-crop
 * @param rotation - Optional rotation in degrees
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation: number = 0
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  // Calculate the rotated dimensions
  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = {
    width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };

  // Set canvas size to the bounding box of the rotated image
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Move the origin to the center of the canvas
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(1, 1); // No flipping for now, can be added if needed
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw the original image
  ctx.drawImage(image, 0, 0);

  // Create a new canvas for the cropped image
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("Could not create cropped canvas context");
  }

  // Set the cropped canvas to the desired crop size
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Calculate the correct source coordinates based on rotation
  const sourceX = pixelCrop.x + (image.width - bBoxWidth) / 2;
  const sourceY = pixelCrop.y + (image.height - bBoxHeight) / 2;

  // Draw the cropped portion from the rotated canvas
  croppedCtx.drawImage(
    canvas,
    sourceX,
    sourceY,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return the cropped image as a File
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        resolve(file);
      },
      "image/jpeg",
      0.9
    );
  });
}