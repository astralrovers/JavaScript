# `Nodejs`实战

## 开始一个`Node Web`程序

### 基本结构

典型的 Node Web程序是由下面几部分组成的：

- `package.json`—— 一个包含依赖项列表和运行这个程序的命令的文件；
- public/—— 静态资源文件夹，CSS和客户端 JavaScript都放在这里；
- node_modules/——项目的依赖项都会装到这里；
- 放程序代码的一个或多个 JavaScript文件。

程序代码一般又会分成下面几块：

- app.js或 index.js——设置程序的代码；
- models/——数据库模型；
- views/——用来渲染页面的模板；
- controllers/ 或 routes/——HTTP请求处理器；
- middleware/——中间件组件。

### 创建项目`express`

**我们先创建一个新项目`later`：**

```shell
mkdir later
cd later
#初始化一个项目，生成package.json
npm init -fy
#npm init --help
#npm init [--force|-f|--yes|-y]  就不用一步步填写了
```

`package.json`:

```json
{
  "name": "later",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

`test`是用来做测试的，我们可以使用`mocha`

**这里使用`express`来搭建服务器，首先安装：**

```shell
#之前学习nodejs基础时已经说过cnpm了
#保存在当前项目下
cnpm install express --save
#安装指定版本
#run npm install --save express@4.12.4
```

现在我们的目录下多了`node_modules`目录，并且`package.json`多了以下内容：

```json
  "dependencies": {
    "express": "^4.16.4"
  }
```

表示当前项目的依赖及其版本。

要卸载的话：

```shell
npm rm express --save
```

这个命令会把它从 node_modules/ 中删除，还会更新 package.json文件。

**简单的服务器**

Express 以 Node 自带的 http 模块为基础，致力于在 HTTP 请求和响应上来建模 Web 程序。

index.js:

```javascript
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Hello Nodejs and Express");
});

app.listen(port, () => {
    console.log(`Express web app available at localhost: ${port}`);
});
```

**解释下不理解的部分：**

- `process.env.PORT`

  即读取当前目录下环境变量port的值，设置方式：

  - `linux`：

    - 临时：`PORT=3001 nodejs index.js`
    - 不重启的话永久有效：`export PORT=1234`

  - windows:

    `set port=3000`

- `app.get`是`express`里面的路由，那么查看官方手册。

  - 这里对应`GET`方法
  - 第一个参数是路径
  - 第二个参数是中间件函数，以后再说中间件
  - 函数的两个参数，类似`Node`里的流，可做流操作：
    - `res`请求
    - `req`响应

**脚本启动**

在package.json里面添加以下代码：

```json
  "scripts": {
    "start" : "nodejs index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

以后运行` npm start`就行了。

不过呢由于每次修改代码都得重新启动，提供以下方式进行热加载：

```shell
 sudo cnpm install nodemon -g
 nodemon start
```

每次更改代码后都会自动重新启动服务。

### 关于RESTful

> 简单的说：RESTful是一种架构的规范与约束、原则，符合这种规范的架构就是RESTful架构。
>
> **REST 是面向资源的，这个概念非常重要，而资源是通过 URI 进行暴露。** 

先看REST是什么意思：

> 英文Representational state transfer 表述性状态转移 其实就是对**资源**的表述性状态转移。

**资源**是REST系统的核心概念，所有的设计都是以**资源**为中心。



最通俗理解：

**URL定位资源，用HTTP动词（GET,POST,DELETE,DETC）描述操作。**



**解释**：

- 表述性：就是指客户端请求一个资源，服务器拿到的这个资源，就是表述
- 资源的地址 在web中就是URI

**围绕资源进行 添加，获取，修改，删除，以及对符合特定条件的资源进行列表操作 ，针对资源设计接口。**

GET    用来获取资源，
POST  用来新建资源（也可以用于更新资源），
PUT    用来更新资源，
DELETE  用来删除资源



**RESTful 架构的核心规范与约束：统一接口**

分为四个子约束：

- 每个资源都拥有一个资源标识，每个资源的资源标识可以用来唯一地标明该资源（URI）

- 消息的自描述性（比如消息类型Content-type,length）

- 资源的自描述性（比如一个商品的描述，出产公司，名称...）

- HATEOAS Hypermedia As The Engine Of Application State(超媒体作为应用状态引擎)

  即客户只可以通过服务端所返回各结果中所包含的信息来得到下一步操作所需要的信息，如到底是向哪个URL发送请求等。也就是说，一个典型的REST服务不需要额外的文档标示通过哪些URL访问特定类型的资源，而是通过服务端返回的响应来标示到底能在该资源上执行什么样的操作。

目的：实现客户端无需借助任何文档即能调用到所有的服务器资源。

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: xxx

{
   "url" : "/api/categories/1",
   "label" : "Food",
   "items_url" : "/api/items?category=1",
   "brands" : [
         {
            "label" : "友臣",
            "brand_key" : "32073",
            "url" : "/api/brands/32073"
         }, {
            "label" : "乐事",
            "brand_key" : "56632",
            "url" : "/api/brands/56632"
         }
         ...
   ]
}
```



**资源的URL设计**

**1.通过URL来表示资源**

资源分为主资源与子资源

因为主资源是一类独立的资源 所以主资源应直接放在相对路径下：例如

若要表示主资源的实例：如果实例的ID=1，则这样表示： /goods/1

子资源：

一个实例的子资源可能是一个集合也可能是一个单一的子资源

子资源为图片集合：/goods/1/pictures

子资源为商品折扣的单子子资源：/goods/1/discount

**2.单数 vs. 复数**

获取用户1的信息，哪种方式更符合RESTful?

/api/users/1

/api/user/1

**3.相对路径 vs. 请求参数**

极光的RESTful API:

获取用户信息 GET /v1/users/{username} 参数放在路径中

VS

获取用户信息 GET /v1/users?username=xxxxx 拼接的方式

获取应用管理员列表 GET /v1/admins?start={start}&count={count} ？后拼接参数的方式：这种方式一般作为过滤资源

**4.使用合适的动词 get delete put post**

**URI都应该是名词，动作应该使用请求类型表示**

选择请求接口的方式： get delete

PUT 在服务器更新资源（客户端提供改变后的完整资源）。

POST 在服务器新建一个资源

**5.使用标准的状态码**

200-500，前端不需要根据0,1这种返回值来判断后端的逻辑处理结果，只根据状态码来判断请求结果。



**特征**

- 客户-服务器（Client-Server），提供服务的服务器和使用服务的客户需要被隔离对待。
- 无状态（Stateless），来自客户的每一个请求必须包含服务器处理该请求所需的所有信息(HTTP消息要描述清楚)。换句话说，服务器端不能存储来自某个客户的某个请求中的信息，并在该客户的其他请求中使用。
- 可缓存（Cachable），服务器必须让客户知道请求是否可以被缓存。（Ross：更详细解释请参考 理解本真的REST架构风格 以及 StackOverflow 的这个问题 中对缓存的解释。）
- 分层系统（Layered System），服务器和客户之间的通信必须被这样标准化：允许服务器和客户之间的中间层（Ross：代理，网关等）可以代替服务器对客户的请求进行回应，而且这些对客户来说不需要特别支持。
- 统一接口（Uniform Interface），客户和服务器之间通信的方法必须是统一化的。（Ross：GET,POST,PUT.DELETE, etc）
- 支持按需代码（Code-On-Demand，可选），服务器可以提供一些代码或者脚本（Ross：Javascrpt，flash，etc）并在客户的运行环境中执行。这条准则是这些准则中唯一不必必须满足的一条。（Ross：比如客户可以在客户端下载脚本生成密码访问服务器。）

**无状态（Stateless）**

> 所谓无状态的，即所有的资源，都可以通过URI定位，而且这个定位与其他资源无关，也不会因为其他资源的变化而改变。有状态和无状态的区别，举个简单的例子说明一下。如查询员工的工资，如果查询工资是需要登录系统，进入查询工资的页面，执行相关操作后，获取工资的多少，则这种情况是有状态的，因为查询工资的每一步操作都依赖于前一步操作，只要前置操作不成功，后续操作就无法执行；如果输入一个url即可得到指定员工的工资，则这种情况是无状态的，因为获取工资不依赖于其他资源或状态，且这种情况下，员工工资是一个资源，由一个url与之对应，可以通过HTTP中的GET方法得到资源，这是典型的RESTful风格。



目的是前后端分离，前端只负责展示和渲染，后端负责数据处理。

### 搭建一个RESTful Web服务

- POST /articles——创建新文章；
- GET /articles/:id——获取指定文章；
- GET /articles——获取所有文章；
- DELETE /articles/:id——删除指定文章。

```javascript
const express = require("express");
const app = express();

const articles = [
    {
        title:'Example'
    }
];

//const port = process.env.PORT || 3000;
app.set("port", process.env.PORT || 3000);

app.get("/articles", (req, res, next) => {
    res.send(articles);
});

app.post("/articles", (req, res, next) => {
    res.send("OK");
});

app.get("/articles/:id", (req, res, next) => {
    const id = req.params.id;
    console.log(`Fetching: ${id}`);
    res.send(articles[id]);
});

app.delete("/articles/:id", (req, res, next) => {
    const id = req.params.id;
    console.log(`Deleting: ${id}`);
    delete articles[id];
    res.send({message:'Deleted'});
});

app.get('/', (req, res) => {
    res.send("Hello Nodejs and Express");
});

app.listen(app.get('port'), () => {
    console.log(`Express web app available at localhost: ${app.get('port')}`);
});

module.exports = app;
```

部分知识点：

- `app.set("port", process.env.PORT || 3000);`，这里其实就是设置一个键值对，使用`app.get(name)`来取值:

  ```javascript
  app.set('title', 'My Site');
  app.get('title'); // "My Site"
  ```

  另外得话还可以设置其他一些特殊值：[官方手册](http://www.expressjs.com.cn/4x/api.html#app.set)

### 路由

`app.get()/post()...`方法，其实对应的是`HTTP`请求类型，这些请求类型被`express`分开了使用不同的接口处理，也就是路由。

**注意这里的`app.get()`方法和取键值的`app.get()`方法不是同一个，原型如下：**

```javascript
app.get(path, callback [, callback ...])
```

- path：可以是字符串路径:`/abd`
- 可以在字符串里使用正则表达式:`"/ab?d"`
- 也可以直接使用js的正则表达式匹配规则:`/\/abd/`
- 可以是参数形式:`/articles/:id`

先看下`req`我们可以看到官方文档里这样描述的：

> req对象表示HTTP请求，并具有请求查询字符串，参数，正文，HTTP标头等的属性。

看下`req`的内容：

```
app.get("/articles/:id", (req, res, next) => {
    const id = req.params.id;
    console.log(req);
    console.log(`Fetching: ${id}`);
    res.send(articles[id]);
});
```

访问`http://127.0.0.1:3000/articles/0`

内容非常多，所以列举几个常见的：

```json
 headers:
   { host: '127.0.0.1:3000',
     connection: 'keep-alive',
     'cache-control': 'max-age=0',
     'upgrade-insecure-requests': '1',
     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
     accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
     'accept-encoding': 'gzip, deflate, br',
     'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
     'if-none-match': 'W/"7-DwHtVqHjKgXl75bk13nzR4SvmpY"' 
   },
  url: '/articles/0',
  method: 'GET',
  statusCode: null,
  statusMessage: null,
    next: [Function: next],
  baseUrl: '',
  originalUrl: '/articles/0',
  _parsedUrl:
   Url {
     protocol: null,
     slashes: null,
     auth: null,
     host: null,
     port: null,
     hostname: null,
     hash: null,
     search: null,
     query: null,
     pathname: '/articles/0',
     path: '/articles/0',
     href: '/articles/0',
     _raw: '/articles/0' },
  params: { id: '0' },
  query: {},
  route:
   Route {
     path: '/articles/:id',
     stack: [ [Object] ],
     methods: { get: true } } }
```



>  所以呢这里的`id`指的就是参数，它被解析后存放在`req.params`里面，我们可以看下，这是个啥玩意儿:

```javascript
app.get("/articles/:id", (req, res, next) => {
    const id = req.params.id;
    console.log(req.params);
    console.log(`Fetching: ${id}`);
    res.send(articles[id]);
});
```

访问`http://127.0.0.1:3000/articles/title`

```javascript
{ id: '0' }
```

很明显这是一个对象。

> 另外挨着`params`的一个参数`query`，这个是啥呢：

比如我们最常见的使用`GET`方法提交表单：`127.0.0.1/article/1?name=nodejs&age=23`:

```javascript
app.get("/articles/:id", (req, res, next) => {
    const id = req.params.id;
    console.log(req.params);
    console.log(req.query);
    console.log(`Fetching: ${id}`);
    res.send(articles[id]);
});
```

```shell
{ id: '0' }
{ name: 'nodejs', age: '23' }
```

所以也是一个键值对，不过是**查询字符串**。



> `app.get()..`**后面的参数是多个回调函数**，其实这里到涉及中间件。

官方文档定义了这个函数：

- 一个中间件功能
- 一系列中间件函数，用逗号隔开
- 一系列中间件功能

那么啥是中间件功能呢？下一节介绍。

#### 使用`Router`管理路由

主要是用来管理大型程序的大量路径，进行分类管理。

Router 的官方描述是：

> Router 是一个独立于中间件和路由的实例，你可以将 Router 看作是只能执行执行中间件和路由的小型应用。而 Express 程序本身就内置了一个 Router 实例。
>
> Router 的行为与中间件类似，它可以通过 .use() 来调用其他的 Router 实例。
>
> 换句话就是，可以使用 Router 将应用划分为几个小的模块。虽然对于一些小型应用来说这样做可能是过度设计，但是一旦 app.js 中的路由扩张太快的话你就可以考虑使用 Router 进行模块拆分了。

```javascript
var express = require("express");
var path = require("path");
// 引入 API Router
var apiRouter = require("./routes/api_router");
var app = express();
var staticPath = path.resolve(__dirname, "static");
app.use(express.static(staticPath));
// API Router 文件的调用
app.use("/api", apiRouter);
app.listen(3000);
```

`Router`的使用和中间件非常相似，`Router`本身就是一个中间件，所有以`/api`开头的请求都会被转到`apiRouter`处理。

`api_router.js`：

```javascript
const express = require("express");

let api = express.Router();

api.get("/message", (req, res) => {
    res.end("message");
});

api.get("/users", (req, res) => {
    res.end("users");
});

module.exports = api;
```





### 中间件

在express中，中间件是非常重要的概念。一个请求，从浏览器发起，到服务端返回，生命周期大概是下面这样子：

> 浏览器发起请求 -> 服务端收到请求 -> 中间件A -> 中间件B -> ... -> 服务端返回

如果不了解也没关系，我们直接来看下，一个最简单中间件是什么样子的。

- req：请求对象。可以从中获取请求相关信息，比如访问地址等。（浏览器 --> 服务器）
- res：响应对象。可以向浏览器返回响应内容，比如返回HTML页面。（服务器 --> 浏览器）
- next：一个函数。目前仅需要知道，next() 被调用时，控制权就会从当前中间件，转移到下一个中间件。

```javascript
function(req, res, next){
    console.log('打印一些日志');
    next(); 
    // 如果不执行next(),那么程序会停在这儿直到超时，如果使用send()、end()等一些返回请求的函数，那么控制权就不会向下传递，认为此次请求结束了。
}
```

举例：

```javascript
var express = require('express');
var app = express();

app.get('/hello', function(req, res, next){
    console.log('打印访问日志');
    next();
});

app.get('/hello', function(req, res, next){
    console.log('假设我在访问数据库');
    next();
});

app.get('/hello', function(req, res, next){
    res.send('你好我是中间件！');
});

app.listen(3000);
```

那么结果如下：

```shell
# 浏览器显示
你好我是中间件！
# shell输出
打印访问日志
假设我在访问数据库
```

你也可以把它们写在一起（一系列）：

```javascript
app.get('/hello', function(req, res, next){
    console.log('打印访问日志');
    next();
}, function(req, res, next){
    console.log('假设我在访问数据库');
    next();
}, function(req, res, next){
    res.send('你好我是中间件！');
});
```

所以上边的回调函数都是中间件，只不过省略了`next`参数，而且在路由里面加中间件只会对当前的`URL`生效。

另外还有一种使用中间件的方式：

```javascript
app.use(midName);
```

```javascript
var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
app.use(function (req, res, next) {
    console.log("Request IP: " + req.url);
    console.log("Request date: " + new Date());
});
app.listen(3000, function () {
    console.log("App started on port 3000");
});
```

```javascript
Request IP: /
Request date: Wed Mar 13 2019 22:43:53 GMT+0800 (DST)
```

但是这里没有执行`next()`会卡住直到超时，使用这种方式添加中间件的话，每个请求都会执行这个中间件函数：

```javascript
app.use(function (req, res, next) {
    console.log("Request IP: " + req.url);
    console.log("Request date: " + new Date());
    next();
});

app.get("/hello", (req, res) => {
    console.log("hello mid");
    res.end("hello");
});

app.get("/world", (req, res) => {
    console.log("world mid");
    res.end("world");
});
```

```shell
Request IP: /hello
Request date: Wed Mar 13 2019 22:48:55 GMT+0800 (DST)
hello mid
Request IP: /world
Request date: Wed Mar 13 2019 22:49:03 GMT+0800 (DST)
world mid
```

关于`app.use()`用法以后在学习。

### 一点扩展

#### **`body-parser`**中间件

在http请求种，POST、PUT、PATCH三种请求方法中包含着请求体，也就是所谓的request，在Nodejs原生的http模块中，请求体是要基于流的方式来接受和解析。
 body-parser是一个HTTP请求体解析的中间件，使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体。

Node原生的http模块中，是将用户请求数据封装到了用于请求的对象req中，这个对象是一个IncomingMessage，该对象同时也是一个可读流对象。需要自己去解析。

Express框架默认使用body-parser作为请求体解析中间件。

```javascript
var bodyParser = require('body-parser');
// 解析 application/json
app.use(bodyParser.json()); 
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
```

这样就可以在项目的application级别，引入了body-parser模块处理请求体。在上述代码中，模块会处理application/x-www-form-urlencoded、application/json两种格式的请求体。经过这个中间件后，就可以在所有路由处理器的req.body中访问请求参数。



你也可以为不同的请求添加不同的解析方式：

```javascript
var express = require('express');
var bodyParser = require('body-parser');

var app = new express();

//创建application/json解析
var jsonParser = bodyParser.json();

//创建application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended: false});

//POST /login 中获取URL编码的请求体
app.post('/login', urlencodedParser, function(req, res){
    if(!req.body) return res.sendStatus(400);
    res.send('welcome, ' + req.body.username);
})

//POST /api/users 获取JSON编码的请求体
app.post('/api/users', jsonParser, function(req,res){
    if(!req.body) return res.sendStatus(400);
    //create user in req.body
})
```



也可以为不同的内容类型添加不同的解析方式：

```javascript
app.use(bodyParser.json({type: 'text/plain'}));
// 解析自定义的 JSON
app.use(bodyParser.json({ type: 'application/*+json' }));

// 解析自定义的 Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));

// 将 HTML 请求体做为字符串处理
app.use(bodyParser.text({ type: 'text/html' }));
```



当请求体解析之后，解析值会被放到req.body属性中，当内容为空时候，为一个空对象{}

| API                       | 作用           | 默认协议头                          |
| ------------------------- | -------------- | ----------------------------------- |
| `bodyParser.json()`       | 解析JSON格式   | `application/json`                  |
| `bodyParser.raw()`        | 解析二进制格式 | `application/raw`                   |
| `bodyParser.text()`       | 解析文本格式   | `text/plain`                        |
| `bodyParser.urlencoded()` | 解析文本格式   | `application/x-www-form-urlencoded` |

#### 时间中间件

```shell
cnpm install morgan --save
```

```javascript
var express = require("express");
var morgan = require("morgan");
...
var app = express();
app.use(morgan("short"));
...
```

```shell
::ffff:127.0.0.1 - GET /articles/0?name=js HTTP/1.1 200 19 - 32.275 ms
```

> 这里使用了 Morgan 中的 short 作为输出选项。当然你可以使用其他的选项设置：combined打印最多信息；tiny 打印最少的信息。

#### 静态文件中间件

`express`内置了一个静态文件中间件:`express.static`。(静态文件就是我们的静态资源:html， js， css...)

[更深入的内容](http://evanhahn.com/express-dot-static-deep-dive/)

```javascript
var staticPath = path.join(__dirname, "static"); // 设置静态文件的路径
app.use(express.static(staticPath)); // 使用express.static从静态路径提供服务
```

[官方参考](http://expressjs.com/zh-cn/starter/static-files.html)

这里用到了`path`和`__dirname`：

- `path`[简单参考](http://www.runoob.com/nodejs/nodejs-path-module.html)

  - 方法

  | 序号 | 方法 & 描述                                                  |
  | ---- | ------------------------------------------------------------ |
  | 1    | **path.normalize(p)** 规范化路径，注意'..' 和 '.'。          |
  | 2    | **path.join([path1][, path2][, ...])** 用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是"/"，Windows系统是"\"。 |
  | 3    | **path.resolve([from ...], to)** 将 **to** 参数解析为绝对路径，给定的路径的序列是从右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径。 例如，给定的路径片段的序列为：/foo、/bar、baz，则调用 path.resolve('/foo', '/bar', 'baz') 会返回 /bar/baz。`path.resolve('/foo/bar', './baz'); // 返回: '/foo/bar/baz'  path.resolve('/foo/bar', '/tmp/file/'); // 返回: '/tmp/file'  path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif'); // 如果当前工作目录为 /home/myself/node， // 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'` |
  | 4    | **path.isAbsolute(path)** 判断参数 **path** 是否是绝对路径。 |
  | 5    | **path.relative(from, to)** 用于将绝对路径转为相对路径，返回从 from 到 to 的相对路径（基于当前工作目录）。在 Linux 上：`path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'); // 返回: '../../impl/bbb'`在 Windows 上：`path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb'); // 返回: '..\\..\\impl\\bbb'` |
  | 6    | **path.dirname(p)** 返回路径中代表文件夹的部分，同 Unix 的dirname 命令类似。 |
  | 7    | **path.basename(p[, ext])** 返回路径中的最后一部分。同 Unix 命令 bashname 类似。 |
  | 8    | **path.extname(p)** 返回路径中文件的后缀名，即路径中最后一个'.'之后的部分。如果一个路径中并不包含'.'或该路径只包含一个'.' 且这个'.'为路径的第一个字符，则此命令返回空字符串。 |
  | 9    | **path.parse(pathString)** 返回路径字符串的对象。            |
  | 10   | **path.format(pathObject)** 从对象中返回路径字符串，和 path.parse 相反。 |

  - 属性

  | 序号 | 属性 & 描述                                                  |
  | ---- | ------------------------------------------------------------ |
  | 1    | **path.sep** 平台的文件路径分隔符，'\\' 或 '/'。             |
  | 2    | **path.delimiter** 平台的分隔符, ; or ':'.                   |
  | 3    | **path.posix** 提供上述 path 的方法，不过总是以 posix 兼容的方式交互。 |
  | 4    | **path.win32** 提供上述 path 的方法，不过总是以 win32 兼容的方式交互。 |

  - 实例

  创建 main.js 文件，代码如下所示：

  ```javascript
  var path = require("path");
  
  // 格式化路径
  console.log('normalization : ' + path.normalize('/test/test1//2slashes/1slash/tab/..'));
  
  // 连接路径
  console.log('joint path : ' + path.join('/test', 'test1', '2slashes/1slash', 'tab', '..'));
  
  // 转换为绝对路径
  console.log('resolve : ' + path.resolve('main.js'));
  
  // 路径中文件的后缀名
  console.log('ext name : ' + path.extname('main.js'));
  ```

  代码执行结果如下：

  ```shell
  $ node main.js 
  normalization : /test/test1/2slashes/1slash
  joint path : /test/test1/2slashes/1slash
  resolve : /web/com/1427176256_27423/main.js
  ext name : .js
  ```

- `__dirname`

  > `__dirname` 总是指向被执行 js 文件的绝对路径，所以当你在 `/d1/d2/myscript.js` 文件中写了 `__dirname`， 它的值就是 `/d1/d2`

#### 错误处理中间件

中间件种类：

- 包含三个参数的常规中间件函数（有时 next 会被忽略而只保留两个参数），而绝大多数时候程序中都是使用这种常规模式。

- 错误处理中间件：

  当你的 app 处于错误模式时，所有的常规中间件都会被跳过而直接执行 Express 错误处理中间件。想要进入错误模式，只需在调用 next 时附带一个参数。这是调用错误对象的一种惯例，例如：

  ```JavaScript
  next(new Error("Something badhappened!"))；
  ```

  > 错误处理中间件中需要四个参数，其中后面三个和常规形式的一致而第一个参数则是
  > next(new Error("Something bad happened!")) 中传递过来的 Error 对象。你可以像使用常规中间件一样来使用错误处理中间件，例如：调用 res.end 或者 next 。如果调用含参数的 next中间件会继续下一个错误处理中间件否则将会退出错误模式并调用下一个常规中间件。

  ```javascript
  app.use(function(err, req, res, next) {
  	// 记录错误
  	console.error(err);
  	// 继续到下一个错误处理中间件
  	next(err);
  });
  ```

  请记住，这些错误处理中间件不管所在位置如何它都只能通过带参 next 进行触发：

  ```javascript
  //需要在前一个中间件执行
  next(new Error("Something badhappened!"))；
  ```

#### 其他中间件

- cookie-parser
- compression



#### **`POSTMAN`**工具

[下载](https://www.getpostman.com/downloads/)

用于调试发各种http请求的。



#### **`curl`**工具

使用它来访问URL:

- curl http://localhost:3000/articles/0
- curl http://localhost:3000/articles
- curl -X DELETE http://localhost:3000/articles/0

### 视图与模板

> 模板的作用是为了使用同一个静态文件动态显示网页内容。

那么我们使用模板的用到**视图引擎**，它是用来将数据和模板结合起来渲染成一个完整页面的插件。

常用的视图引擎是`Pug`和`EJS`，模板语法的话都是大同小异的。这里我们使用`EJS`。

```shell
cnpm install ejs --save
#路径，用于静态资源
cnpm install path --save
```

先来运行一下:

`index.js`

```javascript
var express = require("express");
var path = require("path");
var app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));//规定了模板引擎的静态文件查找位置
app.get("/", function(req, res) {
    res.render("index");
});

app.listen(3000);
```

`mkdir views`

`views/index.ejs`(后缀必须是`ejs`):

```html
<!doctype html>
<html>
    <head>
        <title>express ejs</title>
    </head>
    <body>
        <p>Hello World</p>
    </body>
</html>
```

#### 静态文件

这里的示例使用原来的工程。

前面也提到过静态文件，不过具体使用还没有操作过，我们先来看一个例子:

我们想访问一张图片，第一种做法：

`127.0.0.1:3000/my.jpg`

`index.js`

```javascript
app.get("/my.jpg", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/my.jpg"));
});
```

但是呢，如果我们的图片是放在同一的地方，而我也不想暴露图片存放的真实路径：

`mv my.jpg imgs/`

```javascript
...
app.use(express.static(path.resolve(__dirname, "imgs")));
...

app.get("/my.jpg", (req, res) => {
    res.sendFile("my.jpg");
});
```

找文件时，会到`imgs`文件夹下面去寻找。

也可以使用多个:

```javascript
app.use(express.static(path.resolve(__dirname, "imgs")));
app.use(express.static(path.resolve(__dirname, "public")));
```

会按顺序来，找到了就返回。



不过如果说在不同的路径下存了相同文件名的不同资源，就会造成冲突，所以我们得对提供不同的路径去访问，但是就像前面提到的，不想暴露原始路径，那么我们可以提供不同的虚拟路径：

```javascript
app.use("/pictures", express.static(path.resolve(__dirname, "public")));
app.use("/public", express.static(path.resolve(__dirname, "public")));
```

**现在回到主题**

#### `EJS`讲解

[官网](https://ejs.bootcss.com/)

ejs的模板后缀为`.ejs`，不过也支持`.html`，需要设置:

```javascript
app.engine("html", ejs.renderFile);
```

`ejs`在`express`中使用注意点：

- 需要制定模板引擎:

  ```javascript
  app.set("view engine","/ejs");
  ```

- 配置模板路径：

  ```javascript
  app.set("views", path.resolve(__dirname, "views"));
  ```

- 渲染：

  ```javascript
  res.render(path,data);
  ```

  data则是模板需要的数据。

#### 使用完整的架构

```shell
cnpm install express-generator -g
```

 `express-generator` 可以快速创建一个应用的骨架。

通过`express -h`来查看帮助。

使用以下方式来创建项目：

```shell
express -e pro_web
```

```shell
➜  pro_web git:(master) ✗ tree
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.ejs
    └── index.ejs

7 directories, 8 files
```

安装依赖：

```shell
cnpm install
```

