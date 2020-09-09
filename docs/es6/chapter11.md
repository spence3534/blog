# Set和Map数据结构

## Set

### 基本用法
ES6加入了一个新的数据结构`Set`。它跟数组相似，主要的区别就在于`Set`的成员的值都是唯一的，没有重复的值。

`Set`是一个构造函数，用来生成`Set`数据结构。
```js
let s = new Set();
let arr = [1, 2, 2, 2, 3, 4, 5];
arr.forEach(item => s.add(item));
console.log(s); // Set(5) {1, 2, 3, 4, 5}
```
上面的代码中，使用`add`方法向`Set`结构加入成员，结果`Set`结构不会添加重复的值。

`Set`函数可以接受一个数组或者具有`iterable`接口的其他数据结构作为参数。
```js
// 例子一
const set = new Set([1, 2, 2, 3, 4]);
console.log([...set]); // [1, 2, 3, 4]

// 例子二
const set = new Set(document.querySelectorAll('div'));
console.log(set); // Set(3) {div, div, div}
```
上面的代码中，例子一中的`Set`接受数组作为参数，例子二中是接受类数组的对象作为参数。

有了`Set`数据结构，我们可以用来当作数组去重的方法。
```js
let arr = [1, 2, 3, 4, 5, 5, 5, 5, 6, 6, 6, 7];
const set = new Set(arr);
console.log([...set]); // [1, 2, 3, 4, 5, 6, 7]
```
也可以用于去除字符串里面重复的字符。
```js
const str = 'ababbcccdddd';
const set = new Set(str);
console.log([...set].join()); // a,b,c,d
```
向`Set`添加值时，不会产生类型转换，所以`5`和`"5"`是两个不同的值。`Set`内部判断两个值是否不同，内部使用了一种算法，类似严格相等运算符`（===）`，主要的区别是向`Set`加入值时认为`NaN`等于自身，而严格相等运算符认为`NaN`不等于自身。
```js
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
console.log(set); // {NaN}
```
上面的代码中，向`Set`实例加入了两次`NaN`，但是只加入了一个。这就证明了，在`Set`内部，两个`NaN`是相等的。

如果加入两个对象，那就不一样了。
```js
let set = new Set();

set.add({});
console.log(set.size);

set.add({});
console.log(set.size);
console.log(set); // {{0: value: {}}, {1: value: {}}}
```
上面代码表示，由于两个空对象不相等，所以它们被当作两个值。

### Set实例的属性和方法

`Set`结构实例的属性如下：

* `Set.prototype.constructor`：构造函数，默认就是`Set`函数。
* `Set.prototype.size`：返回`Set`实例的成员总数。

`Set`实例的方法分为两类：操作方法和遍历方法。如下：
* `Set.prototype.add(value)`：添加某个值，返回`Set`结构本身。
* `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
* `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为`Set`的成员。
* `Set.prototype.clear()`：清除所有成员，没有返回值。

```js
const s = new Set();

console.log(s.add(1).add(2).add(2)); // {1, 2}

console.log(s.size); // 2

console.log(s.has(1)); // true
console.log(s.has(2)); // true
console.log(s.has(3)); // false

console.log(s.delete(2)); // true
console.log(s.has(2)); // false
```

`Array.from`方法可以将`Set`结构转为数组。
```js
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);
console.log(array); // [1, 2, 3, 4, 5]
```

这样就提供了数组去重的另外一个方法。
```js
function dedupe(array) {
  return Array.from(new Set(array));
}

console.log(dedupe([1, 1, 1, 2, 3, 4, 4])); // [1, 2, 3, 4]
```

### 遍历操作
`Set`结构的实例一共有四个遍历方法，可以用于遍历成员。实际上这些方法跟对象的方法一样。
* `Set.prototype.keys()`：返回键名的遍历器。
* `Set.prototype.vlaues()`：返回键值的遍历器。
* `Set.prototype.entries()`：返回键值对的遍历器。
* `Set.prototype.forEach()`：使用回调函数遍历每个成员，和数组的`forEach`方法一致。

`Set`的遍历顺序就是插入顺序，这个特性有时候非常有用，比如使用`Set`保存一个回调函数列表，调用时就能保证按照添加顺序调用。

#### `keys()`、`values()`、`entries()`

`keys`方法、`values`方法、`entries`方法返回的都是遍历器对象。由于`Set`结构没有键名，只有键值，所以`keys`方法和`values`方法的行为完全一致。
```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
  // red
  // green
  // blue
}

for (let item of set.values()) {
  console.log(item);
  // red
  // green
  // blue
}

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```
上面的代码中，`entries`方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，两个成员都是相等的。

因为`Set`结构的实例默认是可遍历的，它的默认遍历器生成函数就是它的`values`方法。这就可以直接省略`values`方法，直接用`for...of`循环遍历`Set`。
```js
let set = new Set([1, 4, 9]);
set.forEach((value, key) =>  console.log(`${key} : ${value}`));
// 1 : 1
// 4 : 4
// 9 : 9
```
由于`Set`结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远都是一样的。

另外，`forEach`方法还可以有第二个参数，表示绑定处理函数内部的`this`对象。

#### 遍历的应用

扩展运算符（`...`）内部使用`for...of`循环，所以可以用于`Set`结构。
```js
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
console.log(arr); // ["red", "green", "blue"]
```
扩展运算符和`Set`结构结合，可以实现数组去重方法。
```js
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)];
console.log(unique); // [3, 5, 2]
```
而且，数组的`map`和`filter`方法也可以间接用于`Set`了。
```js
let set1 = new Set([1, 2, 3]);
set1 = new Set([...set1].map(x => x * 2));
console.log(set1); // {2, 4, 6}

let set2 = new Set([1, 2, 3, 4, 5]);
set2 = new Set([...set2].filter(x => (x % 2) == 0));
console.log(set2); // {2, 4}
```
因此使用`Set`可以容易的实现并集、交集、差集。
```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
console.log(union); // {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
console.log(intersect); // {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
console.log(difference); // {1}
```
如果想在遍历操作中，同步改变原来的`Set`结构，可以通过两种方法。一种是利用原`Set`结构映射出一个新的结构。然后赋值给原来的`Set`结构；另一种是利用`Array.from`方法。
```js
let set1 = new Set([1, 2, 3]);
set1 = new Set([...set1].map(val => val * 2));
console.log(set1); // {2, 4, 6}

let set2 = new Set([1, 2, 3]);
set2 = new Set(Array.from(set2, val => val * 2));
console.log(set2); // {2, 4, 6}
```

## WeakSet
`WeakSet`结构与`Set`类似，也是不存在重复值的集合。WeakSet`的成员只能是对象，而不能是其他类型的值。

```js
const ws = new WeakSet();
ws.add(1);
// Uncaught TypeError: Invalid value used in weak set
ws.add(Symbol());
//Uncaught TypeError: Invalid value used in weak set
```
上面代码中，向`WeakSet`添加一个数值和`Symbol`值，结果出现报错了，因为`WeakSet`只能放置对象。

`WeakSet`中的对象是弱引用，即垃圾回收机制不考虑`WeakSet`对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于`WeakSet`之中。

这是因为垃圾回收机制依赖引用计数，`WeackSet`里面的引用，都不计入垃圾回收机制，所以不存在内存泄漏问题。因此，`WeakSet`适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在`WeakSet`里面的引用就会自动消失。

由于这个特点，`WeakSet`的成员是不适合引用的，因为它会随时消失。另外，由于`WeakSet`内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行也不不可预测的，因此`WeakSet`是不可遍历的。

### 语法
`WeakSet`是一个构造函数，通过`new`命令创建`WeakSet`数据结构。
```js
const ws = new WeakSet();
```
`WeakSet`接受一个数组或类似数组的对象作为参数。（任何具有`Iterable`接口的对象，都可以作为`WeackSet`的参数。）该数组的所有成员，都会自动成为`WeakSet`实例对象的成员。
```js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
console.log(ws); // {0: (2) [1, 2], 1: [3, 4]}
```
`a`是一个数组，有两个成员，都是数组，将`a`作为`WeakSet`构造函数的参数，`a`的成员会自动成为`WeakSet`的成员。

注意，是`a`数组的成员成为`WeakSet`的成员，而不是`a`数组本身。这意味着，数组的成员只能是对象。
```js
const b = [1, 2];
const ws = new WeakSet(b);
// 11.2.html:51 Uncaught TypeError: Invalid value used in weak set
```
上面的代码中，数组`b`成员不是对象，添加到`WeackSet`结构中就报错了。

`WeakSet`结构有三个方法，如下：
* `WeackSet.prototype.add(value)`：向`WeakSet`实例添加一个新成员。
* `WeackSet.prototype.delete(value)`：清除`WeakSet`实例的指定成员。
* `WeackSet.prototype.has(value)`：返回一个布尔值，表示某个值是否在`WeakSet`实例之中。

下面展示上述的三种用法。
```js
const ws = new WeakSet();
const obj = {};
const foo = {};

console.log(ws.add(window)); // {Window}
console.log(ws.add(obj)); // {Window, {…}}

console.log(ws.has(window)); // true
console.log(ws.has(foo)); // false

console.log(ws.delete(window)); // true
console.log(ws.has(window)); // false
```
`WeakSet`没有`size`属性，没有办法遍历它的成员。
```js
const arr = [[1, 2], [4, 5]];
const ws = new WeakSet(arr);

console.log(ws.size); // undefined
ws.forEach(() => { console.log('WeakSet has' + item) });
// Uncaught TypeError: ws.forEach is not a function
```
上面的代码试图获取`size`和使用`forEach`，结果都不成功。

`WeakSet`不能遍历的原因，因为成员都是弱引用，随时都会消失的，遍历机制无法保证成员的存在，很可能存在刚刚遍历结束，成员就消失了，`WeakSet`的一个用处就是，储存`DOM`节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

下面是另一个例子。
```js
const foos = new WeakSet();

class Foo {
  constructor() {
    foos.add(this);
  }

  method() {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
    }
  }
}
```
上面的代码保证了`Foo`的实例方法，只能在`Foo`的实例上调用，这里使用`WeakSet`的好处是，`foos`对实例的引用，不会被计入内存回收机制，所以删除实例的时候，不用考虑`foos`，也不会出现内存泄漏。

## Map
总所周知，JavaScript的对象本质上是键值对的集合，但是只能用字符串作键。这样就带来了很大的限制。为了解决这个问题，`ES6`提供了`Map`数据结构。它类似于对象，也是键值对的集合，但是键的范围不限于字符串，可以是各种类型的值（包括对象）都可以当作键。也可以这么理解，`Object`结构提供了 “字符串--值”的对应，`Map`结构提供了“值--值”的对应，如果你需要 “键值对” 的数据结构，`Map`比`Object`更适合。
```js
const m = new Map();
const o = { p: 'hello world' };

m.set(o, 'content');
console.log(m.get(o)); // content

for (let [key, value] of m) {
  console.log(key, value);
  // {p: "hello world"} "content"
}

console.log(m.has(o)); // true
console.log(m.delete(o)); // true
console.log(m.has(o)); // false
```
上面的代码中，使用`Map`结构的方法`set`方法，将对象`o`当作`m`的一个键，然后使用`get`方法读取这个键，接着使用`delete`方法删除了这个键。我们使用`for...of`可以看到键为`o`对象，值就为"content"字符串。

上面的例子展示了怎么向`Map`添加成员，作为构造函数，`Map`也可以接受一个数组作为参数，该数组的成员是一个个表示键值对的数组。
```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
console.log(map); // {"name" => "张三", "title" => "Author"}
console.log(map.size); // 2
console.log(map.has('name')); // true
console.log(map.get('name')); // 张三
console.log(map.has('title')); // true
console.log(map.get('title')); // Author
```
上面的代码中，在新建`Map`实例时，就指定了两个键`name`和`title`。

`Map`构造函数接受数组作为参数，可以执行下面的算法。
```js
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();

items.forEach(([key, value]) => map.set(key, value));
console.log(map); // {"name" => "张三", "title" => "Author"}
```
不仅仅数组，任何具有`Iterator`接口、且每个成员都是一个双元素的数组的数据结构都可以作`Map`构造函数的参数。也就是说，`Set`和`Map`都可以用来生成新的`Map`。
```js
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);

const m1 = new Map(set);
console.log(m1.get('foo')); // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
console.log(m3.get('baz')); // 3
```
上面的代码中，分别使用`Set`对象和`Map`对象，当作`Map`构造函数的参数，然后都生成了新的`Map`对象。

如果对同一个键多次赋值，后面的值会覆盖掉前面的值。
```js
const map = new Map();
map.set(1, 'aaa').set(1, 'bbb');
console.log(map.get(1)); // bbb
```
上面代码中对键`1`连续赋值两次，后面的值覆盖了前面的值。

如果获取一个未知的键会返回`undefined`。
```js
let map = new Map();
console.log(map.get('a')); // undefined
```
要注意的是，只有对同一个对象的引用，`Map`结构才会把这对象当作同一个键。
```js
const map = new Map();
const arr = ['b'];

map.set(['a'], 555);
console.log(map.get(['a'])); // undefined

map.set(arr, 666);
console.log(map.get(arr)); // 666
```
上面的代码的`set`和`get`方法，表面上是针对同一个键，但实际上这两个数组都是不同的实例，内存地址都是不一样的，所以`get`方法无法获取这个键，返回`undefined`。再来看上面第二个变量`arr`，然后向`map`实例添加了`arr`这个键，值且是`666`。通过`get`方法获取`arr`这个键，返回了`arr`的值`666`。这是因为添加和读取的都是同一个数组实例。

同样的值的两个实例，在`Map`结构中也是当作为两个键。
```js
const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map.set(k1, 111).set(k2, 333);
console.log(map.get(k1), map.get(k2)); // 111 333
```
上面的代码中，变量`k1`和`k2`的值是一样的，但是在`Map`结构中被当作为两个键了。

`Map`的键是跟内存地址绑定的，只要内存地址不一样，就被看作为两个键。这就解决了同名属性碰撞的问题，在扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

如果`Map`的键是一个简单类型的值，只要两个严格相等，`Map`会看作为一个键，例如：`0`和`-0`就是一个键，布尔值`true`和字符串`true`则是两个不同的键。另外，`undefined`和`null`也是两个不同的键。虽然`NaN`不严格相等于自身，但`Map`会看作为同一个键。
```js
let map = new Map();

map.set(-0, 123);
console.log(map.get(+0)); // 123

map.set(true, 1);
map.set('true', 2);
console.log(map.get(true)); // 1

map.set(undefined, 3);
map.set(null, 4);
console.log(map.get(undefined)); // 3

map.set(NaN, 123);
console.log(map.get(NaN)); // 123
```
### 实例的属性和操作方法
以下是`Map`结构的实例属性和操作方法。

#### size属性
`size`属性返回`Map`结构的成员总数。
```js
const map = new Map();
map.set('foo', true);
map.set('bar', false);
console.log(map.size); // 2
```

#### Map.prototype.set(key, value)
`set`方法设置键名`key`对应的键值为`value`，然后返回整个`Map`结构。如果`key`已经有值，则键值会被更新，否则就新生成该键。
```js
const m = new Map();

m.set('a', 6); // 键是一个字符串
m.set(1, 'standard'); // 键是一个数值
m.set(undefined, 'nah'); // 键是一个undefined
console.log(m); // {"a" => 6, 1 => "standard", undefined => "nah"}
```
`set`方法返回的是当前的`Map`对象，可以采用链式写法。
```js
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
console.log(map); // {1 => "a", 2 => "b", 3 => "c"}
```
#### Map.prototype.get(key)
`get`方法获取`key`对应的键值，如果没有找到`key`，则返回`undefined`。
```js
const m = new Map();

const hello = function() { console.log('hello'); };
m.set(hello, 'Hello world');
console.log(m.get(hello)); // Hello world
```

#### Map.prototype.has(key)
`has`方法返回一个布尔值，表示某个键是否在当前的`Map`对象中。
```js
const m = new Map();

m.set('a', 6);
m.set(1, 'standard');
m.set(undefined, 'nah');

console.log(m.has('a')); // true
console.log('b'); // b
console.log(m.has(1)); // true
console.log(undefined); // undefined
```

#### Map.prototype.delete(key)
`delete`方法删除某个键，返回`true`。如果删除失败，返回`false`。
```js
const m = new Map();
m.set(undefined, 'nah');
console.log(m.has(undefined)); // true

console.log(m.delete(undefined)); // true
console.log(m.has(undefined)); // false
```

#### Map.prototype.clear()
`clear`方法清除所有成员，没有返回值。
```js
let map = new Map();
map.set('foo', true);
map.set('bar', false);

console.log(map.size); // 2
map.clear();
console.log(map.size); // 0
```

### 遍历方法
`Map`结构有三个遍历器生成函数和一个遍历方法。
* `Map.prototype.keys()`：返回键名的遍历器。
* `Map.prototype.values()`：返回键值的遍历器。
* `Map.prototype.entries()`：返回所有成员的遍历器。
* `Map.prototype.forEach()`：遍历`Map`的所有成员。

Map的遍历顺序也是插入顺序。
```js
const map = new Map([
  ['F', 'no'],
  ['T', 'yes']
]);

for (let key of map.keys()) {
  console.log(key);
}
// F
// T

for (let value of map.values()) {
  console.log(value);
}
// no
// yes

for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// F no
// T yes
```
`Map`结构的默认遍历器接口（Symbol.iterator属性）就是`entries`方法。
```js
console.log(new Map()[Symbol.iterator] === new Map().entries); // true
```
`Map`结构转为数组结构比较快的方法就是使用扩展运算符（`...`）。
```js
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

console.log([...map.keys()]); // [1, 2, 3]
console.log([...map.values()]); // ["one", "two", "three"]
console.log([...map.entries()]); // [[1, "one"], [2, "two"], [3, "three"]]
console.log([...map]); // [[1, "one"], [2, "two"], [3, "three"]]
```
可以结合数组的`map`方法、`filter`方法实现`Map`的遍历和过滤。
```js
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c')

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
console.log(map1);
// {1 => "a", 2 => "b"}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
);
console.log(map2);
// {2 => "_a", 4 => "_b", 6 => "_c"}
```

`Map`还有一个`forEach`方法，和数组的`forEach`方法相似，可以实现遍历。
```js
const map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
map.forEach((value, key) => {
  console.log(value, key);
  // a 1
  // b 2
  // c 3
});
```
`forEach`方法可以接受第二个参数，用来绑定`this`。
```js
const map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const reporter = {
  report: function(key, value) {
    console.log(key, value);
  }
}

map.forEach(function(value, key) {
  this.report(key, value);
  // 1 "a"
  // 2 "b"
  // 3 "c"
}, reporter);
```
上面的代码中，`forEach`方法的回调函数的`this`，就指向`reporter`。

### 和其他数据结构的互相转换

#### Map转为数组
上面已经说了`Map`转为数组最便捷的方法，就是用扩展运算符（`...`）。

#### 数组转为`Map`
将数组传入`Map`构造函数，可以转为`Map`。
```js
const map = new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
]);

console.log(map);
// {
//   true => 7, 
//   Object => ["abc"]
// }
```
#### Map转为对象
如果所有`Map`的键都是字符串，它可以无损地转为对象。
```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
console.log(strMapToObj(myMap)); // {yes: true, no: false}
```
如果有非字符串的键名，那么这个简明会被转成字符串，再当作对象的键名。

#### 对象转为Map
对象转为`Map`可以通过`Object.entries()`。
```js
let obj = { "a": 1, "b": 2 };
let map = new Map(Object.entries(obj));
```
当然也可以自己写一个转换函数。
```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

console.log(objToStrMap({yes: true, no: false}));
// {"yes" => true, "no" => false}
```

#### Map转为JSON
`Map`转为`JSON`要区分两种情况，一种情况是，Map的键名都是字符串，这时可以转为对象`JSON`。
```js
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

let myMap = new Map().set('yes', true).set('no', false);
console.log(strMapToJson(myMap));
// {"yes":true,"no":false}
```
另一种情况是，`Map`的键名有非字符串的时候，可以选择转为数组`JSON`。
```js
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
console.log(mapToArrayJson(myMap)); // [[true,7], [{"foo":3},["abc"]] ]
```
#### JSON转为Map
JSON转为Map，正常情况下，所有的键名都是个字符串。
```js
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

console.log(jsonToStrMap('{"yes": true, "no": false}'));
// {"yes" => true, "no" => false}
```
有一种比较特殊的情况就是，整个`JSON`就是一个数组，并且每个数组成员本身又有两个成员的数组。这时，它可以一一对应地转成`Map`。这是`Map`转成数组JSON的逆向操作。
```js
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

console.log(jsonToMap('[[true, 7], [{"foo": 3}, ["abc"]]]'));
// {true => 7, Object => ["abc"]}
```

## WeakMap

### 含义
`WeakMap`的结构跟`Map`结构相似，也是用来生成键值对的集合。
```js
const wm = new WeakMap();
const key = { foo: 1 };

wm.set(key, 2);
console.log(wm.get(key)); // 2

const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
console.log(wm2.get(k2)); // bar
```
`WeakMap`与`Map`的区别有两点。
一是`WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。
```js
const map = new WeakMap();
map.set(1, 2);
// Uncaught TypeError: Invalid value used as weak map key
map.set(Symbol(), 2);
map.set(null, 2);
```
二是`WeakMap`的键名所指向的对象，不计入垃圾回收机制。

`WeackMap`的出现在于，有时候想在某个对象上存放一些数据，但是会行程对于这个对象的引用。看下面的例子：
```js
const e1 = document.getElementById('foo');
const e2 = document.getElementById('bar');
const arr = [
  [e1, 'foo元素'],
  [e2, 'bar元素']
];
console.log(arr);
// [[div#foo, "foo元素"], [div#bar, "bar元素"]]
```
上面的代码中，`e1`和`e2`是两个对象，通过`arr`数组对这两个对象添加一些文字说明。这就形成了`arr`对`el`和`e2`的引用。

但是不再需要这两个对象时，就需要手动删除这个引用，否则垃圾回收机制就不会释放`e1`和`e2`占用内存，从而导致内存泄漏。
```js
const e1 = document.getElementById('foo');
const e2 = document.getElementById('bar');
const arr = [
  [e1, 'foo元素'],
  [e2, 'bar元素']
];
console.log(arr);
// [[div#foo, "foo元素"], [div#bar, "bar元素"]]

// 不需要e1和e2的时候，需要手动删除引用
arr[0] = null;
arr[1] = null;
```
上面这种写法就显得很不方便，如果忘了写，就会导致内存泄漏。

`WeakMap`就是为了解决这类问题，它的键名所引用的对象都是弱引用，即垃圾回收机制不会考虑该引用。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放这个对象所占用的内存。也就是说，一旦不需要，`WeakMap`里面的键名对象和所对应的键值就会自动消失，不用手动删除引用。

基本上，如果你要向对象上添加数据，又不想干扰垃圾回收机制，就可以使用`WeakMap`。比较典型的应用场景就是，在网页的`DOM`元素上添加数据，就可以使用`WeakMap`结构。当该`DOM`元素被清除，对应的`WeakMap`记录就会自动被移除。
```js
const wm = new WeakMap();
const element = document.getElementById("foo");
wm.set(element, 'foo元素');
console.log(wm.get(element)); // foo元素
```
上面的代码中，先新建一个`WeakMap`实例。然后，将一个`DOM`节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在`WeakMap`里面。这时，`WeakMap`里面对`element`的引用就是弱引用，不会被计入垃圾回收机制。

也就是说，上面的`DOM`节点对象的引用计数是`1`，而不是`2`。这时，一旦消除对该节点的引用，它占用的内存就会被垃圾回收机制释放。`WeakMap`保存的这个键值对，也会自动消失。

总之，`WeakMap`的专用场合就是，它的键所对应的对象，可能会将来消失。`WeakMap`结构有助于防止内存泄漏。

但是要注意的是，`WeakMap`弱引用的只是键名，而不是键值，键值依然是可以正常引用。
```js
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;
console.log(wm.get(key)); // {foo: 1}
```
上面的代码中，键值`obj`是正常引用。所以，即使在`WeakMap`外部消除了`obj`的引用，`WeakMap`内部的引用还是存在的。

### WeakMap的语法
`WeakMap`和`Map`在API有两个区别，一是没有遍历操作，也没有`size`属性。因为没有办法列出所有键名，没办法预测某个键名是否存在，这一刻可以取到键名，下一刻垃圾回收机制运行了，这个键名就没了，为了防止出现不确定的情况，统一规定不能取到键名。二是无法清空，不支持`clear`方法。因此，`WeakMap`只有四个方法可以用：`get()`、`set()`、`has()`、`delete()`。
```js
const wm = new WeakMap();

console.log(wm.size); // undefined
console.log(wm.forEach); // undefined
console.log(wm.clear); // undefined
```