# let和const命令

## let命令
ES6新增了let命令，用于声明变量。其用法类似于var，但是所声明的变量只在let命令所在的代码块内有效。
```js
{
  let a = 10;
  var b = 1;
}
console.log(a); // ReferenceError: a is not defined
console.log(b); // 1
```
上面的代码在代码中分别用let和var声明了两个变量。然后在代码块之外调用这两个变量，结果let声明的变量报错，var声明的变量返回了正确的值。这表明，let声明的变量只在其所在代码块内有效。
```js
// for 循环的计数器很适合使用let命令
for (let i = 0; i < 10; i++) {
  // ...
}
console.log(i); // ReferenceError: i is not defined
```
以上代码中的计数器i只在for循环体内有效，在循环体外引用就会报错。下面的代码如果使用var，最后将输出10。
```js
var a = [];

for (var i = 0; i<10; i++) {
  a[i] = function() {
    console.log(i)
  };
};

a[6](); // 10
```
上面的代码中，变量i是var声明的，在全局范围内都有效，所以全局只有一个变量i。每一次循环，变量i的值都会发生改变，而在循环内，被赋给数组a的函数内部的console.log(i)中的i指向全局的i。也就是说，所有数组a的成员中的i指向的都是同一个i，导致运行时输出的是最后一轮的i值，也就是10。
```js
// 如果使用let，声明的变量仅在块级作用域内有效，最后将输出6。
var a = [];

for (let i = 0; i<10; i++) {
  a[i] = function() {
    console.log(i);
  }
}

a[6](); // 6
```
上面的代码中，变量i是let声明的，当前的i只在本轮循环有效。所以每一个次循环的i其实都是一个新的变量，于是最后输出的是6。大家可能会问，如果每一轮循环的变量i都是重新声明的，那它怎么知道上一轮循环的值从而计算出本轮循环的值呢？这是因为JavaScript引擎内部会记住上一轮循环的值，初始化本轮的变量i是，就在上一轮循环的基础上进行计算。另外，for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
```js
for (let i = 0; i< 3; i++) {
  let i = 'abc';
  console.log(i);
  // 打印出三次'abc'
}
```
正确运行以上代码将输出3次abc。这表明函数内部的变量i与循环变量i不在同一个作用域，而是有各自单独的作用域。

### 不存在变量提升 
var命令会发生 “变量提升” 现象，即变量可以在声明之前使用，值为undefined。这中现象多少是有些奇怪的，按照一般的逻辑，变量应该在声明语句之后才可以使用。为了纠正这种现象，let命令改变语法行为，它所声明的变量一定要在声明后使用，否则便会报错。
```js
// var的情况
console.log(foo); // undefined
var foo = 2;

// let的情况
console.log(bar); // ReferenceError
let bar = 2;
```
在以上代码中，变量foo用var命令声明会发生变量提升，即脚本开始运行时，变量foo便已经存在，但是没有值，所以输出undefined。变量bar用let命令则不会发生变量提升，这表示在声明它之前，变量bar是不存在的，这时如果用到它，就会抛出一个错误。

### 暂时性死区
只要块级作用域内存在let命令，它所声明的变量就 “绑定” （binding）这个区域，不再受外部的影响。 
```js
var tmp = 123;

if (true) {
  tmp = "abc"; // ReferenceError
  let tmp;
}
```
上面的代码中存在全局变量tmp，但是块级作用域内let又声明了一个局部变量tmp，导致后者绑定这个块级作用域，所以在let声明变量前，对tmp赋值会报错。
ES6明确规定，如果区块中存在let和const命令，则这个区块对这些命令声明的变量从一开始就形成封闭作用域。只要在声明之前就使用这些变量，就会报错。
总之，在代码内，使用let命令声明变量之前，该变量都是不可用的。这在语法上成为 **“暂时性死区”（temporal dead zone，简称TDZ）**。
```js
if (true) {
  // TDZ开始ss
  tmp = 'abc' // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp);
}
```
上面的代码中，在let命令声明变量tmp之前，都属于变量tmp的 “死区”。“暂时性死区”也意味着typeof不再是一个百分之百安全的操作。 
```js
typeof x; // ReferenceError
let x;
```
上面的代码中，变量x使用let命令声明，所以在声明之前都属于x的“死区”，只要用到该变量就会报错。因此，typeof运行时就会抛出一个ReferenceError作为比较，如果一个变量根本没有被声明，使用typeof反而不会报错。
```js
console.log(typeof undeclared_variable) // undefined
```
上面的代码中，undeclared_variable是一个不存在的变量名，结果返回“undefined”。所以，在没有let之前，typeof运算符是百分之百安全的，永远不会报错。现在这一点不成立了。这样的设计是为了大家养成良好的编程习惯，变量一定要在声明之后使用，否则就会报错。有些“死区”比较隐蔽，不太容易发现。
```js
function bar(x = y, y = 2) {
  return [x, y]
}
bar(); // ReferenceError
```
上面的代码中，调用bar函数之所以报错（某些实现可能不报错），是因为参数x的默认值等于另一个参数y，而此时y还没有声明，属于“死区”。如果y的默认值是x，就不会报错，因为此时x已声明。
```js
function bar(x = 2, y = x) {
  return [x, y]
}
console.log(bar()); [2, 2]
```
另外，下面的代码也会报错，与var的行为不同。
```js
// 不报错
var x = x;

// 报错
let x = x; // ReferenceError
```
以上代码报错也是因为暂时性死区。使用let声明变量时，只要变量在还没有声明前使用，就会报错。以上示例就属于这种情况，在变量x的声明语句还没有执行完成前就尝试获取x的值，导致抛出错误。ES6规定暂时性死区和let、const语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。这样的错误在ES5中是很常见的，现在有了这种规定，避免此类错误就容易了。总之，暂时性死区的本质就是，只要进入当前作用域，所要使用的变量就已经存在，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

### 不允许重复声明
let不允许在相同作用域内重复声明同一个变量。
```js
// 报错
function fun() {
  let a = 10;
  var a = 1;
}
fun();

// 报错
function bar() {
  let a = 10;
  let a = 1;
}
bar();
```
因此，不能在函数内部重新声明参数。
```js
function func(arg) {
  let arg // 报错
}
func();

function func(arg) {
  {
    let arg; // 不报错
  }
}
```

## 块级作用域
### 为什么需要块级作用域
ES5只有全局作用域和函数作用域，没有块级作用域，这导致很多场景不合理。第一种场景，内层变量可能会覆盖外层变量。
```js
var tmp = new Date();
function f() {
  console.log(tmp);
  if (false) {
    var tmp = "hello world";
  }
}
f(); // undefined
```
以上代码的原意是，if代码块的外部使用外层的tmp变量，内部使用内层的tmp变量。但是，函数f执行后，输出结果为undefined，原因在与变量提升导致内层的tmp变量覆盖了外层的tmp变量。第二种场景，用来计数的循环变量泄露为全局变量。
```js
var s = 'hello';
for (var i = 0; i<s.length; i ++) {
  console.log(s[i]);
}
console.log(i); // 5
```
上面的代码中，变量i只用来控制循环，但循环结束后，它并没有消失，而是泄露成了全局变量。

### ES6的块级作用域
let实际上为JavaScript新增了块级作用域。
```js
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
  }
  console.log(n); // 5
}
f1();
```
上面的函数有两个代码块，都声明了变量n，运行后输出5.这表示外层代码块不受内层代码块的影响。如果使用var定义变量n，最后输出的值就是10。ES6允许块级作用域的任意嵌套。
```js
// 这里的代码使用了一个5层的块级作用域。外层作用域无法读取内层作用域的变量。
{{{{
  {let insane = 'Hello world'}
  console.log(insane); // ReferenceError
}}}}
```
内层作用域可以定义外层作用域的同名变量。
```js
{{{{
  let insane = 'Hello world';
  {let insane = 'Hello world';}
}}}};
```
块级作用域的出现，实际上使得获得广泛应用的立即执行匿名函数不再必要了。
```js
// 匿名函数的写法
(function (){
  var tmp = ...;
  ...
}());

// 块级作用域的写法
{
  let tmp = ...;
  ...
}
```

### 块级作用域与函数声明
函数能不能在块级作用域之中声明？这是一个相当令人困惑的问题。ES5规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。
```js
// 情况一
if (true) {
  function f() {}
}

// 情况二
try {
  function f() {}
} catch(e) {
  // ...
}
```
上面两种函数声明在ES5中都是非法的。

但是，浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数，因此上面两种情况实际上都能运行，并不会报错。ES6引入了块级作用域，明确允许在块级作用域之中声明函数。ES6规定，在块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。
```js
function f() { console.log('I am outside!'); };

(function (){
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am outside!'); }
  }

  f();
}())
```
以上代码在ES5中运行会得到“I am outside!”，因为在if内声明的函数f会被提升到函数头部，实际运行的代码如下。
```js
function f() { console.log('I am outside!'); };

(function () {
  function f() { console.log('I am outside!'); }
  if (false) {
  }

  f();
}())
```
而在ES6中运行时完全不一样了，理论上会得到“I am outside!”。因为块级作用域内声明的函数类似于let，对作用域之外没有影响。但是，如果真的在ES6浏览器中运行上面的代码是会报错的，这是为什么呢？原来，如果改变了块级作用域内声明的函数的处理规则，显然对旧代码产生很大影响。为了减轻因此产生的不兼容问题，ES6中规定，浏览器的实现可以不遵守上面的规定，而有自己的行为方式，具体如下：
1. 允许在块级作用域内声明函数。
2. 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
3. 同时，函数声明还会提升到所在的块级作用域的头部。

根据这3条规则，在浏览器的ES6环境中，块级作用域内声明函数的行为类似于var声明变量。
```js
// 浏览器的ES6环境
function f() { console.log('I am outside!'); }
(function() {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am outside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```
上面的代码在符合ES6的浏览器中都会报错，因为实际运行的是以下代码。
```js
  // 浏览器的ES6环境
  function f() { console.log('I am outside!'); }
  (function() {
    var f = undefined
    if (false) {
      function f() { console.log('I am outside!'); }
    }

    f();
  }());
  // Uncaught TypeError: f is not a function
```
考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式的形式，而不是函数声明语句。
```js
// 函数声明语句
{
  let a = 'secret';
  function f() {
    return a;
  }
}

// 函数表达式
{
  let a = 'secret';
  let f = function() {
    return a;
  };
}
```
## const命令
### 基本用法
const声明一个只读的常量。一旦声明，常量的值就不能改变。
```js
const PI = 3.1414;
PI = 3;
// TypeError: Assignment to constant variable.
```
上面的代码表明改变常量的值会报错。const声明的常量不得改变值。这意味着，const一旦声明常量，就必须立即初始化，不能留到以后赋值。
```js
const foo;
// SyntaxError: Missing initializer in const declaration
```
上面的代码表示，对于const而言，只声明不赋值就会报错。const的作用域与let命令相同：只在声明所在的块级作用域有效。
```js
  if (true) {
    const MAX = 5;
  }
  console.log(MAX); // ReferenceError: MAX is not defined
```
const命令声明的常量也不会提升，同样存在暂时性死区，只能在声明后使用。
```js
if (true) {
  console.log(MAX); // ReferenceError
  const MAX = 5;
}
```
上面的代码在常量MAX声明之前就被调用，结果报错。使用const声明常量也与let一样，不可重复声明。
```js
var message = "Hello!";
let age = 25;

// 以下两行都会报错
const message = "Goodbye!";
const age = 30;
```

### 本质
const实际上保证的并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。对于简单类型的数据（数值、字符串、布尔值）而言，值就保存在变量指向的内存地址中，因此等同于常量。但对于复合类型的数据（主要是对象和数组）而言，变量指向的内存地址保存的只是一个指针，const只能保证这个指针是固定的，至于它指向的数据结构是不是可变的，这完全不能控制，因此，将一个对象声明为常量是必须非常小心。
```js
const foo = {};

// 为foo添加一个属性，可以成功
foo.prop = 123;
console.log(foo.prop);

// 将foo指向另一个对象，就会报错
foo = {}; // TypeError
```
上面的代码中，常量foo储存的是一个地址，这个地址指向一个对象。不可变的只是这个地址，即不能把foo指向另一个地址，但对象本身是可变的，所以依然可以为其添加属性。来看另一个例子。
```js
const a = [];
a.push("Hello"); // 可执行
a.length = 0; // 可执行
a = ['Dave']; // TypeError报错
```
上面的代码中，常量a是一个数组，这个数组本身是可写的，但是如果将另一个数组赋值给a，就会报错。

如果真的想将对象冻结，应该使用Object.freeze方法。
```js
const foo = Object.freeze({});

// 在常规模式是，下面一个行不起作用;
// 严格模式是，该行会报错;
foo.prop = 123;

console.log(foo); // 打印出一个空对象
```
上面的代码中，常量foo指向一个冻结的对象，所以添加新属性时不起作用，严格模式时还会报错。

除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数。
```js
  var constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key, i) => {
      if (typeof obj[key] === 'object') {
        constantize(obj[key]);
      }
    })
  }
```
### ES6声明变量的6种方法
ES5只有两种声明变量的方法：使用var命令和function命令，ES6除了添加了let和const命令，后面还会说到另外两种声明变量的方法：使用import命令和class命令。所以，ES6一共有6种声明变量的方法。