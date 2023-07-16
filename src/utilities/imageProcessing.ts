import sharp from 'sharp';

interface sharpResizeParams {
  source: string;
  target: string;
  width: number;
  height: number;
}

const processImage = async (
  params: sharpResizeParams,
): Promise<null | string> => {
  try {
    await sharp(params.source)
      .resize(params.width, params.height)
      .toFormat('jpg')
      .toFile(params.target);
    return null;
  } catch {
    return 'Image could not be processed.';
  }
};

export default processImage;
