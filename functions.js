
const fs = require('fs');
const path = require('path')

const getSeedImages = function (dirPath, imagesArray, imageDirectory) {
  files = fs.readdirSync(dirPath);
  imagesArray = imagesArray || [];
  files.forEach(function (file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
          imagesArray = getSeedImages(dirPath + "/" + file, imagesArray, imageDirectory)
      } else {
          let ext = path.extname(file);
          if (ext == ".jpeg" || ext == ".jpg" || ext == ".png") {
              let fullPath = dirPath + '/' + file;
              let imageUriPath = dirPath.split(imageDirectory)[1] + "/" + file;
              let stats = fs.statSync(fullPath);

              let image = {
                  name: file,
                  created: stats.birthtime,
                  modified: stats.mtime,
                  mode: stats.mode,
                  size: stats.size,
                  path: imageUriPath,
                  directory: stats.isDirectory(),
                  file: stats.isFile(),
                  symlink: stats.isSymbolicLink()
              }
              imagesArray.push(image);
          }
      }
  })

  let imagesArraySorted = imagesArray.sort(function (a, b) {
      return new Date(b.created) - new Date(a.created);
  });

  return imagesArraySorted;
}

exports.getSeedImages = getSeedImages;