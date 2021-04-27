
const fs = require('fs');
const path = require('path')
const sharp = require('sharp')

const thumbnail_dir = __dirname + "/public/thumbnails/";
console.log(thumbnail_dir)
checkThumbailDir(thumbnail_dir);
function checkThumbailDir(thumbnailPath) {
    if (!fs.existsSync(thumbnailPath)) {
        fs.mkdirSync(thumbnailPath);
    }
}

function generateGalleryThumbnails(imageDataArray) {
    imageDataArray.forEach((imageData) => {
        if (!imageData.thumbnailDir || !imageData.thumbnailName || !imageData.name || !imageData.fullPath) return new Error("Missing required image data");
        // let thumbnailLocation = "public/" + imageData.thumbnailDir + "/gallery_" + imageData.thumbnailName;
        let thumbnailLocation = thumbnail_dir + "/gallery_" + imageData.thumbnailName;
        console.log(thumbnailLocation);
        if (!fs.existsSync(thumbnailLocation)) {
            sharp(imageData.fullPath)
                .resize({ height: 200 })
                .toFile(thumbnailLocation)
                .then(data => {
                    console.log(`Thumbnail generation complete (${imageData.name})`);
                });
        } else {
            console.log(`File exists (${imageData.name})`);
        }
    })
}

function generateLatestThumbnail(imageData) {
    if (!imageData.thumbnailDir || !imageData.thumbnailName || !imageData.name || !imageData.fullPath) return new Error("Missing required image data");
    // let thumbnailLocation = "public/" + imageData.thumbnailDir + "/latest_" + imageData.thumbnailName;
    let thumbnailLocation = thumbnail_dir + "/latest_" + imageData.thumbnailName;
    console.log(thumbnailLocation);
    if (!fs.existsSync(thumbnailLocation)) {
        sharp(imageData.fullPath)
            .resize({ height: 1000 })
            .toFile(thumbnailLocation)
            .then(data => {
                console.log(`Latest image generation complete (${imageData.name})`);
            });
    } else {
        console.log(`File exists (${imageData.name})`);
    }
}

function getSeeds(imageDirectory) {
    return new Promise(function (resolve, reject) {
        getSeedImages(imageDirectory, null, imageDirectory)
            .then(data => {
                generateGalleryThumbnails(data);
                resolve(data);
            })
            .catch(err => {
                console.log(err)
                reject(err)
            });
    })
}


function getLatestImage(imageDirectory) {
    return new Promise(function (resolve, reject) {
        getSeedImages(imageDirectory, null, imageDirectory)
            .then(data => {
                let latestImage = data[0];
                console.log(latestImage)
                generateLatestThumbnail(latestImage);
                resolve(latestImage);
            })
            .catch(err => {
                console.log(err)
                reject(err)
            });
    })
}

function getSeedImages(dirPath, imagesArray, imageDirectory) {
    return new Promise(function (resolve, reject) {
        imagesArray = imagesArray || [];
        let files = fs.readdirSync(dirPath);
        files.forEach((file) => {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                getSeedImages(dirPath + "/" + file, imagesArray, imageDirectory)
                    .then(data => {
                        imagesArray = data
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    });
            } else {
                let ext = path.extname(file).split(".")[1];
                if (ext == "jpeg" || ext == "jpg" || ext == "png") {
                    let fullPath = dirPath + '/' + file;
                    let imageUriPath = dirPath.split(imageDirectory)[1] + "/" + file;
                    let stats = fs.statSync(fullPath);
                    let size = Math.round(((stats.size / 1024 / 1024) + Number.EPSILON) * 100) / 100;

                    let imageData = {
                        name: file,
                        created: stats.birthtime,
                        modified: stats.mtime,
                        size: size + "MB",
                        imagePath: imageUriPath,
                        fullPath: fullPath,
                        thumbnailDir: "thumbnails",
                        thumbnailName: file,
                        directory: stats.isDirectory(),
                        file: stats.isFile(),
                        symlink: stats.isSymbolicLink()
                    }
                    imagesArray.push(imageData);
                }
            }
        })
        let imagesArraySorted = imagesArray.sort(function (a, b) {
            return new Date(b.created) - new Date(a.created);
        });
        let reducedArray = imagesArraySorted.slice(0, 102);
        resolve(reducedArray);
    });
}

module.exports = {
    getSeeds,
    getLatestImage
}