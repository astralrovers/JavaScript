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

### 创建项目

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