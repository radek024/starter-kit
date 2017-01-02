var gulp=require("gulp");
var browserSync=require("browser-sync");
var sass=require("gulp-sass");
var sourcemaps=require("gulp-sourcemaps");
var autoprefixer=require("gulp-autoprefixer");
var cleanCSS=require("gulp-clean-css");
var uglify=require("gulp-uglify");
var imagemin=require("gulp-imagemin");
var changed=require("gulp-changed");
var htmlMin=require("gulp-htmlmin");
var del=require("del");
var sequence=require("run-sequence");

var config={
  dist: "dist/",
  src: "src/",
  cssin: "src/css/**/*.css",
  jsin: "src/js/**/*.js",
  imgin: "src/img/**/*.{jpeg,jpg,png,gif}",
  htmlin: "src/*.html",
  scssin: "src/scss/**/style.scss",
  cssout: "dist/css",
  jsout: "dist/js",
  imgout: "dist/img",
  htmlout: "dist",
  scssout: "src/css",
  cssoutname: "style.css",
  jsoutname: "script.js"
};

gulp.task('serve', ['sass'], function(){

  browserSync({
    server: config.src
  });

  gulp.watch(config.htmlin, ['reload']);
  gulp.watch(config.scssin, ['sass']);
});

gulp.task('reload', function(){
    browserSync.reload();
});

gulp.task('sass', function(){
  return gulp.src(config.scssin)
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 3 versions']
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.scssout))
  .pipe(browserSync.stream());
});

gulp.task('default',['serve']);

gulp.task("css", function(){
  return gulp.src(config.cssin)
   .pipe(cleanCSS())
   .pipe(gulp.dest(config.cssout));
});

gulp.task("js", function(){
  return gulp.src(config.jsin)
   .pipe(uglify())
   .pipe(gulp.dest(config.jsout));
});

gulp.task("img", function(){
  return gulp.src(config.imgin)
   .pipe(changed(config.imgout))
   .pipe(imagemin())
   .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function(){
  return gulp.src(config.htmlin)
  .pipe(htmlMin({
    sortAttributes: true,
    sortClassName: true,
    collapseWhitespace: true
  }))
  .pipe(gulp.dest(config.dist))
});

gulp.task("clean", function(){
  return del(['dist']);
});

gulp.task("build", function(){
  sequence('clean',['html','css','js','img']);
});
