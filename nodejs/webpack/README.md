# 学习`webpack`
> 通俗点说就是把源码(js,html,css,图片等)解析打包。

**关于这个学习项目在不同平台上安装时出现的问题**:
`[fsevents@^1.2.7] optional install error: Package require os(darwin) not compatible with your platform(linux)`
解决:
```shell
cnpm rebuild node-sass
cnpm install
```
## 安装
4.x需要安装两个: `webpack` 和 `webpack-cli`
```shell
npm init -fy #首先创建一个项目
cnpm install webpack webpack-cli --save-dev
#--save-dev 表示开发阶段需要，产品阶段不需要，因为他是用来给我们打包用的
```

**如果我们不进行配置的话，其实webpack本身是有一个默认配置的**，默认配置的文件在：
`node_modules/webpack/lib/WebpackOptionsDefaulter.js`。
我们看几个重要易懂的配置就明白了：
 - 入口文件设置：
   - 默认路径`this.set("entry", "./src");`
   - 默认文件`this.set("resolve.mainFiles", ["index"]);`
 - 出口文件：
   - 默认路径`this.set("output.path", path.join(process.cwd(), "dist"));`
   - 默认文件`this.set("output.filename", "[name].js");`
...其他的就不看了。
## 快速上手
有了默认配置，那我们先来试验下:
```shell
mkdir src
touch src/index.js
```
写入：
```javascript
console.log("Hello Webpack!");
```
运行:
```shell
nodejs node_modules/webpack/bin/webpack.js
```
结果：
```shell
Hash: d6bfd4cfe48b9a2d3473
Version: webpack 4.29.6
Time: 737ms
Built at: 03/23/2019 11:00:23 AM
  Asset       Size  Chunks             Chunk Names
main.js  959 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./src/index.js 30 bytes {0} [built]
```
现在就多出了`dist`文件夹和`dist/main.js`文件，也是我们最终需要的打包好的文件，你可以直接引用到`html`文件中。
**试一下**:
```shell
nodejs dist/main.js
```
output:
```shell
Hello Webpack!
```
**编写html导入**
`touch dist/index.html`
```html
<!doctype html>
<html>
    <head>
        <title>
            webpack learning
        </title>
    </head>
    <body>
        
    </body>
    <script src="./main.js">
    </script>
</html>
```
打开浏览器看`console`输出和命令行输出时一模一样的。
## 重要概念
**`webpack`的四个核心**：
 - 入口
 - 出口
 - loader
 - plugiin

 ## 手动配置
 > `webpack`默认识别的配置文件叫做`webpack.config.js`
 `webpack`是采用的nodejs方式编写的，我们来写一个

 `webpack.config.js`:
 ```javascript
 const path = require('path');

module.exports = {
    mode: 'development', // 模式 默认两种production 和 development
    entry: './src/index.js', // 入口
    output: { // 出口
        filename: 'bundle.js', // 生成的文件名
        path: path.resolve(__dirname, 'dist') // 路径，必须是一个局对路径
    }
};
 ```
这里的模式区别在于：
 - 生成的出口文件，开发模式的文件时压缩简化过得，基本不能阅读，而生产模式的呢更适合阅读
 - 其他的却别目前未了解

现在删除前面的`main.js`，重新来执行`webpack`命令，现在的话`dist`目录下多了`bundle.js`文件，并且和之前的`main.js`文件内容有所差别了，不过效是一样的。

**为啥取名为`wewbpack`呢？**
我们执行`webpack`命令时会去调用`node_modules/webpack-cli/bin/config-yargs.js`,这里就指定了配置文件名称：
```javascript
...
defaultDescription: "webpack.config.js or webpackfile.js",
...
```
那么可以取名为：`webpack.config.js`或者`webpackfile.js`。
其实名称也可以修改的，我们使用命令参数的方式来调用自定义配置文件:
```shell
nodejs node_modules/webpack/bin/webpack.js --config mywebpack.config.js
```
## 分析`webpack`解析过程
先来添加一个模块`src/myModule.js`:
```javascript
function myModule() {
    console.log("I am is myModule!");
}
module.exports = myModule;
```
`bundle.js`里面实际上是一个立即执行函数，他的核心作用呢，是循环加载我们指定的入口文件以及入口文件所依赖的文件，函数的参数时一个对象，以依赖的文件做key，文件内的代码做值(是一个函数，函数调用eval())；
立即执行函数里面有个核心函数:`__webpack_require__`，它就是用来把所有的文件加载到自定义的缓存里面；
`__webpack_require__`利用`call`方法、`eval`方法得到每个模块的执行结果;
循环加载的原理在于将nodejs/es6等模块导入方式`require/import`改为`__webpack_require__`函数，那么在执行代码的时候`__webpack_require__`会得到递归调用，从而链式加载所有模块。
## 简化命令
前面的话每次打包都要执行那么长的命令太麻烦了，我们来简化一下:
`package.json`增加:
```json
...
  "scripts": {
      ...
    "build": "nodejs node_modules/webpack/bin/webpack.js",
    ...
  },
  ...
```
现在我们执行:`npm run build`就可以了。

## `html`插件
现在我们有些问题:
### 开发时服务器
就是前面在运行打包好的`index.html`时，我们是通过点开文件来执行的，实际当中肯定就是访问链接了，所以我们需要一个服务器来运行我们的代码，让我们在开发过程中实时看到效果。
安装`webpack-dev-server`，这是一个开发阶段的web服务器:
`cnpm install webpack-dev-server  --save-dev`
现在来配置`webpack.config.js`:
```javascript
    devServer: { // 开发服务器配置
        port: 3000, // 端口
        progress: true,
        contentBase:'./dist', // 默认执行目录
        open: false // 自动打开浏览器
    },
```
`package.json`:
```json
  "scripts": {
    "build": "nodejs node_modules/webpack/bin/webpack.js",
    "dev": "nodejs node_modules/webpack-dev-server/bin/webpack-dev-server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
运行`npm run dev`就可以了。
### `index.html`打包
前面的话我们是自己在`dist`文件夹下写的`index.html`，不过呢我们更希望在`src`目录下编写我们自己的文件，`dist`下面只需要关心`webpack`打包后的结果，那么以后即使`dist`名称变了，不想用这个文件夹来存放打包文件了，那么我们只需要修改配置即可，不需要自己还要去写`index.html`。
 - 把`dist/index.html`移到`src`下面(去掉之前手动添加的`bundle.js`，打包后webpack会自动帮我们导入，我们只关心html文件模板，不关心打包，打包及文件组织有webpack来做)
 - 安装插件`html-webpack-plugin`:
   ```shell
   cnpm install html-webpack-plugin --save-dev
   ```
 - 修改`webpack.config.js`配置:
   ```JavaScript
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   ...
       plugins:[ // 数组，放着所有插件，每个都是一个插件实例
        new HtmlWebpackPlugin({
            template: './src/index.html', // 模板文件
            filename: 'index.html' // 输出文件名，会放在前面配置的出口路径下
        })
    ]
   ```
 - 运行`npm run dev`:
   ```shell
        Asset       Size  Chunks             Chunk Names
    bundle.js    351 KiB    main  [emitted]  main
    index.html  248 bytes          [emitted] 
   ```
   不过这两个文件并没有在`dist`文件加下，而是在缓存里，但是打开浏览器看到的结果是对的，和之前一致。
 - 打包:
   `webpack.config.js`:
   ```javascript
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   ...
       output: { // 出口
        filename: 'bundle.[hash:8].js', // 生成的文件名 [hash]表示加hash值(只要8位)，配合后面的plugin使用
        path: path.resolve(__dirname, 'dist') // 路径，必须是一个局对路径
    },
    ...
        plugins:[ // 数组，放着所有插件，每个都是一个插件实例
        new HtmlWebpackPlugin({
            template: './src/index.html', // 模板文件
            filename: 'index.html', // 输出文件名，会放在前面配置的出口路径下
            minify: { // 压缩html文件
                removeAttributeQuotes: true, // 删除html里面属性的双引号
                collapseWhitespace: true, // 合并成一行
                hash: true // 增加hash戳
            }
        })
    ]
   ```
   现在执行`npm run build`就看到效果了。

## `css`样式处理
### 常用loader
由于`webpack`默认只支持js的打包，所以不管是`html`、`css`还是其他文件都需要使用`loader`和`plugin`来支持。
先来写个`css`，`src/index.css`:
```css
body {
    background-color: aquamarine;
}
```
导入`src/index.js`:
```javascript
const indexCss = require("./index.css");
```
打包`npm run build`,结果报错了:
```shell
Entrypoint main = bundle.4fd4ba91.js
[./src/index.css] 177 bytes {main} [built] [failed] [1 error]
[./src/index.js] 112 bytes {main} [built]
[./src/myModule.js] 89 bytes {main} [built]

ERROR in ./src/index.css 1:5
Module parse failed: Unexpected token (1:5)
You may need an appropriate loader to handle this file type.
> body {
|     background-color: aquamarine;
| }
 @ ./src/index.js 2:17-39
```
不过也提示我们了要安装loader。
那我们来安装loader:`cnpm install css-loader style-loader --save-dev`。
`webpack.config.js`:
```javascript
    module: { // 模块
        rules: [ // 模块解析规则
            // loader的特点是功能单一，所以一般需要好几个，可以是数组，可以是对象，对象可以有更多参数
            // loader是有顺序的，默认从右向左执行(所以需要注意)
            // css-loader是用来处理@import这种语法的
            // style-loader是用来把css插入到head标签里面的，但是我们看打包好的`index.html`里面并没有引入css，因为css被放到
            // bundle.js里面了，不过浏览器样式里面是有的。
            { 
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    'css-loader']
            },
        ]
    }
```
less sass 等等都一样。

### 使用link
> **我们仍然发现一个问题**：
就是css样式只是被插入到html文件的style标签了，我们更希望使用link来链接

安装插件:`cnpm install mini-css-extract-plugin --save-dev`,他就是用来抽离css的,
`webpack.config.js`:
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
...
plugins:[
  ...
  new MiniCssExtractPlugin({
      filename:'main.css' // 输出的css文件名
  }),
]
...
module: {
  ...
  test: /\.css$/,
      use: [
          /*
          {
              loader: 'style-loader',
              options: {
                  inserttAt: 'top' // 因为我们在html里面有可能定义style，这里的话是把模块里的样式放到html的样式前面，这样一来
              }
          },
          */
          MiniCssExtractPlugin.loader, // 这里的话就不要插入到style标签离了，而是使用MiniCssExtractPlugin的loader规则，也就是使用link
          'css-loader']
  },
  ...
```
### 更多的loader
还有处理css的，加前缀适应不同的浏览器autoprefixer、postcss-loader。
### css压缩
压缩优化css文件资源mini-css-plugin:
`cnpm install optimize-css-assets-webpack-plugin --save-dev`
`webpack.config.js`:
```javascript
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
...
    optimization: { // 优化项
        minimizer: [
            new OptimizeCssPlugin()
        ]
    },
```
不过这个时候发现js文件的压缩没有了，