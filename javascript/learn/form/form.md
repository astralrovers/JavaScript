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

