# 数组扩展

## 扩展运算符
扩展运算符是用三个点`(...)`来标识，就跟rest参数的逆运算一样，将一个数组转为用逗号分隔的参数序列。
```js
console.log(...[1, 2, 3]); // 1 2 3
console.log(1, ...[2, 3, 4], 5); // 1 2 3 4 5
```
一般都是用在函数调用。
```js
function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
console.log(add(...numbers)); // 42
```
以上代码中，`array.push(...items)`和`add(...numbers)`这两行，都是属于函数的调用，并且都使用了扩展运算符。该运算符将一个数组，变为参数序列。

扩展运算符还可以和正常的函数参数结合使用。
```js
function f(v, w, x, y, z) { 
  console.log(v, w, x, y, z); // -1 0 1 2 3
}
const args = [0, 1];
f(-1, ...args, 2, ...[3]);
```
扩展运算符后面还可以使用表达式。
```js
const x = 1;
const arr = [
  ...(x > 0 ? ['a'] : []),
  'b',
];
console.log(arr);
```
如果扩展运算符后面是一个空数组的话，不会产生任何效果。
```js
let arr = [...[], 1];
console.log(arr); // [1]
```

### 代替函数的apply()方法
由于扩展运算符可以用于展开数组，所以不再需要`apply`方法，将数组转为函数的参数了。
```js
// 以前的写法
function f(x, y, z) {
  console.log(x, y, z); // 0 1 2
}

var args = [0, 1, 2];
f.apply(null, args); 

// ES6的写法
function f(x, y, z) {
  console.log(x, y, z); // 0 1 2
}
let args = [0, 1, 2];
f(...args);
```
扩展运算符取代`apply`方法的一个实际的例子，用到`Math.max`方法上，简化求出一个数组最大元素的写法。
```js
// ES5的写法
console.log(Math.max.apply(null, [14, 3, 77])); // 77

// ES6的写法
console.log(Math.max(...[14, 3, 77])); // 77

// 等价于
console.log(Math.max(14, 3, 77)); // 77
```

### 扩展运算符应用
      
#### 复制数组

数组是复合的数据类型，如果直接复制的话，只是复制了指向原数组的指针而已。而不是克隆一个全新的数组，引用类型都有这样的行为。看下面的例子：
```js
const a1 = [1, 2];
const a2 = a1;
a2[0] = 2;
console.log(a1); // [2, 2]
```
上面的例子中，a2并不是克隆a1，而是指向同一个数组的另一个指针而已，修改了a2，同时会影响到a1的变化。

在ES5中只能用变通方法来复制数组。
```js
const a1 = [1, 2];
const a2 = a1.concat();
a2[0] = 3;
console.log(a1); // [1, 2]
console.log(a2); // [3, 2]
```
上面的代码中，a2变量中通过`concat()`方法把a1的数组克隆了一份，a2修改数组的值时，a1并不会受到影响。不知道`concat()`用法的同学，可以去补补基础先。

如果使用扩展运算符的话，也是可以复制数组的，只不过比前面的例子更加简便了。
```js
const a1 = [1, 2];
const a2 = [...a1];
a2[0] = 4;
console.log(a1); // [1, 2]
console.log(a2); // [4, 2]
```

### 合并数组
扩展运算符提供了数组合并的全新写法，在ES5可以使用`concat()`方法实现数组合并。
```js
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5的合并数组
console.log(arr1.concat(arr2, arr3)); // ["a", "b", "c", "d", "e"]

// ES6的合并数组
console.log([...arr1, ...arr2, ...arr3]); // ["a", "b", "c", "d", "e"]
```
但是这两种都是`浅拷贝`，使用的时候需要注意一下。
```js
const a1 = [{ foo: 1 }];
const a2 = [{ bar: 2 }];

const a3 = a1.concat(a2);
const a4 = [...a1, ...a2];

console.log(a3[0] === a1[0]); // true
console.log(a4[0] === a1[0]); // true
```
上面的代码中，`a3`和`a4`是用了两种不同的方式合并的新数组，但是它们的成员都是对原数组成员的引用，这就是浅拷贝。如果修改了引用指向的值，会同步反映到新数组。

### 与解构赋值结合
扩展运算符可以与解构赋值一起使用，用来生成数组。
```js
// ES5的写法
const list = [1, 2, 3, 4, 5];
const a = list[0]; 
const rest = list.slice(1);
console.log(a); // 1
console.log(rest); // [2, 3, 4, 5]

// ES6的写法
const list = [1, 2, 3, 4, 5];
const [a, ...rest] = list;
console.log(a); // 1
console.log(rest); // [2, 3, 4, 5]
```
看另外一个例子。
```js
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest); // [2, 3, 4, 5]

const [a, ...b] = [];
console.log(a); // undefined
console.log(b); // []

const [c, ...d] = ["foo"];
console.log(c); // foo
console.log(d); // []
```

如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则报错。
```js
const [...first, rest] = [1, 2, 3, 4, 5];
// Uncaught SyntaxError: Rest element must be last element

const [a, ...b, c] = [1, 2, 3, 4, 5];
// Uncaught SyntaxError: Rest element must be last element
```

### 实现了Iterator接口的对象
任何定义了`遍历器(Iterator)`接口的对象，都可以用扩展运算符转为真正的数组。
```js
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];
console.log(array); // [div, div, div, div]
```
上面的代码中，`querySelectorAll`方法返回的是一个`NodeList`对象，它并不是一个数组，而是和`arguments`具有一样特征的类数组的对象。可以使用扩展运算符可以将其转为真正的数组，原因就在于`NodeList`对象实现了`Iterator`。

```js
Number.prototype[Symbol.iterator] = function*() {
  let i = 0;
  let num = this.valueOf();
  while (i < num) {
    yield i++;
  }
}

console.log([...5]);
```
上面的代码中，先定义了`Number`对象的遍历器接口，扩展运算符将`5`自动转成`Number`实例以后，就会调用这个接口，就会返回自定义的结果。

对于那些没有部署`Iterator`接口的类似数组的对象，扩展运算符就无法其转为真正的数组。
```js
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};

// Uncaught TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))
let arr = [...arrayLike];
```
上面代码中，`arrayLike`是一个类似数组的对象，但是没有部署`Iterator`接口，扩展运算符就会报错。这时，可以使用`Array.from`方法将`arrayLike`转为真正的数组。

### Map和Set结构，Generator函数
扩展运算符内部调用的是数据结构的`Iterator`接口，因此只要具有`Iterator`接口的对象，都可以使用扩展运算符，比如`Map`结构。
```js
let map = new Map([
  [1, 'noe'],
  [2, 'two'],
  [3, 'three'],
]);
let arr = [...map.keys()];
console.log(arr); // [1, 2, 3]
```
`Generator`函数运行后，返回一个遍历器对象，因此也可以使用扩展运算符。
```js
const go = function*() {
  yield 1;
  yield 2;
  yield 3;
};
console.log([...go()]); // [1, 2, 3]
```
上面的代码中，变量`go`是一个`Generator`函数，执行后返回的是一个遍历器对象，对这个遍历器对象执行扩展运算符，就会将内部遍历得到的值，转为一个数组。

如果对没有`Iterator`接口的对象，使用扩展运算符，将会报错。
```js
const obj = {a: 1, b: 2};
let arr = [...obj]; // Uncaught TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))
```

## Array.from()
`Array.from`方法用于将两类对象转为真正的数组：类数组的对象和可遍历的对象（包括ES6新增的数据结构`Set`和`Map`）。

下面是一个类数组的对象，使用`Array.from`将它转为真正的数组。
```js
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike);

// ES6的写法
var arr2 = Array.from(arrayLike);

console.log(arr1); // ["a", "b", "c"]
console.log(arr2); // ["a", "b", "c"]
```
实际应用中，常见的类数组的对象有`DOM`操作返回的`NodeList`集合，以及函数内部的`arguments`对象。都可以用`Array.form`将其转为真正的数组。
```js
let div = document.querySelectorAll('div');
console.log(Array.from(div)); // []

function fun() {
  let args = Array.from(arguments);
  console.log(args); // []
}
fun();
```
上面的代码中，`querySelectAll`方法返回的是一个类数组的对象，使用`Array.from`可以将这个对象转为真正的数组。函数内部的`arguments`也是如此。

只要是部署了 `Iterator` 接口的数据结构，`Array.from`都能将其转为数组。
```js
console.log(Array.from('hello'));

let namesSet = new Set(['a', 'b']); // ["h", "e", "l", "l", "o"]
console.log(Array.from(namesSet)); // ["a", "b"]
```
上面的代码中，字符串和Set结构都具有 `Iterator` 接口，因此可以被 `Array.from` 转为真正的数组。

如果参数是一个真正的数组，Array.from会返回一个一模一样的新数组。
```js
console.log(Array.from([1, 2, 3])); // [1, 2, 3]
```
扩展运算符`(...)`也可以将某些数据结构转为数组。
```js
function fun() {
  let args = [...arguments];
  return args;
}
console.log(fun()); // []

let div = document.querySelectorAll('div');
console.log([...div]); // []
```
扩展运算符背后调用的其实就是遍历器接口`(Symbol.iterator)`，如果一个对象没有部署这个接口，就无法转换。`Array.from`方法还支持类数组的对象。所谓类数组的对象，本质特征只有一点，必须有`length`属性。因此，任何有`length`属性的对象，都可以使用`Array.from`方法转为数组，而此时扩展运算符就无法转换。
```js
console.log(Array.from({ length: 3 })); // [undefined, undefined, undefined]
```
上面的代码中，`Array.from`返回了一个具有三个成员的数组，每一个位置的值都是`undefined`。扩展运算符转换不了这个对象。

对于那些没有部署该方法的浏览器，可以使用`Array.prototype.slice`方法来代替。
```js
const toArray = (() => 
  Array.from ? Array.from : obj => [].slice.call(obj)
)();

console.log(toArray([1, 2, 3])); // [1, 2, 3]
console.log(toArray({ length: 3 })); // [undefined, undefined, undefined]
```

`Array.from`还可以接受第二个参数，作用类似数组的`map`方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
```js
console.log(Array.from([1, 2, 3], x => x * x)); // [1, 4, 9]
```
看下面的例子，将数组中布尔值为`flase`的成员转为`0`。
```js
console.log(Array.from([1, , 2, , 3,], n => n || 0)); // [1, 0, 2, 0, 3]
```
另一个例子是返回各种数据的类型。
```js
function typesOf() {
  return Array.from(arguments, value => typeof value);
}

console.log(typesOf(null, [], NaN)); // ["object", "object", "number"]
```
如果`map`函数里面用到了`this`关键字，那么`Array.from`还可以传入第三个参数，用来绑定`this`。

`Array.from()`可以将各种值转为数组，并且提供了`map`功能。这意味着，只要有一个原始的数据结构，你就可以对它的值进行处理，然后
转成规范的数据结构，就可以使用很多的数组方法。
```js
console.log(Array.from({ length: 2 }, () => 'jack')); // ["jack", "jack"]
```
上面的代码中，`Array.from`的第一个参数指定了第二个参数运行的次数，这种特性可以让该方法的用法变得非常的灵活。

`Array.from()`的另一个应用是将字符串转为数组，然后返回字符串的长度。
```js
console.log(Array.from('hello')); //  ["h", "e", "l", "l", "o"]
console.log(Array.from('hello').length); // 5
```

## Array.of()
`Array.of`方法用于将一组值，转换为一个数组。
```js
console.log(Array.of(3, 11, 8)); // [3, 11, 8]
console.log(Array.of(3)); // [3]
console.log(Array.of(3).length); // 1
```
这个方法主要的目的，是为了弥补数组构造函数`Array()`的一些不足。因为参数的个数不同，会导致`Array()`的行为有差异。
```js
console.log(Array(3, 11, 8)); // [3, 11, 8]
console.log(Array(3)); // [empty × 3]
console.log(Array()); // []
```
上面的代码中，`Array`方法三个参数、一个参数、没有参数的时候，返回的结果都不一样。只有当参数个数不少于2个时，`Array()`才会返回由
参数组成的新数组。参数个数只有一个时，实际上时指定数组的长度。

`Array.of`基本上可以用来代替`Array()`或`new Array()`，并且不存在由于参数不同而导致的重载。它的行为非常统一。
```js
console.log(Array.of()); // []
console.log(Array.of(undefined)); // [undefined]
console.log(Array.of(1)); // [1]
console.log(Array.of(1, 2)); // [1, 2]
```
`Array.of()`总是返回参数值组成的数组。如果没有参数，就返回一个空数组。

`Array.of()`方法可以用下面的代码实现。
```js
function ArrayOf() {
  return [].slice.call(arguments);
}
console.log(ArrayOf(undefined)); // [undefined]
console.log(ArrayOf(1)); // [1]
console.log(ArrayOf()); // []
console.log(ArrayOf(1, 2)); // [1, 2]
```

## 数组copyWithin()方法
数组实例的`copyWithin()`方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有的成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
```js
Array.prototype.copyWithin(target, start = 0, end = this.length);
```
它接受三个参数：
* `target`（必需）：从该位置开始替换数据。如果为负值，表示倒数。
* `start`（可选）：从该位置开始读取数据，默认为0。如果为负值，表示从末尾开始计算。
* `end`（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

这三个参数都是数字，如果不是的话，会自动转为数值。
```js
console.log([1, 2, 3, 4, 5].copyWithin(0, 2)); // [3, 4, 5, 4, 5]
```
上面的代码表示从数组的下标2开始直到数组结束。那么就是`4`和`5`。复制到数组下标从0开始的位置，结果就覆盖了原来的1和2。
下面更多例子。
```js
// -2相当于3号位
console.log([1, 2, 3, 4, 5].copyWithin(0, -2)); // [4, 5, 3, 4, 5]

// -2相当于3号位，-1相当于从数组的尾部开始计算，相当于4号位
console.log([1, 2, 3, 4, 5].copyWithin(0, -2, -1)); // [4, 2, 3, 4, 5]
```

## 数组find()和findIndex()方法
数组实例的`find`方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回`undefined`。
```js
console.log([1, 4, -5, 10].find((n) => n < 0)); // -5
```
上面的代码找出数组中第一个小于0的成员。
```js
const arr = [1, 5, 10, 15];
const num =  arr.find((value, index, arr) => {
  return value > 9;
});
console.log(num); // 10
```
上面的代码中，`find()`方法的回调函数中接受三个参数：当前的值、当前的位置、和原数组。要注意的是，`find()`方法只会返回第一个符合条件的成员。所以上面的代码中`10`大于`9`，然后返回了10。

数组实例`findIndex`方法的用法和`find`方法类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。
```js
const arr = [1, 5, 10, 15];
const num = arr.findIndex((value, index, arr) => value > 9);
console.log(num); // 2
```
上面的代码中，`findIndex`方法跟`find`方法一样，回调函数同样都是接受三个参数。

这两个方法都可以接受第二个参数，用来绑定回调函数的`this`对象。
```js
function f(v) {
  return v > this.age;
}

let person = { name: 'tutu', age: 18 };

let arr = [19, 12, 20, 15];

const num = arr.find(f, person);

console.log(num); // 19
```
以上的代码中，`find`函数接收了第二个参数`person`对象，回调函数中的`this`对象指向person对象。

另外，这两个方法都可以发现`NaN`，弥补了数组的`indexOf`方法的不足。
```js
console.log([NaN].indexOf(NaN)); // -1
console.log([NaN].findIndex(y => Object.is(NaN, y))); // 0
```
上面的代码中，`indexOf`方法无法识别数组的NaN成员，但是`findIndex`方法可以借助`Object.is`方法做到。

## 数组fill()方法
`fill`方法使用给定的值，填充一个数组。
```js
const arr = ['a', 'b', 'c'];
console.log(arr.fill(7)); // [7, 7, 7]

const arr2 = new Array(3);
console.log(arr2.fill(7)); // [7, 7, 7]
```
以上代码中，`fill`表明用于空数组的初始化非常方便。数组中已有的元素，会被全部抹去，也可以理解为全部被替换。

`fill`方法还可以接受第二个和第三个参数，用来指定填充的起始位置和结束位置。
```js
const arr = ['a', 'b', 'c'];
console.log(arr.fill(7, 1, 2)); // ["a", 7, "c"]
```
上面代码表示，`fill`方法从数组下标1开始，向原数组填充7，到数组下标为2之前结束。

但是要注意的是，如果填充的类型为对象的话，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。
```js
let arr = new Array(3).fill({ name: 'Mike' });
arr[0].name = 'ben';
console.log(arr); // [{name: "ben"}, {name: "ben"}, {name: "ben"}]

let arr2 = new Array(3).fill([]);
arr2[0].push(5);
console.log(arr2); // [[5], [5], [5]]
```