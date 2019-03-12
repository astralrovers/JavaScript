class Light {
    constructor() {
    	this.state = "off";  // 初始状态为关闭
    	this.button = null;  // 开关按钮
    }
    
    buttonWasPressed() {
        if (this.state === 'off') {
            console.log("开灯");
            this.state = 'on';
        } else if (this.state === 'on') {
            console.log('关灯');
            this.state = 'off';
        }
    }
}

let light = new Light();

light.buttonWasPressed();
light.buttonWasPressed();
