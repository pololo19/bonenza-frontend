import { EXTENSION_IMG_AFTER_CROP, TYPE_IMG_AFTER_CROP } from '@/base/constants/common';

const changeExtension = (fileName: string, extension: string) => {
  const ext = fileName.split('.').pop();
  const root = ext ? fileName.substring(0, fileName.length - ext.length) : '';
  return `${root}${extension}`;
};

export function canvasToBlob(canvas: HTMLCanvasElement, fileName: string): Promise<File> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], changeExtension(fileName, EXTENSION_IMG_AFTER_CROP), {
          type: TYPE_IMG_AFTER_CROP,
        });
        resolve(file);
      }
    }, TYPE_IMG_AFTER_CROP);
  });
}

export function camelToSnake(value: string) {
  return value.replace(/[\w]([A-Z])/g, (m) => `${m[0]}_${m[1]}`).toLowerCase();
}

export function byteToMegabyte(input: number, numFixed?: number) {
  const result = input / 1024 / 1024;
  return numFixed || numFixed === 0 ? result.toFixed(numFixed) : result;
}
