module.exports = function() {
  var src = "./src/";
  var build = "./build/";

  var config = {
    src: src,
    build: build,
    customJS: src + "js/*js",
    buildJS: build + "js/**/*.js",
    buildCSS: build + "css/**/*.css",
    srcJS: src + "js/**/*.js",
    srcSCSS: src + "css/**/*.scss",
    img: src + "images/*.*",
    index: "./index.html",
    html: ["./*.html", src + "**/*.html"],
    fonts: src + "fonts/*.*",
    port: 3000,
    root: "./"
  };

  return config;
};