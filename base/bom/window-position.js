var left_pos = (typeof window.screenLeft == "number") ?  // Opera 的screenX/Y的意思不同
                window.screenLeft : window.screenX;
var top_pos = (typeof window.screenTop == "number") ?
                window.screenTop: window.screenY;

console.log("left = [%d], top = [%d]", left_pos, top_pos);

// 这两个方法貌似被禁用了，没效果
window.moveTo(0, 0);
window.moveBy(-90, 0);

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
//也会被禁用
window.resizeTo(300, 300);
window.resizeBy(400, 400);

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

setTimeout("alert('hello')", 1000);  // 不建议直接传字符串，损失性能

var timeout_id = setTimeout(function () {  // 返回的是一个ID
    alert("hello");
}, 1000);

clearTimeout(timeout_id);  // 可以取消
// setInterval(str/func, 1000); // 与setTimeout一样的用法，表示多少时间间隔循环执行
// clearInterval(id);
//
//
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

window.print("are you ok?"); // 弹出打印页面
window.find();
