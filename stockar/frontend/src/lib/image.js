// Achica una imagen en el navegador y la devuelve como data URL JPEG.
// El backend no tiene subida de archivos y acepta JSON de hasta 100 KB, así que la imagen
// viaja dentro del producto (campo `imagen`) y tiene que quedar chica.
const MAX_SIDE = 480;
const MAX_LENGTH = 70_000; // caracteres del data URL, con margen para el resto del producto

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('El archivo no es una imagen válida'));
    };
    img.src = url;
  });
}

export async function resizeImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen');
  const img = await loadImage(file);

  let side = MAX_SIDE;
  for (let attempt = 0; attempt < 6; attempt++) {
    const scale = Math.min(1, side / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // fondo blanco para PNG con transparencia
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.82, 0.7, 0.58]) {
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      if (dataUrl.length <= MAX_LENGTH) return dataUrl;
    }
    side = Math.round(side * 0.75);
  }
  throw new Error('No se pudo achicar la imagen lo suficiente');
}
