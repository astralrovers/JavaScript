# nodejs学习笔记

## 安装与NPM包管理

### 安装

- 这里只介绍Linux下nodejs安装
- `apt-get install nodejs`安装nodejs
- `apt-get install npm`安装npm

### NPM包管理

- 允许用户从NPM服务器下载别人编写的第三方包到本地使用
- 允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用
- 允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用

- 看下版本：`npm -v` ==> `3.5.2`

- 升级：`npm install npm -g`

#### 安装包

- 基本方式：`npm install <Module Name>`，例如安装web服务器框架express：`npm install express`，安装好之后，express 包就放在了工程目录下的 node_modules 目录中，因此在代码中只需要通过 **require('express')** 的方式就好，无需指定第三方包路径。
- 本地安装：`npm install express`，推荐
- 全局安装：`npm install express -g`

#### 包管理

- 查看全局环境安装了哪些包：`npm list -g`

- 查看本地安装了哪些：`npm list`

- 查看包版本：`npm list <Module Name>`，例如：`npm list express`

  ```shell
  /mnt/f/github/learn/JavaScript/nodejs/express
  └── express@4.16.4
  ```

- 卸载：`npm uninstall <Module Name>`

- 更新：`npm update <Module Name>`

- 搜索：`npm search <Module Name>`

#### 创建包

首先要了解package.json规则：

- **name** - 包名。
- **version** - 包的版本号。
- **description** - 包的描述。
- **homepage** - 包的官网 url 。
- **author** - 包的作者姓名。
- **contributors** - 包的其他贡献者姓名。
- **dependencies** - 依赖包列表。如果依赖包没有安装，npm 会自动将依赖包安装在 node_module 目录下。
- **repository** - 包代码存放的地方的类型，可以是 git 或 svn，git 可在 Github 上。
- **main** - main 字段指定了程序的主入口文件，require('moduleName') 就会加载这个文件。这个字段的默认值是模块根目录下面的 index.js。
- **keywords** - 关键字

我们可以使用npm的命令来输出`package.json`的一些基本配置

- 创建模块：`npm init`
- 注册用户：`npm adduser`
- 发布：`npm publish`



#### 使用淘宝镜像

会更快：npm install -g cnpm --registry=https://registry.npm.taobao.org

`cnpm install <Module Name>`



## 模块机制

### 简单的模块导入

nodejs的模块导入规则是使用的commonJS的导入规则，关于nodejs的模块导入原理，循环加载，兼容es6的导入规则这里不介绍，后续补充。

`let mod = require('http')`

#### 导入规则

```markdown
1. 如果 X 是内置模块
   a. 返回内置模块
   b. 停止执行
2. 如果 X 以 '/' 开头
   a. 设置 Y 为文件根路径
3. 如果 X 以 './' 或 '/' or '../' 开头
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
4. LOAD_NODE_MODULES(X, dirname(Y))
5. 抛出异常 "not found"

LOAD_AS_FILE(X)
1. 如果 X 是一个文件, 将 X 作为 JavaScript 文本载入并停止执行。
2. 如果 X.js 是一个文件, 将 X.js 作为 JavaScript 文本载入并停止执行。
3. 如果 X.json 是一个文件, 解析 X.json 为 JavaScript 对象并停止执行。
4. 如果 X.node 是一个文件, 将 X.node 作为二进制插件载入并停止执行。

LOAD_INDEX(X)
1. 如果 X/index.js 是一个文件,  将 X/index.js 作为 JavaScript 文本载入并停止执行。
2. 如果 X/index.json 是一个文件, 解析 X/index.json 为 JavaScript 对象并停止执行。
3. 如果 X/index.node 是一个文件,  将 X/index.node 作为二进制插件载入并停止执行。

LOAD_AS_DIRECTORY(X)
1. 如果 X/package.json 是一个文件,
   a. 解析 X/package.json, 并查找 "main" 字段。
   b. let M = X + (json main 字段)
   c. LOAD_AS_FILE(M)
   d. LOAD_INDEX(M)
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. let DIRS=NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD_AS_FILE(DIR/X)
   b. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules" CONTINUE
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS
```



## 事件

### 事件循环

Node.js 是单进程单线程应用程序，但是因为 V8 引擎提供的异步执行回调接口，通过这些接口可以处理大量的并发，所以性能非常高。

Node.js 几乎每一个 API 都是支持回调函数的。

Node.js 基本上所有的事件机制都是用设计模式中观察者模式实现。

Node.js 单线程类似进入一个while(true)的事件循环，直到没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数。关于更深入的事件与nodejs异步原理请参考朴灵的《深入浅出nodejs》。后续补充。

Node.js 有多个内置的事件，我们可以通过引入 events 模块，并通过实例化 EventEmitter 类来绑定和监听事件。

### 事件简介

Node.js 所有的异步 I/O 操作在完成时都会发送一个事件到事件队列。

Node.js 里面的许多对象都会分发事件：一个 net.Server 对象会在每次有新连接时触发一个事件， 一个 fs.readStream 对象会在文件被打开的时候触发一个事件。 所有这些产生事件的对象都是 events.EventEmitter 的实例。

events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。

你可以通过require("events");来访问该模块。

EventEmitter 对象如果在实例化时发生错误，会触发 error 事件。当添加新的监听器时，newListener 事件会触发，当监听器被移除时，removeListener 事件被触发。

示例：

```javascript
var eventEmit = require('events').EventEmitter;
var event = new eventEmit();
event.on('nEvent', () => {
    console.log('事件触发');
});

setTimeout(() => {
    event.emit('nEvent');
}, 1000);
```

### API

- `addListener(event, listener)`:

  为指定事件添加一个监听器到监听器数组的尾部

- `on(event, listener)`:

  为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数

- `once(event, listener)`:

  为指定事件注册一个单次监听器，即 监听器最多只会触发一次，触发后立刻解除该监听器

- **removeListener(event, listener)**:

  移除指定事件的某个监听器，监听器必须是该事件已经注册过的监听器。它接受两个参数，第一个是事件名称，第二个是回调函数名称。

- **removeAllListeners([event])**:

  移除所有事件的所有监听器， 如果指定事件，则移除指定事件的所有监听器。

- **setMaxListeners(n)**:

  默认情况下， EventEmitters 如果你添加的监听器超过 10 个就会输出警告信息。 setMaxListeners 函数用于提高监听器的默认限制的数量。

- **listeners(event)**:

  返回指定事件的监听器数组。

- **emit(event, [arg1], [arg2], [...])**:

  按参数的顺序执行每个监听器，如果事件有注册监听返回 true，否则返回 false。

### 类方法

- **listenerCount(emitter, event)**:

  返回指定事件的监听器数量。:`events.emitter.listenerCount(eventName)`。

### 内置事件

- **newListener**：

  ```javascript
  event.on('newListener', () => {
      console.log('添加新事件');
  });
  ```

- **removeListener**:

  ```javascript
  event.on('removeListener', () => {
      console.log('删除事件');
  });
  ```

- **error**:

  ```javascript
  event.emit('error');
  ```



## Buffer

## Stream

## 文件系统

## 网络编程

## 多进程

## websocket

## express