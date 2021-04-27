require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('express-favicon');
const functions = require('./functions');
const app = express();

const port = process.env.PORT || 3000;
if (!port) throw new Error("Missing ENV: PORT");
console.log("Port: " + port);
const img_dir = process.env.IMG_DIR;
if (!img_dir) throw new Error("Missing ENV: IMG_DIR");
console.log("Image Directory: " + img_dir);
const view_original = process.env.VIEW_ORIGINAL || false;

app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs');
app.use("/images", express.static(img_dir));
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { pageTitle: "Seed Viewer", });
});

app.get('/seed', (req, res) => {
    functions.getLatestImage(img_dir)
        .then(seedData => {
            res.render('seed', { pageTitle: "Latest Seed Image", seed: seedData })
        });
});

app.get('/seed-gallery', (req, res) => {
    functions.getSeeds(img_dir)
        .then(seedData => {
            res.render('seed-gallery', { pageTitle: "Seed Images Gallery", seeds: seedData, viewOriginal: view_original })
        });
});

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`));