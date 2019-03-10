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

