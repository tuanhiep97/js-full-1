import { promises as fs } from 'fs';
import path from 'path';
import processImage from './imageProcessing';

interface ImageQuery {
  filename?: string;
  width?: string;
  height?: string;
}

export default class File {
  static imagesFullPath = path.resolve(__dirname, '../images/full');
  static imagesThumbPath = path.resolve(__dirname, '../images/thumb');

  static async getImagePath(params: ImageQuery): Promise<null | string> {
    if (!params.filename) {
      return null;
    }
    const filePath: string =
      params.width && params.height
        ? path.resolve(
            File.imagesThumbPath,
            `${params.filename}-${params.width}x${params.height}.jpg`,
          )
        : path.resolve(File.imagesFullPath, `${params.filename}.jpg`);

    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      return null;
    }
  }

  static async isImageAvailable(filename: string = ''): Promise<boolean> {
    if (!filename) {
      return false;
    }

    return (await File.getAvailableImageNames()).includes(filename);
  }

  static async getAvailableImageNames(): Promise<string[]> {
    try {
      return (await fs.readdir(File.imagesFullPath)).map(
        (filename: string): string => filename.split('.')[0],
      );
    } catch {
      return [];
    }
  }

  static async isThumbAvailable(params: ImageQuery): Promise<boolean> {
    if (!params.filename || !params.width || !params.height) {
      return false;
    }

    const filePath: string = path.resolve(
      File.imagesThumbPath,
      `${params.filename}-${params.width}x${params.height}.jpg`,
    );

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  static async createThumbPath(): Promise<void> {
    try {
      await fs.access(File.imagesThumbPath);
    } catch {
      fs.mkdir(File.imagesThumbPath);
    }
  }

  static async createThumb(params: ImageQuery): Promise<null | string> {
    if (!params.filename || !params.width || !params.height) {
      return null;
    }

    const filePathFull: string = path.resolve(
      File.imagesFullPath,
      `${params.filename}.jpg`,
    );
    const filePathThumb: string = path.resolve(
      File.imagesThumbPath,
      `${params.filename}-${params.width}x${params.height}.jpg`,
    );

    return await processImage({
      source: filePathFull,
      target: filePathThumb,
      width: parseInt(params.width),
      height: parseInt(params.height),
    });
  }
}
