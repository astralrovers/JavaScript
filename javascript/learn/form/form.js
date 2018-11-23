var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, true);
        } else if (element.attachEvent) {
            element.attachEvent(type, handler);
        }
    },
    getEvent: function (event) {
        return event ? event : window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    removeHandler: function (element, type, handler) {
        //省略的代码
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    getRelatedTarget: function (event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }
    },
    getButton: function (event) {
        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },
};

function setReset() {
    var form = document.getElementById("myForm");
    EventUtil.addHandler(form, "reset", function (event) {
        //取得事件对象
        event = EventUtil.getEvent(event);
        //阻止表单重置
        EventUtil.preventDefault(event);
    });
}

function useFormElements() {
    var form = document.getElementById("myForm");
    var len = form.elements["color"].length;
    console.log(len);
    for (var i = 0; i < len; i++) {
        console.log(form.elements[i].name);
    }
}

function tsetFormEvent() {
    var textbox = document.forms[0].elements[0];
    EventUtil.addHandler(textbox, "focus", function (event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if (target.style.backgroundColor != "red") {
            target.style.backgroundColor = "yellow";
        }
    });
    EventUtil.addHandler(textbox, "blur", function (event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if (/[^\d]/.test(target.value)) {
            target.style.backgroundColor = "red";
        } else {
            target.style.backgroundColor = "";
        }
    });
    EventUtil.addHandler(textbox, "change", function (event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if (/[^\d]/.test(target.value)) {
            target.style.backgroundColor = "red";
        } else {
            target.style.backgroundColor = "";
        }
    });
}

function serialize(form) {
    var parts = [],
        field = null,
        i,
        len,
        j,
        optLen,
        option,
        optValue;
    for (i = 0, len = form.elements.length; i < len; i++) {
        field = form.elements[i];
        switch (field.type) {
            case "select-one":
            case "select-multiple":
                if (field.name.length) {
                    for (j = 0, optLen = field.options.length; j < optLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            optValue = "";
                            if (option.hasAttribute) {
                                optValue = (option.hasAttribute("value") ?
                                    option.value : option.text);
                            } else {
                                optValue = (option.attributes["value"].specified ?
                                    option.value : option.text);
                            }
                            parts.push(encodeURIComponent(field.name) + "=" +
                                encodeURIComponent(optValue));
                        }
                    }
                }
                break;
            case undefined: //字段集
            case "file": //文件输入
            case "submit": //提交按钮
            case "reset": //重置按钮
            case "button": //自定义按钮
                break;
            case "radio": //单选按钮
            case "checkbox": //复选框
                if (!field.checked) {
                    break;
                }
            /* 执行默认操作 */
            default:
                //不包含没有名字的表单字段
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + "=" +
                        encodeURIComponent(field.value));
                }
        }
    }
    return parts.join("&");
}