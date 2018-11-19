# BOM

## window对象

- 首先要清楚`window`对象，BOM 的核心对象是 window ，它表示浏览器的一个实例。在浏览器中， window 对象有双重角色，它既是通过 JavaScript 访问浏览器窗口的一个接口，又是 ECMAScript 规定的 Global 对象。这意味着在网页中定义的任何一个对象、变量和函数，都以 window 作为其 Global 对象，因此有权访问parseInt() 等方法。

- 由于 window 对象同时扮演着 ECMAScript中 Global 对象的角色，因此所有在全局作用域中声明
  的变量、函数都会变成 window 对象的属性和方法。

  ```javascript
  var age = 29;  // age是一个全局变量，所以它成为了window的属性
  function sayAge(){
      alert(this.age);   // 全局函数也是window的方法，所以这里的this是指向window对象的。
  }
  alert(window.age); //29
  sayAge(); //29
  window.sayAge(); //29
  ```

- 抛开全局变量会成为 window 对象的属性不谈，定义全局变量与在 window 对象上直接定义属性还是有一点差别：全局变量不能通过 delete 操作符删除，而直接在 window 对象上的定义的属性可以。

## 浏览器检测

- 检测浏览器当前的坐标`(x, y)`。`IE`、`Safari`、`Opera` 和 `Chrome` 都提供了`screenLeft `和 `screenTop `属性，分别用于表示窗口相对于屏幕左边和上边的位置。`Firefox` 则在`screenX `和 `screenY` 属性中提供相同的窗口位置信息，Safari 和 Chrome 也同时支持这两个属性。Opera虽然也支持 `screenX `和 `screenY `属性，但与`screenLeft` 和 `screenTop` 属性并不对应，因此建议大家不要在 `Opera `中使用它们。

  ```javascript
  var left_pos = (typeof window.screenLeft == "number") ?  // Opera 的screenX/Y的意思不同
                    window.screenLeft : window.screenX;
  var top_pos = (typeof window.screenTop == "number") ?
                    window.screenTop: window.screenY;
  
  console.log("left = [%d], top = [%d]", left_pos, top_pos);
  ```

- 使用 `moveTo()`和 `moveBy() `方法倒是有可能将窗口精确地移动到一个新位置。这两个方法都接收两个参数，其中`moveTo() `接收的是新位置的 `x` 和` y` 坐标值，而 `moveBy() `接收的是在水平和垂直方向上移动的像素数。

  ```javascript
  // 这两个方法貌似被禁用了，没效果
  window.moveTo(0, 0);
  window.moveBy(-90, 0);
  ```

- 窗口大小。`IE9+`、`Firefox`、`Safari`、`Opera `和` Chrome `均为此提供了 4个属性：` innerWidth` 、 `innerHeight` 、 `outerWidth `和` outerHeight` 。在 `IE9+`、`Safari`和`Firefox`中， `outerWidth` 和 `outerHeight `返回浏览器窗口本身的尺寸（无论是从最外层的 `window `对象还是从某个框架访问）。在`Opera`中，这两个属性的值表示页面视图容器 的大小。而`innerWidth `和` innerHeight`则表示该容器中页面视图区的大小（减去边框宽度）。在 `Chrome` 中， `outerWidth `、 `outerHeight` 与`innerWidth `、 `innerHeight` 返回相同的值，即视口`(viewport)`大小而非浏览器窗口大小。

  在 `IE`、`Firefox`、`Safari`、`Opera` 和 `Chrome `中， `document.documentElement.clientWidth `和`document.documentElement.clientHeight `中保存了页面视口的信息。在 `IE6 `中，这些属性必须在标准模式下才有效；如果是混杂模式，就必须通过 `document.body.clientWidth `和 `document.body.clientHeight` 取得相同信息。而对于混杂模式下的 `Chrome`，则无论通过 `document.documentEle-ment` 还是` document.body `中的` clientWidth `和` clientHeight `属性，都可以取得视口的大小。

  ```javascript
  var pageHeight = window.innerHeight;
  var pageWidth = window.innerWidth;
  
  if (typeof pageHeight == "number") {
      if (document.compatMode == "CSS1Compat") {  // 标准模式，所有浏览器都一样
          pageHeight = document.documentElement.clientHeight;
          pageWidth = document.documentElement.clientWidth;
      } else {  // 混杂模式，IE6用下面这些方式
          pageHeight = document.body.clientHeight;
          pageWidth = document.body.clientWidth;
      };
  }
  
  console.log("innerw = [%d], innerH = [%d]", pageWidth, pageHeight);
  ```

- 使用 `resizeTo() `和 `resizeBy() `方法可以调整浏览器窗口的大小。这两个方法都接收两个参数，其中 `resizeTo() `接收浏览器窗口的新宽度和新高度，而 `resizeBy() `接收新窗口与原窗口的宽度和高度之差。

  ```javascript
  //也会被禁用
  window.resizeTo(300, 300);
  window.resizeBy(400, 400);
  ```

## 导航和打开窗口

- 使用 `window.open() `方法既可以导航到一个特定的` URL`，也可以打开一个新的浏览器窗口。

  这个方法可以接收 4 个参数：要加载的 URL、窗口目标、一个特性字符串以及一个表示新页面是否取代浏览
  器历史记录中当前加载页面的布尔值。通常只须传递第一个参数，最后一个参数只在不打开新窗口的情况下使用。

  如果为 `window.open() `传递了第二个参数，而且该参数是已有窗口或框架的名称，那么就会在具有该名称的窗口或框架中加载第一个参数指定的 URL。

  ```javascript
  // 打开一个新的窗口
  // <a href="https://www.baidu.com" target="newFrame"></a>
  /*
   * 如果有一个名叫 "topFrame" 的窗口或者框架，就会在该窗口或框架加载这个 URL；否则，就
   * 会创建一个新窗口并将其命名为 "topFrame" 。此外，第二个参数也可以是下列任何一个特殊的窗口名
   * 称： _self 、 _parent 、 _top 或 _blank
   * */
  //window.open("https://www.baidu.com", "newFrame");
  var new_win = window.open("https://www.baidu.com");
  new_win.close();  // 仅适用于window.open打开的窗口
  ```

- 如果给` window.open() `传递的第二个参数并不是一个已经存在的窗口或框架，那么该方法就会根据在第三个参数位置上传入的字符串创建一个新窗口或新标签页。如果没有传入第三个参数，那么就会打开一个带有全部默认设置（工具栏、地址栏和状态栏等）的新浏览器窗口（或者打开一个新标签页——根据浏览器设置）。在不打开新窗口的情况下，会忽略第三个参数。

  | 设置       | 值        | 说明                                                         |
  | ---------- | --------- | ------------------------------------------------------------ |
  | fullscreen | yes 或 no | 表示浏览器窗口是否最大化。仅限IE                             |
  | height     | 数值      | 表示新窗口的高度。不能小于100                                |
  | left       | 数值      | 表示新窗口的左坐标。不能是负值                               |
  | location   | yes 或 no | 表示是否在浏览器窗口中显示地址栏。不同浏览器的默认值不同。如果设置为no，地址栏可能会隐藏，也可能会被禁用（取决于浏览器） |
  | menubar    | yes 或 no | 表示是否在浏览器窗口中显示菜单栏。默认值为 no                |
  | resizable  | yes 或 no | 表示是否可以通过拖动浏览器窗口的边框改变其大小。默认值为 no  |
  | scrollbars | yes 或 no | 表示如果内容在视口中显示不下，是否允许滚动。默认值为 no      |
  | status     | yes 或 no | 表示是否在浏览器窗口中显示状态栏。默认值为 no                |
  | toolbar    | yes 或 no | 表示是否在浏览器窗口中显示工具栏。默认值为 no                |
  | top        | 数值      | 表示新窗口的上坐标。不能是负值                               |
  | width      | 数值      | 表示新窗口的宽度。不能小于100                                |

  ```javascript
  window.open("http://www.wrox.com/","wroxWindow", 	"height=400,width=400,top=10,left=10,resizable=yes");
  ```

  另外通过`window.open()`打开的窗口是可以关闭的:

  ```javascript
  var new_win = window.open("https://www.baidu.com");
  new_win.close();  // 仅适用于window.open打开的窗口，但是我第一次调试的时候可以关闭，后面就没关闭了。
  ```

- 间歇调用和超时调用。`setTimeout()`和`setInterval()`其作用和名字是一致的。

  ```javascript
  setTimeout("alert('hello')", 1000);  // 不建议直接传字符串，损失性能
  
  var timeout_id = setTimeout(function () {  // 返回的是一个ID
      alert("hello");
  }, 1000);
  
  clearTimeout(timeout_id);  // 可以取消
  
  setInterval(str/func, 1000); // 与setTimeout一样的用法，表示多少时间间隔循环执行
  clearInterval(id);
  ```

- 系统对话框。

  ```javascript
  // 弹框
  /*
   * alert 警告
   * confirm 确认
   * prompt 提示
   * */
  alert("Hello");
  if (confirm("Are you sure?")) {
      alert("I am sure.");
  } else {
      alert("I am not sure.");
  }
  
  var result = prompt("Your name:", "");
  if (result !== null) {
      alert("Welcome " + result);
  }
  ```

  ![](D:\workspace\proj\github\learn\JavaScript\javascript\learn\bom_dom\Snipaste_2018-11-13_09-31-55.jpg)

  ![Snipaste_2018-11-13_09-32-47](D:\workspace\proj\github\learn\JavaScript\javascript\learn\bom_dom\Snipaste_2018-11-13_09-32-47.jpg)

  ![Snipaste_2018-11-13_09-33-58](D:\workspace\proj\github\learn\JavaScript\javascript\learn\bom_dom\Snipaste_2018-11-13_09-33-58.jpg)

## location对象

- `location `是最有用的 `BOM`对象之一，它提供了与当前窗口中加载的文档有关的信息，还提供了一
  些导航功能。事实上， `location` 对象是很特别的一个对象，因为它既是 `window `对象的属性，也是
  `document `对象的属性；换句话说， `window.location `和 `document.location `引用的是同一个对象。
  `location` 对象的用处不只表现在它保存着当前文档的信息，还表现在它将 `URL `解析为独立的片段，让
  开发人员可以通过不同的属性访问这些片段。

  ```javascript
  alert(window.location == document.location);  // true
  ```

  | 属性名   | 例子                 | 说明                                                         |
  | -------- | -------------------- | ------------------------------------------------------------ |
  | hash     | "#contents"          | 返回URL中的hash（#号后跟零或多个字符），如果URL
中不包含散列，则返回空字符串 |
  | host     | "www.wrox.com:80"    | 返回服务器名称和端口号（如果有）                             |
  | hostname | "www.wrox.com"       | 返回不带端口号的服务器名称                                   |
  | href     | "http:/www.wrox.com" | 返回当前加载页面的完整URL。而location对象的
<br/>toString()方法也返回这个值 |
  | pathname | "/WileyCDA/"         | 返回URL中的目录和（或）文件名                                |
  | port     | "8080"               | 返回URL中指定的端口号。如果URL中不包含端口号，则
<br/>这个属性返回空字符串 |
  | protocol | "http:"              | 返回页面使用的协议。通常是http:或https:                      |
  | search   | "?q=javascript"      | 返回URL的查询字符串。这个字符串以问号开头                    |

- 查询字符串参数。虽然通过上面的属性可以访问到 location 对象的大多数信息，但其中访问 URL 包含的查询字符串的属性并不方便。

  ```javascript
  function getQueryStringArgs() {
      // 取得查询字符串并去掉开头的?
      var qs = (location.search.length > 0 ? location.search.substring(1) : "");
      var args = {};
      var items = qs.length ? qs.split('&') : [];
      var item = null;
      var name = null;
      var val = null;
      var i = null;
      var len = items.length;
      for (i = 0; i < len; i++) {
          item = items[i].split('=');
          name = decodeURIComponent(item[0]);
          val = decodeURIComponent(item[1]);
  
          if (name.length) { args[name] = val; }
      }
      return args;
  }
  
  // 如果查询的字符串是 ?q=javascript&num=10，直接在URI后面添加字串就可以看到效果
  var args = getQueryStringArgs();
  alert(args["q"]);  // javascript
  alert(args["num"]);  // 10
  ```

- 位置操作。

  使用 location 对象可以通过很多方式来改变浏览器的位置。首先，也是最常用的方式，就是使用`assign()` 方法并为其传递一个 URL，如下所示:

  ```javascript
  location.assign("http://www.wrox.com");
  ```

  这样，就可以立即打开新` URL` 并在浏览器的历史记录中生成一条记录。如果是将` location.href`或 `window.location `设置为一个` URL `值，也会以该值调用 `assign() `方法。例如，下列两行代码与显式调用 `assign() `方法的效果完全一样。

  ```javascript
  window.location = "http://www.wrox.com";
  location.href = "http://www.wrox.com";
  ```

  另外，修改` location` 对象的其他属性也可以改变当前加载的页面。下面的例子展示了通过将 `hash `、`search` 、` hostname` 、` pathname `和 `port `属性设置为新值来改变 URL。

  ```javascript
  //假设初始 URL 为 http://www.wrox.com/WileyCDA/
  //将 URL 修改为"http://www.wrox.com/WileyCDA/#section1"
  location.hash = "#section1";
  //将 URL 修改为"http://www.wrox.com/WileyCDA/?q=javascript"
  location.search = "?q=javascript";
  //将 URL 修改为"http://www.yahoo.com/WileyCDA/"
  location.hostname = "www.yahoo.com";
  //将 URL 修改为"http://www.yahoo.com/mydir/"
  location.pathname = "mydir";
  //将 URL 修改为"http://www.yahoo.com:8080/WileyCDA/"
  location.port = 8080;
  ```

  当通过上述任何一种方式修改` URL` 之后，浏览器的历史记录中就会生成一条新记录，因此用户通过单击“后退”按钮都会导航到前一个页面。要禁用这种行为，可以使用` replace() `方法。这个方法只接受一个参数，即要导航到的` URL`；结果虽然会导致浏览器位置改变，但不会在历史记录中生成新记录。在调用` replace() `方法之后，用户不能回到前一个页面，来看下面的例子：

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>You won't be able to get back here</title>
    </head>
    <body>
      <p>Enjoy this page for a second, because you won't be coming back here.</p>
      <script type="text/javascript">
          setTimeout(function () {
              location.replace("http://www.wrox.com/");
          }, 1000);
      </script>
    </body>
  </html>
  ```

## navigator对象

  最早由 `Netscape Navigator 2.0`引入的 `navigator `对象，现在已经成为识别客户端浏览器的事实标准。

- 检测浏览器中是否安装了特定的插件是一种最常见的检测例程。对于非` IE `浏览器，可以使用`plugins `数组来达到这个目的。该数组中的每一项都包含下列属性。

  - `name`：插件名称
  - `description`：插件米描述
  - `filename`：插件的文件名
  - `length`：插件所处理的`MIME`类型数量。

  ```javascript
  function hasPlug(name) {
      name = name.toLowerCase();
      for (var i = 0; i < navigator.plugins.length; i++) {
          if (navigator.plugins[i].toLowerCase().indexOf(name) > -1) {
              return true;
          }
      }
      return false;
  }
  
  // 检测flash
  alert(hasPlug("Flash"));  // 但是我在Chrome中调用也没反应
  ```

  检测 IE 中的插件比较麻烦，因为 `IE `不支持` Netscape `式的插件。在 `IE `中检测插件的唯一方式就是使用专有的 `ActiveXObject` 类型，并尝试创建一个特定插件的实例。`IE` 是以 `COM`对象的方式实现插件的，而 `COM`对象使用唯一标识符来标识。因此，要想检查特定的插件，就必须知道其 `COM `标识符。例如，`Flash `的标识符是 `ShockwaveFlash.ShockwaveFlash `。知道唯一标识符之后，就可以编写类似下面的函数来检测` IE `中是否安装相应插件了。

  ```javascript
  //检测 IE 中的插件
  function hasIEPlugin(name){
      try {
          new ActiveXObject(name);
          return true;
      } catch (ex){
          return false;
      }
  }
  //检测 Flash
  alert(hasIEPlugin("ShockwaveFlash.ShockwaveFlash"));
  //检测 QuickTime
  alert(hasIEPlugin("QuickTime.QuickTime"));
  ```

## screen对象

  没啥用，JavaScript 中有几个对象在编程中用处不大，而 screen 对象就是其中之一。 screen 对象基本上只
用来表明客户端的能力，其中包括浏览器窗口外部的显示器的信息，如像素宽度和高度等。

## history对象

  history 对象保存着用户上网的历史记录，从窗口被打开的那一刻算起。因为 history 是 window对象的属性，因此每个浏览器窗口、每个标签页乃至每个框架，都有自己的 history 对象与特定的window 对象关联。出于安全方面的考虑，开发人员无法得知用户浏览过的 URL。不过，借由用户访问过的页面列表，同样可以在不知道实际 URL 的情况下实现后退和前进。

  使用 go() 方法可以在用户的历史记录中任意跳转，可以向后也可以向前。这个方法接受一个参数，表示向后或向前跳转的页面数的一个整数值。负数表示向后跳转（类似于单击浏览器的“后退”按钮），正数表示向前跳转（类似于单击浏览器的“前进”按钮）。来看下面的例子：

```javascript
//后退一页
history.go(-1);
//前进一页
history.go(1);
//前进两页
history.go(2);
```

也可以给 go() 方法传递一个字符串参数，此时浏览器会跳转到历史记录中包含该字符串的第一个位置——可能后退，也可能前进，具体要看哪个位置最近。如果历史记录中不包含该字符串，那么这个方法什么也不做，例如：

```javascript
//跳转到最近的 wrox.com 页面
history.go("wrox.com");
//跳转到最近的 nczonline.net 页面
history.go("nczonline.net");
```

另外，还可以使用两个简写方法 back() 和 forward() 来代替 go() 。顾名思义，这两个方法可以模仿浏览器的“后退”和“前进”按钮。

```javascript
//后退一页
history.back();
//前进一页
history.forward();
```

除了上述几个方法外， history 对象还有一个 length 属性，保存着历史记录的数量。这个数量包括所有历史记录，即所有向后和向前的记录。对于加载到窗口、标签页或框架中的第一个页面而言，history.length 等于 0。通过像下面这样测试该属性的值，可以确定用户是否一开始就打开了你的页面:

```javascript
if (history.length == 0){
    //这应该是用户打开窗口后的第一个页面
}
```

