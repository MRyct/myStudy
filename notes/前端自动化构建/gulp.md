### gulp

##### 一、基本使用

- npm init -y
- yarn add gulp 安装
- 创建gulp入口文件 gulpfile.js
- 编写对应的任务配置

##### 二、组合任务 （串行任务、并行任务）

```javascript
const { series, parallel } = require('gulp')
const task1 = done => {
    setTimeout(() => {
        console.log('task1 ing')
    }, 1000)
}
const task2 = done => {
    setTimeout(() => {
        console.log('task2 ing')
    }, 1000)
}
const task3 = done => {
    setTimeout(() => {
        console.log('task3 ing')
    }, 1000)
}
export.foor = series(task1, task2, task3) //串行
export.foor = parallel(task1, task2, task3) //并行
```

##### 五、异步任务

- 回调函数

- Promise

- async await

- stream 

  ```javascript
  export.stream = done => {
    	// 创建文件读取流  
      const readStream = fs.createReasStream('package.json')
      // 创建文件写入流  写入temp.txt
      const writeStream = fs.createWriteStream('temp.txt')
      readStream.pipe(writeStream)
      readStream.on('end', () => {
          done()
      })
  }
```
  



##### 六、核心工作原理



`gulp`是基于<font color=red>流-stream</font>的构建系统 （The streaming build system）, 因此`stream`可以说是gulp核心





- createReadStream 创建读取流
- createWriteStream 创建写入流
- Transfrom 转换

> 相当于就是 `输入` — `加工` — `输出`



```javascript
const fs = require('fs')
const { Transform } = require('stream')
exports.default = () => {
    // 文件读取流
    const read = fs.createReadStream('xxxxx.css')
    // 文件写入流
    const write = fs.createWriteStream('xxxx.min.css')
    // 文件转换流
    const transform = new Transform({
        transform: (chunk, encoding, callback) => {
            // 核心转换过程实现
            // chunk => 读取李忠读取到的内容 - Buffer
            const input = chunk.toString()
            const output = input.replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '')
            callback(null, output)
        }
    })
    // 把读取出来的文件流导入写入流
    read
    .pipe(transform) // 转换
    .pipe(write) // 写入
}
```



##### 七、文件操作Api

> gulp 中 读取流api <font color=red>src</font>， 写入流 <font color=red>desc</font>

```javascript
const { src, desc } = require('gulp')
exports.default = () => {
    return src('src/normalize.css')
    	.pipe(desc('dist'))
}
```

##### 八、gulp 文件编译转换

- 样式文件编译 (css)

  ```javascript
  // 以sass为例
  const { src, dest } = require('gulp')
  const sass = require('gulp-sass')
  // { base: 'src'} 指定基础目录  保证编译后的目录结构
  // {outputStyle: 'expanded'} 输出格式展开
  const style = () => {
      return src('src/assets/styles/*.scss', { base: 'src'})
      .pipe(sass( {outputStyle: 'expanded'}))
      .pipe(desc('dist'))
  }
  module.exports = {
      style
  }
  ```

  

- 脚本文件编译(js)

  ```javascript
  const { src, dest } = require('gulp')
  const sass = require('gulp-babel')
  // { babel: 'src'} 指定基础目录  保证编译后的目录结构
  const script = () => {
      return src('src/assets/scripts/*.js', { base: 'src'})
      .pipe(babel({ presets: ['@babel/preset-env']}))
      .pipe(desc('dist'))
  }
  module.exports = {
      script
  }
  ```

  

- 页面模板编译

  ```javascript
  const { src, dest } = require('gulp')
  const swig = require('gulp-swig')
  // swig 方法可传入 一些模板依赖的数据 - 对象
  const page() => {
      return src('src/*.html', { base: 'src'})
      .pipe(swig())
      .pipe(desc('dist'))
  }
  module.exports = {
      page
  }
  ```

  

- 图片和字体文件转换

  ```javascript
  const { src, dest } = require('gulp')
  const imagemin = require('gulp-imagemin')
  // swig 方法可传入 一些模板依赖的数据 - 对象
  const image() => {
      return src('src/assets/images/*', { base: 'src'})
      .pipe(imagemin())
      .pipe(desc('dist'))
  }
  const font() => {
      return src('src/assets/font/*', { base: 'src'})
      .pipe(imagemin())
      .pipe(desc('dist'))
  }
  module.exports = {
      image,
      font
  }
  ```

##### 九、文件清除

```javascript
const { src, dest, parallel, series } = require('gulp')
const del = reuire('del')
const clean = () => {
    return del()
}
const task1 = () => {}
const task2 = () => {}
// 一些其他文件任务
const extra = () = > {
    return src('public/**', {base: 'public'})
    .pipe(dest('dist'))
}
// 任务组合
const compile = parallel(task1, task2)
// 需要在其他任务前 清除 所以采用 series 串行， 先执行清除
const build = series(clean, parallel(compile, extra))
module.exports = {
    compile,
    build
}

```

##### 十、自动加载插件 

使用`gulp-load-plugins`插件

```javascript
const { src, dest } = require('gulp')
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
// plugins.xxxx
const syle = () => {
    return src('src/assets/styles/*.scss', {base: 'src'})
   	.pipe(plugins.sass( {outputStyle: 'expanded'}))
    .pipe(desc('dist'))
}
```

##### 十一、开发服务以及监听文件变化（热更新）

> yarn add browser-sync --dev

```javascript
const { src, dest, parallel, series, watch } = require('gulp')
const browserSync = require('browser-sync')
const plugins = loadPlugins()
cosnt bs = browserSync.create()
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src'})
    .pipe(plugins.sass( {outputStyle: 'expanded'}))
    .pipe(desc('dist'))
}
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src'})
    .pipe(plugins.babel({ presets: ['@babel/preset-env']}))
    .pipe(desc('dist'))
}
const page() => {
    return src('src/*.html', { base: 'src'})
    .pipe(plugins.swig())
    .pipe(desc('dist'))
}
const image() => {
    return src('src/assets/images/*', { base: 'src'})
    .pipe(plugins.imagemin())
    .pipe(desc('dist'))
}
const font() => {
    return src('src/assets/font/*', { base: 'src'})
    .pipe(plugins.imagemin())
    .pipe(desc('dist'))
}
const extra = () = > {
    return src('public/**', {base: 'public'})
    .pipe(dest('dist'))
}
// watch('src/assets/styles/*.scss', style)
// 参数一 文件路径 参数二 任务
const serve = () => {
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/*.html', page)
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'src/public/**'
    ], bs.reload)
    bs.init({
        notify: false,
        port: 2080,
        //open: false,
        files: 'dist/**'
        server: {
            baseDir: 'dist', // 指定根目录
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}
// 任务组合
const compile = parallel(style, script, page)
// 需要在其他任务前 清除 所以采用 series 串行， 先执行清除
// 上线
const build = series(clean, parallel(compile,image, font, extra))
// 开发服务
const develop = series(compile, serve)
module.exports = {
    compile,
    build,
    develop
}
```

##### 十二、useref 文件引用处理

**useref** 是处理html模板中引用的css和js的， 可以将多个文件合并

> yarn add gulp-useref --dev

```javascript
const { src, dest, parallel, series, watch } = require('gulp')
const plugins = loadPlugins()
const useref = () => {
    return 
    src('dist/*.html', { base: 'dist' })
    .pipe(plugins.useref({ searchPath: ['dist', '.']}))
    .pipe(dest('dist'))
}
```

##### 十三、文件压缩

> yarn add gulp-htmllmin --dev  `html`
>
> yarn add gulp-uglify --dev `js`
>
> yarn add gulp-clean --dev `css`
>
> yarn add gulp-if --dev `判断`

```javascript
const { src, dest, parallel, series, watch } = require('gulp')
const plugins = loadPlugins()
const useref = () => {
    return 
    src('dist/*.html', { base: 'dist' })
    .pipe(plugins.useref({ searchPath: ['dist', '.']}))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
        collapseWhitespace: true, // 去掉换行
        minifyCSS: true, // 压缩html js
        minifyJS: true // 压缩html js
    })))
    .pipe(dest('dist'))
}
```

