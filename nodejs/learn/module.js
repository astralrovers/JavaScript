/******************************************    *******************************

      > File Name: module.js

      > Author: Ywl

      > Descripsion:

      > Created Time:     Wed 14 Mar 2018 06:56:43 PM PDT

      > Modify Time: 

 *********************************    ***************************************/
var name;

exports.setName = function(theName){
    name = theName;
};

exports.sayHello = function(){
    console.log('good bye ' + name);
};

// 原理：在外部使用require导入的时候，是实际上require返回的是module.exports这个对象
// 所以我们直接把要导出的对象放到module.exports对象里面，在外部导入时就可以直接通过外部接受时定义的变量
// 使用模块里定义的方法，let my_module = require("module.js"); ==> my_module == module.exports
// 
// 所以我们可以使用下面的方式一次性导出：
// module.exports = {
//      setName : (theName) => {
//          name = theName;
//      },
//      sayHello : () => {
//          console.log(`good bye ${name}`);
//      }
// };
//
// 另外如果我们使用：
// module.exports = () => {
//      console.log("I am a module");
// };
//
// 那么外部就可以直接调用我们的方法，原理也就是上边解释的

/*
single.js
function Hello(){
    var name;
    this.setName = function(theName){
        name = theName;
    };

    this.sayHello = function(){
        console.log('good bye ' + name);
    };
}

exports.Hello = Hello;  //ouTput is exports

need use : require('./single').Hello;

hello.js

function Hello(){
    var name;
    this.setName = function(theName){
        name = theName;
    };

    this.sayHello = function(){
        console.log('good bye ' + name);
    };
}

module.exports = Hello;     //ouTput is module.exports

need use : require('./hello')
*/
