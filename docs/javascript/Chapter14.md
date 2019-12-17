# 表单脚本
## 表单的基础知识
在HTML中，表单是有`<form>`元素来表示的，而在JavaScript中，表单对应的则是HTMLForm-Element类型。HTMLFormElement继承了HTMLElement，因而与其他HTML元素具有相同的默认属性。不过，HTMLFormElement也有它自己下列独有的属性和方法。
* acceptCharset：服务器能够处理的字符集；等价于HTML中的accept-charset特性。
* action：接受请求的URL；等价于HTML中的action特性。
* elements：表单中所有控件的集合（HTMLCollection）。
* enctype：请求的编码类型；等价于HTML中的enctype特性。
* length：表单中控件的数量。
* method：要发送的HTTP请求类型，通常是"get"或"post"；等价于HTML的method特性。
* name：表单的名称；
* reset()：将所有表单域重置为默认值。
* submit()：提交表单。
* target：用于发送请求和接收响应的窗口名称；等价于HTML的target特性。

取得`<form>`元素引用的方式有好几种，最常见的方式就是将它看成与其他元素一样，为其添加id特性，然后再使用getElementById()方法找到它。
```js
var form = document.getElementById("form1");
```
### 提交表单
用户单击提交按钮或图像按钮时，就会提交表单。使用`<input>`或`<button>`都可以定义提交按钮，只要将其type特性的值设置为"submit"即可，而图像按钮则是通过将`<input>`的type特性值设置为"image"来定义的。看下面的例子：
```html
<!-- 通用提交按钮 -->
<input type="submit" value="Submit From">

<!-- 自定义提交按钮 -->
<button type="submit">Submit From</button>

<!-- 图像按钮 -->
<input type="image" src="graphic.gif">
```
只要表单中存在上面列出的任何一种按钮，那么在相应表单控件拥有焦点的情况下，按回车键就可以提交该表单。（textarea是一个例外，在文本区中回车会换行）。如果表单里没有提交按钮，按回车键不会提交表单。

以这种方式提交表单时，浏览器会在将请求发送给服务器之前触发submit事件。这样，我们就有机会验证表单数据，并据以决定是否允许表达提交。阻止这个事件的默认行为就可以取消表单提交。例如：
```js
var form = document.getElementById("myForm");

form.addEventListener("submit", function(event){
  console.log(event);
  // 阻止默认事件
  event.preventDefault();
}, false)
```
调用preventDefault()方法阻止了表单提交。一般来说，在表单数据无效而不能发送给服务器时，可以使用。

在JavaScript中，以编程方式调用submit()方法也可以提交表单。而且，这种方式无需表单包含按钮，任何时候都可以正常提交表单。来看一个例子：
```js
var form = document.getElementById("myForm");
var btn = document.getElementById("myBtn");

btn.onclick = function(event) {
  form.submit();
  console.log("进入");
}
```
在以调用submit()方法的形式提交表单时，不会触发submit事件，因此要记得在调用此方法之前先验证表单数据。

提交表单时出现的最大问题，就是重复提交表单。解决这一问题的办法有两个：在第一次提交表单后就禁用提交按钮，或者利用onsubmit事件取消后续的表单提交操作。

### 重置表单
在用户单击重置按钮时，表单会被重置。使用type特性值为"reset"的`<input>`或`<button>`都可以创建重置按钮，如下面的例子所示。
```html
<!-- 通用重置按钮 -->
<input type="reset" value="Reset Form">

<!-- 自定义重置按钮 -->
<button type="reset">Reset Form</button>
```
这两个按钮都可以用来重置表单。在重置表单时，所有表单字段都会恢复到页面刚加载完毕时的初始值。如果某个字段的初始值为空，就会恢复为空；而带有默认值的字段，也会恢复为默认值。

用户单击重置按钮重置表单时，会触发reset事件。利用这个机会，我们可以在必要时取消重置操作。例如，下面展示了阻止重置表单的代码。
```js
var form = document.getElementById("myForm");

form.addEventListener("reset", function(event) {
  // 阻止表单重置
  event.preventDefault();
}, false)
```
与提交表单一样，也可以通过JavaScript来重置表单，如下面的例子所示。
```js
var form = document.getElementById("myForm");
var reset = document.getElementById("myReset");

reset.onclick = function(event) {
  form.reset();
}
```
与调用submit()方法不同，调用reset()方法会像单击重置按钮一样触发reset事件。

### 表单字段
可以像访问页面中的其他元素一样，使用原生DOM方法访问表单元素。此外，每个表单都有elements属性，该属性是表单中所有表单元素的集合。这个elements集合是一个有序列表，其中包含着表单中的所有字段。每个表单字段在elements集合中的顺序，与它们出现在标记中的顺序相同，可以按照位置和name特性来访问它们。看一个例子：
```js
var form = document.getElementById("myForm");
console.log(form.elements);
// 取得表单中的第一个字段
var input1 = form.elements[0];
console.log(input1);

// 取得名为"UserPhone"的字段
var input2 = form.elements["UserPhone"];
console.log(input2);

// 取得表单中包含的字段的数量
var inputCount = form.elements.length;
console.log(inputCount);
```
如果有多个表单控件都在使用一个name，那么就会返回该name命名的一个NodeList。例如，以下面的HTML代码片段为例：
```html
<form id="myForm">
  <ul>
    <li><input type="radio" name="color" value="red"></li>
    <li><input type="radio" name="color" value="green"></li>
    <li><input type="radio" name="color" value="blue"></li>
  </ul>
</form>
```
在这个HTML表单中，有3个单选按钮，它们的name都是"color"，意味着这3个字段是一起的。在访问elements["color"]时，就会返回一个NodeList，其中包含这3个元素；不过，如果访问elements[0]，则只会返回第一个元素。来看下面的例子：
```js
var form = document.getElementById("myForm");

var colorFields = form.elements["color"];
console.log(colorFields.length); // 3

var firstColorField = colorFields[0];
var firstFormField = form.elements[0];
console.log(firstColorField === firstFormField); // true
```
以上代码显示，通过form.elements[0]访问到的第一个表单字段，与包含在form.elements["color"]中的第一个元素相同。

#### 共有的表单字段属性
除了`<fieldset>`之外，所有表单字段都拥有相同的一组属性。由于`<input>`类型可以表示多中表单字段，因此有些属性只适用于某些字段，但还有一些属性是所有字段所共有的。表单字段共有的属性如下。
* disabled：布尔值，表示当前字段是否被禁用
* form：指向当前字段所属表单的指针；只读。
* name：当前字段的名称。
* readOnly：布尔值，表示当前字段是否只读。
* tabIndex：当前字段的类型，如"checkbox"、"radio"等等。
* value：当前字段将被提交给服务器的值。对文件字段来说，这个属性是只读的，包括文件在计算机中的路径。

除了form属性之外，可以通过JavaScript动态修改其他任何属性。看下面的例子：
```js
var form = document.getElementById("myForm");
var input = form.elements[0];

// 修改value属性
input.value = "Another value";

// 检查form属性的值
console.log(input.form === form);

// 把焦点设置到当前字段
input.focus();

// 禁用当前字段
input.disabled = true;

// 修改type属性（不推荐）
input.type = "checkbox";
```
能够动态修改表单字段属性，意味着我们可以在任何时候，以任何方式来动态操作表单。例如，很多用户可能会重复单击表单的提交按钮。最常见的解决方案，就是在第一次单击后就禁用提交按钮。只要侦听submit事件，并在该事件发生时禁用提交按钮即可。来看一个例子。
```js
var form = document.getElementById("myForm");
form.addEventListener("submit", function(event) {
  var target = event.target;
  console.log(target.elements["submit"]);

  // 取得提交按钮
  var btn = target.elements["submit"];

  // 禁用它
  btn.disabled = true;

  // 阻止默认事件
  event.preventDefault();
}, false)
```
以上代码为表单的submit事件添加了一个事件处理程序。事件触发后，代码取得了提交按钮并将其disabled属性设置为true。但不能通过onclick事件来实现这个功能，因为不同浏览器之间的差异：有的浏览器会在触发表单的submit事件之前触发click事件，而有的浏览器则相反。对于先触发click事件的浏览器，意味着会在提交发生之前禁止按钮，结果永远都不会提交表单。最好是通过submit事件来禁用提交按钮。不过，这种方式不适合表单中不包含提交按钮的情况。只有在包含提交按钮的情况下，才有可能触发表单的submit。

#### 共有的表单字段方法
每个表单字段都有两个方法： **focus()和blur()** 。focus()方法，可以将用户的注意力吸引到页面中的某个部位。例如，在页面加载完毕后，将焦点转移到表单中的第一个字段。
```js
window.addEventListener("load", function(event) {
  document.forms[0].elements[0].focus();
}, false);
```
HTML5为表单新增了一个 **autofocus** 属性。在支持这个属性的浏览器中，只要设置这个属性，不用JavaScript就能自动把焦点移动到相应字段。例如：
```html
<input type="text" autofocus>
```
与 **focus()** 方法相对的是 **blur()** 方法，它的作用是从元素中移走焦点。
```js
document.forms[0].elements[0].blur();
```
**change** 事件对于`<input>`和`<textarea>`元素，在它们失去焦点且value值改变时触发；对于`<select>`元素，在其选项改变时触发。

## 文本框脚本
在HTML中，有两种方式来表现文本框：一种是使用`<input>`元素的单行文本框，另一种是使用`<textarea>`的多行文本框。

### 选择文本
在文本框获得焦点时选择其所有文本，这是一种非常常见的做法。来看下面的例子：
```js
var textbox = document.forms[0].elements["textbox1"];
textbox.addEventListener("focus", function(event){
  var target = event.target;
  target.select();
}, false);
```

#### 取得选择的文本
虽然通过select事件我们可以知道用户什么时候选择了文本，但仍然不知道用户选择了什么文本。HTML通过一些扩展解决了这个问题，以便更顺利地取得选择的文本。该规范采用的办法是添加两个属性：**selectionStart** 和 **selectionEnd**。
```js
function getSelectedText(textbox) {
  return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
}
```
#### 选择部分文本
HTML5也为选择文本框中的部分文本提供了解决方案。除了 **select()** 方法之外，所有文本都有一个 **setSelectionRange()** 方法。这个方法接收两个参数：要选择的第一个字符的引索和要选择的最后一个字符之后的字符的引索。来看一个例子：
```js
var textbox = document.forms[0].elements["textbox1"];
textbox.value = "Hello world！";

// 文本框获取焦点
textbox.select();

// 选择所有文本
var value1 = textbox.setSelectionRange(0, textbox.value.length);

// 选择前3个字符
textbox.setSelectionRange(0, 3);

// 选择第4到第6个字符
textbox.setSelectionRange(4, 7);
```
要看到选择的文本框，必须在调用setSelectionRange()之前或之后立即将焦点设置到文本框。

### 过滤输入
我们经常会要求用户在文本框中输入特定的数据，或者输入特定的格式的数据。例如，包含某些字符，或者必须匹配某种模式。
#### 屏蔽字符
有时候，我们需要用户输入的文本中包含或不包含某些字符。例如，电话号码中不能包含非数值字。
```js
var phone = document.getElementById("userPhone");

phone.addEventListener("keypress", function(event) {
  event = event ? event : window.event;
  var target = event.target || event.srcElement;
  var charCode = event.charCode;

  if (!/\d/.test(String.fromCharCode(charCode))) {
    event.preventDefault();
  }
}, false)
```
这个例子中，我们实现了对用户在输入框中，只允许输入数字。

### 自动切换焦点
使用JavaScript可以从多个方面增强表单字段的易用性。其中，最常见的一种方式就是在用户填写完当前字段时，自动将焦点切换到下一个字段。

为增强易用性，同时加快数据输入，可以在前一个文本框中的字符达到最大数量后，自动将焦点切换到下一个文本框。
```js
(function() {

  function tabForward(event) {
    event = event ? event : window.event;
    var target = event.target;

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

  var textbox1 = document.getElementById("txtTel1"),
      textbox2 = document.getElementById("txtTel2"),
      textbox3 = document.getElementById("txtTel3");

  textbox1.addEventListener("keyup", tabForward);
  textbox2.addEventListener("keyup", tabForward);
  textbox3.addEventListener("keyup", tabForward);
})();
```
### HTML5约束验证API
为了在将表单提交到服务器之前验证数据，HTML5新增了一些功能。有了这些功能，即便JavaScript被禁用或者由于种种原因未能加载，也可以确保基本的验证。

只有在某些情况下表单字段才能进行自动验证。具体来说，就是要在HTML标记中为特定的字段指定一些约束，然后浏览器才会自动执行表单验证。

#### 必填字段
第一种情况是在表单字段中指定了 **required** 属性，如下面的例子所示：
```html
<input type="text" required name="username">
```
任何标注有required的字段，在提交表单时都不能空着。这个属性适用于`<input>、<textarea>`
和`<select>字段`。

#### 其他输入类型
HTML5为`<input>`元素的type属性又新增了几个值。这些新的类型不仅能反映数据类型的信息，而且还能提供一些默认的验证功能。**"email"和"url"** 是两个得到支持最多的类型。例如：
```html
<input type="email" name="email">
<input type="url" name="homepage">
```
#### 数值范围
对所有这些数值类型的输入，可以指定 **min** 属性（最小的可能值）、**max** 属性（最大的可能值）和 **step** 属性（从min到max的两个刻度间的差值）。例如，想让用户只能输入0到100的值，而且这个值必须是5的倍数。代码如下：
```js
<input type="text" min="0" max="100" step="5" name="count">
```
#### 输入模式
HTML5为文本字段新增了 **pattern** 属性。这个属性的值是一个正则表达式，用于匹配文本框中的值。例如，如果只想允许在文本字段中输入数值，可以像下面的代码一样。
```html
<input type="text" pattern="\d+" name="count" id="count">
```
指定pattern也不能阻止用户输入无效的文本。这个模式应用给值，浏览器来判断值是否有效。

#### 检测有效性
使用 **checkValidity()** 方法可以检测表单中的某个字段是否有效。所有表单字段都个方法，如果
字段的值有效，这个方法返回true，否则返回false。看下面的例子：
```html
<input type="number" id="checkNumber" min="0" max="100" step="5" required>
<button type="button" onclick="myFunction()">Click Me</button>
```
```js
function myFunction() {
  var checkInput = document.getElementById("checkNumber");
  if (checkInput.checkValidity()) {
    // 字段有效继续
    alert("有效")
  } else {
    // 字段无效
    alert("无效")
  } 
}                                                     
```
这个例子中，如果输入一个不是5的倍数，就会出现无效字段的弹框。

#### 禁用验证
通过设置 **novalidate** 属性，可以告诉表单不进行验证。
```html
<form method="post" novalidate>
  <!-- 这里插入表单元素 -->
</form>
```
## 选择框脚本
选择框是通过`<select>`和`<option>`元素创建的。为了方便与这个控件交互，除了所有表单字段共有的属性和方法外，还提供了下列属性和方法。
  * add（newOption，relOption）：向控件中插入新`<option>`元素，其位置在相关项（relOption）之前。
  * multiple：布尔值，表示是否允许多项选择；
  * options：控件中所有`<option>`元素的HTMLCollection。
  * remove（index）：移除给定位置的选项。
  * selectedIndex：基于0的选中项的索引，如果没有选中项，则值为-1。对于支持多选的控件，
    只保存选中项中第一项的索引。
  * size：选择框中可见的行数；

选择框的type属性不是 "select-one"，就是 "select-multiple"，这取决于HTML代码中有没有multiple特性。选择框的value属性由当前选中项决定，相应规则如下：
  * 如果没有选中的项，则选择框的value属性保存空字符串。
  * 如果有一个选中项，而且该项的value特性已经在HTML中指定，则选择框的value属性等于选
    中项的value特性。即使value特性的值是空字符串，也同样遵循此条规则。
  * 如果有一个选中项，但该项的value特性在HTML中未指定，则选择框的value属性等于该项的文本。
  * 如果有多个选中项，则选择框的vlaue属性将依据前两条规则取得第一个选中项的值。

以下面的选择框为例：
```html
<select name="location" id="selLocation">
  <option value="Sunnyvale, CA">Sunnyvale</option>
  <option value="Los Angeles, CA">Los Angeles</option>
  <option value="Mountan View, CA">Mountan View</option>
  <option value="">China</option>
  <option>Australia</option>
</select>
```
:::warning 警告
选择框的change事件与其他表单字段的change事件触发的条件不一样。其他表单字段的change事件是
在值被修改且焦点离开当前字段时触发，而选择框的change事件只要选中了选项就会触发。
:::
### 选择选项
对于只允许选择一项的选择框，访问选中项的最简单方式，就是使用选择框的selectedIndex属性，如
下面的例子所示：
```js
var selectbox = document.getElementById("selLocation"),
  selectedOption = selectbox.options[selectbox.selectedIndex],
  selectIndex = selectbox.selectedIndex;
console.log(selectedOption);
console.log("值为 ", selectedOption.value);
console.log("索引为 ", selectIndex);
```
### 添加选项
可以使用JavaScript动态创建选项，并将它们添加到选择框中。添加选项的方式有很多，第一种方式就是使用如下所示的DOM方法。
```js
var selectbox = document.getElementById("selLocation");
var newOption = document.createElement("option");
newOption.appendChild(document.createTextNode("Option text"));
newOption.setAttribute("value", "Option value");

selectbox.appendChild(newOption);
```
第二种方式是使用Option构造函数来创建新选项。Option构造函数接受两个参数：文本（text）和值（value）；第二个参数可选。
```js
var selectbox = document.getElementById("selLocation");
var newOption = new Option("Option text", "Option value");

selectbox.appendChild(newOption);
```
第三种添加新选项的方式是使用选择框的 **add()** 方法。DOM规定这个方法接受两个参数：要添加的新选项和将为于新选项之后的选项。如果想在列表的最后添加一项，应该将第二个参数设置为null。如果编写跨浏览器的代码，将第二个参数传入undefined。来看个例子：
```js
var selectbox = document.getElementById("selLocation");
var newOption = new Option("Option text", "Option value");

selectbox.add(newOption, undefined); // 最佳方案
```
### 移除选项
与添加选项类似，移除选项的方式有很多种。首先，可以使用DOM的removeChild()方法，为其传入要移除的选项，如下面的例子：
```js
var selectbox = document.getElementById("selLocation");
selectbox.removeChild(selectbox.options[0]); // 移除第一个选项
```
其次，可以使用选择框的remove()方法。这个方法接受一个参数，既要移除选项的索引。
```js
var selectbox = document.getElementById("selLocation");
selectbox.remove(0);
```
最后一中方式，就是讲相应选项设置为null。例如：
```js
var selectbox = document.getElementById("selLocation");
selectbox.options[0] = null;
```
要清除选择框中所有的项，需要迭代所有选项并逐个移除它们，下面的例子所示：
```js
var selectbox = document.getElementById("selLocation");
function clearSelectbox(selectbox) {
  for (var i = 0, len = selectbox.options.length; i < len; i++) {
    selectbox.remove(0);
  }
}
clearSelectbox(selectbox);
```
这个函数每次只移除选择框的第一项。由于移除第一选项后，所有后续选项都会自动向上移动一个位置，因此重复移除第一个选项就可以移除所有选项了。

### 移动和重排选项
使用 **appendChild()** 方法传入一个文档中已有的元素，那么就会先从该元素的父节点中移除它，再把它添加到指定的位置。来看个例子：
```js
var selectbox1 = document.getElementById("selLocation1");
var selectbox2 = document.getElementById("selLocation2");

selectbox2.appendChild(selectbox1.options[0]);
```
重排选项次序的过程也十分类似。最好的方式仍然是使用DOM方法。最适合的DOM方法就是**insertBefore()**；看下面的例子：
```js
var selectbox = document.getElementById("selLocation");
var optionToMove = selectbox.options[1];
selectbox.insertBefore(optionToMove, selectbox.options[optionToMove.index - 1]);
```
## 表单序列化
在JavaScript中，可以利用表单字段的type属性，连同name和value属性一起实现对表单的序列化。
表单序列化有以下规则：
* 对表单字段的名称和值进行URL编码，使用和号（&）分隔。
* 不发送禁用的表单字段。
* 只发送勾选的复选框和单选框
* 不发送type为"reset"和"button"的按钮。
* 多选选择框中的每个选中的值单独一个条目。
* 在单击提交按钮提交表单的情况下，也会发送提交按钮；否则，不发送提交按钮。也包括type为"image"的`<input>`元素。
* `<select>`元素的值，就是选中的`<option>`元素的value特性的值。如果`<option>`元素没有value特性，则是`<option>`元素的文本值。
## 富文本编辑
这一技术的本质，就是在页面中嵌入一个包括空HTML页面的 **iframe**。通过设置 **designMode** 属性，这个空白的HTML页面可以被编辑，而编辑对象则是该页面`<body>`元素的HTML代码。designMode属性有两个可能值："off" （默认值）和 "on"。在设置为 "on" 时，整个文档都会变得可以编辑（显示插入符号）然后就可以像使用字处理软件一样，通过键盘将文本内容加粗、变成斜体，等等。

### 使用contenteditable属性
另一种编辑富文本内容的方式是使用名为contenteditable的特殊属性，可以把contenteditable
属性应用给页面中的任何元素，然后用户立即就可以编辑该元素。这里不过多讲解。