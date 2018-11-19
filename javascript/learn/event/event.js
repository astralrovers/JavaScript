var EventUtil = {
    addHandler: function(element, type, handler){
        //省略的代码
        if (element.addEventListener) {
            element.addEventListener(type, handler, true);
        } else if (element.attachEvent) {
            element.attachEvent(type, handler);
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    preventDefault: function(event){
        if (event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    removeHandler: function(element, type, handler){
        //省略的代码
    },
    stopPropagation: function(event){
        if (event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};

EventUtil.addHandler(window, "load", function(event){
	alert("Loaded!");
});
