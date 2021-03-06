# 学习设计模式

这里的设计模式是基于JavaScript，不过设计模式是一种方法、思想，不区分语言，只是实现问题。

另外，我同时也是一名C程序员，所以也会考虑C语言当中如何实现。

> **核心：设计模式的主题总是把不变的事物和变化的事物分离开来。**

## 单例模式

### 定义

**保证一个类仅有一个实例，并提供一个访问它的全局访问点。**

**解释**：

也就是说定义了一个类，但是这个类只能创建一个实例，这个实例只要被创建出来那就是唯一的，而且以后任何地方使用这个类来创建一个实例返回的都是之前创建的那个实例，而且这个实例在全局范围内都是可以访问的。

### 应用场景

当我们的程序中只需要一个用来表示特殊含义和用途的对象时就可以使用单例模式来保证该对象无论在何时都只会被创建一次，它的值在程序中的任何地方使用修改都是同步的。比如线程池、windows对象、登录窗和登录状态等等都是唯一的，全局同步的。代表的某个唯一事物的当前描述。

### 例子

```javascript
class Singletion {
    constructor(name) {
        this.name = name;
    }
}

function createAdmin(name) {
    if (!Singletion.instance) {
        // 将实例绑定到类上面，就可以通过类来获取是否已经创建该类实例的标志
        Singletion.instance = new Singletion(name);
    }
    return Singletion.instance; 
}

let admin1 = createAdmin("js");
let admin2 = createAdmin("node");

console.log(admin1 === admin2);
console.log("admin1 : ", admin1.name);
console.log("admin2 : ", admin2.name);
```

结果

```shell
true
admin1 :  js
admin2 :  js
```

C语言版：

```c
  #include <stdio.h>
  #include <stdbool.h>
  #include <stdlib.h>

  static char *create_admin(char *name) {
      static bool is_created = false;  // 使用一个静态变量来表示创建标志
      static char *admin = NULL;		// 保留创建对象
      if (!is_created) {
          admin = (char *)malloc(20);
          sprintf(admin, "%s", name);
          is_created = true;
      }
      return admin;
  }

  int main(int argc, char** argv) {
      char *admin1 = create_admin("javascript");
      char *admin2 = create_admin("c language");
      printf("%s\n", (admin1 == admin2) ? "true" : "false");
      printf("admin1 %s\n", admin1);
      printf("admin2 %s\n", admin2);
      return 0;
  }
/*
true
admin1 javascript
admin2 javascript
*/
```





不过这种模式去创建一个单例并不是特别理想，使用`new`关键字去创建实例会让人只管感受到得到的是一个实例，而不用像上边这种方式去关心函数的返回值是啥。

```javascript
class Singletion {
    constructor(name) {
        // 在构造函数里面讲实例绑定到类上
        if (!Singletion.instance) {
            this.name = name;
            Singletion.instance = this;
        }
        return Singletion.instance;
    }

    printName() {
        console.log(this.name);
    }
}

let admin1 = new Singletion("js");
let admin2 = new Singletion("node");

console.log(admin1 === admin2);
console.log("admin1 : ", admin1.name);
console.log("admin2 : ", admin2.name);

admin1.printName();
admin2.printName();
```

结果：

```shell
true
admin1 :  js
admin2 :  js
js
js
```

### 其他实现方式

但是有时候我们需要的可能并不是类实例，而是一个普通的对象，那么最简单的方式就是定义一个全局变量，然后定义一组访问它的接口。

```javascript
let admin = {
    _name : 'js',
    setName : (name) => {
        this._name = name;
    },
    getName : () => {
        return this._name;
    }
};
```

这样的话我们就只需要操作`admin`这个全局变量就好了。

C语言版:

```c
#include <stdio.h>

static char admin_name[20] = "admin";

static void set_admin_name(char *name) {
    sprintf(admin_name, "%s", name);
}

static char *get_admin_name(void) {
    return admin_name;
}

int main(int args, char** argv) {
    set_admin_name("javascript");
    printf("%s\n", get_admin_name());
    return 0;
}
```



但是呢我们应该避免过多地使用全局变量，应该更多地使用接口，这样对于代码维护是非常好的，因为相对来说数据和操作都是在一个整体里面的。

对于一些只读变量我们除了使用`const`表示，还可以使用闭包，来看看实现：

```JavaScript
let adminName = (function Singletion(name) {
    return () => {
        return name;
    };
})("javascript");

console.log(adminName()); // javascript
```

这样的话我们就只有一个接口。

## 策略模式

### 定义

**定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。**

对于`JavaScript`来说相互替换不是问题，因为不存在类型问题，但是对于静态语言比如`C`，必须要确定参数类型。

### 例子说明

比如年终奖的计算，那么定义如下：

- S级为月薪的4倍
- A级为月薪的3倍
- B级为月薪的2倍

那么实现代码如下：

```javascript
function calculateBonus(performanceLevel, salary) {
    if (performanceLevel == 'S') {
        return salary * 4;
    } else if (performanceLevel == 'A') {
        return salary * 3;
    } else if(performanceLevel == 'B') {
        return salary * 2;
    }
}
```

代码简单，但是存在如下缺陷：

- 过多的if-else，如果存在大量分支呢？
- 修改风险性，不管是增删if-else，还是改变某个等级的算法，都存在风险，没有**开放-封闭**的思想
- 如果某个算法在外部要复用呢？又得再写一个一样的？

那么结合上述缺点和**策略模式概念**解释：

- 我们发现改变的始终使我们输入的`performanceLevel`, `salary`，最终目的是得到年终奖结果
- 我们不关心底层如何实现，甚至于`S`级还有额外福利，那么每个等级相当于对应各自的算法，我们只需要根据等级去调用各自的算法策略，那么不管每个等级自己的算法如何实现都没关系。

一个基于策略模式的程序至少由两部分组成：

- 第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程
-  第二个部分是环境类 Context，Context接受客户的请求，随后把请求委托给某一个策略类
- 要做到这点，说明 Context中要维持对某个策略对象的引用

一个传统的实现：

```javascript
var Bonus = function(){
	this.salary = null; // 原始工资
	this.strategy = null; // 绩效等级对应的策略对象
};
Bonus.prototype.setSalary = function( salary ){
	this.salary = salary; // 设置员工的原始工资
};
Bonus.prototype.setStrategy = function( strategy ){
	this.strategy = strategy; // 设置员工绩效等级对应的策略对象
};
Bonus.prototype.getBonus = function(){ // 取得奖金数额
	return this.strategy.calculate( this.salary ); // 把计算奖金的操作委托给对应的策略对象
};

// 我们这儿只是拿到给策略和要给它的参数

var performanceS = function(){};
performanceS.prototype.calculate = function( salary ){
	return salary * 4;
};
var performanceA = function(){};
performanceA.prototype.calculate = function( salary ){
	return salary * 3;
};
var performanceB = function(){};
performanceB.prototype.calculate = function( salary ){
	return salary * 2;
};

// 定义一些列算法策略
```

es6的写法，也是传统面向对象语言对策略模式的一个实现:

```javascript
class Bonus {
    constructor(strategy = null) {
        this.strategy = strategy;
    }
    
    getBonus() {
        return this.strategy.calculate();
    }
}

//下面也可以不定义成对象，而是方法
class StrategyVir {
    //其实这里也可以不用传参，在调用下面函数的时候再传参，可以避免每次在使用的时候都必须重新定义一个对象
    constructor(salary) {
        this.salary = salary;
    }
    
    calculate() {
        return this.salary;
    }
}

class performanceS extends StrategyVir{
    constructor(salary) {
        super(salary);
    }
    calculate() {
        return this.salary * 4;
    }
}

class performanceA extends StrategyVir{
    constructor(salary) {
        super(salary);
    }
    calculate() {
        return this.salary * 3;
    }
}

class performanceB extends StrategyVir{
    constructor(salary) {
        super(salary);
    }
    calculate() {
        return this.salary * 2;
    }
}

let bonus = new Bonus(new performanceS(15000));
console.log("S : ", bonus.getBonus());

bonus.strategy = new performanceA(15000);
console.log("A : ", bonus.getBonus());

bonus.strategy = new performanceB(15000);
console.log("B : ", bonus.getBonus());

//S :  60000
//A :  45000
//B :  30000
```

**定义说得更详细一点，就是：定义一系列的算法，把它们各自封装成策略类，算法被封装在策略类内部的方法里。在客户对 Context发起请求的时候，Context总是把请求委托给这些策略对象中间的某一个进行计算。**



### JavaScript实现

像上边这种方式在使用时，我总得知道有`Bonus`对象和它的方法，并且也可能存在我只想通过等级直接得到结果，并不想知道要用哪些策略，我们可以定义成下面这种格式：

```javascript
let strategies = {
'S' : (salary) => {
    return salary * 4;
},
'A' : (salary) => {
    return salary * 3;
},
'B' : (salary) => {
    return salary * 2;
},
};

function calculateBonus(level, salary) {
    return strategies[level](salary);
}

console.log(calculateBonus('S', 15000));
```

这种方式就类似于策略组数据和调用策略的接口。

### 目的

策略模式的目的在于消除大量的分支，将每个策略封装成单独的一组算法，再使用同一个调度方式进行使用，每个策略互不相干，那么每个策略内部实现和修改就不影响了，对于增加也方便。

### 优缺点

- 策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句。
- 策略模式提供了对开放 — 封闭原则的完美支持，将算法封装在独立的 strategy 中，使得它们易于切换，易于理解，易于扩展。
- 策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作。
- 在策略模式中利用组合和委托来让 Context拥有执行算法的能力，这也是继承的一种更轻便的替代方案。



- 策略模式会在程序中增加许多策略类或者策略对象，但实际上这比把它们负责的逻辑堆砌在 Context中要好。
- 要使用策略模式，必须了解所有的 strategy ，必须了解各个 strategy 之间的不同点，这样才能选择一个合适的 strategy 。比如，我们要选择一种合适的旅游出行路线，必须先了解选择飞机、火车、自行车等方案的细节。此时 strategy 要向客户暴露它的所有实现，这是违反最少知识原则的。



对于`C`语言实现方式也是类似的，可以封装一组策略接口，然后在调度时传入某个策略；也可以将策略和其对应的主键存放的数组中，采用循环的方式去查找对应的策略。

## 代理模式

> **无法直接访问，或者不方便访问，或者直接访问效果不佳，可以采用中间人来做中转，我直接访问中间人，中间人帮我访问目标人。**

### 简单例子说明

小明像给暗恋的女神送花，但是他本人比较内向，又怕被拒绝，不过他和女神有一个共同的朋友翠花，那么小明就让翠花代自己送花给女神：

```javascript
let xiaoming = {
    sendFlower: (target) => {
        target.recvFlower("flower");
    }
};

let cuihua = {
    recvFlower: (flower) => {
        nvshen.recvFlower(flower);
    }
};

let nvshen = {
    recvFlower: (dongdong) => {
        console.log("女神是我， 我收到了屌丝送来的 ：" + dongdong);
    }
};

xiaoming.sendFlower(cuihua); // 女神是我， 我收到了屌丝送来的 ：flower
```

代码很简单，但是看起来繁琐， 没啥用。

但是如果说，女神心情好的时候送花，成功的概率很大，不过对于小明来说不知道女神啥时候心情好，翠花可能知道啊：

```javascript
let xiaoming = {
    sendFlower: (target) => {
        target.recvFlower("flower");
    }
};

let cuihua = {
    recvFlower: (flower) => {
        nvshen.listenGoodMood(() => {
            nvshen.recvFlower(flower);
        });
    }
};

let nvshen = {
    listenGoodMood: (fn) => {
        setTimeout(() => {
            console.log("本姑凉现在心情很不错。");
            fn();
        }, 1000)
    },
    recvFlower: (dongdong) => {
        console.log("女神是我， 我收到了屌丝送来的 ：" + dongdong);
    }
};

xiaoming.sendFlower(cuihua); // 女神是我， 我收到了屌丝送来的 ：flower
```

### 总结

代理模式常用在我们无法直接访问的情况，或者需要更优的访问效果时可使用代理模式。

## 发布订阅模式

> 发布—订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。在JavaScript 开发中，我们一般用事件模型来替代传统的发布—订阅模式。

这种模式的简单解释就是：

对于用户(订阅者)来说要得到某个信息并不需要时时刻刻去查看或者询问，只需要注册它想要知道什么，不用关心什么时候才能知道，对于发布者来说也不用管订阅者任何行为，只需要订阅者注册是否要的到某个信息，那么在信息更新的时候就通知订阅者就好了。

### 应用场景

- `AJAX`的回调函数
- 事件

都是只需要订阅注册，发布者会自动通知订阅者，那么也需要取消。

### 实例

`DOM`时间时最常见的，另外举个简单的现实例子：

​	小明最近看上了一套房子，到了售楼处之后才被告知，该楼盘的房子早已售罄。好在售楼MM告诉小明，不久后还有一些尾盘推出，开发商正在办理相关手续，手续办好后便可以购买。但到底是什么时候，目前还没有人能够知道。
​	于是小明记下了售楼处的电话，以后每天都会打电话过去询问是不是已经到了购买时间。除了小明，还有小红、小强、小龙也会每天向售楼处咨询这个问题。一个星期过后，售楼MM 决定辞职，因为厌倦了每天回答1000 个相同内容的电话。
​	当然现实中没有这么笨的销售公司，实际上故事是这样的：小明离开之前，把电话号码留在了售楼处。售楼MM 答应他，新楼盘一推出就马上发信息通知小明。小红、小强和小龙也是一样，他们的电话号码都被记在售楼处的花名册上，新楼盘推出的时候，售楼MM会翻开花名册，遍历上面的电话号码，依次发送一条短信来通知他们。

```javascript
// 售楼处
let salesOffices = {
    clientList : [], // 订阅者回调函数列表
    listen : function (key, fn) { // 注册订阅者
        this.clientList.push({key:key, fn:fn});
    },
    trigger : function (key, result) { // 发布消息
        for (let item of this.clientList) {
            if (item.key == key) {
                item.fn(key, result);
            }
        }
    }
};


salesOffices.listen('80', (key, result) => {
    console.log(`key = ${key}, result = ${result}`);
});

salesOffices.listen('100', (key, result) => {
    console.log(`key = ${key}, result = ${result}`);
});


// 手动触发
salesOffices.trigger('80', '有了');
salesOffices.trigger('100', '有了');

// key = 80, result = 有了
// key = 100, result = 有了
```



### 目的

- 解除对象之间的强耦合
- 开放闭合原则，复用性更强，可扩展性更强，更灵活

## 命令模式

> 有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么，此时希望用一种松耦合的方式来设计软件，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

### 例子说明

​	假设有一个快餐店，而我是该餐厅的点餐服务员，那么我一天的工作应该是这样的：当某位客人点餐或者打来订餐电话后，我会把他的需求都写在清单上，然后交给厨房，客人不用关心是哪些厨师帮他炒菜。我们餐厅还可以满足客人需要的定时服务，比如客人可能当前正在回家的路上，要求 1个小时后才开始炒他的菜，只要订单还在，厨师就不会忘记。客人也可以很方便地打电话来撤销订单。另外如果有太多的客人点餐，厨房可以按照订单的顺序排队炒菜。
​	这些记录着订餐信息的清单，便是命令模式中的命令对象。

```html
<button id="button1">点击按钮1</button>
<button id="button2">点击按钮2</button>
<button id="button3">点击按钮3</button>
```



```javascript
let button1 = document.getElementById('button1');
let button2 = document.getElementById('button2');
let button3 = document.getElementById('button3');


// 发送命令
let setCommand = function (button, command) {
    button.onclick = () => {
        command.execute();
    };
};

// 具体命令实现，也是命令的最终接受者
let MenuBar = {
    refresh : () => {
        console.log("刷新菜单目录");
    }
};

let SubMenu = {
    add : function () {
        console.log("增加子菜单");
    },
    del : function () {
        console.log("删除子菜单");
    }
};

// 封装，类似服务员
var RefreshMenuBarCommand = function( receiver ){
    this.receiver = receiver;
};

RefreshMenuBarCommand.prototype.execute = function(){
    this.receiver.refresh();
};

var AddSubMenuCommand = function( receiver ){
    this.receiver = receiver;
};

AddSubMenuCommand.prototype.execute = function(){
    this.receiver.add();
};

var DelSubMenuCommand = function( receiver ){
    this.receiver = receiver;
};

DelSubMenuCommand.prototype.execute = function(){
    console.log( '删除子菜单' );
};

// 最后就是把命令接收者传入到 command 对象中，并且把 command 对象安装到 button 上面：
var refreshMenuBarCommand = new RefreshMenuBarCommand( MenuBar );
var addSubMenuCommand = new AddSubMenuCommand( SubMenu );
var delSubMenuCommand = new DelSubMenuCommand( SubMenu );
// 这里最好不要直接使用回调函数，扩展性不强
setCommand( button1, refreshMenuBarCommand );
setCommand( button2, addSubMenuCommand );
setCommand( button3, delSubMenuCommand );
```

### 撤销与修改

上边的代码存在一些缺陷：

- 无法撤销
- 无法修改命令

那么我们最好使用类似命令列表的形式，把命令都添加到列表里管理起来，这样就有很大的可操作性：

- 可以修改
- 可以撤销
- 甚至可以控制执行时机，优先级

## 组合模式

> **组合模式**可以理解为层次的分级细化，类似一棵树，**从根到叶**。

比如上边的命令模式，如果说一个命令又是由多个子命令构成，那么多个命令就是由更多子命令构成，层层扩散细化。其实大多架构都符合这样一个原理：层级问题，从高到底层；从底层组合成整体。符合开放-闭合原则，增加删除互不干扰；对于用户来说我只需要第一层，后面的不用管，对于第一层来说，只关心第二层...

比如一个超级万能遥控器，一个开关就可以开启电视，空调，加湿器等等，但是底下可能说把所有开关功能都尝试了一遍。

### 优缺点

- 优点：
  - 层级明确，条理清晰
  - 扩展性好
- 缺点：
  - 系统开销增大，比如超级万能遥控器，所有开关都尝试过；而且如果经常只是用一个功能，效率就比较低了
  - 安全问题，如果某个环节错误，可能会影响整个系统



## 模板方法模式

> 模板方法模式是一种只需使用继承就可以实现的非常简单的模式。

模板方法模式由两部分结构组成：

- 第一部分是抽象父类
- 第二部分是具体的实现子类

通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

在模板方法模式中，子类实现中的相同部分被上移到父类中，而将不同的部分留待子类来实现。这也很好地体现了泛化的思想。

### 例子

一个经典的设计模式例子：咖啡和茶。

来看看流程：

- 咖啡：
  - 烧开水
  - 开水冲泡咖啡
  - 咖啡倒进杯子
  - 加糖和牛奶
- 茶：
  - 烧开水
  - 开水浸泡茶叶
  - 茶倒进杯子
  - 加柠檬

使用伪代码简单实现流程：

```javascript
class Coffee {
    constructor() {
        boilWater();
        brewCoffeeGriends();
        pourInCup();
        addSugarAndMilk();
    }
}
let coffee = new Coffee();

class Tea {
    constructor() {
        boilWater();
        steepTeaBag();
        pourInCup();
        addLemon();
    }
}
let tea = new Tea();
```

我们发现步骤都差不多，那么我们可以把咖啡和茶进行泛化抽象：

- 咖啡、茶统一称为*饮料*
- 冲泡、浸泡统一称为*泡*

- 加糖和牛奶、加柠檬统一称为*调料*

那么步骤抽象为：

- 烧水
- 泡饮料
- 饮料倒进杯子
- 加调料

代码实现：

- 抽象饮料

  ```javascript
  class Beverage {
      constructor() {}
      boilWater() {}
      brew() {}
      pourInCup() {}
      addCondiments() {}
      init() {
          this.boilWater();
          this.brew();
          this.pourInCup();
          this.addCondiments();
      }
  }
  ```

- 咖啡继承实现具体子类

  ```javascript
  class Coffee extends Beverage {
      constructor() {
          super();
      }
      boilWater() {
          console.log("烧开水");
      }
      brew() {
          console.log("冲泡咖啡");
      }
      pourInCup() {
          console.log("把咖啡倒进杯子");
      }
      addCondiments() {
          console.log("加糖和牛奶");
      }
  }
  
  let coffee = new Coffee();
  coffee.init();
  ```

- 茶继承实现具体子类

  ```javascript
  class Tea extends Beverage {
      constructor() {
          super();
      }
      boilWater() {
          console.log("烧开水");
      }
      brew() {
          console.log("浸泡茶叶");
      }
      pourInCup() {
          console.log("把茶倒进杯子");
      }
      addCondiments() {
          console.log("加柠檬");
      }
  }
  
  let tea = new Tea();
  tea.init();
  ```

### 重要说明

- 符合依赖倒置原则，这里讲到这个原则，就简单提一下：

  依赖倒置原则的三个要点：

  - 高层模块不依赖底层模块，两者都应该依赖其抽象。什么意思呢？即：

    - 高层模块可以理解为一个统一调用接口或对象，底层模块可以理解为具体实现某个功能的接口或对象

    - 高层模块调用底层模块时不应该指定调用某个具体的底层模块，因为这样局限性大大了，那要调用另一个底层模块怎么办呢?
    - 这里需要将所有具体底层接口或对象抽象为一个统一可以表示的接口或对象，每个具体底层接口或对象在实现时要继承于抽象接口或对象；高层模块在实现时只需要使用抽象接口或对象中包含的方法和属性即可；在调用高层模块时，只需要传入一个继承于抽象并且实现了抽象的属性和方法的底层模块实例即可；那么高层模块在调用底层模块时就不需要关心调用的是哪个底层模块了，因为他们都继承于同一个抽象，类型相同，具有相同属性和方法，只是实现各自具体功能而已，比如上述的咖啡和茶各自的方法。

  - 抽象不依赖于细节。即所有具体底层模块的抽象不应该和具体实现有任何关系。

  - 细节应该依赖于抽象。即具体底层模块应该继承于抽象，并且要实现抽象中的方法。

- 如何保证子类实现了抽象的方法呢？这里只说一种方式：

  ```javascript
  class Beverage {
      constructor() {}
      boilWater() {
          throw new Error("子类必须重写 boilWater 方法");
      }
      brew() { ... }
      pourInCup() { ... }
      addCondiments() { ... }
      init() {
          this.boilWater();
          this.brew();
          this.pourInCup();
          this.addCondiments();
      }
  }
  ```

  没实现就抛出异常，不过也只能在运行时才能体现出来。

## 职责链模式

> 职责链模式的定义是：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。



### 举例

职责链模式在生活中非常常见，比如期末考试的时候运气差的你被安排在了第一排的位置，结果你又不会做，只好向后面传小纸条求助，那么后面的同学不一定会，如果他好心呢，他会继续向后面传。

### 优缺点

- 对象在达成目的时不用关心最终是谁来完成这个任务，只关心它的下一个节点，将发出者和接受者进行解耦
- 对一个节点的更改不会影响其他节点
- 但是需要维护很多的节点，会造成系统浪费
- 而且也不能保证一定会完成

## 装饰者模式

> 学过`python`装饰器，那你就能很容易理解这个模式了，就是增强原来的对象，类，接口的功能，目前`JavaScript`的这个特性还在提案中。

## 状态模式

### 定义

> 允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。

- 第一部分的意思是将状态封装成独立的类，并将请求委托给当前的状态对象，当对象的内部状态改变时，会带来不同的行为变化。
- 第二部分是从客户的角度来看，我们使用的对象，在不同的状态下具有截然不同的行为，这个对象看起来是从不同的类中实例化而来的，实际上这是使用了委托的效果。

### 举例说明

有一个电灯，电灯只有一个开关。那么切换开关会有不同的效果。

```javascript
class Light {
    constructor() {
    	this.state = "off";  // 初始状态为关闭
    	this.button = null;  // 开关按钮
    }
    
    buttonWasPressed() {
        if (this.state === 'off') {
            console.log("开灯");
            this.state = 'on';
        } else if (this.state === 'on') {
            console.log('关灯');
            this.state = 'off';
        }
    }
}

let light = new Light();

light.buttonWasPressed();
light.buttonWasPressed();
```

但是呢，世界上的电灯可不只是这么简单而已，还有档数：

```javascript
...
    buttonWasPressed() {
        if (this.state === 'off') {
            console.log("弱光");
            this.state = 'weakLight';
        } else if (this.state === 'weakLight') {
            console.log('强光');
            this.state = 'strongLight';
        } else if (this.state === 'strongLight') {
            console.log('关灯');
            this.state = 'off';
        }
    }
    ...
```

那么这里明显有些缺陷：

- 违反开闭原则，每次增加修改`light`状态，都得去修改这个类
- 甚至说还有其他特效，光强等等，我们无法估计这个类的大小，那么`buttonWasPressed`如何编写

所以得改进。

### 改进

- 首先得明确状态之间得转换关系，关-弱光-强光-关
- 抽象状态类

```javascript
class State {
    constructor(light) {
        this.light = light;
    }

    buttonWasPress() { }
}


class OffLight extends State {
    constructor(light) {
        super(light);
    }

    buttonWasPress() {
        console.log("关灯");
        this.light.setState(this.light.weakLightState);
    }
}

class WeakLight extends State {
    constructor(light) {
        super(light);
    }

    buttonWasPress() {
        console.log("弱光");
        this.light.setState(this.light.strongLightState);
    }
}

class StrongLight extends State {
    constructor(light) {
        super(light);
    }

    buttonWasPress() {
        console.log("强光");
        this.light.setState(this.light.offLightState);
    }
}


class Light {
    constructor() {
        this.offLightState = new OffLight(this);
        this.weakLightState = new WeakLight(this);
        this.strongLightState = new StrongLight(this);
        this.currState = this.offLightState;
    }
    setState(newState) {
        this.currState = newState;
    }
    click() {
        //console.log(this.currState);
        this.currState.buttonWasPress();
    }
}

let light = new Light();
light.click();
light.click();
light.click();
light.click();
```



### 优缺点

- 状态模式定义了状态与行为之间的关系，并将它们封装在一个类里。通过增加新的状态类，很容易增加新的状态和转换。
- 避免Context 无限膨胀，状态切换的逻辑被分布在状态类中，也去掉了Context 中原本过多的条件分支。
- 用对象代替字符串来记录当前状态，使得状态的切换更加一目了然。
- Context 中的请求动作和状态类中封装的行为可以非常容易地独立变化而互不影响。
- 状态模式的缺点是会在系统中定义许多状态类，编写20 个状态类是一项枯燥乏味的工作，而且系统中会因此而增加不少对象。
- 另外，由于逻辑分散在状态类中，虽然避开了不受欢迎的条件分支语句，但也造成了逻辑分散的问题，我们无法在一个地方就看出整个状态机的逻辑。

优化：

- 有两种选择来管理state 对象的创建和销毁。第一种是仅当state 对象被需要时才创建并随后销毁，另一种是一开始就创建好所有的状态对象，并且始终不销毁它们。如果state对象比较庞大，可以用第一种方式来节省内存，这样可以避免创建一些不会用到的对象并及时地回收它们。但如果状态的改变很频繁，最好一开始就把这些state 对象都创建出来，也没有必要销毁它们，因为可能很快将再次用到它们。



## 适配器模式

适配器模式的作用是解决两个软件实体间的接口不兼容的问题。使用适配器模式之后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。

比如`python`使用统一的接口去访问数据库。

- 适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。适配器模式不需要改变已有的接口，就能够使它们协同作用。
- 装饰者模式和代理模式也不会改变原有对象的接口，但装饰者模式的作用是为了给对象增加功能。装饰者模式常常形成一条长的装饰链，而适配器模式通常只包装一次。代理模式是为了控制对对象的访问，通常也只包装一次。
- 外观模式的作用倒是和适配器比较相似，有人把外观模式看成一组对象的适配器，但外观模式最显著的特点是定义了一个新的接口。

### 应用场景

如果现有的接口已经能够正常工作，那我们就永远不会用上适配器模式。适配器模式是一种“亡羊补牢”的模式，没有人会在程序的设计之初就使用它。

### 举例

比如我们请求谷歌和百度地图：

```javascript
let googleMap = {
    show : () => {
        console.log("谷歌地图");
    }
};

let baiduMap = {
    show : () => {
        console.log("百度地图");
    }
};

let renderMap = (map) => {
    if (map.show instanceof Function) {
        map.show();
    }
};

renderMap(googleMap);
renderMap(baiduMap);
```

但是现实不大可能所有对象都是`show`这个方法，所以得对其进行适配：

```javascript
let googleMap = {
    show : () => {
        console.log("谷歌地图");
    }
};

let baiduMap = {
    display : () => {
        console.log("百度地图");
    }
};

let baiduMapAdapter = () => {
    show : () => {
        baiduMap.display();
    }
};

let renderMap = (map) => {
    if (map.show instanceof Function) {
        map.show();
    }
};

renderMap(googleMap);
renderMap(baiduMapAdapter);
```



## 工厂模式

### 简单工厂

### 抽象工厂





# 学习设计原则

> 区分一下模式和原则，模式是解决问题的可选方式，原则是编码规则，可以说某个设计模式是否符合某个设计原则。

## 单一职责原则

### 定义

> 一个对象（方法）只做一件事情。
>
> 单一职责原则（`SRP`）的职责被定义为“引起变化的原因”。如果我们有两个动机去改写一个方法，那么这个方法就具有两个职责。每个职责都是变化的一个轴线，如果一个方法承担了过多的职责，那么在需求的变迁过程中，需要改写这个方法的可能性就越大。
>
> 单一职责原则更多地是被运用在对象或者方法级别上。

`SRP`原则在很多设计模式中都有着广泛的运用，例如代理模式、迭代器模式、单例模式和装饰者模式。

### 特点

我们在设计接口和类的时候需要将他们的职责分明：

- 只做一件事，将粒度做到最小
- 提高可复用性
- 改动时会将风险和规模降到最低
- 但是相对而言类和方法的数量会大量增加



## 最少知识原则

### 定义

> 一个软件实体应当尽可能少地与其他实体发生相互作用。
>
> 这里的软件实体是一个广义的概念，不仅包括对象，还包括系统、类、模块、函数、变量等。

解释最少知识原则：
	某军队中的将军需要挖掘一些散兵坑。下面是完成任务的一种方式：将军可以通知上校让他叫来少校，然后让少校找来上尉，并让上尉通知一个军士，最后军士唤来一个士兵，然后命令士兵挖掘一些散兵坑。

```javascript
gerneral.getColonel( c ).getMajor( m ).getCaptain( c ) .getSergeant( s ).getPrivate( p ).digFoxhole();
```

这条链中任何一个对象的改动都会影响整条链的结果。但是对于将军来说，他只是通知上校就好了，不关心上校怎么去做。

这个模式是用来对象....间的解耦的。比如**代理模式**、**中介者模式**、**职责链模式**等等都符合。



## 开放闭合原则

### 定义

> 软件实体（类、模块、函数）等应该是可以扩展的，但是不可修改。
>
> 这是最重要的一条原则，很多时候，一个程序具有良好的设计，往往说明它是符合开放-封闭原则的。

**开放-封闭原则的思想：当需要改变一个程序的功能或者给这个程序增加新功能的时候，可以使用增加代码的方式，但是不允许改动程序的源代码。**

> ​	有一家生产肥皂的大企业，从欧洲花巨资引入了一条生产线。这条生产线可以自动完成从原材料加工到包装成箱的整个流程，但美中不足的是，生产出来的肥皂有一定的空盒几率。于是老板又从欧洲找来一支专家团队，花费数百万元改造这一生产线，终于解决了生产出空盒肥皂的问题。
>
> ​	另一家企业也引入了这条生产线，他们同样遇到了空盒肥皂的问题。但他们的解决办法很简单：用一个大风扇在生产线旁边吹，空盒肥皂就会被吹走。

这个故事告诉我们，相比修改源程序，如果通过增加几行代码就能解决问题，那这显然更加简单和优雅，而且增加代码并不会影响原系统的稳定。

### 入口点

- 消除条件分支，比如之前的策略模式
- 利用多态，抽象相同的地方，模板方法模式等
- 隔离变化和不变化的地方
- 使用回调函数

### 设计模式中的开放闭合原则

- 发布-订阅模式

  发布订阅模式用来降低多个对象之间的依赖关系，它可以取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口。当有新的订阅者出现时，发布者的代码不需要进行任何修改；同样当发布者需要改变时，也不会影响到之前的订阅者。

- 模板方法模式

  在一个运用了模板方法模式的程序中，子类的方法种类和执行顺序都是不变的，所以我们把这部分逻辑抽出来放到父类的模板方法里面；而子类的方法具体怎么实现则是可变的，于是把这部分变化的逻辑封装到子类中。通过增加新的子类，便能给系统增加新的功能，并不需要改动抽象父类以及其他的子类，这也是符合开放封闭原则的。

- 策略模式

  策略模式将各种算法都封装成单独的策略类，这些策略类可以被交换使用。策略和使用策略的客户代码可以分别独立进行修改而互不影响。我们增加一个新的策略类也非常方便，完全不用修改之前的代码。

- 职责链模式

  当我们增加一个新类型的订单函数时，不需要改动原有的订单函数代码，只需要在链条中增加一个新的节点。

### 相对性

也并不是说这个模式必须要封闭，无法修改，还是我们要尽量做到，即使修改，也要力求修改难度、范围、风险最低。

- 挑选出最容易发生变化的地方，然后构造抽象来封闭这些变化。
- 在不可避免发生修改的时候，尽量修改那些相对容易修改的地方。拿一个开源库来说，修改它提供的配置文件，总比修改它的源代码来得简单。



## 依赖倒置原则

前面也提到过了。

依赖倒置原则的三个要点：

- 高层模块不依赖底层模块，两者都应该依赖其抽象。什么意思呢？即：
  - 高层模块可以理解为一个统一调用接口或对象，底层模块可以理解为具体实现某个功能的接口或对象
  - 高层模块调用底层模块时不应该指定调用某个具体的底层模块，因为这样局限性大大了，那要调用另一个底层模块怎么办呢?
  - 这里需要将所有具体底层接口或对象抽象为一个统一可以表示的接口或对象，每个具体底层接口或对象在实现时要继承于抽象接口或对象；高层模块在实现时只需要使用抽象接口或对象中包含的方法和属性即可；在调用高层模块时，只需要传入一个继承于抽象并且实现了抽象的属性和方法的底层模块实例即可；那么高层模块在调用底层模块时就不需要关心调用的是哪个底层模块了，因为他们都继承于同一个抽象，类型相同，具有相同属性和方法，只是实现各自具体功能而已，比如上述的咖啡和茶各自的方法。
- 抽象不依赖于细节。即所有具体底层模块的抽象不应该和具体实现有任何关系。
- 细节应该依赖于抽象。即具体底层模块应该继承于抽象，并且要实现抽象中的方法。

## 接口隔离原则

> 接口是对象能响应的请求的集合。

- 最理想的代码是使用一组接口就能完成功能，接口是实现一个功能的最小粒度
- 经典的鸭子类型，只要像那么回事，那么就是鸭子。这里就是只要具有那个接口，那么外层的调用都是统一的，比如之前的**适配器模式**，只要有`show`方法就可以了。

## 里式替换原则