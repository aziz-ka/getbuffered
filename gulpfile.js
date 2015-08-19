var gulp = require("gulp");
var config = require("./gulp.config")();
var browserSync = require("browser-sync");
var del = require("del");
var wiredep = require("wiredep").stream;
var $ = require("gulp-load-plugins")({lazy: true});

// list all available tasks
gulp.task("tasks", $.taskListing);

// analyze js files for errors with jshint and jscs
gulp.task("analyzeJS", function() {
  log("analyzing js");

  return gulp
    .src(config.customJS)
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter("fail"));
});

// minify main.js only since all other js files are already minified
gulp.task("scripts", [/*"analyzeJS", */"clean-scripts"], function() {
  log("minifying js files");

  return gulp
    .src(config.srcJS)
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe(gulp.dest(config.build + "js"));
});

// compile sass to css, add necessary browser prefixes and minify it
gulp.task("styles", ["clean-styles"], function() {
  log("compiling and minifying css");

  return gulp
    .src(config.srcSCSS)
    .pipe($.plumber())
    .pipe($.sass({outputStyle: "compressed"}))
    .pipe($.autoprefixer({browsers: ["last 10 versions", "> 5%", "ie >= 9"]}))
    .pipe(gulp.dest(config.build + "css"))
    .pipe(browserSync.stream());
});

// compress images
gulp.task("images", function() {
  log("compressing images");

  return gulp
    .src(config.img)
    .pipe($.imagemin())
    .pipe(gulp.dest(config.build + "images"));
});

// copy fonts into the build folder
gulp.task("fonts", function() {
  log("copying fonts");

  return gulp
    .src(config.fonts)
    .pipe(gulp.dest(config.build + "fonts"));
});

// clean styles on compile
gulp.task("clean-styles", function(done) {
  var files = config.buildCSS;
  clean(files, done);
});

// clean scripts on linting and minifying
gulp.task("clean-scripts", function(done) {
  var files = config.buildJS;
  clean(files, done);
});

// watch for any changes in js, css, html files
gulp.task("watch", function() {
  log("watching over js, css, html files");

  gulp.watch(config.srcJS, ["scripts"]);
  gulp.watch(config.srcSCSS, ["styles"]);
  gulp.watch(config.img, ["images"]);
});

// wire bower dependencies into source code
// .bowerrc file runs wiredep task whenever new package is added or removed from bower_components
gulp.task("wiredep", ["styles", "scripts"], function() {
  log("wiring css & js dependencies into index.html");

  return gulp
    .src(config.index)
    .pipe(wiredep())
    .pipe($.inject(gulp.src(config.buildCSS), {relative: true}))
    .pipe($.inject(gulp.src(config.buildJS), {relative: true}))
    .pipe(gulp.dest(config.root));
});



// remove files; "done" callback makes primary task wait for a clean task to finish
function clean(path, done) {
  log("cleaning " + $.util.colors.yellow(path));
  del(path, done);
}

// kick off browser-sync
gulp.task("browser-sync", function() {
  if(browserSync.active) {
    return; /* if it's already running, do nothing */
  }

  log("starting browser-sync on port " + config.port);

  browserSync.init({
    server: {
      baseDir: "./"
    },
    ghostMode: {
      clicks: true,
      location: true,
      forms: true,
      scroll: true
    },
    injectChanges: true, /* inject changes into document insted of reloading it when possible */
    logLevel: "debug", /* detailed log */
    reloadDelay: 1000
  });

  gulp.watch(config.srcSCSS, ["styles"]);
  gulp.watch(config.html).on("change", browserSync.reload);
});

// log currently running task
function log(msg) {
  $.util.log($.util.colors.yellow(msg));
}