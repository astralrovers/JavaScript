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
setCommand( button1, refreshMenuBarCommand );
setCommand( button2, addSubMenuCommand );
setCommand( button3, delSubMenuCommand );
