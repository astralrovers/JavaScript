function op_attribute() {
    var p = document.getElementById("first-p");
    console.log(p.getAttribute("id"));
    console.log(p.getAttribute("class"));
    console.log(p.getAttribute("title"));
    console.log(p.getAttribute("lang"));
    console.log(p.getAttribute("dir"));
}

function print_style() {
    var myDiv = document.getElementById("myDiv");
    console.log(myDiv.style.backgroundColor);
    console.log(myDiv.style.width);
    console.log(myDiv.style.height);
}
