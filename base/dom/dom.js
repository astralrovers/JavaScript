alert(document.nodeType);
var html = document.documentElement;
var p = document.createElement("p");
var txt = document.createTextNode("new element");
p.appendChild(txt);
document.body.appendChild(p);
alert(html);
alert(document.childNodes[0]);
alert(document.firstChild);
alert(html === document.childNodes[0]);
alert(html === document.firstChild);