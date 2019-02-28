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

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。

在 Node.js 中，Buffer 类是随 Node 内核一起发布的核心库。Buffer 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，每当需要在 Node.js 中处理I/O操作中移动的数据时，就有可能使用 Buffer 库。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。ES6里面也有关于二进制类型的。

### 简单示例

```java
let buf = Buffer.from('javascript', 'utf-8');

console.log(buf);
console.log(buf[0]);
console.log(buf.toString('hex'));
console.log(buf.toString('ascii'));
console.log(buf.toString('utf-8'));
```

out:

```shell
<Buffer 6a 61 76 61 73 63 72 69 70 74>
106
6a617661736372697074
javascript
javascript
```

可以看出来buf里面全是二进制的，不管是用何种方式创建都会转换成2进制数据，和C语言里面的2进制数据完全相同。

**Node.js 目前支持的字符编码包括：**

- **ascii** - 仅支持 7 位 ASCII 数据。如果设置去掉高位的话，这种编码是非常快的。
- **utf8** - 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8 。
- **utf16le** - 2 或 4 个字节，小字节序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。
- **ucs2** - **utf16le** 的别名。
- **base64** - Base64 编码。
- **latin1** - 一种把 **Buffer** 编码成一字节编码的字符串的方式。
- **binary** - **latin1** 的别名。
- **hex** - 将每个字节编码为两个十六进制字符。

### 创建

Buffer 提供了以下 API 来创建 Buffer 类：

- **Buffer.alloc(size[, fill[, encoding]])：** 返回一个指定大小的 Buffer 实例，如果没有设置 fill，则默认填满 0
- **Buffer.allocUnsafe(size)：** 返回一个指定大小的 Buffer 实例，但是它不会被初始化，所以它可能包含敏感的数据
- **Buffer.allocUnsafeSlow(size)**
- **Buffer.from(array)：** 返回一个被 array 的值初始化的新的 Buffer 实例（传入的 array 的元素只能是数字，不然就会自动被 0 覆盖）
- **Buffer.from(arrayBuffer[, byteOffset[, length]])：** 返回一个新建的与给定的 ArrayBuffer 共享同一内存的 Buffer。
- **Buffer.from(buffer)：** 复制传入的 Buffer 实例的数据，并返回一个新的 Buffer 实例
- **Buffer.from(string[, encoding])：** 返回一个被 string 的值初始化的新的 Buffer 实例

我们来看下使用和一些细节：

```javascript
let buf_alloc = Buffer.alloc(10, 1);
console.log(buf_alloc);

let buf_alloc_unsafe = Buffer.allocUnsafe(10);
console.log(buf_alloc_unsafe);

let buf_arr = Buffer.from([1, 2, 0x33333]); //数组元素长度只能是1个字节，高位会被忽略
console.log(buf_arr);

let buf_str = Buffer.from('123');
console.log(buf_str);

let arrbuf = new ArrayBuffer(10);
let buf_from_arrbuf = Buffer.from(arrbuf);
arrbuf[0] = 9;
buf_from_arrbuf.buffer[1] = 5; // arrbuf === buf_from_arrbuf.buffer，所以改一个另一个会变化
buf_from_arrbuf[1] = 4;
console.log(arrbuf);
console.log(buf_from_arrbuf);
//并不是很明白这样做有什么意义

let buf_copy = Buffer.from(buf_arr);
console.log(buf_copy);

//另外任何类型都会被转换成2进制
```

看下结果：

```shell
<Buffer 01 01 01 01 01 01 01 01 01 01>
<Buffer 50 0c 5f b7 ff 7f 00 00 50 0c>
<Buffer 01 02 33>
<Buffer 31 32 33>
ArrayBuffer { byteLength: 10, '0': 9, '1': 5 }
<Buffer 00 04 00 00 00 00 00 00 00 00>
<Buffer 01 02 33>
```

### 读写

- 写：

  ```javascript
  buf.write(string[, offset[, length]][, encoding]);
  ```

  参数描述如下：

  - **string** - 写入缓冲区的字符串。
  - **offset** - 缓冲区开始写入的索引值，默认为 0 。
  - **length** - 写入的字节数，默认为 buffer.length
  - **encoding** - 使用的编码。默认为 'utf8' 。

  根据 encoding 的字符编码写入 string 到 buf 中的 offset 位置。 length 参数是写入的字节数。 如果 buf 没有足够的空间保存整个字符串，则只会写入 string 的一部分。 只部分解码的字符不会被写入。

  返回实际写入的大小。如果 buffer 空间不足， 则只会写入部分字符串。

  ```javascript
  let buf = Buffer.alloc(256);
  console.log("len is ", buf.write("hello nodejs"));
  console.log(buf);
  console.log(String.fromCharCode(buf[0]));
  ```

  ```shell
  len is  12
  <Buffer 68 65 6c 6c 6f 20 6e 6f 64 65 6a 73 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... >
  h
  ```

- 读：

  ```javascript
  buf.toString([encoding[, start[, end]]]);
  ```

  参数描述如下：

  - **encoding** - 使用的编码。默认为 'utf8' 。
  - **start** - 指定开始读取的索引位置，默认为 0。
  - **end** - 结束位置，默认为缓冲区的末尾。

  解码缓冲区数据并使用指定的编码返回字符串。

  ```javascript
  let buf = Buffer.alloc(20);
  
  for (let i = 0; i < buf.length; i++) {
      buf[i] = i+97;
  }
  
  console.log(buf.toString('utf-8'));
  ```

  ```shell
  abcdefghijklmnopqrst
  ```

  也可以当做数组使用，数组里的元素长度为1字节。

### 其他方法

- json : `buf.toJSON()`， 当字符串化一个 Buffer 实例时，[JSON.stringify()](http://www.runoob.com/js/javascript-json-stringify.html) 会隐式地调用该 **toJSON()**。

  ```javascript
  let buf = Buffer.from([1, 2, 3, 4, 5]);
  
  let json = JSON.stringify(buf);
  console.log(json);
  
  let copy = JSON.parse(json, (key, value) => {
      return value && value.type == 'Buffer' ? Buffer.from(value.data) : value;
  });
  
  console.log(copy);
  ```

  ```shell
  {"type":"Buffer","data":[1,2,3,4,5]}
  <Buffer 01 02 03 04 05>
  ```

- 连接：Buffer.concat(list[, totalLength])

  参数描述如下：

  - **list** - 用于合并的 Buffer 对象数组列表。
  - **totalLength** - 指定合并后Buffer对象的总长度。

  返回一个多个成员合并的新 Buffer 对象。

  ```javascript
  let buf1 = Buffer.from('hello');
  let buf2 = Buffer.from([1, 2, 3]);
  
  let buf3 = Buffer.concat([buf1, buf2]);
  
  console.log(buf3);
  ```

  ```shell
  <Buffer 68 65 6c 6c 6f 01 02 03>
  ```

- 比较：buf.compare(otherBuffer);

  参数描述如下：

  - **otherBuffer** - 与 **buf** 对象比较的另外一个 Buffer 对象

  返回一个数字，表示 **buf** 在 **otherBuffer** 之前，之后或相同。

  ```javascript
  let buf1 = Buffer.from('hello');
  let buf2 = Buffer.from([1, 2, 3]);
  
  console.log(buf1.compare(buf2));
  ```

  ```shell
  1
  ```

- 拷贝：buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])

  参数描述如下：

  - **targetBuffer** - 要拷贝的 Buffer 对象。
  - **targetStart** - 数字, 可选, 默认: 0
  - **sourceStart** - 数字, 可选, 默认: 0
  - **sourceEnd** - 数字, 可选, 默认: buffer.length

  ```javascript
  var buf1 = Buffer.from('abcdefghijkl');
  var buf2 = Buffer.from('RUNOOB');
  
  //将 buf2 插入到 buf1 指定位置上
  buf2.copy(buf1, 2, 2, 4);
  
  console.log(buf1.toString());
  ```

  ```shell
  abNOefghijkl
  ```

- slice和数组一样。



## Stream

Stream 是一个抽象接口，Node 中有很多对象实现了这个接口。例如，对http 服务器发起请求的request 对象就是一个 Stream，还有stdout（标准输出）。

Node.js，Stream 有四种流类型：

- **Readable** - 可读操作。
- **Writable** - 可写操作。
- **Duplex** - 可读可写操作.
- **Transform** - 操作被写入数据，然后读出结果。

所有的 Stream 对象都是 EventEmitter 的实例。常用的事件有：

- **data** - 当有数据可读时触发。
- **end** - 没有更多的数据可读时触发。
- **error** - 在接收和写入过程中发生错误时触发。
- **finish** - 所有数据已被写入到底层系统时触发。



下面以文件流为例：

### 读

```javascript
let fs = require("fs");
let data = '';

let rdStream = fs.createReadStream("hello.js");

rdStream.on('data', (chunk) => {
    data += chunk;
});

rdStream.on("end", () => {
    console.log(data);
});

rdStream.on("error", (err) => {
    console.log(err);
});

console.log("结束");
```

```shell
结束
/******************************************    *******************************

      > File Name: hello.js

      > Author: Ywl

      > Descripsion:

      > Created Time:     Mon 12 Mar 2018 05:59:02 PM PDT

      > Modify Time:

 *********************************    ***************************************/
console.log("%s, %d", "Hello world!", 2018);
```

### 写

```shell
let fs = require("fs");
let wrStream = fs.createWriteStream('output.txt');

wrStream.write('hello nodejs', 'utf-8');

wrStream.end();

wrStream.on('finish', () => {
    console.log('写完了');
});

console.log('结束');
```

磁盘中出多了output.txt文件:

hello nodejs

### 管道流

从一个地方流到另一个地方

```javascript
let fs = require("fs");
let rd = fs.createReadStream('hello.js');
let wr = fs.createWriteStream('output.txt');

rd.pipe(wr);
```

output.txt

```
/******************************************    *******************************

      > File Name: hello.js

      > Author: Ywl

      > Descripsion:

      > Created Time:     Mon 12 Mar 2018 05:59:02 PM PDT

      > Modify Time: 

 *********************************    ***************************************/
console.log("%s, %d", "Hello world!", 2018);
```





## 文件系统

Node.js 提供一组类似 UNIX（POSIX）标准的文件操作API。 Node 导入文件系统模块(fs)语法如下所示：

`var fs = require("fs");`

Node.js 文件系统（fs 模块）模块中的方法均有异步和同步版本，例如读取文件内容的函数有异步的 fs.readFile() 和同步的 fs.readFileSync()。

异步的方法函数最后一个参数为回调函数，回调函数的第一个参数包含了错误信息(error)。

建议大家使用异步方法，比起同步，异步方法性能更高，速度更快，而且没有阻塞。

### 读文件

```javascript
var fs = require('fs');

fs.readFile('hello.js', 'utf-8', function(err, data){
    console.log("异步");
    if(err){
        console.error(err);
    }
    else if(data){
        console.log(data);
    }
});

let data = fs.readFileSync('hello.js');
console.log(data.toString());

console.log('end');     /* print 'end' before 'err' or 'data' */
```

```shell
/******************************************    *******************************

      > File Name: hello.js

      > Author: Ywl

      > Descripsion:

      > Created Time:     Mon 12 Mar 2018 05:59:02 PM PDT

      > Modify Time:

 *********************************    ***************************************/
console.log("%s, %d", "Hello world!", 2018);

end
异步
/******************************************    *******************************

      > File Name: hello.js

      > Author: Ywl

      > Descripsion:

      > Created Time:     Mon 12 Mar 2018 05:59:02 PM PDT

      > Modify Time:

 *********************************    ***************************************/
console.log("%s, %d", "Hello world!", 2018);
```

### 打开文件

`fs.open(path, flags[, mode], callback)`。

参数使用说明如下：

- **path** - 文件的路径。
- **flags** - 文件打开的行为。
- **mode** - 设置文件模式(权限)，文件创建默认权限为 0666(可读，可写)。
- **callback** - 回调函数，带有两个参数如：callback(err, fd)。

flags 参数可以是以下值：

| Flag | 描述                                                   |
| ---- | ------------------------------------------------------ |
| r    | 以读取模式打开文件。如果文件不存在抛出异常。           |
| r+   | 以读写模式打开文件。如果文件不存在抛出异常。           |
| rs   | 以同步的方式读取文件。                                 |
| rs+  | 以同步的方式读取和写入文件。                           |
| w    | 以写入模式打开文件，如果文件不存在则创建。             |
| wx   | 类似 'w'，但是如果文件路径存在，则文件写入失败。       |
| w+   | 以读写模式打开文件，如果文件不存在则创建。             |
| wx+  | 类似 'w+'， 但是如果文件路径存在，则文件读写失败。     |
| a    | 以追加模式打开文件，如果文件不存在则创建。             |
| ax   | 类似 'a'， 但是如果文件路径存在，则文件追加失败。      |
| a+   | 以读取追加模式打开文件，如果文件不存在则创建。         |
| ax+  | 类似 'a+'， 但是如果文件路径存在，则文件读取追加失败。 |

```javascript
var fs = require("fs");

// 异步打开文件
console.log("准备打开文件！");
fs.open('input.txt', 'r+', function(err, fd) {
   if (err) {
       return console.error(err);
   }
  console.log("文件打开成功！");     
});
```

### 写文件

`fs.writeFile(file, data[, options], callback)`.

writeFile 直接打开文件默认是 **w** 模式，所以如果文件存在，该方法写入的内容会覆盖旧的文件内容。

参数使用说明如下：

- **file** - 文件名或文件描述符。
- **data** - 要写入文件的数据，可以是 String(字符串) 或 Buffer(缓冲) 对象。
- **options** - 该参数是一个对象，包含 {encoding, mode, flag}。默认编码为 utf8, 模式为 0666 ， flag 为 'w'
- **callback** - 回调函数，回调函数只包含错误信息参数(err)，在写入失败时返回。

```javascript
var fs = require("fs");

console.log("准备写入文件");
fs.writeFile('input.txt', '我是通 过fs.writeFile 写入文件的内容',  function(err) {
   if (err) {
       return console.error(err);
   }
   console.log("数据写入成功！");
   console.log("--------我是分割线-------------")
   console.log("读取写入的数据！");
   fs.readFile('input.txt', function (err, data) {
      if (err) {
         return console.error(err);
      }
      console.log("异步读取文件数据: " + data.toString());
   });
});
```

### 异步模式下的文件操作

下面的函数用法类似于c语言里面的文件操作，基于文件描述符。

- 读：

  ```JavaScript
  fs.read(fd, buffer, offset, length, position, callback)；
  ```

  参数使用说明如下：

  - **fd** - 通过 fs.open() 方法返回的文件描述符。
  - **buffer** - 数据写入的缓冲区。
  - **offset** - 缓冲区写入的写入偏移量。
  - **length** - 要从文件中读取的字节数。
  - **position** - 文件读取的起始位置，如果 position 的值为 null，则会从当前文件指针的位置读取。
  - **callback** - 回调函数，有三个参数err, bytesRead, buffer，err 为错误信息， bytesRead 表示读取的字节数，buffer 为缓冲区对象。

  ```javascript
  var fs = require("fs");
  var buf = new Buffer.alloc(1024);
  
  console.log("准备打开已存在的文件！");
  fs.open('input.txt', 'r+', function(err, fd) {
     if (err) {
         return console.error(err);
     }
     console.log("文件打开成功！");
     console.log("准备读取文件：");
     fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
        if (err){
           console.log(err);
        }
        console.log(bytes + "  字节被读取");
        
        // 仅输出读取的字节
        if(bytes > 0){
           console.log(buf.slice(0, bytes).toString());
        }
     });
  });
  ```

...更多参考[File System](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback)

以下为 Node.js 文件模块相同的方法列表：

| 序号 | 方法 & 描述                                                  |
| ---- | ------------------------------------------------------------ |
| 1    | **fs.rename(oldPath, newPath, callback)** 异步 rename().回调函数没有参数，但可能抛出异常。 |
| 2    | **fs.ftruncate(fd, len, callback)** 异步 ftruncate().回调函数没有参数，但可能抛出异常。 |
| 3    | **fs.ftruncateSync(fd, len)** 同步 ftruncate()               |
| 4    | **fs.truncate(path, len, callback)** 异步 truncate().回调函数没有参数，但可能抛出异常。 |
| 5    | **fs.truncateSync(path, len)** 同步 truncate()               |
| 6    | **fs.chown(path, uid, gid, callback)** 异步 chown().回调函数没有参数，但可能抛出异常。 |
| 7    | **fs.chownSync(path, uid, gid)** 同步 chown()                |
| 8    | **fs.fchown(fd, uid, gid, callback)** 异步 fchown().回调函数没有参数，但可能抛出异常。 |
| 9    | **fs.fchownSync(fd, uid, gid)** 同步 fchown()                |
| 10   | **fs.lchown(path, uid, gid, callback)** 异步 lchown().回调函数没有参数，但可能抛出异常。 |
| 11   | **fs.lchownSync(path, uid, gid)** 同步 lchown()              |
| 12   | **fs.chmod(path, mode, callback)** 异步 chmod().回调函数没有参数，但可能抛出异常。 |
| 13   | **fs.chmodSync(path, mode)** 同步 chmod().                   |
| 14   | **fs.fchmod(fd, mode, callback)** 异步 fchmod().回调函数没有参数，但可能抛出异常。 |
| 15   | **fs.fchmodSync(fd, mode)** 同步 fchmod().                   |
| 16   | **fs.lchmod(path, mode, callback)** 异步 lchmod().回调函数没有参数，但可能抛出异常。Only available on Mac OS X. |
| 17   | **fs.lchmodSync(path, mode)** 同步 lchmod().                 |
| 18   | **fs.stat(path, callback)** 异步 stat(). 回调函数有两个参数 err, stats，stats 是 fs.Stats 对象。 |
| 19   | **fs.lstat(path, callback)** 异步 lstat(). 回调函数有两个参数 err, stats，stats 是 fs.Stats 对象。 |
| 20   | **fs.fstat(fd, callback)** 异步 fstat(). 回调函数有两个参数 err, stats，stats 是 fs.Stats 对象。 |
| 21   | **fs.statSync(path)** 同步 stat(). 返回 fs.Stats 的实例。    |
| 22   | **fs.lstatSync(path)** 同步 lstat(). 返回 fs.Stats 的实例。  |
| 23   | **fs.fstatSync(fd)** 同步 fstat(). 返回 fs.Stats 的实例。    |
| 24   | **fs.link(srcpath, dstpath, callback)** 异步 link().回调函数没有参数，但可能抛出异常。 |
| 25   | **fs.linkSync(srcpath, dstpath)** 同步 link().               |
| 26   | **fs.symlink(srcpath, dstpath[, type], callback)** 异步 symlink().回调函数没有参数，但可能抛出异常。 type 参数可以设置为 'dir', 'file', 或 'junction' (默认为 'file') 。 |
| 27   | **fs.symlinkSync(srcpath, dstpath[, type])** 同步 symlink(). |
| 28   | **fs.readlink(path, callback)** 异步 readlink(). 回调函数有两个参数 err, linkString。 |
| 29   | **fs.realpath(path[, cache], callback)** 异步 realpath(). 回调函数有两个参数 err, resolvedPath。 |
| 30   | **fs.realpathSync(path[, cache])** 同步 realpath()。返回绝对路径。 |
| 31   | **fs.unlink(path, callback)** 异步 unlink().回调函数没有参数，但可能抛出异常。 |
| 32   | **fs.unlinkSync(path)** 同步 unlink().                       |
| 33   | **fs.rmdir(path, callback)** 异步 rmdir().回调函数没有参数，但可能抛出异常。 |
| 34   | **fs.rmdirSync(path)** 同步 rmdir().                         |
| 35   | **fs.mkdir(path[, mode], callback)** S异步 mkdir(2).回调函数没有参数，但可能抛出异常。 访问权限默认为 0777。 |
| 36   | **fs.mkdirSync(path[, mode])** 同步 mkdir().                 |
| 37   | **fs.readdir(path, callback)** 异步 readdir(3). 读取目录的内容。 |
| 38   | **fs.readdirSync(path)** 同步 readdir().返回文件数组列表。   |
| 39   | **fs.close(fd, callback)** 异步 close().回调函数没有参数，但可能抛出异常。 |
| 40   | **fs.closeSync(fd)** 同步 close().                           |
| 41   | **fs.open(path, flags[, mode], callback)** 异步打开文件。    |
| 42   | **fs.openSync(path, flags[, mode])** 同步 version of fs.open(). |
| 43   | **fs.utimes(path, atime, mtime, callback)**                  |
| 44   | **fs.utimesSync(path, atime, mtime)** 修改文件时间戳，文件通过指定的文件路径。 |
| 45   | **fs.futimes(fd, atime, mtime, callback)**                   |
| 46   | **fs.futimesSync(fd, atime, mtime)** 修改文件时间戳，通过文件描述符指定。 |
| 47   | **fs.fsync(fd, callback)** 异步 fsync.回调函数没有参数，但可能抛出异常。 |
| 48   | **fs.fsyncSync(fd)** 同步 fsync.                             |
| 49   | **fs.write(fd, buffer, offset, length[, position], callback)** 将缓冲区内容写入到通过文件描述符指定的文件。 |
| 50   | **fs.write(fd, data[, position[, encoding]], callback)** 通过文件描述符 fd 写入文件内容。 |
| 51   | **fs.writeSync(fd, buffer, offset, length[, position])** 同步版的 fs.write()。 |
| 52   | **fs.writeSync(fd, data[, position[, encoding]])** 同步版的 fs.write(). |
| 53   | **fs.read(fd, buffer, offset, length, position, callback)** 通过文件描述符 fd 读取文件内容。 |
| 54   | **fs.readSync(fd, buffer, offset, length, position)** 同步版的 fs.read. |
| 55   | **fs.readFile(filename[, options], callback)** 异步读取文件内容。 |
| 56   | **fs.readFileSync(filename[, options])**                     |
| 57   | **fs.writeFile(filename, data[, options], callback)** 异步写入文件内容。 |
| 58   | **fs.writeFileSync(filename, data[, options])** 同步版的 fs.writeFile。 |
| 59   | **fs.appendFile(filename, data[, options], callback)** 异步追加文件内容。 |
| 60   | **fs.appendFileSync(filename, data[, options])** The 同步 version of fs.appendFile. |
| 61   | **fs.watchFile(filename[, options], listener)** 查看文件的修改。 |
| 62   | **fs.unwatchFile(filename[, listener])** 停止查看 filename 的修改。 |
| 63   | **fs.watch(filename[, options][, listener])** 查看 filename 的修改，filename 可以是文件或目录。返回 fs.FSWatcher 对象。 |
| 64   | **fs.exists(path, callback)** 检测给定的路径是否存在。       |
| 65   | **fs.existsSync(path)** 同步版的 fs.exists.                  |
| 66   | **fs.access(path[, mode], callback)** 测试指定路径用户权限。 |
| 67   | **fs.accessSync(path[, mode])** 同步版的 fs.access。         |
| 68   | **fs.createReadStream(path[, options])** 返回ReadStream 对象。 |
| 69   | **fs.createWriteStream(path[, options])** 返回 WriteStream 对象。 |
| 70   | **fs.symlink(srcpath, dstpath[, type], callback)** 异步 symlink().回调函数没有参数，但可能抛出异常。 |



## 网络编程

在 Node.js 模块库中有很多好用的模块。接下来我们为大家介绍几种常用模块的使用：

| 序号 | 模块名 & 描述                                                |
| ---- | ------------------------------------------------------------ |
| 1    | [**OS 模块**](http://www.runoob.com/nodejs/nodejs-os-module.html) 提供基本的系统操作函数。 |
| 2    | [**Path 模块**](http://www.runoob.com/nodejs/nodejs-path-module.html) 提供了处理和转换文件路径的工具。 |
| 3    | [**Net 模块**](http://www.runoob.com/nodejs/nodejs-net-module.html) 用于底层的网络通信。提供了服务端和客户端的的操作。 |
| 4    | [**DNS 模块**](http://www.runoob.com/nodejs/nodejs-dns-module.html) 用于解析域名。 |
| 5    | [**Domain 模块**](http://www.runoob.com/nodejs/nodejs-domain-module.html) 简化异步代码的异常处理，可以捕捉处理try catch无法捕捉的。 |



## 多进程

我们都知道 Node.js 是以单线程的模式运行的，但它使用的是事件驱动来处理并发，这样有助于我们在多核 cpu 的系统上创建多个子进程，从而提高性能。

每个子进程总是带有三个流对象：child.stdin, child.stdout 和child.stderr。他们可能会共享父进程的 stdio 流，或者也可以是独立的被导流的流对象。

Node 提供了 child_process 模块来创建子进程，方法有：

- **exec** - child_process.exec 使用子进程执行命令，缓存子进程的输出，并将子进程的输出以回调函数参数的形式返回。
- **spawn** - child_process.spawn 使用指定的命令行参数创建新进程。
- **fork** - child_process.fork 是 spawn()的特殊形式，用于在子进程中运行的模块，如 fork('./son.js') 相当于 spawn('node', ['./son.js']) 。与spawn方法不同的是，fork会在父进程与子进程之间，建立一个通信管道，用于进程之间的通信

### exec()

child_process.exec 使用子进程执行命令，缓存子进程的输出，并将子进程的输出以回调函数参数的形式返回。

语法如下所示：

```
child_process.exec(command[, options], callback)
```

参数说明如下：

**command：** 字符串， 将要运行的命令，参数使用空格隔开

**options ：对象，可以是：**

- cwd ，字符串，子进程的当前工作目录
- env，对象 环境变量键值对
- encoding ，字符串，字符编码（默认： 'utf8'）
- shell ，字符串，将要执行命令的 Shell（默认: 在 UNIX 中为`/bin/sh`， 在 Windows 中为`cmd.exe`， Shell 应当能识别 `-c`开关在 UNIX 中，或 `/s /c` 在 Windows 中。 在Windows 中，命令行解析应当能兼容`cmd.exe`）
- timeout，数字，超时时间（默认： 0）
- maxBuffer，数字， 在 stdout 或 stderr 中允许存在的最大缓冲（二进制），如果超出那么子进程将会被杀死 （默认: 200*1024）
- killSignal ，字符串，结束信号（默认：'SIGTERM'）
- uid，数字，设置用户进程的 ID
- gid，数字，设置进程组的 ID

**callback ：**回调函数，包含三个参数error, stdout 和 stderr。

exec() 方法返回最大的缓冲区，并等待进程结束，一次性返回缓冲区的内容。

让我们创建两个 js 文件 support.js 和 master.js。

support.js 文件代码：

```
console.log("进程 " + process.argv[2] + " 执行。" );
```

master.js 文件代码：

```javascript
const fs = require('fs');
const child_process = require('child_process');
 
for(var i=0; i<3; i++) {
    var workerProcess = child_process.exec('node support.js '+i, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });
 
    workerProcess.on('exit', function (code) {
        console.log('子进程已退出，退出码 '+code);
    });
}
```



执行以上代码，输出结果为：

```
$ node master.js 
子进程已退出，退出码 0
stdout: 进程 1 执行。

stderr: 
子进程已退出，退出码 0
stdout: 进程 0 执行。

stderr: 
子进程已退出，退出码 0
stdout: 进程 2 执行。

stderr: 
```

### spawn()

child_process.spawn 使用指定的命令行参数创建新进程，语法格式如下：

```
child_process.spawn(command[, args][, options])
```

参数说明如下：

**command：** 将要运行的命令

**args：** Array 字符串参数数组

**options Object**

- cwd String 子进程的当前工作目录
- env Object 环境变量键值对
- stdio Array|String 子进程的 stdio 配置
- detached Boolean 这个子进程将会变成进程组的领导
- uid Number 设置用户进程的 ID
- gid Number 设置进程组的 ID

spawn() 方法返回流 (stdout & stderr)，在进程返回大量数据时使用。进程一旦开始执行时 spawn() 就开始接收响应。

```javascript
const fs = require('fs');
const child_process = require('child_process');
 
for(var i=0; i<3; i++) {
   var workerProcess = child_process.spawn('node', ['support.js', i]);
 
   workerProcess.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
   });
 
   workerProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
   });
 
   workerProcess.on('close', function (code) {
      console.log('子进程已退出，退出码 '+code);
   });
}
```



### fork()

child_process.fork 是 spawn() 方法的特殊形式，用于创建进程，语法格式如下：

```
child_process.fork(modulePath[, args][, options])
```

参数说明如下：

**modulePath**： String，将要在子进程中运行的模块

**args**： Array 字符串参数数组

**options**：Object

- cwd String 子进程的当前工作目录
- env Object 环境变量键值对
- execPath String 创建子进程的可执行文件
- execArgv Array 子进程的可执行文件的字符串参数数组（默认： process.execArgv）
- silent Boolean 如果为`true`，子进程的`stdin`，`stdout`和`stderr`将会被关联至父进程，否则，它们将会从父进程中继承。（默认为：`false`）
- uid Number 设置用户进程的 ID
- gid Number 设置进程组的 ID

返回的对象除了拥有ChildProcess实例的所有方法，还有一个内建的通信信道。

```javascript
const fs = require('fs');
const child_process = require('child_process');
 
for(var i=0; i<3; i++) {
   var worker_process = child_process.fork("support.js", [i]);    
 
   worker_process.on('close', function (code) {
      console.log('子进程已退出，退出码 ' + code);
   });
}
```



## websocket

## express

### 简介

Express 是一个简洁而灵活的 node.js Web应用框架, 提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。

使用 Express 可以快速地搭建一个完整功能的网站。

Express 框架核心特性：

- 可以设置中间件来响应 HTTP 请求。
- 定义了路由表用于执行不同的 HTTP 请求动作。
- 可以通过向模板传递参数来动态渲染 HTML 页面。

### 安装

安装 Express 并将其保存到依赖列表中：

```
$ cnpm install express --save
```

以上命令会将 Express 框架安装在当前目录的 **node_modules** 目录中， **node_modules** 目录下会自动创建 express 目录。以下几个重要的模块是需要与 express 框架一起安装的：

- **body-parser** - node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。
- **cookie-parser** - 这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
- **multer** - node.js 中间件，用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。

```
$ cnpm install body-parser --save
$ cnpm install cookie-parser --save
$ cnpm install multer --save
```

安装完后，我们可以查看下 express 使用的版本号：

```
$ cnpm list express
/data/www/node
└── express@4.15.2  -> /Users/tianqixin/www/node/node_modules/.4.15.2@express
```

简单示例

```javascript
var express = require('express');
var app = express();
 
app.get('/', function (req, res) {
   res.send('Hello World');
})
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
```

