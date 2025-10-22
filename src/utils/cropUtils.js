// src/utils/cropUtils.js
// NOTE: createImage utility is no longer needed since we use a ref to the image element.

/**
 * Gets the cropped image file using canvas.
 * @param {string} imageSrc - The source data URL of the image.
 * @param {HTMLImageElement} image - The actual image element reference (from useRef).
 * @param {Object} completedCrop - The crop object ({unit, x, y, width, height}).
 * @returns {Promise<{file: File, url: string}>}
 */
export async function getCroppedImg(imageSrc, image, completedCrop) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2D context available');
  }

  // Calculate the scale factor between the displayed image size and the natural image size
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  // Set canvas size to the size of the crop area
  canvas.width = completedCrop.width * scaleX;
  canvas.height = completedCrop.height * scaleY;

  // Draw the image onto the canvas, starting the crop from the top-left of the cropped area
  ctx.drawImage(
    image,
    completedCrop.x * scaleX,
    completedCrop.y * scaleY,
    completedCrop.width * scaleX,
    completedCrop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Return as a Blob for file creation
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      const file = new File([blob], `pixilify-cropped-${Date.now()}.png`, { type: 'image/png' });
      resolve({ file, url: URL.createObjectURL(blob) });
    }, 'image/png');
  });
}