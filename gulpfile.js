var gulp = require("gulp");
var config = require("./gulp.config")();
var browserSync = require("browser-sync");
var del = require("del");
var wiredep = require("wiredep").stream;
var $ = require("gulp-load-plugins")({lazy: true});

gulp.task("tasks", $.taskListing);

gulp.task("analyzeJS", function() {
  log("analyzing js");

  return gulp
    .src(config.srcJS)
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter("fail"));
});

gulp.task("scripts", [/*"analyzeJS", */"clean-scripts"], function() {
  log("copying scripts");

  return gulp
    .src(config.srcJS)
    .pipe($.plumber())
    // .pipe($.uglify())
    .pipe(gulp.dest(config.build + "js"))
    .pipe(browserSync.stream());
});

gulp.task("styles", ["clean-styles"], function() {
  log("compiling and vendor-prefixing css");

  return gulp
    .src(config.srcSCSS)
    .pipe($.plumber())
    .pipe($.sass({outputStyle: "expanded"}))
    .pipe($.autoprefixer({browsers: ["last 10 versions", "> 5%", "ie >= 9"]}))
    .pipe(gulp.dest(config.build + "css"))
    .pipe(browserSync.stream());
});

gulp.task("images", ["clean-images"], function() {
  log("compressing and copying images");

  return gulp
    .src(config.srcImg)
    .pipe($.imagemin())
    .pipe(gulp.dest(config.build + "images"));
});

gulp.task("fonts", ["clean-fonts"],  function() {
  log("copying fonts");

  return gulp
    .src(config.fonts)
    .pipe(gulp.dest(config.build + "fonts"));
});

gulp.task("index", ["clean-index"], function() {
  log("copying index.html into root");

  return gulp
    .src(config.srcIndex)
    .pipe(gulp.dest(config.root))
    .pipe(browserSync.stream());
});

gulp.task("clean-scripts", function(done) {
  clean(config.buildJS, done);
});

gulp.task("clean-styles", function(done) {
  clean(config.buildCSS, done);
});

gulp.task("clean-images", function(done) {
  clean(config.buildImages, done);
});

gulp.task("clean-fonts", function(done) {
  clean(config.buildFonts, done);
});

gulp.task("clean-index", function(done) {
  clean(config.buildIndex, done);
});

gulp.task("browser-sync", ["wiredep"], function() {
  if(browserSync.active) {
    return; /* if it's already running, do nothing */
  }

  log("starting browser-sync on port " + config.port);

  browserSync.init({
    server: {
      baseDir: config.root
    },
    minify: false,
    logLevel: "debug", /* detailed log */
    reloadDelay: 1000
  });

  gulp.watch(config.srcSCSS, ["styles"]);
  gulp.watch(config.srcJS, ["scripts"]);
  gulp.watch(config.html, ["index", "wiredep"]);
});

gulp.task("build", ["wiredep", "images", "fonts"], function() {
  log("optimizing and building html, css and js");

  var assets = $.useref.assets();

  return gulp
    .src(config.buildIndex)
    .pipe($.plumber())
    .pipe(assets)
    .pipe($.if("*.js", $.uglify()))
    .pipe($.if("*.css", $.minifyCss()))
    .pipe(assets.restore())
    // .pipe($.minifyHtml())
    .pipe($.useref())
    .pipe(gulp.dest(config.root));
});

gulp.task("watch", function() {
  log("watching over js, css, html files");

  gulp.watch(config.srcJS, ["scripts"]);
  gulp.watch(config.srcSCSS, ["styles"]);
  gulp.watch(config.srcImg, ["images"]);
});

// .bowerrc file runs wiredep task whenever new package is added or removed from bower_components
gulp.task("wiredep", ["styles", "scripts"], function() {
  log("wiring css & js dependencies into index.html");

  return gulp
    .src(config.srcIndex)
    .pipe(wiredep({ignorePath: "../"}))
    .pipe($.inject(gulp.src(config.buildCSS), {relative: true, ignorePath: "../"}))
    .pipe($.inject(gulp.src(config.buildJS), {relative: true, ignorePath: "../"}))
    .pipe(gulp.dest(config.root));
});



// remove files; "done" callback makes primary task wait for a clean task to finish
function clean(path, done) {
  log("cleaning " + $.util.colors.yellow(path));
  del(path, done);
}

// log currently running task
function log(msg) {
  $.util.log($.util.colors.yellow(msg));
}