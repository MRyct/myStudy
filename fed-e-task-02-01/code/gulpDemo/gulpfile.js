const { src, dest, parallel, series, watch } = require('gulp')
// 删除插件
const del = require('del')
// 实现开发服务 （热更新）
const browserSync = require('browser-sync')
// 自动加载插件
const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()
// 创建一个服务
const bs = browserSync.create()

const clean = () => {
  return del(['dist', 'temp'])
}

const defaultConfig = {
    baseDir: 'src',
    targetDir: 'dist'
}
const style = () => {
  return src('src/css/*.scss', { base: defaultConfig.baseDir})
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest(defaultConfig.targetDir))
    .pipe(bs.reload({ stream: true }))
}
const script = () => {
  return src('src/js/*.js', { base: defaultConfig.baseDir })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest(defaultConfig.targetDir))
    .pipe(bs.reload({ stream: true }))
}
const page = () => {
  return src('src/views/*.html', { base: defaultConfig.baseDir })
    .pipe(plugins.swig({ defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest(defaultConfig.targetDir))
    .pipe(bs.reload({ stream: true }))
}
const image = () => {
  return src('src/images/**', { base: defaultConfig.baseDir })
    .pipe(plugins.imagemin())
    .pipe(dest(defaultConfig.targetDir))
}
// 1.将多个css、js合并 减少请求
// 2.压缩js,css,html以及html模板中的css js
//** 这一步在上线时操作就可以了 减少开发时性能上的开销 **/
const useref = () => {
  return src(`${defaultConfig.targetDir}/views/*.html`, { base: defaultConfig.targetDir })
    .pipe(plugins.useref({ searchPath: [defaultConfig.targetDir, '.'] }))
    // html js css
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest(defaultConfig.targetDir))
}
const serve = () => {
  watch('src/css/*.scss', style)
  watch('src/js/*.js', script)
  watch('src/views/*.html', page)
  watch([
    'src/images/**'
  ], bs.reload)

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    // files: 'dist/**',
    server: {
      baseDir: ['dist', 'src'],
    }
  })
}
const compile = parallel(style, script, page)

// 上线之前执行的任务
const build =  series(clean,parallel(series(compile, useref),image))

const develop = series(clean, compile, serve)

module.exports = {
  clean,
  build,
  develop
}
