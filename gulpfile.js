var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');
//const image = require('gulp-image');

var src = "./sources";
var scss = src + '/sass/**/*.scss';
var dest = './public';
var pug = './views/**/*.pug';

gulp.task('sass', function () {
    return gulp.src(scss)
        .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer()) // Add vendor prefixes to CSS rules by Can I Use
            .pipe(cssnano()) // Minify CSS
        .pipe(sourcemaps.write())
        .pipe(gulp.dest( dest + '/css' ));
});



// Static Server + watching SCSS/HTML files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        proxy: 'localhost:3000'
    });

    gulp.watch(scss, ['sass']).on('change', browserSync.reload);
    gulp.watch(pug).on('change', browserSync.reload);
    //gulp.watch(image, ['image']).on('change', browserSync.reload);
});

//gulp.task('image', function () {
  //  gulp.src('./img/**/*')
   //     .pipe(image())
//        .pipe(gulp.dest(dest + './img'));
//});

gulp.task('default', ['serve']);