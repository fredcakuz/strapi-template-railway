'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { file: fileUtils } = require('@strapi/utils');

// Strapi core hardcodes quality:80 when "Size optimization" is on, which
// made WebP banners look grainy. Bump it to 90 for a better quality/size balance.
const IMAGE_QUALITY = 90;
const OPTIMIZABLE_FORMATS = ['jpeg', 'png', 'webp', 'tiff', 'avif'];

function getMetadata(file) {
  if (!file.filepath) {
    return new Promise((resolve, reject) => {
      const pipeline = sharp();
      pipeline.metadata().then(resolve).catch(reject);
      file.getStream().pipe(pipeline);
    });
  }
  return sharp(file.filepath).metadata();
}

function writeStreamToFile(stream, filePath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    stream.on('error', reject);
    stream.pipe(writeStream);
    writeStream.on('close', resolve);
    writeStream.on('error', reject);
  });
}

function patchImageQuality(strapi) {
  const imageManipulation = strapi.plugin('upload').service('image-manipulation');
  const uploadService = strapi.plugin('upload').service('upload');

  imageManipulation.optimize = async (file) => {
    const { sizeOptimization = false, autoOrientation = false } = (await uploadService.getSettings()) ?? {};
    const { format, size } = await getMetadata(file);

    if (!((sizeOptimization || autoOrientation) && OPTIMIZABLE_FORMATS.includes(format))) {
      return file;
    }

    const transformer = file.filepath ? sharp(file.filepath) : sharp();
    transformer[format]({ quality: sizeOptimization ? IMAGE_QUALITY : 100 });
    if (autoOrientation) transformer.rotate();

    const filePath = file.tmpWorkingDirectory
      ? path.join(file.tmpWorkingDirectory, `optimized-${file.hash}`)
      : `optimized-${file.hash}`;

    let newInfo;
    if (!file.filepath) {
      transformer.on('info', (info) => {
        newInfo = info;
      });
      await writeStreamToFile(file.getStream().pipe(transformer), filePath);
    } else {
      newInfo = await transformer.toFile(filePath);
    }

    const newFile = { ...file };
    newFile.getStream = () => fs.createReadStream(filePath);
    newFile.filepath = filePath;

    if (newInfo?.size && size && newInfo.size > size) {
      return file;
    }

    return Object.assign(newFile, {
      width: newInfo?.width,
      height: newInfo?.height,
      size: newInfo?.size ? fileUtils.bytesToKbytes(newInfo.size) : 0,
      sizeInBytes: newInfo?.size,
    });
  };
}

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi.customFields.register({
      name: 'map-point',
      type: 'json',
    });

    patchImageQuality(strapi);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
