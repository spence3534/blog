# 变量的解构赋值

## 数组的解构赋值

### 基本用法
ES6允许按照一定模式从数组和对象中提取值，然后对变量进行赋值，这被称为`解构`。

以前，为变量赋值只能直接指定值。
```js
let a = 1;
let b = 2;
let c = 3;
```
ES6允许写成下面这样。
```js
let [a, b, c] = [1, 2, 3];
console.log(a); // 1
console.log(b); // 2
console.log(c); // 3
```
上面的代码表示，可以从数组中提取值，按照对象位置对变量赋值。

本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。下面是一些实用嵌套数组进行解构的例子。
```js
let [foo, [[bar], baz]] = [1, [[2], 3]];

console.log(foo); // 1
console.log(bar); // 2
console.log(baz); // 3

let [ , , third] = ["foo", "bar", "baz"];
console.log(third); // baz

let [x, , y] = [1, 2, 3];
console.log(x); // 1
console.log(y); // 3

let [head, ...tail] = [1, 2, 3, 4];
console.log(head); // 1
console.log(tail); // [2, 3, 4]

let [a, b, ...z] = ['a'];
console.log(a); // a
console.log(b); // undefined
console.log(z); // []
```
如果解构不成功，变量的值就等于`undefined`。
```js
let [foo] = [];
let [bar, foo] = [1];

console.log(foo); // undefined
console.log(bar); // 1
console.log(foo); // undefined
```
以上两种情况都属于解构不成功，`foo`的值都会等于`undefined`。

另一种情况是不完全解构，即等号左边的模式只匹配一部分的等号右边的数组。这种情况下，解构依然可以成功。
```js
let [x, y] = [1, 2, 3];
console.log(x); // 1
console.log(y); // 2

let [a, [b], d] = [1, [2, 3], 4];
console.log(a); // 1
console.log(b); // 2
console.log(d); // 4
```
上面的两个例子都属于不完全解构，但是可以成功。

如果等号的右边不是数组（或者严格来说不是可遍历的结构，后面会讲到），那么将会报错。
```js
// 报错
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};
```
上面的语句都会报错，因为等号右边的值或是专为对象以后不具备`Interator`接口（前五个表达式），或是本身就不具备`Iterator`接口（最后一个表达式）。对于`Set`结构，也可以使用数组的解构赋值。
```js
let [x, y, z] = new Set(['a', 'b', 'c']);
console.log(x); // a
```
事实上，只要某种数据结构具有`Iterator`接口，都可以采用数组形式的解构赋值。
```js
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

let [first, second, third, fourth, fifth, sixth] = fibs();
console.log(sixth); // 5
```
上面的代码中，`fibs`是一个`Generator`函数（后面会详细讲解），原生具有`Iterator`接口。结构赋值会依次从这个接口中获取值。

### 默认值
解构赋值允许指定默认值。
```js
  let [foo = true] = [];
  console.log(foo); // true

  let [x, y = 'b'] = ['a'];
  console.log(x); // a
  console.log(y); // b

  let [bar, tail = 'b'] = ['a', undefined];
  console.log(bar); // a
  console.log(tail); // b

  let [z = 1] = [undefined];
  console.log(z); // 1

  let [b = 1] = [null];
  console.log(b); // null
```
上面的代码中，如果一个数组成员是`null`，默认值就不会生效，因为`null`不严格等于`undefined`。
:::warning
！注意，ES6内部使用严格相等运算符（===）判断一个位置是否有值。所以，如果一个数组成员不严格等于undefined，默认值是不会生效的。
:::
如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到时才会求值。
```js
function f() {
  console.log('aaa');
}

let [x = f()] = [1];
console.log(x); // 1
```
上面的代码中，因为`x`能取到值，所以函数`f`根本不会执行。上面的代码其实等价于下面
的代码。
```js
let x;
if ([1][0] === undefined) {
  x = f();
} else {
  x = [1][0];
}
```
默认值可以引用解构赋值的其他变量，但该变量必须已经声明。
```js
let [x = 1, y = x] = [];
console.log(x); // 1
console.log(y); // 1

let [a = 1, b = a] = [2]; // x=2; y=2
console.log(a); // 2
console.log(b); // 2

let [c = 1, d = c] = [1, 2]; // x=1; y=2
console.log(c); // 1
console.log(d); // 2

let [f = g, g = 1] = [];
console.log(f); // ReferenceError
console.log(g); // ReferenceError
```
上面最后一个表达式之所以会报错，是因为`f`用到默认值`g`时，`g`还没有声明。

## 对象的解构赋值
解构赋值不仅用于数组，还可以对对象进行解构赋值
```js
let { foo, bar } = { foo: "xiaoli", bar: "xiaohong" };

console.log(foo); // xiaoli
console.log(bar); // xiaohong
```

对象的解构和数组的解构有所不同。数组的元素是要按次序排列的，变量的取值是由它的位置决定，但是对象的话，属性没有次序，变量必须和属性同名才能取到正确的值。
```js
let { bar, foo } = { foo: "aaa", bar: "bbb" };

console.log(bar); // bbb
console.log(foo); // aaa
```

上面已经说了，对象解构时，变量必须和属性同名才能够取到正确的值。来看个例子：
```js
let { baz } = { bar: "bbb" };
console.log(baz); // undefined
```
在这个例子中，变量没有对应的同名属性，导致取不到值，最后打印出了`undefined`。

如果变量名与属性名不一致，必须写成下面这样。
```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };

console.log(baz);

let obj = { first: "hello", last: "world" };
let { first: f, last: l } = obj;

console.log(f, l);
```
实际上说明，对象的解构赋值是下面形式的简写。
```js
let { foo: foo, bar: bar } = { foo: "aaa", bar: "bbb" };
```
对象的解构赋值的机制是先找到同名属性，然后再赋值给对应的变量。真正被赋值的是后者，而不是前者。所以大家平时在开发过程中需要注意。
```js
let { foo: baz } = { foo: "aaa", bar: "bbb" };

console.log(baz); // aaa
console.log(foo); // Uncaught ReferenceError: foo is not defined
```
上面的代码中，`foo`是匹配的模式，`baz`才是变量。真正被赋值的是变量`baz`，而不是模式`foo`。

与数组一样的，解构可以用于嵌套结构的对象。
```js
let obj = {
  p: [
    'Hello',
    { y: "world" }
  ]
};

let { p: [x, { y }] } = obj;

console.log(x, y); // Hello world
```
需要注意的是，这时`p`是模式，不是变量，因此不会被赋值，如果`p`也要作为变量赋值，可以写成
下面这样。
```js
let obj = {
  p: [
    'Hello',
    { y: "world" }
  ]
};

let { p, p: [x, { y }] } = obj;

console.log(p); // ["Hello", { y: "world" }]
console.log(x, y); // Hello world
```

看另一个例子。

```js
let node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};

let { loc, loc: { start }, loc: { start: { line } } } = node;
console.log(line); // 1
console.log(loc); // {start: {line: 1, column: 5}}
console.log(start); // { line: 1, column: 5 }
```
上面的例子进行了三次解构赋值，对`loc、start、lin`e三个属性的解构赋值。需要注意的是，最后一次对`line`属性的解构赋值之中，只有`line`是变量，`loc`和`start`都是模式，不是变量。

来看下面的嵌套赋值的例子。
```js
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

console.log(obj); // {prop: 123}
console.log(arr); // true
```
对象的解构也可以指定默认值。
```js
let { x = 3 } = {};
console.log(x); // 3

let { b, y = 5 } = { b: 1 };
console.log(b); // 1
console.log(y); // 5

let { x: y = 3 } = {};
console.log(y); // 3

let { message: msg = 'Something went wrong' } = { };
console.log(msg); // Something went wrong
```
默认值生效的条件是，对象属性值严格等于`undefined`。
```js
let { x = 3 } = { x: undefined };
console.log(x); // 3

let { y = 3 } = { y : null};
console.log(y); // null
```
上面的代码中，如果x属性等于`null`的话，就不严格相等于`undefined`，所以会导致默认值不会生效。

如果解构失败的话，变量的值就等于`undefined`。
```js
let { foo } = { bar: 'bar' };
console.log(foo); // undefined
```
如果解构模式是嵌套的对象的话，而且子对象所在的父属性不存在，也会报错。
```js
// Uncaught TypeError: Cannot read property 'bar' of undefined
let { foo: { bar } } = { baz: "baz" };
```
上面的代码里，等号左边对象的`foo`属性对应一个子对象。该子对象的`bar`属性在解构时会报错，是因为`foo`这时等于`undefined`，再取子属性就会报错，来看下面的代码。
```js
let _tmp = { baz: 'baz' };
console.log(_tmp.foo.baz); // Uncaught TypeError: Cannot read property 'baz' of undefined
```
如果要将一个已经声明的变量用于解构赋值，必须要多加小心。
```js
// Uncaught SyntaxError
let x;
{ x } = { x: 1 };
```
上面的代码写法会报错，是因为JavaScript引擎会将`{x}`理解成一个代码块，从而发生语法错误，只有不将大括号写在行首，避免JavaScript将其解释为代码块，才能够解决这个问题。像下面这样的写法就不会报错了。整个解构赋值语句放在一个圆括号里面就可以了。关于圆括号的问题，后面会讲到。
```js
let x;
( { x } = { x: 1 } );
console.log(x); // 1
```

解构赋值允许等号左边的模式之中不放置任何变量名，因此，可以写出一些古怪的赋值表达式。
```js
({} = [true, false]);
({} = 'abc');
({} = []);
```
像上面的表达式是毫无意义的，但是语法是完全合法的，也不会出现出错。

对象的解构赋值可以很方便地将现有对象的方法赋值到某个变量。
```js
let { log, sin, cos } = Math;
```
上面的代码将Math对象的对数、正弦、余弦三个方法赋值到对应的变量上，使用起来就会方便很多。

由于数组本质就是特殊的对象，因此可以对数组进行对象属性的解构。
```js
let arr = [1, 2, 3];
let { 0: first, [arr.length - 1] : last } = arr;
console.log(first); // 1
console.log(last); // 3
```
上面的代码对数组进行对象解构。数组`arr`的`0`键对应的值是`1`，`[arr.length - 1]`就是`2`键，对应的值是`3`。方括号这种写法属于 “属性名表达式”。后面会讲到。

## 数值和布尔值的解构赋值
解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。
```js
let { toString: s } = 123;
console.log(s === Number.prototype.toString); // true

let { toString: f } = true;
console.log(f === Boolean.prototype.toString); // true
```
上面的例子中，数值和布尔值的包装对象都有`toString`属性，因此变量`s`都能取得到值。

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转成对象，`undefined`和`null`都是无法转成对象，所以对它们进行解构赋值时都会报错。
```js
let { prop: x } = undefined; // Uncaught TypeError
let { prop: y } = null; // Uncaught TypeError
```

## 函数参数的解构赋值
函数的参数也可以使用解构赋值。
```js
function add([x, y]) {
  return x + y;
}
console.log(add([1, 2])); // 3
```
上面的例子中，函数`add`的参数表面上是一个数组，在传入参数的时候，数组参数就被解构成变量`x`和`y`。对于函数内部的代码来说，它们能感受到的参数就是`x`和`y`。

下面是另外一个例子。
```js
const arr = [[1, 2], [3, 4]].map(([a, b]) => a + b);
console.log(arr); // [3, 7]
```
函数参数的解构也可以使用默认值
```js
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

console.log(move({ x: 3, y: 8 })); // [3, 8]
console.log(move({ x: 3 })); // [3, 0]
console.log(move({})); // [0, 0]
console.log(move()); // [0, 0]
```
上面的例子中，函数`move`的参数是一个对象，通过对这个对象进行解构，得到变量`x`和`y`的值。如果解构失败，`x`和`y`等于默认值。

注意，下面的写法会得到不一样的结果。
```js
function move({x, y} = {x: 0, y: 0}){
  return [x, y];
}

console.log(move({x: 3, y: 8})); // [3, 8]
console.log(move({x: 3})); // [3, undefined]
console.log(move({})); // [undefined, undefined]
console.log(move()); // [0, 0]
```
上面的例子是为函数`move`的参数指定默认值，而不是为变量`x`和`y`指定默认值，所以会得到与前一种写法不同的结果。

`undefined`就会触发函数参数的默认值。
```js
const arr = [1, undefined, 3].map((x = 'yes') => x);
console.log(arr); // [1, "yes", 3]
```

## 圆括号问题

### 不能使用圆括号的情况

有三种解构赋值不得使用圆括号

#### 1.变量声明语句
```js
let [(a)] = [1];
let {x: (c)} = {};
```
上面的语句都会报错，因为它们都是变量声明语句，模式不能使用圆括号。只要是变量声明语句，都不能使用圆括号。
如果是使用vscode编辑器的话，会直接提示报错。

#### 2.函数参数
函数参数也属于变量声明，因此不能使用圆括号，如果是vscode编辑器，会直接提示报错
```js
// 报错
function f([(z)]) { return z; }

// 报错
function f([z, (x)]) { return x; }
```

#### 3.赋值语句的模式
```js
// 全部都会报错
({p: a}) = { p: 42 };
([b]) = [5];
```
上面的代码将整个模式放在圆括号之中，导致报错。

```js
// 报错
[({ p: a }), { x: c }] = [{}, {}];
```
上面的代码将一部分模式放在圆括号之中，导致报错。

### 可以使用圆括号的情况

可以使用圆括号的情况只有一种，就是赋值语句的非模式部分可以使用圆括号。
```js
[(b)] = [1];
console.log(b); // 1

({p: (d)} = {p: 4});
console.log(d); // 4

[(parseInt.prop)] = [3];
console.log(parseInt.prop); // 3
```
上面的3行语句都可以正确执行，因为它们都是赋值语句，并不是声明语句。而且它们的圆括号都不属于模式的一部分。第1行语句中，模式是取数组的第1个成员，跟圆括号无关；第2行语句中，模式是`p`而不是d；第3行语句与第1行语句的性质一致。


## 用途
变量的解构赋值用途很多

#### 交换变量的值
```js
let x = 1;
let y = 2;

[x, y] = [y, x];
console.log(`x的值是${x}`, `y的值是${y}`); // x的值是2 y的值是1
```
上面的代码交换变量`x`和`y`的值，这种写法不仅简洁，而且易读，语义非常清晰。

#### 从函数返回多个值
函数只能返回一个值，如果要返回多个值，只能将它们放在数组或对象里面当作返回值，然后使用解构赋值，这样取出这些值就很方便了。
```js
function example() {
  // 返回一个数组
  return [1, 2, 3];
}

let [a, b, c] = example();
console.log(a, b, c); // 1 2 3

function returnObj() {
  // 返回一个对象
  return {
    foo: 1,
    bar: 2
  };
}

let { foo, bar } = returnObj();
console.log(foo, bar); // 1 2
```

#### 函数参数的定义
解构赋值可以方便地将一组参数与变量名对应起来。
```js
function f([x, y, z]) {
  console.log("x的值", x); // x的值 1
  console.log("y的值", y); // y的值 2
  console.log("z的值", z); // z的值 3
}

// 参数是一组有次序的值
f([1, 2, 3]);

function b({x, y, z}) {
  console.log("x的值", x); // x的值 1
  console.log("y的值", y); // y的值 2
  console.log("z的值", z); // z的值 3
}

// 参数是一组无次序的值
b({z: 3, y: 2, x: 1});
```

#### 提取JSON数据
解构赋值用来提取`JSON`对象中的数据是非常有用的。我们在日常开发中，对后端同学返回给我们的数据用解构赋值做处理，方便很多了。
```js
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

const { id, status, data } = jsonData;
console.log(id); // 42
console.log(status); // OK
console.log(data); // [867, 5309]
```
上面就是使用解构赋值快速提取`JSON`数据的值。只要属性正确就可以提取，不用考虑顺序。

#### 遍历Map结构
任何部署了`Iterator`接口的对象都可以用`for...of`循环遍历。`Map`结构原生支持`Iterator`接口，配合变量的解构赋值获取键名和键值就非常方便。
```js
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for(let [key, value] of map) {
  console.log(key + " is " + value);
  // first is hello 
  // second is world
}
```
如果只想获取键名，或者只想获取键值，也可以写成下面这样。
```js
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key] of map) {
  // 获取键名
  console.log(`key is ${key}`);
  // key is first
  // key is second
}

for(let [, value] of map) {
  // 获取键值
  console.log(`value is ${value}`);
  // value is hello
  // value is world
}
```

#### 输入模块的指定方法
加载模块时，往往需要指定输入的方法。解构赋值使得输入语句非常清晰。
```js
const { SourceMapConsumer, SourceNode } = require("source-map");
```