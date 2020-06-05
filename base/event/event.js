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

EventUtil.addHandler(window, "load", function(event){
	alert("Loaded!");
});

function setMouse() {
    var div = document.getElementById("myDiv");
	EventUtil.addHandler(div, "click", function(event){
	    event = EventUtil.getEvent(event);
	    alert("Client coordinates: " + event.clientX + "," + event.clientY);
    });
}

function setKey() {
    var div = document.getElementById("myDiv");
    EventUtil.addHandler(div, "click", function (event) {
        event = EventUtil.getEvent(event);
        var keys = new Array();
        if (event.shiftKey) {
            keys.push("shift");
        }
        if (event.ctrlKey) {
            keys.push("ctrl");
        }
        if (event.altKey) {
            keys.push("alt");
        }
        if (event.metaKey) {
            keys.push("meta");
        }
        alert("Keys: " + keys.join(","));
    });
}
