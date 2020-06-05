# function总结

## 函数的本质

  - `js`中的函数不存在重载的说法，函数名只是一个普通变量而已，它的值是一个地址，这个地址为函数地址，而函数本身是一个`Object`类型。

    ```javascript
    cal_factorial = function(){     //这里要注意函数名也是一个对象变量，表示一个函数的地址,重新指向新的函数时原来的函数依然存在
        console.log('not using!');
    }
    
    function cal_factorial() {
        console.log('not using!');
    }
    //这两种方式是一样的
    ```

- 由于上面的特性，函数可以作为参数和返回值。

  ```javascript
  function print_name() {
      console.log("js");
  }
  
  function send_func(func) {
      func();
  }
  
  send_func(print_name);
  
  function get_func() {
      return function() {
          console.log("hello");
      }
  }
  
  recv_func = get_func();
  recv_func();
  ```

  输出：
  
  ```shell
  js
  hello
  ```
  能够防止成为普通函数声明的部分。

- 一种立即调用的方式：

  ```javascript
  (function hello() {
      console.log("hello\n");
  })();
  ```

## 函数内部属性

- 函数对象包含`arguments`和`this`两个属性。

- `arguments`是一个数组对象，包含一个函数传入的所有参数：

  ```javascript
  function func(name, age) {
      console.log(arguments);
      console.log("%s %d", name, age);
  }
  
  func("ywl", 23);
  ```

  输出：

  ```shell
  [Arguments] { '0': 'ywl', '1': 23 }
  ywl 23
  ```

  不过这个对象还有一个`callee`属性，代表当前函数的指针，将它作为函数调用时与嗲用原函数无异。

  ```javascript
  function func(name, age) {
      console.log(arguments);
      console.log("%s %d", name, age);
      if (age != 0) {
          console.log(arguments.callee);
          arguments.callee("js", 0);
      }
  }
  
  func("ywl", 23);
  ```

  输出：

  ```shell
  [Arguments] { '0': 'ywl', '1': 23 }
  ywl 23
  [Function: func]
  [Arguments] { '0': 'js', '1': 0 }
  js 0
  ```

- 另一个是`this`对象，这是一个指针。`this`引用的是函数据以执行的环境对象（注意不是函数）。当在网页的全局作用域中调用函数时，`this `对象引用的就是 `window`。

  ```javascript
  function print_color() {
      console.log(this.color);
  }
  
  window.color = "red";
  
  var o = {
      color : "blue"
  };
  
  o.print_color = print_color;
  
  print_color();
  o.print_color();
  ```

  输出：

  ```shell
  red  #因为此时的this是代表window
  blue #此时的环境对象是o
  ```

- 还有一个特殊的函数属性`caller`。表示被调用函数的调用者。

  ```javascript
  function be_use() {
      console.log(arguments.callee.caller);
      console.log(be_use.caller);
  }
  
  function user() {
      be_use();
  }
  
  user();
  ```

  输出：

  ```shell
  [Function: user]
  [Function: user]
  ```

## 函数属性和方法

- 每个函数包含`length`和`prototype`两个属性。

- `length`表示函数希望接收的`命名参数`个数。

  ```javascript
  function print_argc(name, age) {
  
  }
  
  console.log(print_argc.length);  // out : 2
  ```

- `prototype`是一个非常特殊且重要的属性，对于引用类型来说，`prototype`是保存它们所有实例方法的真正所在。像toString()，valueOf()都保存在`prototype`名下，只不过通过各自的实例对象访问罢了。在继承的实现中极为重要。`prototype`无法被枚举，因此`for-in`是无法发现的。

- 非继承而来的方法`apply()`和`call()`，两个方法非常类似。第一个参数是在其中运行函数的作用域，另一个是参数数组。

  **这两个函数的原理在于将传入的对象赋给函数的this指针，那么函数的this指针就可以访问到传入对象的属性和方法了，在默认情况下函数的this指向全局即window。**

  ```javascript
  function say_js() {
      this.say_hello = function () {
          console.log("hello");
      }
  }
  
  window.say_hello();  // 这条语句是有效的，在默认情况下全局函数的执行环境是window，即this指向window.
  ```



  ```javascript
  function sum_digital(num1, num2) {
      console.log(this);
      console.log(this.color);
      this.say_color = function () {
          console.log(this.color);
      };
      return num1 + num2;
  }
  
  var x = {
      color : "yellow"
  };
  
  console.log("%d", sum_digital.call(x, 1, 2)); // call需要将参数展开
  x.say_color();
  console.log("%d", sum_digital.apply(x, [1, 2])); // apply可以展开，也可以不展开。第二个参数可以是 Array 的实例，也可以是arguments对象（调用者的参数列表）
  
  //这两个方法真正的作用在于扩展执行环境对象的作用域(在构造函数的原理中起到作用)，这里sum_digital的执行环境作用于扩充了x对象，因此访问得到color属性。
  ```

  输出：

  ```shell
  { color: 'yellow' }  #第一次调用sum_digital时this对象指向x
  yellow
  3
  yellow
  { color: 'yellow', say_color: [Function] } #第二次调用sum_digital时this对象指向x，但是此时x已经被添加到了sum_digital的作用域中，因此上面的语句才有效。
  yellow
  3
  ```

  另一个方法是`bind()`，它会返回一个函数的实例，其 this 值会被绑定到传给 bind() 函数的值。

  ```javascript
  function sum_digital(num1, num2) {
      console.log(this.color);
      return num1 + num2;
  }
  
  var x = {
      color : "yellow"
  };
  var bind_func = sum_digital.bind(x);
  console.log("%d", bind_func(30, 40));
  ```

  ```shell
  yellow
  70
  ```
