# Iterator
      
## Iterator遍历器概念
js现有表示“集合”的数据结构，主要是数组（`Array`）、对象（`Object`）、`Map`、`Set`这四种数据集合。还可以组合使用它们，定义自己的数据结构，例如数组的成员是`Map`，`Map`的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。

遍历器（Iterator）就是这样的一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只需要部署Iterator接口，就可以完成遍历操作。

Iterator的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排序；三是ES6加入了一种新的遍历方法`for...of`循环，Iterator接口主要提供给`for...of`使用。

Iterator的遍历过程有以下三点。
1. 创建一个指针对象，指向当前数据结构的开始位置。实际上，遍历器对象本质上就是一个指针对象罢了。
2. 第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。

每次调用`next`方法，都会返回数据结构的当前成员信息，也就是说，返回一个包含`value`和`done`两个属性的对象。`value`属性就是当前成员的值，`done`属性是一个布尔值，表示遍历是否结束。

下面是模拟`next`方法返回值的例子：
```js
var iterAtor = copyIterator(['a', 'b']);

console.log(iterAtor.next()); // {value: "a", done: false}
console.log(iterAtor.next()); // {value: "b", done: false}
console.log(iterAtor.next()); // {value: undefined, done: true}

function copyIterator(array) {
  var nextIndex = 0;

  return {
    next() {
      return nextIndex < array.length 
        ? { value: array[nextIndex++], done: false } 
        : { value: undefined, done: true }
    }
  }
}
```
上面的代码中定义了一个`copyIterator`函数，是一个遍历器生成函数，作用是返回一个遍历器对象。对数组`['a', 'b']`执行这个函数，就会返回这个数组的遍历器对象（也就是指针对象）`iterAtor`。

指针对象的`next`方法，用于移动指针。开始的时候，指针指向数组的开始位置。每次调用`next`方法，指针就会指向数组的下一个成员。第一个调用的时候，就指向`a`；第二次调用，就指向了`b`。

`next`方法返回一个对象，而这个对象就是当前数据成员的信息。这个对象有两个属性`value`和`done`，`value`属性返回的是当前位置的成员，`done`属性是一个布尔值，表示遍历是否结束，代表着是否还有必要再调用一次`next`方法。

总而言之，调用指针对象的`next`方法，就可以遍历事先给定好的数据结构。

Iterator只是把接口规格加到数据结构之上而已，所以，遍历器与它所遍历的那个数据结构是分开的，这样可以写出一个没有对应数据结构的遍历器对象，也可以说是，用遍历器对象模拟出数据结构。来看下面的例子：
```js
var iterAtor = imitationId();

console.log(iterAtor.next()); // {value: 0, done: false}
console.log(iterAtor.next()); // {value: 1, done: false}

function imitationId() {
  var index = 0;
  return {
    next() {
      return { value: index++, done: false };
    }
  }
}
```
上面的代码中是一个无限循环的遍历器对象的例子，遍历器生成函数`imitationId`，返回一个遍历器对象（也就是指针对象）。可以看到并没有对应的数据结构，也可以说是，遍历器对象自己描述了一个数据结构出来。

## 默认Iterator接口

Iterator接口的目的是为了所有数据结构，提供一种统一的访问机制，即`for...of`循环。当使用`for...of`循环遍历某种数据结构时，会自动去找`Iterator`接口。

一种数据结构只要部署了Iterator接口，这种数据结构就是“可遍历的”（iterable）。

默认的Iterator接口部署在数据结构的`Symbol.iterator`属性，换种说法就是，一个数据结构只要有`Symbol.iterator`属性，就是“可遍历的”（iterable）。`Symbol.iterator`属性本身就是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。
```js
const myObj = {
  [Symbol.iterator]: function() {
    return {
      next: function() {
        return {
          value: 1,
          done: true
        }
      }
    }
  }
};

console.log(myObj[Symbol.iterator]().next());
// {value: 1, done: true}
```
上面的代码中，对象`myObj`是可遍历的（iterble），因为具有`Symbol.iterator`属性。执行这个属性，返回一个遍历器对象。该对象的特征就是有`next`方法，每次调用`next`方法，都会返回一个代表当前成员的信息对象，有`value`和`done`属性。

有一些数据结构原生具有Iterator接口（例如数组），不用做任何处理，就可以被`for...of`循环遍历。因为，这些数据原生部署了`Symbol.iterator`属性，另外有一些数据结构没有（例如对象）。如果部署了`Symbol.iterator`属性的数据结构，就是部署了遍历器接口。调用这个接口就会返回一个遍历器对象。

原生具备Iterator接口的数据结构有：`Array`、`Map`、`Set`、`String`、`TypedArray`、函数的`arguments`对象、`NodeList`对象。

来看个例子：
```js
var arr = [1, 2, 3];
var iter = arr[Symbol.iterator]();

console.log(iter.next()); // {value: 1, done: false}
console.log(iter.next()); // {value: 2, done: false}
console.log(iter.next()); // {value: 3, done: false}
console.log(iter.next()); // {value: undefined, done: true}
```
上面的代码中，变量`arr`是一个数组，原生就有遍历器接口，部署在`arr`的`Symbol.iterator`属性上。所以，调用这个属性，就得到遍历器对象。

对于原生部署Iterator接口的数据结构，不用自己写遍历器生成函数，`for...of`循环会自动遍历它们。除此之外，其他数据结构（主要是对象）的Iterator接口，都需要在`Symbol.iterator`属性上面部署，这样做才会被`for...of`循环遍历。

对象之所以没有默认部署Iterator接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要手动指定。本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历接口，就等于部署一种线性转换。严格的说，对象部署遍历器接口并不是很必要的，因为这时对象实际上被当作Map结构使用。

一个对象如果要具备可被`for...of`循环调用的Iterator接口，就必须在`Symbol.iterator`的属性上部署遍历器生成方法。
```js
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;

    if (value < this.stop) {
      this.value++;
      return { done: false, value: value };
    }
    return { done: true, value: undefined };
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (let value of range(0, 5)) {
  console.log(value);
}
// 0
// 1
// 2
// 3
// 4
```
上面代码是一个类部署Iterator接口的写法。`Symbol.iterator`属性对应一个函数，执行后返回当前对象的遍历器对象。
```js
function Obj(value) {
  this.value = value;
  this.next = null;
}

Obj.prototype[Symbol.iterator] = function() {
  var iterator = { next: next };
  var current = this;

  function next() {
    if (current) {
      var value = current.value;
      current = current.next;
      return { done: false, value: value };
    } else {
      return { done: true };
    }
  }
  return iterator;
}

let a = new Obj(1);
let b = new Obj(2);
let c = new Obj(3);

a.next = b;
b.next = c;

for (let i of a) {
  console.log(i);
}
// 1
// 2
// 3
```
上面代码首先在构造函数的原型链上部署`Symbol.iterator`方法，调用该方法会返回遍历器对象`iterator`，调用该对象的`next`方法，返回一个值的同时，自动将内部指针移到下一个实例。

下面是另一个为对象添加Iterator接口的例子。
```js
let obj = {
  data: ['hello', 'world'],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;

    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};

for (let item of obj) {
  console.log(item);
}
// hello
// world
```
对于类似数组的对象，例如，存在数值键名和`length`属性，需要部署Iterator接口，就是`Symbol.iterator`方法直接引用数组的`Iterator`接口。
```js
const list = document.querySelectorAll('div');

list.__proto__[Symbol.iterator] = Array.prototype[Symbol.iterator];

for (let item of list) {
  console.log(item);
}

console.log([...list]);
```
NodeList对象是类数组的对象，它本身就有遍历接口，可以直接进行遍历。上面的代码中，将它的遍历接口改成数组的`Symbol.iterator`属性。丝毫不受影响。

来看另一个类数组的对象调用数组的`Symbol.iterator`方法的例子：
```js
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};

for(let item of iterable) {
  console.log(item);
}

// a
// b
// c
```
要注意的是普通对象部署数组的`Symbol.iterator`方法，是无效的。
```js
const obj = {
  x: 'x',
  y: 'y',
  n: 'n',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};

for (let item of obj) {
  console.log(item);
}
// undefined
// undefined
// undefined
```
如果`Symbol.iterator`方法对应的不是一个遍历器生成函数，会导致报错。
```js
let obj = {};
obj[Symbol.iterator] = () => 1;

console.log([...obj]);
// TypeError: Result of the Symbol.iterator method is not an object
```
上面的代码中，变量`obj`的`Symbol.iterator`方法对应的不是遍历器生成函数，所以导致报错了。

有了遍历器接口就可以使用`while`循环遍历。也可以使用`for...of`循环遍历。
```js
let iterator = [1, 2, 3, 4, 5, 6, 7][Symbol.iterator]();
let result = iterator.next();

while (!result.done) {
  console.log(result.value);
  result = iterator.next();
}
// 1
// 2
// 3
// 4
// 5
// 6
// 7
```
上面的代码，`iterator`是一个数组，`result`是它的遍历器对象。遍历器对象每次移动指针，都会检查一下返回值的`done`属性，是否为`false`，如果遍历器没结束，就会继续遍历下去。直到`done`属性的值为`true`，就停止了遍历。

## 调用Iterator接口的场景

有些场景会默认调用Iterator（也就是`Symbol.iterator`方法），除了`for...of`循环之外，还有几个场景。

#### 解构赋值
对数组和Set结构进行解构赋值时，会默认调用`Symbol.iterator`方法。
```js
let set = new Set().add('a').add('b').add('c');
let [x, y] = set;

console.log(x, y);
// a b

let [first, ...rest] = set;
console.log(first, rest);
// a ["b", "c"]
```

#### 扩展运算符
扩展运算符（...）也会调用默认的Iterator接口。
```js
let string = 'hello';
console.log([...string]); // ["h", "e", "l", "l", "o"]

let arr = ['b', 'c'];
console.log(['a', ...arr, 'd']); // ["a", "b", "c", "d"]
```
这样就提供了一种机制，可以将任何部署了Iterator接口的数据结构，转为数组。也就是说，只要某个数据结构部署了Iterator接口，就可以对它使用扩展运算符转成数组。

#### yield*
`yield*`后面跟的是一个可遍历的结构，就会调用该结构的遍历器接口。
```js
let  generator = function* () {
  yield 1;
  yield* [2, 3, 4];
  yield 5;
};

var iterator = generator();

console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: 4, done: false}
console.log(iterator.next()); // {value: 5, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

#### 其他场景
由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。如下：
* `for...of`
* `Array.from()`
* `Map()`、`Set()`、`WeakMap()`、`WeakSet()`
* `Promise.all()`
* `Promise.race()`

## 字符串的Iterator接口

字符串是一个类数组的对象，同时具备Iterator接口。
```js
let someString = 'hi';

console.log(typeof someString[Symbol.iterator]);
// function

let iterator = someString[Symbol.iterator]();

console.log(iterator.next()); // {value: "h", done: false}
console.log(iterator.next()); // {value: "i", done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```
上面代码中，调用`Symbol.iterator`方法返回一个遍历器对象，在这个遍历器上可以调用`next()`方法，实现字符串遍历。

可以覆盖原生的`Symbol.iterator`方法，可以达到修改遍历器行为的目的。
```js
var str = new String('hi');
console.log([...str]);
// ["h", "i"]

str[Symbol.iterator] = function() {
  return {
    next() {
      console.log(this);
      if (this._first) {
        this._first = false;

        return { value: "bye", done: false};
      } else {
        return { done: true };
      }
    },
    _first: true
  };
};

console.log([...str]); // ["bye"]
console.log(str); // {"hi", Symbol(Symbol.iterator): ƒ}
```
上面代码中，字符串str的`Symbol.iterator`方法被修改了，所以扩展运算符（`...`）返回的值变成了`bye`，而字符串本身还是`hi`。

## Iterator接口与Generator函数

`Symbol.iterator()`方法的最简单实现，就是使用Generator函数。
```js
let myIterator = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
};
console.log([...myIterator]); // [1, 2, 3]

// 或者可以用下面的简写方法
let obj = {
  * [Symbol.iterator]() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
};

for (let x of obj) {
  console.log(x);
}
// a
// b
// c
```
上面代码中，`Symbol.iterator()`方法几乎不用部署任何代码，只要用`yield`命令列出每一步的返回值就行了。

## 遍历器对象的return()，throw()

遍历器对象除了具有`next()`方法，还可以具有`return()`方法和`throw()`方法。如果自己写遍历器对象生成函数，`next()`方法是必须部署的，`return()`方法和`throw()`方法是可选的。

`return()`方法的使用场景一般在`for...of`循环提前退出（是因为出错，或者有`break`语句），就会调用`return()`方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署`return()`方法。
```js
function readLinesSync(arr) {
  this.arr = arr;
  let self = this;
  let index = 0;
  return {
    [Symbol.iterator]() {
      return {
        next() {
          if (index < self.arr.length) {
            return { value: self.arr[index++], done: false };
          } else {
            return { done: true };
          }
        },

        return() {
          console.log("跳出循环");
          return { done: true };
        }
      }
    }
  };
};
```
上面的代码中，函数`readLinesSync`接受一个数组作为参数，返回一个遍历器对象，这个遍历器对象除了`next()`方法，还部署了`return()`方法。有两种情况会触发这个`return()`方法。
```js
let arr = [1, 2, 3, 4, 5, 6, 7];
let iterator = readLinesSync(arr);
// 情况一
for (let item of readLinesSync(arr)) {
  console.log(item);
  if (item >= arr.length) {
    break;
  }
}

// 情况二
for (let item of readLinesSync(arr)) {
  console.log(item);
  break;
}
```
上面的代码中，情况一是`item`（`arr`数组的成员是数值）的值等于`arr`数组长度时，就会执行`return()`方法；情况二是会在输出数组第一个成员时就执行`return()`方法。

注意，`return()`方法必须返回一个对象，这是Generator语法决定的。

`throw()`方法主要是配合Generator函数使用，一般的遍历器对象用不到这个方法。

## for...of循环
一个数据结构只要部署了`Symbol.iterator`属性，就会被视为具有iterator接口，就可以使用`for...of`循环遍历它的成员。也就是说，`for...of`循环内部调用的是数据结构的`Symbol.iterator`方法。

`for...of`循环可以使用的范围包括数组、`Set`和`Map`结构、某些类数组的对象（例如：`arguments`对象、DOM NodeList对象），还有Generator对象，以及字符串。

### 与其他遍历语法的比较
就拿数组来说，JavaScript有多种遍历语法。最典型的写法就是`for`循环。
```js
let arr = [1, 2, 3, 4, 5, 6, 7];

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```
这种写法相对来说比较麻烦，数组提供了内置的一个方法`forEach`方法。
```js
let arr = [1, 2, 3, 4, 5, 6, 7];

arr.forEach((item) => {
  console.log(item);
});
```
`forEach`的问题在于，无法使用`break`命令或者`return`命令中途退出`forEach`循环。

`for...in`循环可以遍历数组的键名。
```js
let arr = [1, 2, 3, 4, 5, 6, 7];

for (let item in arr) {
  console.log(arr[item]);
}
```

`for...in`循环有几个缺点：
* 数组的键名是数字，但是`for...in`循环是以字符串作为键名“0”、“1”、“2”等等。
* `for...in`循环不仅遍历数字键名，还会遍历手动添加的其他键，包括原型链上的键，这也是为什么`for...in`能遍历`window`对象的原因。
* 某些情况下，`for...in`循环会以任意顺序遍历键名。

反正，`for...in`循环主要是为遍历对象设计的，对于不适合遍历数组这一说法，我个人觉得，也不能这么绝对的说不能遍历数组。也要看应用场景。

`for...of`循环相比上面的几种做法，有一些显著的优点。
```js
let arr = [1, 2, 3, 4, 5, 6, 7];

for (let item of arr) {
  console.log(item);
}
```
* 有着和`for...in`一样的简洁语法，但是没有`for...in`那些缺点。
* 不同于`forEach`方法，它可以和`break`、`continue`和`return`配合使用。
* 提供了遍历所有数据结构的统一操作接口。