var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifyjs = require('uglify-js');
var minifier = require('gulp-uglify/minifier');
var pump = require('pump');
const babel = require('gulp-babel');
var mainBowerFiles = require('main-bower-files');
var iife = require("gulp-iife");
var del = require('del');
var exec = require('child_process').exec;

gulp.task("clear-public", function () {
    return del(['public']);
});

gulp.task("combine-js", ["clear-public"], function () {
    return gulp.src('./views/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('combined.js'))
        .pipe(iife())
        // .pipe(minifier({}, uglifyjs))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task("bower-files", ["clear-public"], function () {
    return gulp.src(mainBowerFiles())
        .pipe(concat('vendor.js'))
        .pipe(iife())
        // .pipe(minifier({}, uglifyjs))
        .pipe(gulp.dest("./public/js"));
});

gulp.task('move-static', ["clear-public"], function () {
    return gulp.src([
        './views/**/*.html',
        './views/**/*.css'
    ], {base: './views/'})
        .pipe(gulp.dest('./public/'));
});

gulp.task("run-node", ["clear-public", "combine-js", "move-static", "bower-files"], function (cb) {
    exec("node index.js", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// Default task(s).
gulp.task("default",
    [
        "clear-public",
        "combine-js",
        "move-static",
        "bower-files",
        "run-node"
    ]);