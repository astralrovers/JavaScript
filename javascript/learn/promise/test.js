var o = {
    then : function(){}
};

var j = Object.create(o);

console.log(j.__proto__);
var v = new Promise(function(resolve, reject){
    console.log("hello");
    resolve("ok");
});
function out_time(time) {
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            reject("超时");
        }, time);
    });
}

/* 并不是说谁先完成了，剩下的回调就会被中断，不执行了，
 * 只是说不会在被Promise处理，即只有一个未来值会被处理，其他的会被忽略
 * */
Promise.race([v, out_time(3000)]).then(
function(data){
    console.log(data);
},
function(data){
    console.log(data);
});
//console.log(v.then);
