function func1(k) {
    return function (x, y) {
        return x*k + y;
    }
}
var temp = func1(2);
console.log(temp(3, 7));