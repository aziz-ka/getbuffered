module.exports = function() {
  var src = "./src/";
  var build = "./build/";

  var config = {
    src: src,
    build: build,
    buildJS: build + "js/**/*.js",
    buildCSS: build + "css/**/*.css",
    buildImages: build + "images/**/*.*",
    buildFonts: build + "fonts/**/*.*",
    buildIndex: "./index.html",
    srcJS: src + "js/**/*.js",
    srcSCSS: src + "css/**/*.scss",
    srcImg: src + "images/*.*",
    srcIndex: src + "index.html",
    html: src + "**/*.html",
    fonts: ["./bower_components/font-awesome/fonts/**/*.*",
            "./bower_components/bootstrap/fonts/**/*.*"],
    port: 3000,
    root: "./"
  };

  return config;
};