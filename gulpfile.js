const { src, dest, watch, parallel } = require("gulp");
//css
const sass = require("gulp-sass")(require("sass"));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JS
const terser = require('gulp-terser-js');

function css(done) {

    src('src/scss/**/*.scss') //Identifica el archivo
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass()) //Compilar
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css")) //Almacena en disco duro

    done(); //Callback que avisa a gulp cuando se finalice una tarea
}

function imagesLight( done ){
    const choices = {
        optimizationLevel: 3
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( cache(imagemin(choices)))
        .pipe( dest('build/img') )

    done();
}

function imgToVersionWebp(done){

    const choices = {
        quality: 60
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(choices) )
        .pipe( dest('build/img') )

    done();
}

function imgToVersionAvif(done){

    const choices = {
        quality: 60
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( avif(choices) )
        .pipe( dest('build/img') )

    done();
}

function javascript( done ){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagesLight = imagesLight;
exports.imgToVersionWebp = imgToVersionWebp;
exports.dev = parallel( imagesLight, imgToVersionWebp, imgToVersionAvif, javascript, dev);