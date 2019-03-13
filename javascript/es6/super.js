class A {
  constructor() {
    this.name = "js";
  }
    static hello() {
        console.log("hello");
    }

    Hhello() {
        console.log("Hhello");
    }

}

class B extends A {
  constructor() {
    super();
  }
}
/*
 //等同于
function A() {
    this.name = "js";
}

function B() {
    A.prototype.constructor.call(this);
}
*/

let n = new B();
console.log(n.name);

A.hello(); // hello
A.prototype.Hhello(); // Hhello
//
/*
 * 由以下结果可以看出来
 * 函数有__proto__属性和prototype对象
 * 普通实例对象只有__proto__属性
 *
 * 一、函数作为基类，没有继承
 * 1.对于函数对象的prototype对象(本身类的对象)而言，有__proto__属性和constructor属性
 *   1).__proto__属性指向Object.prototype。
 *      A.prototype.__proto__ == {}
 *      Object.prototype == {}
 *      原因在于A.prototype是一个对象
 *      但是A没有继承于谁
 *        那么A.prototype由Object创建的，
 *        A.prototype的构造函数是Object，
 *        A.prototype是Object的一个实例
 *   2).constructor属性指向自身
 * 2.函数的__proto__属性指向Function.prototype, 直接继承Function.prototype, 原因是普通函数的构造函数是Function。
 *
 * 二、函数作为子类
 * 1.prototype.__proto__指向父类的prototype对象，
 *   因为子类的prototype的构造函数是父类，
 *   子类的prototype对象是父类的一个实例，
 *   在es5中的继承，我们会显示地将子类的prototype指向父类的实例:
 *     Children.prototype = new Father();
 * 2.__proto__指向父类
 *   表示的是构造函数的继承，调用子类的构造方法之前必须要调用父类的构造方法，
 *   通过子类的__proto__能够知道当前继承于谁，并且找到所有的继承关系
 *
 * 三、普通实例的__proto__
 * 指向构造函数的prototype对象
 *
 * 所以方法都在prototype上，
 * 通过一个个prototype.__proto__链接起来，
 * 通过prototype(.__proto__)对象找到构造函数的prototype以找到继承过来的方法.
 * */
//基类
console.log('class A'); 
console.log(A.prototype instanceof Object); // true
console.log(A.prototype instanceof Function); // false
console.log(A.prototype); // A {}
console.log(A.prototype.__proto__);// {} 
console.log(A.prototype.constructor);// [Function: A] 
console.log(A.__proto__);// [Function]
console.log(A.__proto__ == Function.prototype);// true
console.log(A.__proto__ == Function.prototype.prototype);// false
console.log();

console.log('class Function'); 
console.log(Function.prototype); // [Function]
console.log(Function.prototype.__proto__);// {} 
console.log(Function.prototype.constructor);// [Function: Function] 
console.log(Function.__proto__);// [Function]
console.log();

console.log('Object');
console.log(Object.prototype); // {}
console.log();

//子类
console.log(B.prototype instanceof A); // true
console.log(B.prototype); // B {}
console.log(B.prototype.__proto__); // A {}
console.log(B.prototype.__proto__ == A.prototype); // true
console.log(B.prototype.constructor); // [Function: B]
console.log(B.__proto__); // [Function: A]
console.log(B.__proto__ == A); // true
console.log(B.__proto__.__proto__); // Function
console.log();

console.log(n.prototype); // undefined
console.log(n.__proto__); // B {}
/*
class A
A {}
{}
[Function: A]
[Function]

class Function
[Function]
{}
[Function: Function]
[Function]

Object
{}

B {}
A {}
[Function: B]
[Function: A]

undefined
B {}
 * */
