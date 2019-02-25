function *add() {
    var a = 0;
    while (a < 10) {
        yield;
        console.log("var  = [%d]", a);
        a++;
    }
    return a;
}

var y = add();
console.log(y);
y.next();
y.next();
y.next();
y.next();
