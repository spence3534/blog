# 高级技巧

## 高级函数

函数是JavaScript中最有趣的部分之一。它们本质上是十分简单和过程化的，但也可以是非常复杂和动态的。一些额外的功能可以通过使用闭包来实现。

### 安全的类型检测

在任何值上调用`Object`原生的`toString()`方法，都会返回一个`[object NativeConstructorName]`格式的字符串。每个类的内部都有一个`[[Class]]`属性，这个属性中就指定了上述字符串的构造函数名。举个例子：
```js
var arr = [];
var txt = "xiaohong";

console.log(Object.prototype.toString.call(arr)); // [object Array]
console.log(Object.prototype.toString.call(txt)); // [object String]
```

由于原生数组的构造函数名与全局作用域无关，因此使用`toString()`就能保证返回一致的值。利用这一点，可以创建如下函数：
```js
function isArray(value) {
  return Object.prototype.toString.call(value);
}
```
同样的，也可以基于这一思路来测试某个值是不是原生函数或正则表达式：
```js
function isFunction(value) {
  return Object.prototype.toString.call(value) == "[object Function]";
}

function isRegExp(value) {
  return Object.prototype.toString.call(value) == "[object RegExp]";
}
```
这一技巧也广泛应用于检测原生JSON对象，`Object`的`toString()`方法不能检测非原生构造函数的构造函数名。因此，开发人员定义的任何构造函数都将返回[object Object]。
:::warning
请注意，Object.prototype.toString()本身也可能会被修改。
:::

### 作用域安全的构造函数
构造函数其实就是一个使用new操作符调用的函数。当使用`new`调用时，构造函数内用到的`this`对象会指向新创建的对象实例，如下面的例子所示：
```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}

var person = new Person("xiaohong", 19, "Front end Engineer");
```
上面这个例子中，`Person`构造函数使用`this`对象给三个属性赋值：`name、age`和`job`。当和`new`操作符连用时，则会创建一个新的`Person`对象，同时会给它分配这些属性。问题出在当没有使用`new`操作符来调用该构造函数的情况上。由于该this对象是在运行时绑定的，所以直接调用`Person()`，`this`会映射到全局对象`window`上，导致错误对象属性的意外增加。例如：
```js
var person = Person("xiaohong", 22, "Front end Engineer");

console.log(window.name); // xiaohong
console.log(window.age); // 22
console.log(window.job); // Front end Engineer
```
这里，原本针对Person实例的三个属性被加到window对象上，因为构造函数是作为普通函数调用的，忽略了new操作符。这个问题是由于this对象的晚绑定造成的，在这里this被解析成了window对象。由于window的name属性是用于标识链接目标的frame的，所以这里对该属性的偶然覆盖可能会导致该页面上出现其他错误。这个问题的解决方法就是创建一个作用域安全的构造函数。

作用域安全的构造函数在进行任何更改前，首先确认this对象是正确类型的实例。如果不是，那么会创建新的实例并返回。看下面的例子：
```js
function Person(name, age, job) {
  if (this instanceof Person) {
    this.name = name;
    this.age = age;
    this.job = job;
  } else {
    return new Person(name, age, job);
  }
}

var person1 = Person("xiaohong", 22, "Front end Engineer");
console.log(window.name); // ""
console.log(person1.name); // "xiaohong"

var person2 = new Person("xiaoming", 23, "Back end Engineer");
console.log(person2.name); // "xiaoming"
```
这段代码中的Person构造函数添加了一个检查并确保this对象是Person实例的if语句，它表示要么使用new操作符，要么在现有的Person实例环境中调用构造函数。任何一种情况下，对象初始化都能正常进行。如果this并非Person的实例，那么会再次使用new操作符调用构造函数并返回结果。最后的结果是，调用Person构造函数时无论是否使用new操作符，都会返回一个Person的新实例，这就避免了在全局对象上意外设置属性。

关于作用域安全的构造函数的贴心提示。实现这个模式后，你就锁定了可以调用构造函数的环境。如果你使用构造函数窃取模式的继承且不使用原型链，那么这个继承很可能被破坏。看个例子：
```js
function Polygon(sides) {
  if (this instanceof Polygon) {
    this.sides = sides;
    this.getArea = function() {
      return 0;
    }
  } else {
    return new Polygon(sides);
  }
};

function Rectangle(width, height) {
  Polygon.call(this, 2);
  this.width = width;
  this.height = height;
  this.getArea = function() {
    return this.width * this.height;
  };
}

var rect = new Rectangle(5, 10);
console.log(rect.sides); // undefined
```
在这段代码中。Polygon构造函数是作用域安全的，然而Rectangle构造函数则不是。新创建一个Rectangle实例之后，这个实例应该通过Polygon.call()来继承Polygon的sides属性。但是，由于Polygon构造函数是作用域安全的，this对象并非Polygon的实例，所以会创建并返回一个新的Polygon对象。Rectangle构造函数中的this对象并没有得到增长，同时Polygon.call()返回的值也没有用到，所以Rectangle实例中就不会有sides属性。

如果构造函数窃取结合使用原型链或者寄生组合则可以解决这个问题。考虑以下例子：
```js
function Polygon(sides) {
  if (this instanceof Polygon) {
    this.sides = sides;
    this.getArea = function() {
      return 0;
    }
  } else {
    return new Polygon(sides);
  }
};

function Rectangle(width, height) {
  Polygon.call(this, 2);
  this.width = width;
  this.height = height;
  this.getArea = function() {
    return this.width * this.height;
  };
}

Rectangle.prototype = new Polygon();


var rect = new Rectangle(5, 10);
console.log(rect.sides); // 2
```
上面这段重写的代码中，一个Rectangle实例也同时是一个Polygon实例，所以Polygon.call()
会照原意执行，最终为Rectangle实例添加了sides属性。

### 惰性载入函数

因为浏览器之间行为的差异，多数JavaScript代码包含了大量的if语句，将执行引导到正确的代码中。
看一个简单的例子：
```js
function createXHR() {
  if (typeof XMLHttpRequest != undefined) {
    return new XMLHttpRequest();
  } else if (typeof arguments.callee.activeXString != "string") {
    var versions = ["MSXML2.XMLHttp.6.0"] // ......
  } else {
    throw new Error ("No XHR object available.");
  }
}
```
每次调用createXHR()的时候，它都要对浏览器所支持的能力仔细检查。每次调用该函数都是这样，即
使每次调用时分支的结果都不变：如果浏览器支持内置XHR，那么它就一直支持了，那么这种测试就变得
没必要了。即使只有一个if语句的代码，也肯定比没有if语句的慢，所以如果if语句不必要每次执行，那
么代码可以运行地更快一些。解决方案就是称之为惰性载入的技巧。

惰性载入表示函数执行的分支仅会发生一次。有两种实现惰性载入的方式，第一种就是在函数被调用时再
处理函数。在第一次调用的过程中，该函数会覆盖为另外一个按合适方式执行的函数，这样任何对原函数
的调用都不用再经过执行的分支了。例如，可以用下面的方式使用惰性载入重写createXHR()。
```js
function createXHR() {
  if (typeof XMLHttpRequest != undefined) {
    createXHR = function() {
      return new XMLHttpRequest();
    }
  } else if (typeof arguments.callee.activeXString != "string") {
    createXHR = function() {
      var versions = ["MSXML2.XMLHttp.6.0"];
      // ......
    }
  } else {
    createXHR = function() {
      throw new Error("No XHR object available.");
    }
  }
}
```
这个惰性载入的createXHR()中，if语句的每一个分支都会为createXHR变量赋值，有效覆盖了原有的函
数。最后一步便是调用新赋的函数。下一次调用createXHR()的时候，就会直接调用被分配的函数，这样
就不用再次执行if语句了。

第二种实现惰性载入的方式是在声明函数时就指定适当的函数。这样，第一次调用函数时就不会损失性能
了，而在代码首页加载时会损失一点性能。以下就是按照这一思路重写前面例子的结果。
```js
var createXHR = (function() {
  if (typeof XMLHttpRequest != undefined) {
    return function() {
      return new XMLHttpRequest();
    }
  } else if (typeof arguments.callee.activeXString != "string") {
    return function() {
      var versions = ["MSXML2.XMLHttp.6.0"];
      // ......
    }
  } else {
    return function() {
      throw new Error("No XHR object available.");
    }
  }
})();
```
这个例子中使用的技巧是创建一个匿名、自执行的函数，用以确定应该使用哪一个函数实现。实际的逻辑
都一样。不一样的地方就是第一行代码（使用var定义函数）、新增了自执行的匿名函数，另外每个分支都
返回正确的函数定义，以便立即将其赋值给createXHR()。

惰性载入函数的优点是只在执行分支代码时牺牲一点儿性能。至于哪种方式更合适，就要看具体的需求而定了。

### 函数绑定

函数绑定要创建一个函数，可以在特定的this环境中以指定参数调用另一个函数。该技巧常常和回调函数与
事件一起使用。以便在将函数作为变量传递的同时保留代码的执行环境。看下面的例子：
```js
var handler = {
  message: "Event handled",
  handleClick: function(event) {
    alert(this.message);
  }
};

var btn = document.getElementById("my-btn");
btn.addEventListener('click', handler.handleClick, false);
```
在上面的例子中，当按下该按钮时，就调用该函数，显示一个警告框，警告框应该显示Event handled，结果显示的是undefined。这个问题在于没有保存handler.handleClick()的环境，所以this对象最后是指向了DOM按钮而非handler，我们可以使用一个闭包来修正这个问题。
```js
var handler = {
  message: "Event handled",
  handleClick: function(event) {
    alert(this.message);
  }
};

var btn = document.getElementById("my-btn");
btn.addEventListener('click', function(e) {
  handler.handleClick(e);
}, false);
```
这个解决方案在onclick事件内使用了一个闭包直接调用handler.handleClick()。当然，这是特定于
这段代码的解决方案。创建多个闭包可能会令代码变得难于理解和调试。因此，很多JavaScript库实现
了一个可以将函数绑定到指定环境的函数。这个函数叫bind()。

一个简单的bind()函数接受一个函数和一个环境，并返回一个在给定环境中调用给定函数的函数，并且
将所有参数原封不动传递过去。如下：
```js
function bind(fn, context) {
  return function() {
    return fn.apply(context, arguments);
  }
}
```
这个函数看起来简单，但其功能是非常强大的，在bind()中创建了一个闭包，闭包使用apply()调用传
入的函数，并给apply()传递context对象和参数。这里使用的arguments对象是内部函数的，而非bind()的。
当调用返回函数时，它会给定环境中执行被传入的函数并给出所有参数。bind()函数按如下方式使用：
```js
function bind(fn, context) {
  return function () {
    return fn.apply(context, arguments);
  }
}

handler = {
  message: "hello world",
  handleClick: function(e) {
    alert(this.message);
  }
}

var btn = document.getElementById("my-btn");
btn.addEventListener("click", bind(handler.handleClick, handler));
```
在这个例子中，我们用bind()函数创建了一个保持了执行环境的函数，并将其传给addEventListener()。
event对象也被传给了该函数，如下所示：
```js
function bind(fn, context) {
  return function () {
    return fn.apply(context, arguments);
  }
}

handler = {
  message: "hello world",
  handleClick: function(e) {
    alert(this.message + ":" + e.type);
  }
}

var btn = document.getElementById("my-btn");
btn.addEventListener("click", bind(handler.handleClick, handler));
```
handler.handleClick()方法和平时一样获得了event对象，因为所有的参数都通过被绑定的函数
直接传给了它。

但是有一种更简单的方法，使用ECMAScript5的原生bind()方法，你不用再自己定义bind()函数了，而是
可以直接在函数上调用这个方法。例如：
```js
var handler = {
  message: "hello world",
  handleClick: function(e) {
    alert(this.message + ":" + e.type);
  }
};

var btn = document.getElementById("my-btn");
btn.addEventListener("click", handler.handleClick.bind(handler), false);
```
只要是将某个函数指针以值的形式进行传递，同时该函数必须在特定环境中执行，被绑定函数的效用就突
显出来了。它们主要用于事件以及定时器。被绑定函数与普通函数相比有更多开销，它们需要更多内存，同
时也因为多重函数调用稍微慢一点，所以最好只在必要时使用。

### 函数柯里化

与函数绑定紧密相关的是**函数柯里化**，它用于创建已经设置好了一个或多个参数的函数。函数柯里
化的基本方法和函数绑定是一样的；使用一个闭包返回一个函数。两者的区别在于，当函数被调用时，
返回的函数还需要设置一些传入的参数。看以下例子：
```js
function add(num1, num2) {
  return num1 + num2;
}

function curriedAdd(num2) {
  return add(5, num2);
}

console.log(add(2, 3)); // 5
console.log(curriedAdd(3)); // 8
```
这段代码定义了两个函数：add()和curriedAdd()。后者本质上是在任何情况下第一个参数为5的add()
版本。尽管从技术上来说curriedAdd()并非柯里化的函数，但它很好地展示了其概念。

柯里化函数通常由以下步骤动态创建：调用另一个函数并为它传入要柯里化的函数和必要参数。下面是创
建柯里化函数的通用方式。
```js
function curry(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(innerArgs);
    return fn.apply(null, finalArgs);
  }
}
```
curry()函数的主要工作就是将被返回函数的参数进行排序。curry()的第一个参数是要进行柯里化的函数，其他参数是要传入的值。为了获取第一个参数之后的所有参数，在arguments对象上调用了slice()方法，并传入参数1表示被返回的数组包含从第二个参数开始的所有参数。然后args数组包含了来自外部函数的参数。在内部函数中，创建了innerArgs数组用来存放所有传入的参数（又一次用到了slice()）。有了存放来自外部函数和内部函数的参数数组后，就可以使用concat()方法将它们组合为finalArgs，然后使用apply()将结果传递给该函数。注意这个函数并没有考虑到执行环境，所以调用apply()时第一个参数是null。curry()函数可以按以下方式应用。
```js
function add(num1, num2) {
  return num1 + num2;
}

var curriedAdd = curry(add, 5);
console.log(curriedAdd(3)); // 8
```
在这个例子中，创建了第一个参数绑定为5的add()的柯里化版本。当调用curriedAdd()并传入3时，3会成为add()的第二个参数，同时第一个参数依然是5，最后结果便是和8。也可以像下面例子这样给出所有的函数参数：
```js
function add(num1, num2) {
  return num1 + num2;
}

var curriedAdd = curry(add, 5, 12);
console.log(curriedAdd()); // 17
```

函数柯里化还常常作为函数绑定的一部分包含在其中，构造出更为复杂的bind()函数。例如：
```js
function bind(fn, context) {
  var args = Array.prototype.slice.call(arguments, 2);
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(innerArgs);
    return fn.apply(context, finalArgs);
  };
}
```
对curry()函数的主要更改在于传入的参数个数，以及它如何影响代码的结果。curry()仅仅接受一个要包裹的函数作为参数，而bind()同时接受函数和一个object对象。这表示给被绑定的函数的参数是从第三个开始而不是第二个，这就要更改slice()的第一处调用。另一处更改是在倒数第3行将object对象传给apply()。当使用bind()时，它会返回绑定到给定环境的函数，并且可能它其中某些函数参数
已经被设好。当你想除了event对象再额外给事件传递参数时，这非常有用，例如：
```js
var handler = {
  message: "hello world",
  handleClick: function(name, e) {
    console.log(this.message + ":" + name + ":" + e.type);
  }
}

var btn = document.getElementById("my-btn");
btn.addEventListener("click", bind(handler.handleClick, handler, "my-btn"));
```
在这个更新过的例子中，handler.handleClick()方法接受了两个参数：要处理的元素的名字和e对象。作为第三个参数传递给bind()函数的名字，又被传递给了handler.handleClick()，而handler.handleClick()也会同时接收到e对象。

用ECMAScript5中的bind()方法也能实现函数柯里化，只要在this的值之后再传入另一个参数即可。
```js
var handler = {
  message: "hello world",
  handleClick: function(name, e) {
    console.log(this.message + ":" + name + ":" + e.type);
  }
}

var btn = document.getElementById("my-btn");
btn.addEventListener("click", handler.handleClick.bind(handler, "my-btn"));
```
JavaScript中的柯里化函数和绑定函数提供了强大的动态函数创建功能。使用bind()还是curry()要根据是否需要object对象响应来决定。它们都能用于创建复杂的算法和功能，当然两者都不应滥用，因为每个函数都会带来额外的开销。

## 防篡改对象

:::warning
不过请注意：一旦把对象定义为防篡改，就无法撤销了。
:::

### 不可扩展对象
默认情况下，所有对象都是可以扩展的。任何时候都可以向对象中添加属性和方法。看下面的例子：
```js
var person = { name: "xiaoli" };
person.age = 22;
console.log(person); // name: "xiaoli" age: 22
```
即使第一行代码已经完整定义person对象，但第二行代码仍然能给它添加属性。但使用 **Object.preventExtensions()** 方法可以改变这个行为，让你不能再给对象添加属性和方法。看下面的例子：
```js
var person = { name: "xiaoli" };
Object.preventExtensions(person);
person.age = 22;
console.log(person.age); // undefined
```
在调用了 **Object.preventExtensions()** 方法后，就不能给person对象添加新属性和方法了。

虽然不能给对象添加新成员，但已有的成员则丝毫不受影响。。你仍然还可以修改删除已有的成员。另外，使用 **Object.isExtensible()** 方法还可以确定对象是否可以扩展。
```js
var person = { name: "xiaoli" };
console.log(Object.isExtensible(person)); // true

Object.preventExtensions(person);
console.log(Object.isExtensible(person)); // false
```

### 密封的对象
ECMAScript5为对象定义的第二个保护级别是密封对象。密封对象不可扩展，而且已用成员的[[Configurable]]特性将被设置为false。这就意味着不能删除属性和方法，因为不能使用 **Object.defineProperty()** 把数据修改为访问器属性，或者相反。属性值是可以修改的。

要密封对象，可以使用 **Object.seal()** 方法。
```js
var person = { name: "xiaoli" };
Object.seal(person);

person.age = 19;

console.log(person.age); // undefined

delete person.name;
console.log(person.name); // xiaoli
```
这个例子中，添加age属性的行为被忽略了，而尝试删除name属性的操作也被忽略了，因此这个属性没有受到任何影响。

使用 **Object.isSealed()** 方法可以确定对象是否被密封了，因为被密封的对象不可扩展，所以用 **Object.isExtensible()** 检测密封的对象也会返回false。
```js
var person = { name: "xiaoli" };
console.log(Object.isExtensible(person)); // true
console.log(Object.isSealed(person)); // false

Object.seal(person);
console.log(Object.isSealed(person)); // true
console.log(Object.isExtensible(person)); // false
```

:::warning
虽然对象被密封了，但是还是可以修改对象上原有的属性的值。
:::

### 冻结的对象

最严格的防篡改级别是冻结对象。冻结的对象既不可扩展，又是密封的，而且对象数据属性的[[Writable]]特性会被设置为false。如果定义[[Set]]函数，访问器属性仍然是可写的。ECMAScript5定义了 **Object.freeze()** 方法可以用来冻结对象。
```js
var person = { name: "xiaoli" };
Object.freeze(person);

person.age = 29;
console.log(person.age); // undefined

delete person.name;
console.log(person.name); // xiaoli

person.name = "xiaohong";
console.log(person.name); // xiaoli
```
与密封和不可扩展一样，对冻结的对象执行非法操作在非严格模式下会被忽略，而在严格模式下会抛出错误。

因为冻结对象既是密封的又是不可扩展的，所以用 **Object.isExtensible()** 和 **Object.isSealed()** 检测冻结对象将分别返回false和true。
```js
var person = { name: "xiaoli" };
console.log(Object.isExtensible(person)); // true
console.log(Object.isSealed(person)); // false
console.log(Object.isFrozen(person)); // false

Object.freeze(person);

console.log(Object.isExtensible(person)); // false
console.log(Object.isSealed(person)); // true
console.log(Object.isFrozen(person)); // true
```
## 高级定时器

### 函数防抖
浏览器中某些计算和处理要比其他的昂贵很多。例如，DOM操作比起非DOM交互需要更多的内存和CPU时间。连续尝试进行过多的DOM相关操作可能会导致浏览器挂了，有时候甚至会崩溃。尤其是使用 **onresize** 事件的时候容易发生，当调整浏览器大小的时候，该事件会连续触发。在 **onresize** 事件内部如果尝试进行DOM操作。其高频率的更改可能会让浏览器崩溃。为了解决这一问题，可以使用定时器对该函数进行 **防抖**。

:::danger
在JavaScript高级程序设计3里面为函数节流，实际上是函数防抖。
:::

函数防抖背后的基本思想是指，某些代码不可以在没有间断的情况连续重复执行。第一次调用函数，创建一个定时器，在指定的时间间隔之后运行代码。当第二次调用该函数时，它会清除前一次的定时器并设置另一个。如果前一个定时器已经执行过了，这个操作就没有任何意义。然而，如果前一个定时器尚未执行，其实就是将其替换为一个新的定时器。目的是只有执行函数的请求停止了一段时间之后才执行。以下是该模式的基本形式：
```js
var processor = {
  // 用一个属性来存定时器
  timeoutId: null,

  // 实际进行处理的方法
  performProcessing: function() {
    // 实际执行的代码
    console.log("performProcessing");
  },

  // 初始处理调用的方法
  process: function() {
    clearTimeout(this.timeoutId);

    var that = this;
    this.timeoutId = setTimeout(function (){
      that.performProcessing();
    }, 100);
  }
};

// 尝试进行
processor.process();
```
这段代码中，创建了一个叫做processor对象。这个对象还有两个方法：process()和performProcessing()。前者是初始化任何处理所必须调用的，后者则实际进行应完成的处理。当调用了process()，第一步清除存好的timeoutId，来阻止之前的调用被执行。然后，创建一个新的定时器调用performProcessing()。由于setTimeout()中用到的函数的环境总是window，所以有必要保存this的引用以方便以后使用。

时间间隔设为了100ms，这表示最后一个调用process()之后至少100ms后才会调用performProcessing()。所以如果100ms之内调用了process()共20次，performProcessing()仍只会被调用一次。

这个模式可以使用debounce()函数来简化，这个函数可以自动进行定时器的设置和清除，如下所示：
```js
function debounce(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function() {
    method.call(context);
  }, 100);
}
```
**debounce()** 函数接收两个参数：要执行的函数以及在哪个作用域中执行。上面这个函数首先清除之前设置的任何定时器。定时器ID是存储在函数的tId属性中的，第一次把方法传递给debounce()的时候，这个属性可能并不存在。接下来，创建一个新的定时器，并将其ID储存在方法的tId属性中。如果这是第一次对这个方法调用debounce()的话，那么这段代码会创建该属性。定时器代码使用call()来确保方法在适当的环境中执行。如果没有给第二个参数，那么就在全局作用域内执行该方法。

前面提到过，防抖在resize事件中是最常用的。如果你基于该事件来改变页面布局的话，最好控制处理的频率，以确保浏览器不会在极短的时间内进行过多的计算。例如，假设有一个`<div>`元素需要保持它的高度始终等同于宽度。那么实现这一功能的代码如下编写：
```js
function debounce(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function() {
    method.call(context);
  }, 100);
}

function resizeDiv() {
  var div = document.getElementById("myDiv");
  div.style.height = div.offsetWidth + "px";
}

window.onresize = function() {
  debounce(resizeDiv);
}
```
这里，调整大小的功能被放入了一个叫做 **resizeDiv()** 的单独函数中。然后onresize事件调用debounce()并传入 **resizeDiv**函数，而不是直接调用resizeDiv()。多数情况下，用户是感觉不到变化的，虽然给浏览器节省的计算可能会非常大。

只要代码是周期性执行的。都应该使用防抖，但是你不能控制请求执行的速率。这里展示 **debounce()** 函数用了100ms作为间隔，当然可以根据自己的需要来修改它。

下面的代码是通过模拟用户在频繁点击按钮，使用函数防抖进行性能优化的例子。
```js
window.onload = function() {
  // 通过id获取按钮，并绑定一个click事件
  var myBtn = document.getElementById("debounce");
  myBtn.addEventListener("click", debounce(myDebounce));
}

// 这里的防抖功能函数，接受一个函数作为参数
function debounce(fn) {
  // 声明一个变量用来存定时器的返回值
  let time = null;

  return function() {
    // 首先把前一个定时器先清除
    clearTimeout(time);

    // 设置一个新的定时器，用户如果还点击的话，重新设置定时器
    time = setTimeout(function() {
      fn.call(this, arguments);
    }, 1000);
  };
}

// 需要进行函数防抖的函数
function myDebounce() {
  // 这里是需要做防抖的操作。
  console.log("hello debounce！");
}
```

### 函数节流
关于函数节流的代码实现有很多，下面的throttle函数的原理是，将即将被执行的函数用setTimeout延迟一段时间执行。如果该次延迟执行还没有完成，则不会调用该函数。throttle函数接受2个参数，第一个是要被延迟的函数，第二个参数是延迟执行的时间。
```js
window.onload = function() {
  // 通过id获取按钮，并绑定一个click事件
  var myBtn = document.getElementById("throttle");
  myBtn.addEventListener("click", throttle(function() {
    console.log("hello throttle！");
  }, 1000));
}

function throttle(fn, interval) {
  var _self = fn,  // 保存需要延迟执行的函数
      timer, // 保存定时器的返回值
      firstTime = true; // 是否是第一次调用的值

  return function() {
    var args = arguments; // 这里的arguments其实就是event
    var that = this; // 这里的this直接指向button

    if (!firstTime) { // 如果是第一次调用，不需要延迟执行
      _self.apply(that, args);
      return firstTime = false;
    }

    // 如果定时器还在的话，就说明前一次还没有执行完，所以直接返回false，不往下执行
    // 也就是说timer一开始是为undefined的，如果timer有值的话，就说明定时器还在。
    if (timer) {
      return false;
    }

    timer = setTimeout(function() { // 延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      _self.apply(that, args);
    }, interval || 500);
  }
}
```
下面这个函数节流是结合了时间戳的版本。接收三个参数：一个为需要节流的函数，第二个为设定时间间隔，第三个是执行间隔时长。
```js
function throttle(fn, wait, time) {
  let previous = null; // 用于记录上一次设置的时间
  let timer = null; // 设置定时器的返回值

  return function() {
    // 获取当前的时间戳
    let now = + new Date();

    // 首先用previous变量来做是否是第一次的标识。如果是就把当前时间戳赋给previous变量。
    if (!previous) {
      previous = now;
    }

    // 然后用当前时间戳减去上次时间戳大于设置的执行时间间隔的话，那么就执行一次。
    if (now - previous > time) {
      clearTimeout(timer);
      fn.apply(this, arguments);
      previous = now;
    } else {
      // 否则就用设定时间间隔执行该函数，wait传500毫秒就500毫秒才执行。
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    }
  }
}
```

## 自定义事件

事件是一种叫做观察者的设计模式，是一种创建松散耦合代码的技术。对象可以发布事件，用来表示在该对象的某一时刻到了。然后其他对象可以观察该对象，等待这某一时刻到来并通知运行代码来响应。

观察者模式由两类对象组成：主体和观察者。主体负责发布事件，同时观察者通过订阅这些事件来观察该主体。该模式的一个关键概念是主体并不知道观察者的任何事情，也就是说它可以独自存在并正常运作即使观察者不存在。从另一个方面来说，观察者知道主体并能注册事件的回调函数。就拿DOM来说，DOM元素就是主体，而事件处理代码就是观察者。

事件是与DOM交互的最常见方式，但它们可以用于非DOM代码中----通过实现自定义事件。自定义事件背后的概念是创建一个管理事件的对象，让其他对象监听那些事件。如下：
```js
function EventTarget() {
  this.handlers = {};
}

EventTarget.prototype = {
  constructor:EventTarget,
  addHandler: function(type, handler) {
    if (typeof this.handlers[type] == "undefined") {
      this.handlers[type] = [];
    }

    this.handlers[type].push(handler);
  },

  fire: function(event) {
    if (!event.target) {
      event.target = this;
    }
    if (this.handlers[event.type] instanceof Array) {
      var handlers = this.handlers[event.type];

      for (var i = 0, len = handlers.length; i < len; i ++) {
        handlers[i](event);
      }
    }
  },

  removeHandler: function(type, handler) {
    if (this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type];

      for (var i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i] === handler) {
          break;
        }
      }

      handlers.splice(i, 1);
    }
  }
}
```
**EventTarget**类型有一个单独的属性handlers，用于储存事件处理程序。还有三个方法：addHander()：用于注册给定类型的事件，fire()：是用于触发一个事件，removeHandler()：用于注销某个事件类型的事件。

**addHandler()** 方法接受两个参数：事件类型和用于处理该事件的函数。当调用该方法时，会进行一次检查，看看handlers属性中是否已经存在一个针对该事件类型的数组；如果没有，则创建一个新的。然后使用push()将该处理程序添加到数组末尾。

如果要触发一个事件，要调用**fire()** 函数。该方法接受一个单独的参数，是一个至少包含type属性的对象。fire()方法先给event对象设置一个target属性，如果它尚未被指定的话。然后它就查找对应该事件类型的一组处理程序，调用各个函数，并给出event对象。因为这些都是自定义事件，所以event对象上需要的额外信息由你自己确定。

**removeHandler()** 方法是addHandler()的辅助，接受的参数一样，这个方法搜索事件处理程序的数组找到要删除的处理程序的位置。如果找到了，则使用break退出for循环。然后用splice()方法将该项目从数组中删除。

使用EventTarget类型的自定义事件如下使用：
```js
function handleMessage(event) {
  console.log("Message received：" + event.message);
}

// 创建一个新对象
var target = new EventTarget();

// 添加一个事件
target.addHander("message", handleMessage);

// 执行一个事件
target.fire({type: "message", message: "hello world！"});

// 删除事件
target.removeHandler("message", handleMessage);

// 即使再次执行，也没有响应
target.fire({type: "message", message: "hello world！"});
```
在这段代码中，定义了handleMessage()函数用于处理message事件。它接受event对象并输出message属性。调用target对象的addHandler()方法并传给"message"以及handleMessage()函数。在接下来的一行上，调用了fire()函数，并传递了包含2个属性，即type和message的对象直接量。它会调用message事件的事件处理程序，这样就会在控制台打印了来自handleMessage()里打印的一段文字。然后删除了事件。这样即使事件再次触发，也没有看到控制台的任何响应。

这种功能是封装在一种自定义类型中的，其他对象可以继承EventTarget并获得这个行为，如下所示：
```js
function object(o) {
  function F() { };
  F.prototype = o;
  return new F();
}

function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
};

function Person(name, age) {
  EventTarget.call(this);
  this.name = name;
  this.age = age;
};

inheritPrototype(Person, EventTarget);

Person.prototype.say = function(message) {
  this.fire({type: "message", message: message});
}
```
Person类型使用了寄生组合继承方法继承EventTarget。一旦调用say()方法，就会触发事件，它包含了消息的细节。在某类型的另外的方法中调用fire()方法是很常见的，同时它通常不是公开调用的，请看下面的使用：
```js
function handleMessage(event) {
  console.log(event.target.name + "says：" + event.message);
}

// 创建新的对象
var person = new Person("xiaoli", 19);

// 添加一个事件
person.addHander("message", handleMessage);

// 在该对象上调用1个方法，并触发消息事件
person.say("hello world");
```
这个例子中的handleMessage()函数在控制台打印显示了某人姓名（通过event.target.name获得的）的一个消息正文。当调用say()方法并传递一个消息时，就会触发message事件。接着，它又会调用handleMessage()函数并在控制台打印出消息的正文。

当代码中存在多个部分在特定时刻交互的情况下，自定义事件就非常有用了，这是，如果每个对象都有其他所有对象的引用，那整个代码就会紧密耦合，同时维护也变得困难，因为对某个对象的修改也会影响到其他对象。使用自定义事件有助于解耦相关对象，保持功能的隔绝。很多情况中，触发事件的代码和监听事件的代码是完全分离的。