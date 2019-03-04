# 学习设计模式

这里的设计模式是基于JavaScript，不过设计模式是一种方法、思想，不区分语言，只是实现问题。

另外，我同时也是一名C程序员，所以也会考虑C语言当中如何实现。

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

像上边这种方式在使用时，我总得知道有`Bonus`对象和它的方法，并且也得清楚有哪些策略可以用，我们可以定义成下面这种格式：

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