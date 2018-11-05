class State {
    constructor(light) {
        this.light = light;
    }

    buttonWasPress() { }
}


class OffLight extends State {
    constructor(light) {
        super(light);
    }

    buttonWasPress() {
        console.log("关灯");
        this.light.setState(this.light.weakLightState);
    }
}

class WeakLight extends State {
    constructor(light) {
        super(light);
    }

    buttonWasPress() {
        console.log("弱光");
        this.light.setState(this.light.strongLightState);
    }
}

class StrongLight extends State {
    constructor(light) {
        super(light);
    }

    buttonWasPress() {
        console.log("强光");
        this.light.setState(this.light.offLightState);
    }
}


class Light {
    constructor() {
        this.offLightState = new OffLight(this);
        this.weakLightState = new WeakLight(this);
        this.strongLightState = new StrongLight(this);
        this.currState = this.offLightState;
    }
    setState(newState) {
        this.currState = newState;
    }
    click() {
        //console.log(this.currState);
        this.currState.buttonWasPress();
    }
}

let light = new Light();
light.click();
light.click();
light.click();
light.click();
