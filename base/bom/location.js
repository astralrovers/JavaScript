alert(window.location == document.location);

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

// 如果查询的字符串是 ?q=javascript&num=10
var args = getQueryStringArgs();
alert(args["q"]);  // javascript
alert(args["num"]);  // 10

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
alert(hasPlug("Flash"));

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
