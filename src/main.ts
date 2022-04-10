import './style.css'
import { PALETTES } from "./palettes";
import { buildFilters } from './filters';

const DIMENSIONS = [window.innerWidth, window.innerHeight];
const FILTERS = buildFilters(DIMENSIONS[0]);
const FILTER = FILTERS[Math.floor(Math.random() * FILTERS.length)];
const PALETTE = PALETTES[Math.floor(Math.random() * PALETTES.length)];

const buildURL = () => {
  const { search } = window.location;
  return `https://source.unsplash.com/${DIMENSIONS[0]}x${DIMENSIONS[1]}/${search}`;
};

/**
 * Get drawing context
 */
const getContext = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
  return canvas.getContext('2d');
};

/**
 * The canvas needs to be sized to the correct number of pixels
 * !!! This is not the same as CSS width/height
 */
const resizeCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.canvas.width = DIMENSIONS[0];
  ctx.canvas.height = DIMENSIONS[1];
};

/**
 * Instantiate and load image
 */
const loadImage = () => {
  return new Promise<HTMLImageElement | undefined>(
    (resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', function() {
        resolve(this);
      }, false);
      image.addEventListener('error', function() {
        reject();
      }, false);
      image.crossOrigin = "Anonymous";
      image.src = buildURL();
    }
  );
};

/**
 * Convert RGBA pixel data to reduced size grayscale
 * !!! Output array will be 1/4 the size of input array
 */
const grayScale = (data: Uint8ClampedArray): Uint8ClampedArray => {
  const gray = new Uint8ClampedArray(data.length / 4);
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    gray[i / 4] = avg;
  }
  return gray;
};

/**
 * Convert value (0 || 255) to RGB array
 */
const mapPaletteToRGB = (value: number): [number, number, number] => {
  return value > 0 ? PALETTE[1] : PALETTE[0];
}

/**
 * Map value to palette index (0 || 255)
 */
const getClosestPaletteValue = (value: number) => {
  return value > 128 ? 255 : 0;
};

/**
 * Apply dithering filter in place
 */
const filter = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i++) {
    const initial = data[i];
    const adjusted = getClosestPaletteValue(initial);
    const error = initial - adjusted;

    // Set current pixel
    data[i] = adjusted;

    // Diffuse the error according to the filter
    FILTER.forEach(([weight, addressOffset]) => {
      const idx = i + addressOffset;
      data[idx] = data[idx] + (error * weight);
    });
  }
};

/**
 * Map single grayscale values to rgba pixels
 */
const grayToRGBA = (gray: Uint8ClampedArray, rgba: Uint8ClampedArray) => {
  for (let i = 0; i < rgba.length; i += 4) {
    const [r, g, b] = mapPaletteToRGB(gray[i / 4]);
    rgba[i]     = r;
    rgba[i + 1] = g;
    rgba[i + 2] = b;
  }
};

/**
 * Manipulate pixel data
 */
const transform = (imageData: ImageData): ImageData => {
  const { data } = imageData;

  // convert rgba data to grayscale
  const gray = grayScale(data);

  // apply dithering filter
  filter(gray);

  // unpack grayscale back into rgba data
  grayToRGBA(gray, data);

  return imageData;
};

/**
 * Main canvas program
 */
const draw = async (ctx: CanvasRenderingContext2D) => {
  // load image
  const image = await loadImage();

  if (!image) {
    console.warn("image could not be loaded");
    return;
  }

  // draw initial image to canvas context
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, DIMENSIONS[0], DIMENSIONS[1]);
  const transformed = transform(imageData);
  ctx.putImageData(transformed, 0, 0);
};

/**
 * Replace the canvas element with an img, so that results are easier to save
 */
const convertCanvasToImg = (ctx: CanvasRenderingContext2D) => {
  ctx.canvas.toBlob((blob) => {
    if (!blob) {
      console.warn("couldn't build blob from canvas");
      return;
    }

    // init replacement img
    const newImg = document.createElement('img');

    // get data url from canvas blob
    const url = URL.createObjectURL(blob);

    // put the canvas data url in the img
    newImg.src = url;
    document.body.appendChild(newImg);

    // remove the original canvas
    ctx.canvas.remove();
  });
}

const main = async () => {
  const ctx = getContext();

  if (!ctx) {
    return;
  }

  resizeCanvas(ctx);
  await draw(ctx);
  convertCanvasToImg(ctx);
};

main();
