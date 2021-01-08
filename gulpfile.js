'use strict'

import gulp              from 'gulp'
import sass              from 'gulp-sass'
import pug               from 'gulp-pug'
import babel             from 'gulp-babel'
import plumber           from 'gulp-plumber'
import imagemin          from 'gulp-imagemin'
import concat            from 'gulp-concat'
import autoprefixer      from 'gulp-autoprefixer'
import uglify            from 'gulp-uglify-es'
import notify            from 'gulp-notify'
import browserSync       from 'browser-sync'
import newer             from 'gulp-newer'
import del               from 'del'
import removeCssComments from 'gulp-strip-css-comments'


const path = {
  dist: {
    index:   'dist/',
    style:   'dist/css/',
    scripts: 'dist/javascript/',
    medias:  'dist/images/',
    fonts:   'dist/fonts/'
  },
  src: {
    index:   'src/index/index.pug',
    style:   'src/style/style.{scss,css}',
    scripts: 'src/scripts/*.{ts,js}',
    medias:  'src/images/**/*',
    fonts:   'src/fonts/*.{woff,woff2}'
  },
  srcWatch: {
    index:   'src/index/*.pug',
    style:   'src/style/*.{scss,css}',
    scripts: 'src/scripts/*.{ts,js}',
    medias:  'src/images/**/*',
    fonts:   'src/fonts/*.{woff,woff2}'
  }
}


const buildFunctions = {
  index: done => {
    del(path.dist + '*.html')
    gulp.src(path.src.index)
      .pipe(plumber())
      .pipe(pug())
      .pipe(gulp.dest(path.dist.index))
  
    done()
  },
  style: done => {
    gulp.src(path.src.style)
      .pipe(plumber({
        errorHandler: error => {
          notify.onError({
            title: 'SCSS error',
            message: 'error <%= error.message %>'
          })(error)
        }
      }))
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(removeCssComments())
      .pipe(autoprefixer({ cascade: true }))
      .pipe(gulp.dest(path.dist.style))
  
    done()
  },
  scripts: done => {
    gulp.src(path.src.scripts)
    .pipe(plumber({
      errorHandler: error => {
        notify.onError({
          title: 'JAVASCRIPT error',
          message: 'error <%= error.message %>'
        })(error)
      }
    }))
    .pipe(concat('main.js'))
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    .pipe(uglify.default())
    .pipe(gulp.dest(path.dist.scripts))

    done()
  },
  images: done => {
    del(path.dist.medias)
    gulp.src(path.src.medias)
      .pipe(newer(path.dist.medias))
      .pipe(imagemin([
        imagemin.mozjpeg({
          quality: 93,
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 4
        }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ]))
      .pipe(gulp.dest(path.dist.medias))
      .pipe(browserSync.reload({ stream: true }))

    done()
  },
  build: done => {
    gulp.series(
      buildFunctions.index,
      buildFunctions.style,
      buildFunctions.scripts,
      buildFunctions.images
    )
    done()
  }
}

const devFunction = {
  index: done => {
    gulp.src(path.src.index)
      .pipe(plumber())
      .pipe(pug({ pretty: true }))
      .pipe(gulp.dest(path.dist.index))
      .pipe(browserSync.reload({ stream: true }))
  
    done()
  },
  style: done => {
    gulp.src(path.src.style)
      .pipe(plumber({
        errorHandler: error => {
          notify.onError({
            title: 'SCSS error',
            message: 'error <%= error.message %>'
          })(error)
        }
      }))
      .pipe(sass({ outputStyle: 'expanded' }))
      .pipe(removeCssComments())
      .pipe(autoprefixer({ cascade: true }))
      .pipe(gulp.dest(path.dist.style))
      .pipe(browserSync.reload({ stream: true }))
  
    done()
  },
  scripts: done => {
    gulp.src(path.src.scripts)
      .pipe(plumber({
        errorHandler: error => {
          notify.onError({
            title: 'JAVASCRIPT error',
            message: 'error <%= error.message %>'
          })(error)
        }
      }))
      .pipe(concat('main.js'))
      // .pipe(babel({
      //   presets: ['@babel/env']
      // }))
      // .pipe(uglify.default())
      .pipe(gulp.dest(path.dist.scripts))
      .pipe(browserSync.reload({ stream: true }))

    done()
  },
  images: done => {
    gulp.src(path.src.medias)
      // .pipe(newer(path.dist.medias))
      .pipe(imagemin([
        imagemin.mozjpeg({
          quality: 93,
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 4
        }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ]))
      .pipe(gulp.dest(path.dist.medias))
      .pipe(browserSync.reload({ stream: true }))

    done()
  },
  initialize: () => {
    browserSync.init({
      server: path.dist.index,
      notify: false,
      online: true,
      open: false
    })

    gulp.watch(path.srcWatch.index, devFunction.index)
    gulp.watch(path.srcWatch.style, devFunction.style)
    gulp.watch(path.srcWatch.scripts, devFunction.scripts)
    gulp.watch(path.srcWatch.medias, devFunction.images)
  }
}


export const index   = buildFunctions.index
export const style   = buildFunctions.style
export const scripts = buildFunctions.scripts
export const images  = buildFunctions.images

export default devFunction.initialize
export const build = buildFunctions.build
