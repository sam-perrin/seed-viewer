require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('express-favicon');
const functions = require('./functions');

const app = express();
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const img_dir = process.env.IMG_DIR;

if (!port) throw new Error("Missing ENV: PORT");
if (!img_dir) throw new Error("Missing ENV: IMG_DIR");
console.log("Port: " + port);
console.log("Image Directory: " + img_dir);

app.use(favicon(__dirname + '/public/favicon.ico'));
app.get('/', (req, res) => {
    res.render('index', { pageTitle: "Seed Viewer", });
});

app.get('/seed-viewer', (req, res) => {
    let seedImages = functions.getSeedImages(img_dir, null, img_dir);
    res.render('seed-viewer', { pageTitle: "Seed Images", images: seedImages })
});

app.use("/images", express.static(img_dir));
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`));