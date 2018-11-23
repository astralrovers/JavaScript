# 表单

## 表单的基础知识

​	在 HTML 中，表单是由` <form> `元素来表示的，而在 JavaScript 中，表单对应的则是 HTMLFormElement 类型。 HTMLFormElement 继承了 HTMLElement ，因而与其他 HTML 元素具有相同的默认属性。不过， HTMLFormElement 也有它自己下列独有的属性和方法。

- acceptCharset ：服务器能够处理的字符集；等价于 HTML 中的 accept-charset 特性。
- action ：接受请求的 URL；等价于 HTML 中的 action 特性。
- elements ：表单中所有控件的集合（ HTMLCollection ） 。
- enctype ：请求的编码类型；等价于 HTML 中的 enctype 特性。
- length ：表单中控件的数量。
- method ：要发送的 HTTP 请求类型，通常是 "get" 或 "post" ；等价于 HTML 的 method 特性。
- name ：表单的名称；等价于 HTML 的 name 特性。
- reset() ：将所有表单域重置为默认值。
- submit() ：提交表单。
- target ：用于发送请求和接收响应的窗口名称；等价于 HTML 的 target 特性。

​	取得 `<form> `元素引用的方式有好几种。其中最常见的方式就是将它看成与其他元素一样，并为其添加 id 特性，然后再像下面这样使用 getElementById() 方法找到它。

```javascript
var form = document.getElementById("form1");
```

​	其次，通过 document.forms 可以取得页面中所有的表单。在这个集合中，可以通过数值索引或name 值来取得特定的表单，如下面的例子所示：

```javascript
var firstForm = document.forms[0]; //取得页面中的第一个表单
var myForm = document.forms["form2"]; //取得页面中名称为"form2"的表单
```

​	另外，在较早的浏览器或者那些支持向后兼容的浏览器中，也会把每个设置了 name 特性的表单作为属性保存在 document 对象中。例如，通过 document.form2 可以访问到名为 "form2" 的表单。不过，我们不推荐使用这种方式：一是容易出错，二是将来的浏览器可能会不支持。
​	注意，可以同时为表单指定 id 和 name 属性，但它们的值不一定相同。

### 表单提交

​	用户单击提交按钮或图像按钮时，就会提交表单。使用` <input> `或 `<button> `都可以定义提交按钮，只要将其 type 特性的值设置为 "submit" 即可， 而图像按钮则是通过将` <input> `的 type 特性值设置为"image" 来定义的。因此，只要我们单击以下代码生成的按钮，就可以提交表单。

```javascript
<!-- 通用提交按钮 -->
<input type="submit" value="Submit Form">
<!-- 自定义提交按钮 -->
<button type="submit">Submit Form</button>
<!-- 图像按钮 -->
<input type="image" src="graphic.gif">
```

​	只要表单中存在上面列出的任何一种按钮，那么在相应表单控件拥有焦点的情况下，按回车键就可以提交该表单。 （ textarea 是一个例外，在文本区中回车会换行。 ）如果表单里没有提交按钮，按回车键不会提交表单。

​	以这种方式提交表单时，浏览器会在将请求发送给服务器之前触发 submit 事件。这样，我们就有机会验证表单数据，并据以决定是否允许表单提交。阻止这个事件的默认行为就可以取消表单提交。例如，下列代码会阻止表单提交：

```javascript
var form = document.getElementById("myForm");
EventUtil.addHandler(form, "submit", function(event){
	//取得事件对象
	event = EventUtil.getEvent(event);
	//阻止默认事件
	EventUtil.preventDefault(event);
});
```

​	在 JavaScript 中，以编程方式调用 submit() 方法也可以提交表单。而且，这种方式无需表单包含提交按钮，任何时候都可以正常提交表单。来看一个例子。

```javascript
var form = document.getElementById("myForm");
// 提交表单
form.submit();
```

​	在以调用 submit() 方法的形式提交表单时，不会触发 submit 事件，因此要记得在调用此方法之前先验证表单数据。

​	提交表单时可能出现的最大问题，就是重复提交表单。在第一次提交表单后，如果长时间没有反应，用户可能会变得不耐烦。这时候，他们也许会反复单击提交按钮。结果往往很麻烦（因为服务器要处理重复的请求） ，或者会造成错误（如果用户是下订单，那么可能会多订好几份） 。解决这一问题的办法有两个：在第一次提交表单后就禁用提交按钮，或者利用 onsubmit 事件处理程序取消后续的表单提交操作。

### 重置表单

​	在用户单击重置按钮时，表单会被重置。使用 type 特性值为 "reset" 的` <input> `或` <button>` 都可以创建重置按钮，如下面的例子所示。

```html
<!-- 通用重置按钮 -->
<input type="reset" value="Reset Form">
<!-- 自定义重置按钮 -->
<button type="reset">Reset Form</button>
```

​	这两个按钮都可以用来重置表单。在重置表单时，所有表单字段都会恢复到页面刚加载完毕时的初始值。如果某个字段的初始值为空，就会恢复为空；而带有默认值的字段，也会恢复为默认值。用户单击重置按钮重置表单时，会触发 reset 事件。利用这个机会，我们可以在必要时取消重置操作。例如，下面展示了阻止重置表单的代码：

```javascript
function setReset() {
    var form = document.getElementById("myForm");
    EventUtil.addHandler(form, "reset", function (event) {
        //取得事件对象
        event = EventUtil.getEvent(event);
        //阻止表单重置
        EventUtil.preventDefault(event);
    });
}
```

与提交表单一样，也可以通过 JavaScript 来重置表单，如下面的例子所示：

```javascript
var form = document.getElementById("myForm");
// 重置表单
form.reset();
```

与调用 submit() 方法不同，调用 reset() 方法会像单击重置按钮一样触发 reset 事件。

### 表单字段

​	可以像访问页面中的其他元素一样，使用原生 DOM 方法访问表单元素。此外，每个表单都有elements 属性，该属性是表单中所有表单元素（字段）的集合。这个 elements 集合是一个有序列表，其中包含着表单中的所有字段，例如 `<input> `、` <textarea> `、` <button> `和` <fieldset>` 。每个表单字段在 elements 集合中的顺序，与它们出现在标记中的顺序相同，可以按照位置和 name 特性来访问它们。下面来看一个例子：

```javascript
var form = document.getElementById("form1");
//取得表单中的第一个字段
var field1 = form.elements[0];
//取得名为"textbox1"的字段
var field2 = form.elements["textbox1"];
//取得表单中包含的字段的数量
var fieldCount = form.elements.length;
```

​	如果有多个表单控件都在使用一个 name （如单选按钮） ，那么就会返回以该 name 命名的一个NodeList 。例如，以下面的 HTML 代码片段为例：

```html
    <form method="post" id="myForm">
        <ul>
            <li><input type="radio" name="color" value="red">Red</li>
            <li><input type="radio" name="color" value="green">Green</li>
            <li><input type="radio" name="color" value="blue">Blue</li>
        </ul>
        <br/>
        <input type="submit" value="submit"/>
    </form>
```

​	在这个 HTML 表单中， 有 3 个单选按钮， 它们的 name 都是 "color" ， 意味着这 3 个字段是一起的。在访问 elements["color"] 时，就会返回一个 NodeList ，其中包含这 3 个元素；不过，如果访问elements[0] ，则只会返回第一个元素。来看下面的例子：

```javascript
var form = document.getElementById("myForm");
var colorFields = form.elements["color"];
alert(colorFields.length); //3
var firstColorField = colorFields[0];
var firstFormField = form.elements[0];
alert(firstColorField === firstFormField); //true
```

#### 共有的表单字段属性

​	除了` <fieldset> `元素之外，所有表单字段都拥有相同的一组属性。由于 `<input>` 类型可以表示多种表单字段，因此有些属性只适用于某些字段，但还有一些属性是所有字段所共有的。表单字段共有的属性如下：

- disabled ：布尔值，表示当前字段是否被禁用。
- form ：指向当前字段所属表单的指针；只读。
- name ：当前字段的名称。
- readOnly ：布尔值，表示当前字段是否只读。
- tabIndex ：表示当前字段的切换（tab）序号。
- type ：当前字段的类型，如 "checkbox" 、 "radio" ，等等。
- value ：当前字段将被提交给服务器的值。对文件字段来说，这个属性是只读的，包含着文件在计算机中的路径。

除了 form 属性之外，可以通过 JavaScript 动态修改其他任何属性。来看下面的例子：

```javascript
var form = document.getElementById("myForm");
var field = form.elements[0];
//修改 value 属性
field.value = "Another value";
//检查 form 属性的值
alert(field.form === form); //true
//把焦点设置到当前字段
field.focus();
//禁用当前字段
field.disabled = true;
//修改 type 属性（不推荐，但对<input>来说是可行的）
field.type = "checkbox";
```

​	能够动态修改表单字段属性，意味着我们可以在任何时候，以任何方式来动态操作表单。例如，很多用户可能会重复单击表单的提交按钮。在涉及信用卡消费时，这就是个问题：因为会导致费用翻番。为此，最常见的解决方案，就是在第一次单击后就禁用提交按钮。只要侦听 submit 事件，并在该事件发生时禁用提交按钮即可。以下就是这样一个例子：

```javascript
//避免多次提交表单
EventUtil.addHandler(form, "submit", function(event){
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	//取得提交按钮
	var btn = target.elements["submit-btn"];
	//禁用它
	btn.disabled = true;
});
```

​	以上代码为表单的 submit 事件添加了一个事件处理程序。事件触发后，代码取得了提交按钮并将其 disabled 属性设置为 true 。注意，不能通过 onclick 事件处理程序来实现这个功能，原因是不同浏览器之间存在**时差** ：有的浏览器会在触发表单的 submit 事件之前触发 click 事件，而有的浏览器则相反。对于先触发 click 事件的浏览器，意味着会在提交发生之前禁用按钮，结果永远都不会提交表单。因此，最好是通过 submit 事件来禁用提交按钮。不过，这种方式不适合表单中不包含提交按钮的情况； 如前所述， 只有在包含提交按钮的情况下， 才有可能触发表单的 submit事件。

#### 共有的表单字段方法

​	每个表单字段都有两个方法： focus() 和 blur() 。其中， focus() 方法用于将浏览器的焦点设置到表单字段，即激活表单字段，使其可以响应键盘事件。例如，接收到焦点的文本框会显示插入符号，随时可以接收输入。使用 focus() 方法，可以将用户的注意力吸引到页面中的某个部位。例如，在页面加载完毕后，将焦点转移到表单中的第一个字段。为此，可以侦听页面的 load 事件，并在该事件发生时在表单的第一个字段上调用 focus() 方法，如下面的例子所示：

```javascript
EventUtil.addHandler(window, "load", function(event){
	document.forms[0].elements[0].focus();
});
```

​	要注意的是，如果第一个表单字段是一个 `<input> `元素，且其 type 特性的值为 "hidden" ，那么以上代码会导致错误。另外，如果使用 CSS 的 display 和 visibility 属性隐藏了该字段，同样也会导致错误。

​	HTML5 为表单字段新增了一个 autofocus 属性。 在支持这个属性的浏览器中， 只要设置这个属性，
不用 JavaScript 就能自动把焦点移动到相应字段。例如：

```html
<input type="text" autofocus>
```

为了保证前面的代码在设置 autofocus 的浏览器中正常运行，必须先检测是否设置了该属性，如
果设置了，就不用再调用 focus() 了：

```javascript
EventUtil.addHandler(window, "load", function(event){
	var element = document.forms[0].elements[0];
    // 因为 autofocus 是一个布尔值属性，所以在支持的浏览器中它的值应该是 true 。 
    if (element.autofocus !== true){
		element.focus(); console.log("JS focus");
	}
});
```

​	与 focus() 方法相对的是 blur() 方法，它的作用是从元素中移走焦点。在调用 blur() 方法时，并不会把焦点转移到某个特定的元素上；仅仅是将焦点从调用这个方法的元素上面移走而已。在早期Web 开发中， 那时候的表单字段还没有 readonly 特性， 因此就可以使用 blur() 方法来创建只读字段。现在，虽然需要使用 blur() 的场合不多了，但必要时还可以使用的。用法如下：

```javascript
document.forms[0].elements[0].blur();
```

#### 共有的表单字段事件

除了支持鼠标、键盘、更改和 HTML 事件之外，所有表单字段都支持下列 3 个事件：

- blur ：当前字段失去焦点时触发。
- change ：对于 `<input>` 和` <textarea>` 元素，在它们失去焦点且 value 值改变时触发；对于`<select>` 元素，在其选项改变时触发。
- focus ：当前字段获得焦点时触发。



​	当用户改变了当前字段的焦点，或者我们调用了 blur() 或 focus() 方法时，都可以触发 blur 和focus 事件。这两个事件在所有表单字段中都是相同的。但是， change 事件在不同表单控件中触发的次数会有所不同。 对于 `<input> `和` <textarea>` 元素， 当它们从获得焦点到失去焦点且 value 值改变时，才会触发 change 事件。对于 `<select>` 元素，只要用户选择了不同的选项，就会触发 change 事件；换句话说，不失去焦点也会触发 change 事件。

​	通常，可以使用 focus 和 blur 事件来以某种方式改变用户界面，要么是向用户给出视觉提示，要么是向界面中添加额外的功能（例如，为文本框显示一个下拉选项菜单） 。而 change 事件则经常用于验证用户在字段中输入的数据。例如，假设有一个文本框，我们只允许用户输入数值。此时，可以利用focus 事件修改文本框的背景颜色，以便更清楚地表明这个字段获得了焦点。可以利用 blur 事件恢复文本框的背景颜色，利用 change 事件在用户输入了非数值字符时再次修改背景颜色。下面就给出了实现上述功能的代码：

```javascript
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
```

## 文本框脚本

​	在 HTML 中，有两种方式来表现文本框：一种是使用` <input> `元素的单行文本框，另一种是使用`<textarea>` 的多行文本框。这两个控件非常相似，而且多数时候的行为也差不多。不过，它们之间仍然存在一些重要的区别。

​	要表现文本框，必须将` <input> `元素的 type 特性设置为 "text" 。而通过设置 size 特性，可以指定文本框中能够显示的字符数。通过 value 特性，可以设置文本框的初始值，而 maxlength 特性则用于指定文本框可以接受的最大字符数。如果要创建一个文本框，让它能够显示 25 个字符，但输入不能超过 50 个字符，可以使用以下代码：

```javascript
<input type="text" size="25" maxlength="50" value="initial value">
```

相对而言， `<textarea>` 元素则始终会呈现为一个多行文本框。 要指定文本框的大小， 可以使用 rows和 cols 特性。其中， rows 特性指定的是文本框的字符行数，而 cols 特性指定的是文本框的字符列数（类似于 `<inpu>` 元素的 size 特性） 。与 `<input>` 元素不同，` <textarea> `的初始值必须要放在`<textarea>` 和 `</textarea>` 之间，如下面的例子所示：

```html
<textarea rows="25" cols="5">initial value</textarea>
```

​	另一个与` <input>` 的区别在于，不能在 HTML 中给` <textarea>`指定最大字符数。无论这两种文本框在标记中有什么区别，但它们都会将用户输入的内容保存在 value 属性中。可以通过这个属性读取和设置文本框的值，如下面的例子所示：

```javascript
var textbox = document.forms[0].elements["textbox1"];
alert(textbox.value);
textbox.value = "Some new value";
```

建议这样使用value值，不要使用DOM的方法(setAttribute())，因为修改不一定会反映在DOM里。

### 选择文本

​	上述两种文本框都支持 select() 方法，这个方法用于选择文本框中的所有文本。在调用 select()方法时，大多数浏览器（Opera 除外）都会将焦点设置到文本框中。这个方法不接受参数，可以在任何时候被调用：

```javascript
var textbox = document.forms[0].elements["textbox1"];
textbox.select();
```

​	在文本框获得焦点时选择其所有文本，这是一种非常常见的做法，特别是在文本框包含默认值的时候。因为这样做可以让用户不必一个一个地删除文本：

```javascript
EventUtil.addHandler(textbox, "focus", function(event){
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	target.select();
});
```

#### 选择（ select ）事件

​	与 select() 方法对应的，是一个 select 事件。在选择了文本框中的文本时，就会触发 select事件。不过，到底什么时候触发 select 事件，还会因浏览器而异。在 IE9+、Opera、Firefox、Chrome和 Safari 中，只有用户选择了文本（而且要释放鼠标），才会触发 select 事件。而在 IE8 及更早版本中，只要用户选择了一个字母（不必释放鼠标），就会触发 select 事件。另外，在调用 select() 方法时也会触发 select 事件。下面是一个简单的例子：

```javascript
var textbox = document.forms[0].elements["textbox1"];
	EventUtil.addHandler(textbox, "select", function(event){
	var alert("Text selected" + textbox.value);
});
```

####  取得选择的文本

​	虽然通过 select 事件我们可以知道用户什么时候选择了文本，但仍然不知道用户选择了什么文本。HTML5 通过一些扩展方案解决了这个问题，以便更顺利地取得选择的文本。该规范采取的办法是添加两个属性： selectionStart 和 selectionEnd 。这两个属性中保存的是基于 0 的数值，表示所选择文本的范围（即文本选区开头和结尾的偏移量）。因此，要取得用户在文本框中选择的文本，可以使用如下代码：

```javascript
function getSelectedText(textbox){
	return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
}
```

​	IE9+、Firefox、Safari、Chrome 和 Opera 都支持这两个属性。IE8 及之前版本不支持这两个属性，而是提供了另一种方案。

​	IE8 及更早的版本中有一个 document.selection 对象，其中保存着用户在整个文档范围内选择的文本信息；也就是说，无法确定用户选择的是页面中哪个部位的文本。不过，在与 select 事件一起使用的时候，可以假定是用户选择了文本框中的文本，因而触发了该事件。要取得选择的文本，首先必须创建一个范围，然后再将文本从其中提取出来，如下面的例子所示：

```javascript
function getSelectedText(textbox){
	if (typeof textbox.selectionStart == "number"){
		return textbox.value.substring(textbox.selectionStart,
											textbox.selectionEnd);
	} else if (document.selection){
		return document.selection.createRange().text;
	}
}
```

#### 选择部分文本

​	HTML5 也 为 选 择 文 本 框 中 的 部 分 文 本 提 供 了 解 决 方 案 ， 即 最 早 由 Firefox 引 入 的setSelectionRange() 方法。现在除 select() 方法之外，所有文本框都有一个 setSelectionRange()方法。这个方法接收两个参数：要选择的第一个字符的索引和要选择的最后一个字符之后的字符的索引（类似于 substring() 方法的两个参数）。

```javascript
textbox.value = "Hello world!"
//选择所有文本
textbox.setSelectionRange(0, textbox.value.length); //"Hello world!"
//选择前 3 个字符
textbox.setSelectionRange(0, 3); //"Hel"
//选择第 4 到第 6 个字符
textbox.setSelectionRange(4, 7); //"o w"
```

要看到选择的文本，必须在调用 setSelectionRange() 之前或之后立即将焦点设置到文本框。

​	IE8 及更早版本支持使用范围选择部分文本。要选择文本框中的部分文本，必须首先使用 IE 在所有文本框上提供的 createTextRange() 方法创建一个范围，并将其放在恰当的位置上。然后，再使用 moveStart() 和 moveEnd() 这两个范围方法将范围移动到位。不过，在调用这两个方法以前，还必须使用 collapse() 将范围折叠到文本框的开始位置。此时， moveStart() 将范围的起点和终点移动到了相同的位置，只要再给 moveEnd() 传入要选择的字符总数即可。最后一步，就是使用范围的 select() 方法选择文本：

```javascript
textbox.value = "Hello world!";
var range = textbox.createTextRange();
//选择所有文本
range.collapse(true);
range.moveStart("character", 0);
range.moveEnd("character", textbox.value.length); //"Hello world!"
range.select();
//选择前 3 个字符
range.collapse(true);
range.moveStart("character", 0);
range.moveEnd("character", 3);
range.select(); //"Hel"
//选择第 4 到第 6 个字符
range.collapse(true);
range.moveStart("character", 4);
range.moveEnd("character", 3);
range.select(); //"o w"
```

​	与在其他浏览器中一样，要想在文本框中看到文本被选择的效果，必须让文本框获得焦点。为了实现跨浏览器编程，可以将上述两种方案组合起来，如下面的例子所示：

```javascript
function selectText(textbox, startIndex, stopIndex){
	if (textbox.setSelectionRange){
		textbox.setSelectionRange(startIndex, stopIndex);
	} else if (textbox.createTextRange){
		var range = textbox.createTextRange();
		range.collapse(true);
		range.moveStart("character", startIndex);
		range.moveEnd("character", stopIndex - startIndex);
		range.select();
	}
    textbox.focus();
}
```

​	这个 selectText() 函数接收三个参数：要操作的文本框、要选择文本中第一个字符的索引和要选择文本中最后一个字符之后的索引。首先，函数测试了文本框是否包含 setSelectionRange() 方法。如果有，则使用该方法。否则，检测文本框是否支持 createTextRange() 方法。如果支持，则通过创建范围来实现选择。最后一步，就是为文本框设置焦点，以便用户看到文本框中选择的文本。可以像下面这样使用 selectText() 方法：

```javascript
selectText(textbox, 0, textbox.value.length); //"Hello world!"
//选择前 3 个字符
selectText(textbox, 0, 3); //"Hel"
//选择第 4 到第 6 个字符
selectText(textbox, 4, 7); //"o w"
```

### 过滤输入

​	我们经常会要求用户在文本框中输入特定的数据，或者输入特定格式的数据。例如，必须包含某些字符，或者必须匹配某种模式。由于文本框在默认情况下没有提供多少验证数据的手段，因此必须使用JavaScript 来完成此类过滤输入的操作。而综合运用事件和 DOM 手段，就可以将普通的文本框转换成能够理解用户输入数据的功能型控件。

#### 屏蔽字符

​	有时候，我们需要用户输入的文本中包含或不包含某些字符。例如，电话号码中不能包含非数值字符。如前所述，响应向文本框中插入字符操作的是 keypress 事件。因此，可以通过阻止这个事件的默认行为来屏蔽此类字符。

```javascript
EventUtil.addHandler(textbox, "keypress", function(event){
	event = EventUtil.getEvent(event);
	EventUtil.preventDefault(event);
});
```

​	运行以上代码后，由于所有按键操作都将被屏蔽，结果会导致文本框变成只读的。如果只想屏蔽特定的字符，则需要检测 keypress 事件对应的字符编码，然后再决定如何响应。例如，下列代码只允许用户输入数值：

```javascript
EventUtil.addHandler(textbox, "keypress", function(event){
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	var charCode = EventUtil.getCharCode(event);
	if (!/\d/.test(String.fromCharCode(charCode))){
    	EventUtil.preventDefault(event);
	}
});
```

### 自动切换焦点

​	使用 JavaScript 可以从多个方面增强表单字段的易用性。其中，最常见的一种方式就是在用户填写完当前字段时，自动将焦点切换到下一个字段。通常，在自动切换焦点之前，必须知道用户已经输入了既定长度的数据（例如电话号码）。例如，美国的电话号码通常会分为三部分：区号、局号和另外 4 位数字。为取得完整的电话号码，很多网页中都会提供下列 3 个文本框：

```html
<input type="text" name="tel1" id="txtTel1" maxlength="3">
<input type="text" name="tel2" id="txtTel2" maxlength="3">
<input type="text" name="tel3" id="txtTel3" maxlength="4">
```

​	为增强易用性，同时加快数据输入，可以在前一个文本框中的字符达到最大数量后，自动将焦点切换到下一个文本框。换句话说，用户在第一个文本框中输入了 3 个数字之后，焦点就会切换到第二个文本框，再输入 3 个数字，焦点又会切换到第三个文本框。这种“自动切换焦点”的功能，可以通过下列代码实现：

```javascript
(function () {
    function tabForward(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if (target.value.length == target.maxLength) {
            var form = target.form;
            for (var i = 0, len = form.elements.length; i < len; i++) {
                if (form.elements[i] == target) {
                    if (form.elements[i + 1]) {
                        form.elements[i + 1].focus();
                    }
                    return;
                }
            }
        }

    }
    var box1 = document.getElementById("txtTel1");
    var box2 = document.getElementById("txtTel2");
    var box3 = document.getElementById("txtTel3");

    EventUtil.addHandler(box1, "keyup", tabForward);
    EventUtil.addHandler(box2, "keyup", tabForward);
    EventUtil.addHandler(box3, "keyup", tabForward);
})();
```

### HTML5 约束验证API

​	具体来说，就是要在 HTML 标记中为特定的字段指定一些约束，然后浏览器才会自动执行表单验证。

#### 必填字段

第一种情况是在表单字段中指定了 required 属性，如下面的例子所示：

```html
<input type="text" name="username" required>
```

​	任何标注有 required 的字段，在提交表单时都不能空着。这个属性适用于 `<input> `、 `<textarea>`和` <select> `字段（Opera 11 及之前版本还不支持 `<select>` 的 required 属性）。

​	在 JavaScript 中，通过对应的 required 属性，可以检查某个表单字段是否为必填字段：

```javascript
var isrequired = document.forms[0].elements["username"].required;
```

另外，使用下面这行代码可以测试浏览器是否支持 required 属性：

```javascript
var isSupportRequired = "required" in document.creatElement("input");
```

#### 其他输入类型

​	HTML5 为 `<input> `元素的 type 属性又增加了几个值。这些新的类型不仅能反映数据类型的信息，而且还能提供一些默认的验证功能。其中， "email" 和 "url" 是两个得到支持最多的类型，各浏览器也都为它们增加了定制的验证机制。例如：

```html
<input type="email" name="email"> <!--浏览器存有邮件地址的话会提示待选邮箱-->
<input type="url" name="url">
```

​	要检测浏览器是否支持这些新类型，可以在 JavaScript 创建一个` <input> `元素，然后将 type 属性设置为 "email" 或 "url" ，最后再检测这个属性的值。不支持它们的旧版本浏览器会自动将未知的值设置为 "text" ，而支持的浏览器则会返回正确的值。例如：

```javascript
var email = document.createElement("input");
input.type = "email";
var idSupportEmail = (input.type == "email");
```

#### 数值范围

​	除了 "email" 和 "url" ，HTML5 还定义了另外几个输入元素。这几个元素都要求填写某种基于数字的值： "number" 、 "range" 、 "datetime" 、 "datetime-local" 、 "date" 、 "month" 、 "week" ，还有 "time" 。浏览器对这几个类型的支持情况并不好，因此如果真想选用的话，要特别小心。目前，浏览器开发商主要关注更好的跨平台兼容性以及更多的逻辑功能。因此，本节介绍的内容某种程度上有些超前，不一定马上就能在实际开发中使用。

​	对所有这些数值类型的输入元素，可以指定 min 属性（最小的可能值）、 max 属性（最大的可能值）和 step 属性（从 min 到 max 的两个刻度间的差值）。例如，想让用户只能输入 0 到 100的值，而且这个值必须是 5 的倍数，可以这样写代码：

```html
<input type="number" min="0" max="10" step="2" name="count">
```

​	在不同的浏览器中，可能会也可能不会看到能够自动递增和递减的数值调节按钮（向上和向下按钮）。

​	以上这些属性在 JavaScript 中都能通过对应的元素访问（或修改）。此外，还有两个方法： stepUp()和 stepDown() ，都接收一个可选的参数：要在当前值基础上加上或减去的数值。（默认是加或减 1。）这两个方法还没有得到任何浏览器支持，但下面的例子演示了它们的用法：

```javascript
input.stepUp(); //加 1
input.stepUp(5); //加 5
input.stepDown(); //减 1
input.stepDown(10); //减 10
```

#### 输入模式

​	HTML5 为文本字段新增了 pattern 属性。这个属性的值是一个正则表达式，用于匹配文本框中的值。例如，如果只想允许在文本字段中输入数值，可以像下面的代码一样应用约束：

```html
<input type="text" pattern="\d+" name="count">
```

​	注意，模式的开头和末尾不用加^和$符号（假定已经有了）。这两个符号表示输入的值必须从头到	尾都与模式匹配。

​	与其他输入类型相似，指定 pattern 也不能阻止用户输入无效的文本。这个模式应用给值，浏览器来判断值是有效，还是无效。在 JavaScript 中可以通过 pattern 属性访问模式。

```javascript
var pattern = document.forms[0].elements["count"].pattern;
```

使用以下代码可以检测浏览器是否支持 pattern 属性。

```javascript
var isSupportPattern = "pattern" in document.createElement("input");
```

#### 检测有效性

​	使用 checkValidity() 方法可以检测表单中的某个字段是否有效。所有表单字段都有个方法，如果字段的值有效，这个方法返回 true ，否则返回 false 。字段的值是否有效的判断依据是本节前面介绍过的那些约束。换句话说，必填字段中如果没有值就是无效的，而字段中的值与 pattern 属性不匹配也是无效的。例如：

```javascript
if (document.forms[0].elements[0].checkValidity()){
	//字段有效，继续
} else {
	//字段无效
}
```

​	要检测整个表单是否有效，可以在表单自身调用 checkValidity() 方法。如果所有表单字段都有效，这个方法返回 true ；即使有一个字段无效，这个方法也会返回 false 。

```javascript
if(document.forms[0].checkValidity()){
	//表单有效，继续
} else {
	//表单无效
}
```

​	与 checkValidity() 方法简单地告诉你字段是否有效相比， validity 属性则会告诉你为什么字段有效或无效。这个对象中包含一系列属性，每个属性会返回一个布尔值。

- customError ：如果设置了 setCustomValidity() ，则为 true ，否则返回 false 。

- patternMismatch ：如果值与指定的 pattern 属性不匹配，返回 true 。

- rangeOverflow ：如果值比 max 值大，返回 true 。

- rangeUnderflow ：如果值比 min 值小，返回 true 。

- stepMisMatch ：如果 min 和 max 之间的步长值不合理，返回 true 。

- tooLong ：如果值的长度超过了 maxlength 属性指定的长度，返回 true 。有的浏览器（如Firefox 4）会自动约束字符数量，因此这个值可能永远都返回 false 。

- typeMismatch ：如果值不是 "mail" 或 "url" 要求的格式，返回 true 。

- valid ：如果这里的其他属性都是 false ，返回 true 。 checkValidity() 也要求相同的值。

- valueMissing ：如果标注为 required 的字段中没有值，返回 true 。



  因此，要想得到更具体的信息，就应该使用 validity 属性来检测表单的有效性。下面是一个例子：

  ```javascript
  if (input.validity && !input.validity.valid){
  	if (input.validity.valueMissing){
  		alert("Please specify a value.")
  	} else if (input.validity.typeMismatch){
  		alert("Please enter an email address.");
  	} else {
  		alert("Value is invalid.");
  	}
  }
  ```

  #### 禁用验证

  ​	通过设置 novalidate 属性，可以告诉表单不进行验证。

  ```html
  <form name="xxx" method="post" action="action.py" novalidate>
      <!--插入元素-->
  </form>
  ```

  ​	在 JavaScript 中使用 noValidate 属性可以取得或设置这个值，如果这个属性存在，值为 true ，如果不存在，值为 false ：

  ```javascript
  document.forms[0].noValidate = true;
  ```

  如果一个表单中有多个提交按钮，为了指定点击某个提交按钮不必验证表单，可以在相应的按钮上添加 formnovalidate 属性。

  ```html
  <form method="post" action="foo.php">
  	<!--这里插入表单元素-->
  	<input type="submit" value="Regular Submit">
      <input type="submit" formnovalidate name="btnNoValidate"value="Non-validating Submit">
  </form>
  ```

  在这个例子中，点击第一个提交按钮会像往常一样验证表单，而点击第二个按钮则会不经过验证而提交表单。使用 JavaScript 也可以设置这个属性：

  ```javascript
  //禁用验证
  document.forms[0].elements["btnNoValidate"].formNoValidate = true;
  ```

  ## 选择框脚本

  	选择框是通过 `<select> `和` <option> `元素创建的。为了方便与这个控件交互，除了所有表单字段共有的属性和方法外， HTMLSelectElement 类型还提供了下列属性和方法：

- add(newOption, relOption) ：向控件中插入新` <option> `元素，其位置在相关项（ relOption ）之前。
-  multiple ：布尔值，表示是否允许多项选择；等价于 HTML 中的 multiple 特性。
- options ：控件中所有` <option> `元素的 HTMLCollection 。
- remove(index) ：移除给定位置的选项。
- selectedIndex ：基于 0 的选中项的索引，如果没有选中项，则值为 -1 。对于支持多选的控件，只保存选中项中第一项的索引。
- size ：选择框中可见的行数；等价于 HTML 中的 size 特性。

​	选择框的 type 属性不是 "select-one" ，就是 "select-multiple" ，这取决于 HTML 代码中有没有 multiple 特性。选择框的 value 属性由当前选中项决定，相应规则如下：

- 如果没有选中的项，则选择框的 value 属性保存空字符串。

- 如果有一个选中项，而且该项的 value 特性已经在 HTML 中指定，则选择框的 value 属性等于选中项的 value 特性。即使 value 特性的值是空字符串，也同样遵循此条规则。

- 如果有一个选中项，但该项的 value 特性在 HTML 中未指定，则选择框的 value 属性等于该项的文本。

- 如果有多个选中项，则选择框的 value 属性将依据前两条规则取得第一个选中项的值。

以下面的选择框为例：

```html
<select name="location" id="selLocation">
	<option value="Sunnyvale, CA">Sunnyvale</option>
	<option value="Los Angeles, CA">Los Angeles</option>
	<option value="Mountain View, CA">Mountain View</option>
	<option value="">China</option>
	<option>Australia</option>
</select>
```

​	在 DOM 中，每个` <option> `元素都有一个 HTMLOptionElement 对象表示。为便于访问数据，HTMLOptionElement 对象添加了下列属性：

- index ：当前选项在 options 集合中的索引。
- label ：当前选项的标签；等价于 HTML 中的 label 特性。
- selected ：布尔值，表示当前选项是否被选中。将这个属性设置为 true 可以选中当前选项。
- text ：选项的文本。
- value ：选项的值（等价于 HTML 中的 value 特性）。

​	其中大部分属性的目的，都是为了方便对选项数据的访问。虽然也可以使用常规的 DOM 功能来访问这些信息，但效率是比较低的，如下面的例子所示：

```javascript
var select_box = document.forms[0].elements["location"];
// 不推荐
var text = select_box.firstChild.nodeValue;   // 选项的文本
var valud = select_box.options[0].getAttribute("value");
```

使用属性的方式：

```javascript
var selectbox = document.forms[0].elements["location"];
// 推荐
var text = selectbox.options[0].text; // 选项的文本
var value = selectbox.options[0].value; //
```

### 选择选项

​	对于只允许选择一项的选择框，访问选中项的最简单方式，就是使用选择框的 selectedIndex 属性，如下面的例子所示：

```javascript
var selectedOption = selectbox.options[selectbox.selectedIndex];
```

取得选中项之后，可以像下面这样显示该选项的信息：

```javascript
var selectedIndex = selectbox.selectedIndex;
var selectedOption = selectbox.options[selectedIndex];
alert("Selected index: " + selectedIndex + "\nSelected text: " +
	selectedOption.text + "\nSelected value: " + selectedOption.value);
```

​	这里，我们通过一个警告框显示了选中项的索引、文本和值。

​	对于可以选择多项的选择框， selectedfIndex 属性就好像只允许选择一项一样。设置selectedIndex 会导致取消以前的所有选项并选择指定的那一项，而读取 selectedIndex 则只会返回选中项中第一项的索引值。

​	另一种选择选项的方式，就是取得对某一项的引用，然后将其 selected 属性设置为 true 。例如，下面的代码会选中选择框中的第一项：

```javascript
selectbox.options[0].selected = true;
```

​	与 selectedIndex 不同，在允许多选的选择框中设置选项的 selected 属性，不会取消对其他选中项的选择，因而可以动态选中任意多个项。但是，如果是在单选选择框中，修改某个选项的 selected 属性则会取消对其他选项的选择。需要注意的是，将 selected 属性设置为 false 对单选选择框没有影响。

​	实际上， selected 属性的作用主要是确定用户选择了选择框中的哪一项。要取得所有选中的项，可以循环遍历选项集合，然后测试每个选项的 selected 属性。来看下面的例子：

```javascript
function getSelectedOptions(selectbox){
	var result = new Array();
	var option = null;
	for (var i=0, len=selectbox.options.length; i < len; i++){
			option = selectbox.options[i];
		if (option.selected){
			result.push(option);
		}
	}
	return result;
}
```

​	下面是一个使用 getSelectedOptions() 函数取得选中项的示例：

```javascript
var selectbox = document.getElementById("selLocation");
var selectedOptions = getSelectedOptions(selectbox);
var message = "";
for (var i=0, len=selectedOptions.length; i < len; i++){
	message += "Selected index: " + selectedOptions[i].index +
	"\nSelected text: " + selectedOptions[i].text +
	"\nSelected value: " + selectedOptions[i].value + "\n\n";
}
alert(message);
```

### 添加选项

​	可以使用 JavaScript 动态创建选项，并将它们添加到选择框中。添加选项的方式有很多，第一种方式就是使用如下所示的 DOM方法：

```javascript
var newOption = document.createElement("option");
newOption.appendChild(document.createTextNode("Option text"));
newOption.setAttribute("value", "Option value");
selectbox.appendChild(newOption);
```

​	第二种方式是使用 Option 构造函数来创建新选项，这个构造函数是 DOM 出现之前就有的，一直遗留到现在。 Option 构造函数接受两个参数：文本（ text ）和值（ value ）；第二个参数可选。虽然这个构造函数会创建一个 Object 的实例，但兼容 DOM 的浏览器会返回一个 `<option> `元素。换句话说，在这种情况下，我们仍然可以使用 appendChild() 将新选项添加到选择框中。来看下面的例子：

```javascript
var newOption = new Option("Option text", "Option value");
selectbox.appendChild(newOption); //在 IE8 及之前版本中有问题
```

​	第三种添加新选项的方式是使用选择框的 add() 方法。DOM 规定这个方法接受两个参数：要添加的新选项和将位于新选项之后的选项。如果想在列表的最后添加一个选项，应该将第二个参数设置为null 。在 IE对 add() 方法的实现中，第二个参数是可选的，而且如果指定，该参数必须是新选项之后选项的索引。兼容 DOM 的浏览器要求必须指定第二个参数，因此要想编写跨浏览器的代码，就不能只传入一个参数。这时候，为第二个参数传入 undefined ，就可以在所有浏览器中都将新选项插入到列表最后了。来看一个例子：

```javascript
var newOption = new Option("Option text", "Option value");
selectbox.add(newOption, undefined); //最佳方案
```

### 移除选项

​	与添加选项类似，移除选项的方式也有很多种。首先，可以使用 DOM 的 removeChild() 方法，为其传入要移除的选项，如下面的例子所示：

```javascript
selectbox.removeChild(selectbox.options[0]); //移除第一个选项
```

​	其次，可以使用选择框的 remove() 方法。这个方法接受一个参数，即要移除选项的索引，如下面的例子所示：

```javascript
selectbox.remove(0); //移除第一个选项
```

​	最后一种方式，就是将相应选项设置为 null 。这种方式也是 DOM 出现之前浏览器的遗留机制。例如：

```javascript
selectbox.options[0] = null; //移除第一个选项
```

​	要清除选择框中所有的项，需要迭代所有选项并逐个移除它们，如下面的例子所示：

```javascript
function clearSelectbox(selectbox){
	for(var i=0, len=selectbox.options.length; i < len; i++){
		selectbox.remove(i);
	}
}
```

### 移动和重排选项

​	在 DOM 标准出现之前，将一个选择框中的选项移动到另一个选择框中是非常麻烦的。整个过程要涉及从第一个选择框中移除选项，然后以相同的文本和值创建新选项，最后再将新选项添加到第二个选择框中。而使用 DOM 的 appendChild() 方法，就可以将第一个选择框中的选项直接移动到第二个选择框中。我们知道，如果为 appendChild() 方法传入一个文档中已有的元素，那么就会先从该元素的父节点中移除它，再把它添加到指定的位置。下面的代码展示了将第一个选择框中的第一个选项移动到第二个选择框中的过程：

```javascript
var selectbox1 = document.getElementById("selLocations1");
var selectbox2 = document.getElementById("selLocations2");
selectbox2.appendChild(selectbox1.options[0]);
```

​	移动选项与移除选项有一个共同之处，即会重置每一个选项的 index 属性。

​	重排选项次序的过程也十分类似，最好的方式仍然是使用 DOM 方法。要将选择框中的某一项移动到特定位置，最合适的 DOM 方法就是 insertBefore() ； appendChild() 方法只适用于将选项添加到选择框的最后。要在选择框中向前移动一个选项的位置，可以使用以下代码：

```javascript
var optionToMove = selectbox.options[1];
selectbox.insertBefore(optionToMove, selectbox.options[optionToMove.index-1]);
```

​	以上代码首先选择了要移动的选项，然后将其插入到了排在它前面的选项之前。实际上，第二行代码对除第一个选项之外的其他选项是通用的。类似地，可以使用下列代码将选择框中的选项向后移动一个位置。

```javascript
var optionToMove = selectbox.options[1];
selectbox.insertBefore(optionToMove, selectbox.options[optionToMove.index+2]);
```

## 表单序列化

​	随着 Ajax 的出现，表单序列化已经成为一种常见需求（第 21 章将讨论 Ajax）。在 JavaScript 中，可以利用表单字段的 type 属性，连同 name 和 value 属性一起实现对表单的序列化。在编写代码之前，有必须先搞清楚在表单提交期间，浏览器是怎样将数据发送给服务器的。

- 对表单字段的名称和值进行 URL 编码，使用和号（&）分隔。
- 不发送禁用的表单字段。
- 只发送勾选的复选框和单选按钮。
- 不发送 type 为 "reset" 和 "button" 的按钮。
- 多选选择框中的每个选中的值单独一个条目。
- 在单击提交按钮提交表单的情况下，也会发送提交按钮；否则，不发送提交按钮。也包括 type为 "image" 的 `<input> `元素。
- `<select>` 元素的值，就是选中的 `<option>` 元素的 value 特性的值。如果 `<option>` 元素没有
  value 特性，则是 `<option>` 元素的文本值。

在表单序列化过程中，一般不包含任何按钮字段，因为结果字符串很可能是通过其他方式提交的。除此之外的其他上述规则都应该遵循。以下就是实现表单序列化的代码：

```javascript
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
```

## 富文本编辑

​	富文本编辑，又称为 WYSIWYG（What You See Is What You Get，所见即所得）。在网页中编辑富文本内容，是人们对 Web 应用程序最大的期待之一。虽然也没有规范，但在 IE 最早引入的这一功能基础上，已经出现了事实标准。而且，Opera、Safari、Chrome 和 Firefox 都已经支持这一功能。这一技术的本质，就是在页面中嵌入一个包含空 HTML 页面的 iframe 。通过设置 designMode 属性，这个空白的 HTML 页面可以被编辑，而编辑对象则是该页面` <body> `元素的 HTML 代码。 designMode 属性有两个可能的值： "off" （默认值）和 "on" 。在设置为 "on" 时，整个文档都会变得可以编辑（显示插入符号），然后就可以像使用字处理软件一样，通过键盘将文本内容加粗、变成斜体，等等。

​	可以给 iframe 指定一个非常简单的 HTML 页面作为其内容来源。例如：

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Blank Page for Rich Text Editing</title>
	</head>
	<body>
	</body>
</html>
```

​	这个页面在 iframe 中可以像其他页面一样被加载。要让它可以编辑，必须要将 designMode 设置为 "on" ，但只有在页面完全加载之后才能设置这个属性。因此，在包含页面中，需要使用 onload 事件处理程序来在恰当的时刻设置 designMode ，如下面的例子所示：

```html
<iframe name="richedit" style="height:100px;width:100px;" src="blank.htm"></iframe>
<script type="text/javascript">
	EventUtil.addHandler(window, "load", function(){
		frames["richedit"].document.designMode = "on";
	});
</script>
```

### 使用 contenteditable 属性

​	另一种编辑富文本内容的方式是使用名为 contenteditable 的特殊属性，这个属性也是由 IE 最早实现的。可以把 contenteditable 属性应用给页面中的任何元素，然后用户立即就可以编辑该元素。这种方法之所以受到欢迎，是因为它不需要 iframe 、空白页和 JavaScript，只要为元素设置contenteditable 属性即可：

```javascript
<div class="editable" id="richedit" contenteditable></div>
```

​	这样，元素中包含的任何文本内容就都可以编辑了，就好像这个元素变成了` <textarea> `元素一样。通过在这个元素上设置 contenteditable 属性，也能打开或关闭编辑模式：

```javascript
var div = document.getElementById("richedit");
div.contentEditable = "true";
```

​	contenteditable 属性有三个可能的值： "true" 表示打开、 "false" 表示关闭， "inherit" 表示从父元素那里继承（因为可以在 contenteditable 元素中创建或删除元素）。支持 contenteditable属性的元素有 IE、Firefox、Chrome、Safari 和 Opera。