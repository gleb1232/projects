source_folder = 'app';
// name_project = require("path").basename(__dirname);

var gulp = require('gulp'),
    browsersync = require("browser-sync").create(),// .create()
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html');
webpcss = require('gulp-webpcss');
svgSprite = require('gulp-svg-sprite');
ttf2woff = require('gulp-ttf2woff');
ttf2woff2 = require('gulp-ttf2woff2');
fonter = require('gulp-fonter');
fs = require('fs');
var path = {
    vendor: {
        js: 'app/js/',
        css: 'app/css/'
    },
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        scss: 'dist/css/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        json: 'dist/json/'
    },
    app: { //Пути откуда брать исходники
        html: 'app/**/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        scss: 'app/css/**/*main.scss',
        css: 'app/css/*main.css',
        scss12: 'app/css/main.scss',
        img: 'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/*.ttf',
        fonts_otf: 'app/fonts/',
        json: 'app/json/*.json'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/css/**/*.scss',
        scss2: 'app/css/main.sccs',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*',
        json: 'app/**/*.json'

    },
    clean: './dist/'

};


gulp.task('otf2ttf', function () {
    return gulp.src(['app/fonts/*otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(gulp.dest(path.app.fonts_otf)); //Выплюнем их в папку build - 'diz'
})

gulp.task('svgSprite', function () {
    return gulp.src(['app/iconsprite/*svg'])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg",  //sprite file name
                    example: true
                }
            },
        }
        ))
        .pipe(gulp.dest(path.dist.img)) //Выплюнем их в папку build - 'diz'
});
function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false,
        port: 3000//8081

    })
}

function css() {
    return gulp.src(path.app.scss12)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(webpcss())//  СОЗДАЕТ BAGROUNND WEBP
        .pipe(group_media())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest(path.dist.css)) //Выплюнем их в папку build - 'diz'
        .pipe(browsersync.stream()) //И перезагрузим наш сервер для обновлений
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )

        .pipe(gulp.dest(path.dist.css)) //Выплюнем их в папку build - 'diz'
        .pipe(browsersync.stream()) //И перезагрузим наш сервер для обновлений
}
function json() {
    return gulp.src(path.app.json)
        .pipe(gulp.dest(path.dist.json))
        .pipe(browsersync.stream()) //И перезагрузим наш сервер для обновлений
}
function js() {
    return gulp.src(path.app.js)
        .pipe(gulp.dest(path.dist.js)) //Выплюнем их в папку build - 'diz'
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(gulp.dest(path.dist.js)) //Выплюнем их в папку build - 'diz'
        .pipe(browsersync.stream()) //И перезагрузим наш сервер для обновлений
}
function images() {
    return gulp.src(path.app.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(gulp.dest(path.dist.img)) //Выплюнем их в папку build - 'diz'
        .pipe(gulp.src(path.app.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [
                    {
                        removeViewBox: true
                    }
                ],
                interlaced: true,
                optimizationLevel: 3,//0 to 7
            })
        )
        .pipe(gulp.dest(path.dist.img)) //Выплюнем их в папку build - 'diz'
        .pipe(browsersync.stream()) //И перезагрузим наш сервер для обновлений
}
function html() {
    return gulp.src(path.app.html)
        .pipe(webphtml())
        .pipe(gulp.dest(path.dist.html)) //Выплюнем их в папку build - 'diz'
        .pipe(browsersync.stream()) //И перезагрузим наш сервер для обновлений
}
function fonts() {
    gulp.src(path.app.fonts)
        .pipe(ttf2woff())
        .pipe(gulp.dest(path.dist.fonts)) //Выплюнем их в папку build - 'diz'
    gulp.src(path.app.fonts)
        .pipe(ttf2woff2())
        .pipe(gulp.dest(path.dist.fonts)) //Выплюнем их в папку build - 'diz'

        .pipe(browsersync.stream()) //И перезагрузим наш сервер для обновлений
}




function fontsStyle() {

    let file_content = fs.readFileSync(source_folder + '/css/fonts.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/css/fonts.scss', '', cb);
        return fs.readdir(path.dist.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + '/css/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}
function cb() { }

var build = gulp.series(gulp.parallel(css, html, json, js, images, fonts, fontsStyle));

function watchFiels() {
    gulp.watch([path.watch.scss], css);
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.json], json);
}

var watch = gulp.parallel(build, watchFiels, browserSync);



exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.json = json;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;







//browser-sync
//gulp-sass
// gulp-autoprefixer
//gulp-group-css-media-queries
// npm i gulp-clean-css -D
//npm i gulp-rename -D
//npm i gulp-uglify-es -D
//npm i gulp-imagemin -D
//npm i gulp-webp -D
//npm i gulp-webp-html -D

//npm install webp-converter@2.2.3 --save-dev
//npm i gulp-webpcss -D

//npm i gulp-svg-sprite -D
//npm i gulp-ttf2woff gulp-ttf2woff2  -D
//npm i gulp-fonter  -D
// npm i fs  -D





//npm install webp-converter@2.2.3 --save-dev




