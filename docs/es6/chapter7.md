# 函数的扩展

## 函数参数的默认值

### 基本用法
ES6允许为函数的参数设置默认值，直接写在参数定义的后面。
```js
function log(x, y = "world") {
  console.log(x, y);
}

log("hello"); // hello world
log("hello", "tutu"); // hello tutu
log("hello", ""); // hello
```
ES6的这种写法要比ES5的写法要简洁多了，而且非常自然。看另一个例子。
```js
function Point(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}

let p = new Point();
console.log(p); // {x: 0, y: 0}
```
除了简洁之外，ES6的写法还有两个好处：第一，阅读代码的人可以立刻知道哪些参数是可以省略的。不用查看函数或文档；第二，有利于将来的代码优化，即使未来的版本彻底拿掉这个参数，也不会导致以前的代码无法运行。

参数的变量是默认声明的，所以不能用`let`或`const`再次声明。
```js
function foo(x = 5) {
  let x = 1; // Identifier 'x' has already been declared
  const x = 2; // Identifier 'x' has already been declared
}
```
上面的代码中，参数变量`x`是默认声明的，在函数体中不能用`let`或`const`再次声明，否则会报错。

使用参数默认值时，函数不能有同名参数。
```js
function foo(x, x, y = 1) {
  console.log(x, y);
}
// Uncaught SyntaxError: Duplicate parameter name not allowed in this context
```
还有另一个容易忽略的地方是，参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。
```js
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}
foo(); // 100
x = 100;
foo(); // 101
```
上面的代码中，参数`p`的默认值是`x + 1`。这时，每次调用函数`foo`都会重新计算`x + 1`，而不是默认`p`等于100。

### 与解构赋值默认值结合使用
参数默认值可以与解构赋值的默认值结合起来使用。
```js
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}); // undefined 5
foo({x: 1}); // 1 5
foo({x: 1, y: 2}); // 1 2
foo(); // TypeError: Cannot destructure property 'x' of 'undefined' as it is undefined
```
上面的代码使用了对象的解构赋值默认值，而没有使用函数参数的默认值，只有当函数`foo`的参数是一个对象时，变量x和y才会通过解构赋值而生成，如果函数`foo`调用时参数不是对象，变量`x`和`y`就不会生成，从而报错，只有参数对象没有`y`属性时，`y`的默认值`5`才会生效。

下面是另一个对象的解构赋值默认值的例子。
```js
function fetch(url, {body = '', method = 'GET', headers = {}}) {
  console.log(method);
}

fetch('http://example.com', {}); // GET

fetch('http://example.com'); // TypeError: Cannot read property 'body' of undefined
```
上面的代码中，如果函数`fetch`的第二个参数是一个对象，就可以为它的`3`个属性设置默认值。

上面的写法不能省略第二个参数，如果结合函数参数的默认值，就可以省略第二个参数。这时，就出现了双重默认值。

```js
function fetch(url, {body = '', method = 'GET'} = {}) {
  console.log(method);
}

fetch('http://example.com'); // GET
```
上面的代码中，函数`fetch`没有第二个参数时，函数参数的默认值就会生效，然后才是解构赋值的默认值生效。变量`method`取得默认值`GET`。

下面的两种写法有什么差别呢？
```js
// 写法一
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

// 写法二
function m2({x, y} = {x: 0, y: 0}) {
  return [x, y];
}

// 函数没有参数的情况
console.log(m1()); // [0, 0]
console.log(m2()); // [0, 0]

// 函数有参数的情况
console.log(m1({x: 8, y: 10})); // [8, 10]
console.log(m2({x: 1, y: 2})); // [1, 2]

// x有值，y无值的情况
console.log(m1({x: 2})); // [2, 0]
console.log(m2({x: 1})); // [1, undefined]

// x和y都有值的情况
console.log(m1({})); // [0, 0]
console.log(m2({})); // [undefined, undefined]

console.log(m1({z: 3})); // [0, 0]
console.log(m2({z: 2})); // [undefined, undefined]
```
以上两种写法都对函数的参数设定了默认值，区别在于，写法一中函数参数的默认值是空对象，但是设置了对象解构赋值的默认值；写法二中函数参数的默认值是一个具有属性的函数，但没有设置对象解构赋值的默认值。

### 参数默认值的位置
通常情况下，定义了默认值的参数应该是函数的尾参数（也就是在最后面的参数）。因为这样比较容易看出到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是无法省略的。
// 例子一
```js
function f(x = 1, y) {
  return [x, y];
}

console.log(f()); // [1, undefined]
console.log(f(2)); // [2, undefined]
console.log(f(null, 1)); // [null, 1]
console.log(f(undefined, 1)); // [1, 1]

// 例子二
function fun(x, y = 5, z) {
  return [x, y, z];
}

console.log(fun()); // [undefined, 5, undefined]
console.log(fun(1)); // [1, 5, undefined]
console.log(fun(1, 2)); // [1, 2, undefined]
console.log(fun(1, undefined, 2)); // [1, 5, 2]
```
以上的代码中，有默认值的参数都不是尾参数。这时，无法只省略该参数而不省略其后的参数，除非显式输入`undefined`。

如果传入`undefined`，将触发该参数等于默认值，`null`则没有这个效果。
```js
function foo(x = 5, y = 6) {
  console.log(x, y);
}
foo(undefined, null); // 5 null
```
以上的代码中，x参数对应`undefined`，结果触发了默认值，y参数等于`null`，没有触发默认值。

### 函数的length属性
指定了默认值以后，函数的`length`属性将返回没有指定默认值的参数个数。也就是说，指定默认值后，`length`属性将失真。
```js
console.log((function (a) {}).length); // 1
console.log((function (a = 5){}).length); // 0
console.log((function (a, b, c = 5) {}).length); // 2
```
上面的代码中，`length`属性的返回值等于函数的参数个数减去指定了默认值的参数个数。比如，上面的最后一个函数定义了`3`个参数，其中有一个参数`c`指定了默认值，因此`length`属性等于3减去1，即为2。

这是因为`length`属性的含义是该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。同样的，`rest`参数也不会计入`length`属性。
```js
console.log((function(...args) {}).length); // 0
```
如果设置了默认值的参数不是尾数，那么`length`属性也不再计入后面的参数。
```js
console.log((function (a = 0, b, c) {}).length); // 0
console.log((function (a, b = 1, c) {}).length); // 1
```

### 作用域
一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域。等到初始化结束，这个作用域就消失。这种语法行为在不设置参数默认值时是不会出现的。
```js
var x = 1;
function f(x, y = x) {
  console.log(y);
}
f(2); // 2
```
以上的代码中，参数`y`的默认值等于变量`x`。调用函数f时，参数形成一个单独的作用域。在这个作用域里面，默认值变量`x`指向第一个参数`x`，而不是全局变量`x`，所以打印的是`2`。

再来看看下面的例子。
```js
let x = 1;
function f(y = x) {
  let x = 2;
  console.log(y);
}
f(); // 1
```
以上的代码中，函数`f`调用时，参数`y = x`形成一个单独的作用域。在这个作用域里面，变量`x`本身没定义，所以指向外层的全局变量`x`。函数调用时，函数体内部的局部变量`x`并没有影响到默认值变量`x`。注意的是，如果全局变量`x`不存在，就会报错。

如果参数的默认值是一个函数，该函数的作用域也遵守这个规则。看下面的例子。
```js
let foo = "outer";

function bar(func = x => foo) {
  let foo = 'inner';
  console.log(func());
}

bar(); // outer
```
上面代码中，函数`bar`的参数`func`的默认值是一个匿名函数，返回值为变量`foo`。函数参数形成的单独作用域里面并没有定义变量`foo`，所以`foo`指向外层的全局变量`foo`，因此控制台打印出`outer`。如果`foo`没有被声明也是会直接抛出错误的。
```js
let foo = "outer";

function bar(func = x => foo) {
  let foo = 'inner';
  console.log(func());
}

bar(); // outer
```

来看一个更复杂的例子。
```js
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}

foo(); // 3
console.log(x); // 1
```
上面的代码中，函数`foo`的参数形成一个单独作用域。这个作用域中首先声明了变量`x`，然后声明了变量`y`。`y`的默认值是一个匿名函数，这个匿名函数内部的变量`x`指向同一个作用域的第一个参数`x`。函数`foo`内部又声明了一个内部变量`x`，该变量与第一个参数`x`由于不是同一个作用域，所以不是同一个变量，因此执行`y`后，内部变量`x`和外部全局变量`x`的值都没变。

如果将`var x = 3`的`var`去除，函数`foo`的内部变量`x`就指向第一个参数`x`，与匿名函数内部的`x`是一致的，所以最后输出的就是`2`，而外层的全局变量`x`依然不受影响。
```js
var x = 1;
function foo(x, y = function() { x = 2; }) {
  x = 3;
  y();
  console.log(x);
}
foo(); // 2
console.log(x); // 1
```

### 应用
利用参数默认值可以指定某一个参数不得省略，如果省略就抛出一个错误。
```js
function throwIfMissing() {
  throw new Error ('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}

foo(); // Error: Missing parameter
```
如果调用的时候没有参数，以上代码中的`foo`函数就会调用默认值`throwIfMissing`函数，从而抛出一个错误。

在以上的代码来看，参数`mustBeProvided`的默认值等于`throwIfMissing`函数的运行结果，这表明参数的默认值不是定义时执行的，而是在运行时执行。如果参数已经赋值，默认值中的函数就不会运行。

## rest参数
使用`rest`参数的形式为（...变量名），用于获取函数的多余参数，这样就不需要使用`arguments`对象了。`rest`参数搭配的变量是一个数组，该变量将多余的参数放入其中。
```js
function fun(...values) {
  let sum = 0;

  for (let val of values) {
    sum += val;
  }
  return sum;
}

console.log(fun(1, 2, 3, 4)); // 10
```
上面的代码中的`fun`函数是一个求和函数，利用`rest`参数可以向该函数传入任意数目的参数。下面是一个`rest`参数代替`arguments`变量的例子。
```js
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```
比较上面的两种写法可以发现，`rest`参数的写法更加简洁。

`rest`参数中的变量代表一个数组，所以数组特有的方法都可以用到这个变量上。
```js
function push(array, ...items) {
  items.forEach(item => {
    array.push(item);
    console.log(item);
  });
}

let a = [];
push(a, 1, 2, 3);
```
:::warning
`rest`参数之后就不能再有其他参数，`rest`只能是最后一个参数，否则会报错。还有函数的`length`属性不包括`rest`参数。
:::

## name属性
函数的`name`属性返回该函数的函数名。
```js
function foo() {}
console.log(foo.name); // foo
```
需要注意的是，如果将一个匿名函数赋值给一个变量，ES5的`name`属性会返回空字符串，而ES6的`name`属性会返回实际的函数名。

## 箭头函数

### 基本用法
ES6引入了“箭头”（`=>`）定义函数。
```js
let f = v => v;
console.log(f(1)); // 1
```
上面的代码相当于以下的代码。
```js
let f = function(v) {
  return v;
}
console.log(f(1)); // 1
```
如果箭头函数不需要参数或者需要多个参数，就使用圆括号代表参数部分。
```js
let f = () => 5;
console.log(f());

// 等同于
let f = function() {
  return 5;
}
console.log(f()); // 5

let sum = (number1, number2) => number1 + number2;
console.log(sum(2, 3)); // 5

// 等同于
let sum = function(number1, number2) {
  return number1 + number2;
}
console.log(sum(2, 3)); // 5
```
如果箭头函数的代码块部分多于一条语句，就要使用大括号将其括起来，并使用`return`语句返回。
```js
let sum = (num1, num2) => { return num1 + num2; }
console.log(sum(1, 2)); // 3
```
由于大括号被解析为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号。
```js
let getTempItem = id => ({id: id, name: "tutu"});
console.log(getTempItem(1)); // {id: 1, name: "tutu"}
```
箭头函数可以与变量解构结合使用。
```js
const full = ({first, last}) => `${first} ${last}`;
console.log(full({first: 1, last: 2})); // 1 2

// 等同于
function full(person) {
  return `${person.first} ${person.last}`;
}
console.log(full({first: 1, last: 2})); // 1 2
```
箭头函数使得表达更加简洁。
```js
const isEven = n => n % 2 == 0;
const square = n => n * n;
```
上面的代码只用了两行就定义了两个简单的工具函数，如果不用箭头函数，可能就要占用多行，而且还不如现在这样写醒目。

箭头函数的一个用处是简化回调函数。
```js
// 正常写法
let arr = [1, 2, 3];
let arr1 = arr.map(function(item) {
  return item * item;
});
console.log(arr1); // [1, 4, 9]

// 箭头函数的写法
let arr = [1, 2, 3];
let arr1 = arr.map(item => item * item)
console.log(arr1); // [1, 4, 9]
```

结合`rest`参数和箭头函数使用的例子。
```js
const numbers = (...nums) => nums;
console.log(numbers(1, 2, 3, 4, 5)); // [1, 2, 3, 4, 5]

const headAndTail = (head, ...tail) => [head, tail];
console.log(headAndTail(1, 2, 3, 4, 5)); // [1, [2, 3, 4, 5]]
```

### 箭头函数的注意事项
箭头函数有几个问题在使用时需要注意的，
1. 函数体内的`this`对象就是定义时所在的对象，而不是使用时所在的对象。
2. 不可以当作构造函数，也就是说，不可以使用`new`操作符，否则会抛出一个错误。
3. 不可以使用`arguments`对象，该对象在函数体内不存在。但是可以使用`rest`参数来代替。
4. 不可以使用`yield`命令，因此箭头函数不能用作`Generator`函数。

其中，第一点值得注意的是。`this`对象的指向是可变的，但在箭头函数中它是固定的。
```js
function foo() {
  setTimeout(() => {
    console.log('id', this.id);
  }, 100);
}
var id = 21;

foo.call({ id: 42 });
```
以上的代码中，`setTimeout`的参数是一个箭头函数，这个箭头函数的定义是`foo`函数生成时生效的，而它真正执行要等到`100ms`后。如果是普通函数，执行时`this`应该指向全局对象`window`，这时应该输出`21`。但是，箭头函数导致`this`总是指向函数定义生效时所在的对象，也就是`{id: 42}`，所以输出了`42`。

箭头函数可以让`setTimeout`里面的`this`绑定定义时所在的作用域，而不是指向运行时所在的作用域。看下面的例子。
```js
function Timer() {
  this.s1 = 0;
  this.s2 = 0;

  // 箭头函数
  setInterval(() => this.s1++, 1000);

  // 普通函数
  setInterval(function() {
    this.s2++;
  }, 1000);
}

var timer = new Timer();

setTimeout(() => console.log('s1：', timer.s1), 3100); // s1： 3
setTimeout(() => console.log('s2：', timer.s2), 3100); // s2： 0
```
上面的代码中，`Timer`函数内部设置了两个定时器，分别使用了箭头函数和普通函数。前者的this绑定定义时所在的作用域（即`Timer`函数），后者的this指向运行时所在的作用域（即全局对象）。所以，3100ms之后，`timer.s1`被更新了3次，而`timer.s2`一次都没有更新。

`this`指向的固定化并不是因为箭头函数内部有绑定`this`的机制，实际原因是箭头函数根本没有`this`这一说，导致内部的this就是外层代码块的`this`。正是因为它没有`this`，所以不能用作构造函数。

除了`this`，以下`3`个变量在箭头函数中也是不存在的，都是指向外层函数的对应变量：`arguments、super`和`new.target`。

### 嵌套的箭头函数

箭头函数内部还可以再使用箭头函数。下面是一个ES5语法的多重嵌套函数。
```js
function insert(value) {
  return {into: function(array) {
    return {after: function(afterValue) {
      array.splice(array.indexOf(afterValue) + 1, 0, value);
      return array;
    }};
  }};
}

console.log(insert(2).into([1, 3]).after(1)); // [1, 2, 3]
```
使用箭头函数改写上面的函数。
```js
let insert = (value) => ({into: (array) => ({after: (afterValue) => {
  array.splice(array.indexOf(afterValue) + 1, 0, value);
  return array;
}})});
console.log(insert(2).into([1, 3]).after(1)); // [1, 2, 3]
```

## 尾调用优化

### 什么是尾调用
尾调用是函数式编程的一个重要概念，本身非常简单，就是指某个函数的最后一步是调用另一个函数。
```js
function f(x) {
  return g(x);
}
```
上面的代码中，函数f的最后一步是调用函数`g`，这就是尾调用。

那不属于尾调用又是哪些呢？请看以下代码。
```js
function f(x) {
  let y = g(x);
  return y;
}

function f(x) {
  return g(x) + 1;
}

function f(x) {
  g(x);
}
```
上面的代码中，情况一是调用函数`g`之后还有赋值操作，所以不属于尾调用，即使语义完全一样；情况二也属于调用后还有操作，即使写在一行内；情况三等同于下面的代码。
```js
function f(x) {
  g(x);
  return undefined;
}
```
尾调用不一定出现在函数尾部，只要是最后一步操作即可。
```js
function f(x) {
  if (x > 0) {
    return m(x);
  }
  return n(x);
}
```
上面的代码中，函数`m`和`n`都属于尾调用，因为它们都是函数`f`的最后一步操作。

### 尾调用优化
尾调用之所以与其他调用不同，就在于其特殊的调用位置。

函数调用会在内存形成一个 “调用记录” ，又称为 “调用帧” ，保存调用位置和内部变量等信息。如果在函数`A`的内部调用函数`B`，那么在`A`的调用帧上方会形成一个`B`的调用帧。等到`B`运行结束，将结果返回到`A`，`B`的调用帧才会消失。如果函数`B`内部还调用函数`C`，那就还有一个`C`的调用帧，以此类推。所有的调用帧就形成一个 “调用栈”。

尾调用由于是函数的最后一步操作。所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，直接用内层函数的调用帧取代外层函数的即可。
```js
function f() {
  let m = 1;
  let n = 2;

  return g(m + n);
}

f();

// 等同于
function f() {
  return g(3);
}

f();

// 等同于
g(3);
``` 
上面的代码中，如果函数`g`不是尾调用，函数`f`就需要保存内部变量`m`和`n`的值、`g`的调用位置等信息。但由于调用`g`之后，函数`f`就结束了，所以执行到最后一步，完全可以删除`f(x)`的调用帧，只保留`g(3)`的调用帧。

这就叫作 “尾调用优化”，即保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时调用帧只有一项，这将大大节省内存。这就是 “尾调用优化”的意义。

:::warning
只有不再用到外层函数的内部变量。内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行 “尾调用优化”。
:::

```js
function addOne(a) {
  var one = 1;

  function inner(b) {
    return b + one;
  }

  return inner(a);
}

console.log(addOne(10));
```
上面的函数不会进行尾调用优化，因为内层函数`inner`使用了外层函数`addOne`的内部变量`one`。

### 尾递归
函数调用自身称为递归，如果尾调用自身就称为尾递归。

递归非常耗费内存，因为需要同时保存成百上千个调用帧，很容易产生 “栈溢出”错误。但对于尾递归来说，由于只存在一个调用帧，所以永远都不会发生 “栈溢出”错误。
```js
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
```
以上的代码是一个阶乘函数，计算`n`的阶乘，最多需要保存`n`个调用记录，复杂度为`O(n)`。如果改写成尾递归，只保留一个调用记录，则复杂度为`O(1)`。
```js
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

console.log(factorial(5, 1)); // 120
```
还有一个例子----计算`Fibonacci`数列，也能充分说明尾递归优化的重要性。非尾递归的`Fibonacci`数列实现看下面的例子。
```js
function Fibonacci (n) {
  if (n <= 1) {return 1};
  return Fibonacci(n - 1) + Fibonacci(n - 2);
}

console.log(Fibonacci(10)); // 89
console.log(Fibonacci(100)); // 堆栈溢出 
console.log(Fibonacci(500)); // 堆栈溢出
```
上面的代码中，最后两次打印的`Fibonacci`函数传了`100`和`500`，可以看到浏览器控制台一直都没有结果，是因为数值太大，所以一直在计算，导致堆栈溢出。

尾递归优化的`Fibonacci`数列实现如下。
```js
function Fibonacci2 (n, ac1 = 1, ac2 = 1) {
  if (n <= 1) { return ac2 };
  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}

console.log(Fibonacci2(100));
console.log(Fibonacci2(1000));
console.log(Fibonacci2(10000));
```
由此可见，尾调用优化对递归操作的意义重大，所以一些函数式编程语言将其写入了语言规格。ES6也是如此，第一次明确规定，所有ECMAScript的实现都必须部署尾调用优化。只要使用尾递归，就不会发生栈溢出，可以大大减少内存的占用。