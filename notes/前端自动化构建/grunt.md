### grunt

##### 一、常用插件及总结

**插件**

- load-grunt-tasks 自动加载所有的grunt插件中的任务

  ```javascript
  const loadGruntTask = require('load-grunt-tasks')
  loadGruntTask(grunt)
  ```

- grunt-sass 编译sass文件 转换成css文件

  ```javascript
  const sass = require('sass')
  modeule.exports = grunt => {
      grunt.initConfig({
          sass: {
              options: {
                  sourceMap: true,
                  implementation: sass
              },
              main: {
                  files: {
                      'dist/css/main.css': 'src/scss/main.scss'
                  }
              }
          }
      })
      grunt.loadNpmTasks('grunt-sass')
  }
  ```

- grunt-babel 编译ES6

  ```javascript
  modeule.exports = grunt => {
      grunt.initConfig({
          babel: {
              options: {
                  sourceMap: true,
                  presets: ['@babel/preset-env']
              },
              main: {
                  files: {
                      'dist/js/app.js': 'src/js/app.js'
                  }
              }
          }
      })
      loadGruntTask(grunt)
  }
  ```

- grunt-contrib-watch 热更新 监听文件变化

  ```javascript
  modeule.exports = grunt => {
      grunt.initConfig({
          babel: {
              options: {
                  sourceMap: true,
                  presets: ['@babel/preset-env']
              },
              main: {
                  files: {
                      'dist/js/app.js': 'src/js/app.js'
                  }
              }
          },
          watch: {
              js: {
                  files: ['src/js/*.js'],
                  tasks: ['babel']
              },
              css: {
                  files: ['src/scss/*.scss'],
                  tasks: ['sass']
              }
          }
      })
      loadGruntTask(grunt)
      grunt.registerTask('default', ['sass', 'babel','watch'])
  }
  ```

  