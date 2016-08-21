var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var mainBowerFiles = require('main-bower-files');
var del = require('del');
var exec = require('child_process').exec;
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

gulp.task("clear-public", function () {
    return del(['public']);
});

gulp.task("combine-js", ["clear-public"], function () {
    var bundler = browserify({
        entries: './views/app.js',
        debug: true
    });
    bundler.transform(babelify);

    bundler.bundle()
        .on('error', function (err) {
            console.error(err);
        })
        .pipe(source('combined.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(uglify({
        //     mangle: false
        // })) // Use any gulp plugins you want now
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task("combine-foo", ["clear-public"], function () {
    var bundler = browserify({
        entries: 'js/bar/bar.js',
        debug: true
    });
    bundler.transform(babelify);

    bundler.bundle()
        .on('error', function (err) {
            console.error(err);
        })
        .pipe(source('foo.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify()) // Use any gulp plugins you want now
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task("bower-files", ["clear-public"], function () {
    return gulp.src(mainBowerFiles())
        .pipe(concat('vendor.js'))
        // .pipe(iife())
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
        "combine-foo",
        "move-static",
        "bower-files",
        "run-node"
    ]);