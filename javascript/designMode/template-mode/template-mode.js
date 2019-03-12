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
