
function print_name() {
    console.log("js");
}

function send_func(func) {
    func();
}

send_func(print_name);

function get_func() {
    return function() {
        console.log("hello");
    }
}

recv_func = get_func();
recv_func();

function func(name, age) {
    console.log(arguments);
    console.log("%s %d", name, age);
    if (age != 0) {
        console.log(arguments.callee);
        arguments.callee("js", 0);
    }
}

func("ywl", 23);


function print_color() {
    console.log(this.color);
}

//window.color = "red";

var o = {
    color : "blue"
};

o.print_color = print_color;

print_color();
o.print_color();

function be_use() {
    console.log(arguments.callee.caller);
    console.log(be_use.caller);
}

function user() {
    be_use();
}

user();

function print_argc(name, age) {

}

console.log(print_argc.length);

function sum_digital(num1, num2) {
    console.log(this.color);
    return num1 + num2;
}

var x = {
    color : "yellow"
};

console.log("%d", sum_digital.call(x, 1, 2));
console.log("%d", sum_digital.apply(x, [1, 2]));

var bind_func = sum_digital.bind(x);

console.log("%d", bind_func(30, 40));