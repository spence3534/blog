# 变量的解构赋值

## 数组的解构赋值

### 基本用法
ES6允许按照一定模式从数组和对象中提取值，然后对变量进行赋值，这被称为解构。
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
如果解构不成功，变量的值就等于undefined。
```js
let [foo] = [];
let [bar, foo] = [1];

console.log(foo); // undefined
console.log(bar); // 1
console.log(foo); // undefined
```
以上两种情况都属于解构不成功，foo的值都会等于undefined。

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
上面的语句都会报错，因为等号右边的值或是专为对象以后不具备Interator接口（前五个表达式），或是本身就不具备Iterator接口（最后一个表达式）。对于Set结构，也可以使用数组的解构赋值。
```js
let [x, y, z] = new Set(['a', 'b', 'c']);
console.log(x); // a
```
事实上，只要某种数据结构具有Iterator接口，都可以采用数组形式的解构赋值。
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
上面的代码中，fibs是一个Generator函数（后面会详细讲解），原生具有Iterator接口。结构赋值会依次从这个接口中获取值。

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
上面的代码中，如果一个数组成员是null，默认值就不会生效，因为null不严格等于undefined。
:::warning
！注意，ES6内部使用严格相等运算符（===）判断一个位置是否有值。所以，如果一个数组成员
不严格等于undefined，默认值是不会生效的。
:::
如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到时才会求值。
```js
function f() {
  console.log('aaa');
}

let [x = f()] = [1];
console.log(x); // 1
```
上面的代码中，因为x能取到值，所以函数f根本不会执行。上面的代码其实等价于下面
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
上面最后一个表达式之所以会报错，是因为f用到默认值g时，g还没有声明。

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
在这个例子中，变量没有对应的同名属性，导致取不到值，最后打印出了undefined。

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
上面的代码中，foo是匹配的模式，baz才是变量。真正被赋值的是变量baz，而不是模式foo。

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
需要注意的是，这时p是模式，不是变量，因此不会被赋值，如果p也要作为变量赋值，可以写成
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
上面的例子进行了三次解构赋值，对loc、start、line三个属性的解构赋值。需要注意的是，最后一次对line属性的解构赋值之中，只有line是变量，loc和start都是模式，不是变量。

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
默认值生效的条件是，对象属性值严格等于undefined。
```js
let { x = 3 } = { x: undefined };
console.log(x); // 3

let { y = 3 } = { y : null};
console.log(y); // null
```
上面的代码中，如果x属性等于null的话，就不严格相等于undefined，所以会导致默认值不会生效。

如果解构失败的话，变量的值就等于undefined。
```js
let { foo } = { bar: 'bar' };
console.log(foo); // undefined
```
如果解构模式是嵌套的对象的话，而且子对象所在的父属性不存在，也会报错。
```js
// Uncaught TypeError: Cannot read property 'bar' of undefined
let { foo: { bar } } = { baz: "baz" };
```
上面的代码里，等号左边对象的foo属性对应一个子对象。该子对象的bar属性在解构时会报错，是因为foo这时等于undefined，再取子属性就会报错，来看下面的代码。
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
上面的代码写法会报错，是因为JavaScript引擎会将{x}理解成一个代码块，从而发生语法错误，只有不将大括号写在行首，避免JavaScript将其解释为代码块，才能够解决这个问题。像下面这样的写法就不会报错了。整个解构赋值语句放在一个圆括号里面就可以了。关于圆括号的问题，后面会讲到。
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
上面的代码对数组进行对象解构。数组arr的0键对应的值是1，[arr.length - 1]就是2键，对应的值是3。方括号这种写法属于 “属性名表达式”。后面会讲到。
