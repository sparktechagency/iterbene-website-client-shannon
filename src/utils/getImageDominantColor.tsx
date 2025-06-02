const getImageDominantColor = (img: HTMLImageElement): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      resolve("#f3f4f6"); // Fallback color
      return;
    }

    // Limit canvas size for performance
    const maxSize = 100;
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0,
        g = 0,
        b = 0;
      let pixelCount = 0;

      // Sample every 5th pixel
      for (let i = 0; i < data.length; i += 20) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        pixelCount++;
      }

      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      // Make the color slightly muted
      const darkenFactor = 0.8;
      r = Math.floor(r * darkenFactor);
      g = Math.floor(g * darkenFactor);
      b = Math.floor(b * darkenFactor);
      resolve(`rgb(${r}, ${g}, ${b})`);
    } catch {
      resolve("#f3f4f6"); // Fallback color
    }
  });
};
export default getImageDominantColor;
