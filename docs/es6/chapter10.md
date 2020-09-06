# Symbol

## 概述
ES6加入了`Symbol`数据类型，表示独一无二的值，它是`JS`的第七种数据类型。`Symbol`值通过`Symbol`函数生成。也就是说，对象的属性名现在可以是两种类型，一种是原来就有的字符串，第二种就是新增的`Symbol`类型。只要属性名属于`Symbol`类型，就是属于独一无二的，可以保证不会和其他属性名冲突。
```js
let sym = Symbol();

console.log(typeof sym); // symbol
```
上面的代码中，`sym`变量是一个独一无二的值。`typeof`运算符的结果表明变量`s`是`Symbol`数据类型，而不是字符串之类的其他类型。

:::warning
`Symbol`函数前不能使用`new`操作符，否则会报错，因为`Symbol`是一个原始类型的值，不是对象。也不能添加属性。它是一种类似字符串的数据类型。
:::

`Symbol`函数可以接受一个字符串作为参数，表示对`Symbol`实例的描述，是为了在控制台中显示，或者转字符串时比较容易区分。
```js
let sym1 = Symbol('foo');
let sym2 = Symbol('bar');

console.log(sym1); // Symbol(foo)
console.log(sym2); // Symbol(bar)
```
上面的代码中，`s1`和`s2`是两个`Symbol`值，如果不加参数，在控制台输出都是`Symbol()`，不利于区分。有了参数之后，就等于给它们加上了描述，输出时也能够区分出是哪个值。

如果`Symbol`的参数是一个对象的话，就会调用这个对象的`toString`方法，转成字符串，然后生成一个`Symbol`值。
```js
const obj = {
  toString() {
    return 'abc';
  }
};

const sym = Symbol(obj);
console.log(sym); // Symbol(abc)
```

:::warning
`Symbol`函数的参数只表示对当前`Symbol`值的描述，如果相同参数的`Symbol`函数的返回值是不相等的。
:::

```js
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();
console.log(s1 === s2); // false

// 有参数的情况
let s3 = Symbol('foo');
let s4 = Symbol('foo');
console.log(s3 === s4); // false
```
上面的代码中，都是`Symbol`函数的返回值，参数也相同，但是它们都不相等的。

`Symbol`值不能跟其他类型的值运算，否则会报错。
```js
let sym = Symbol('symbol');
// Cannot convert a Symbol value to a string
console.log('abc' + sym);
```
`Symbol`值可以显式转为字符串。
```js
let sym = Symbol('foo');

console.log(String(sym)); // Symbol(foo)
console.log(sym.toString()); // Symbol(foo)
```
`Symbol`值还可以转为布尔值，但是不能转为数值。
```js
let sym = Symbol();

console.log(Boolean(sym)); // true
console.log(!sym); // false

console.log(Number(sym));
// Cannot convert a Symbol value to a number
```

## 作为属性名的Symbol

都知道每一个`Symbol`值都是不相等的，这就可以使用`Symbol`值来当作标识符用于对象属性名，保证不会出现同名属性，这对于一个由多个模块构成的情况非常有用，防止某个键被改写或覆盖。
```js
let mySymbol = Symbol('foo');

// 写法一
let a = { };
a[mySymbol] = "abc";

console.log(a); // {Symbol(foo): "abc"}

// 写法二
let b = {
  [mySymbol]: 'abc',
}

console.log(b); // {Symbol(foo): "abc"}

// 写法三
let c = { };
Object.defineProperty(c, mySymbol, { value: 'abc' });
console.log(c); // {Symbol(foo): "abc"}
```
以上三种写法都可以给对象写入`Symbol`类型作为属性。

要注意的是，`Symbol`值当作对象属性名时不能使用点运算符。
```js
let mySymbol = Symbol();
let a = {};

a.mySymbol = 'hello';
console.log(a[mySymbol]); // undefined
console.log(a['mySymbol']); // hello
```
上面的代码中，因为点运算符后面总是字符串，所以不会读取`mySymbol`作为标识名所指代的值，导致`a`的属性名是一个字符串，而不是一个`Symbol`值。

同样的，在对象的内部，使用`Symbol`值定义属性时，`Symbol`值必须放在方括号里面。
```js
let s = Symbol();

let obj = {
  [s]: function(arg) {
    return arg;
  }
}
console.log(obj); // {Symbol(): ƒ}
console.log(obj[s](123)); // 123
```
上面的代码中，如果`s`不放在方括号中，该属性的键名就是一个字符串，而不是`Symbol`值。

使用ES6增强的对象写法，上面的obj对象写得更加简洁一点。
```js
let s = Symbol();
let obj = {
  [s](arg) {
    return arg;
  }
};
```

`Symbol`类型还可以用来定义一组常量，保证这组常量的值都不相等的。
```js
let obj = {
  DEBUG: Symbol('debug'),
  INFO: Symbol('info'),
  WARN: Symbol('warn')
}

console.log(obj.DEBUG, 'debug'); // Symbol(debug) "debug"
console.log(obj.INFO, 'info'); // Symbol(info) "info"
```
下面另一个例子。
```js
const COLOR_RED = Symbol();
const COLOR_GREEN = Symbol();

function getComplement(color) {
  switch (color) {
    case COLOR_RED:
      return COLOR_GREEN;
    case COLOR_GREEN:
      return COLOR_RED;
    default:
      throw new Error('undefined color');
  }
}

console.log(getComplement(COLOR_RED));
```
常量使用`Symbol`值的最大好处就是，其他任何值都不可能有相同的值了，就可以保证上面的`switch`语句按设计的方式工作。

:::warning
`Symbol`值作为属性名时，该属性还是公开属性，不是私有属性
:::

## 实例：消除魔术字符串

魔术字符串是指，在代码中出现很多次，跟代码形成强耦合的某一个具体的字符串或者数值。为了风格良好的代码，应该尽量不要出现魔术字符串，而由含义清晰的变量代替。
```js
function getArea(shape, options) {
  var area = 0;

  switch (shape) {
    case "Triangle": // 魔术字符串
      area = .5 * options.width * options.height;
      break;
  }
  return area;
}

getArea('Triangle', { width: 100, height: 100 });
```
上面的代码中，字符串`“Triangle”`就是一个魔术字符串，如果它出现的次数多，就与代码形成“强耦合”，不利于未来的修改和维护。并且需要改的地方很多。

通常消除魔术字符串的方法，就是把它写成一个变量。
```js
let shapeType = {
  triangle: 'Triangle'
};

function getArea(shape, options) {
  let area = 0;

  switch(shape) {
    case shapeType.triangle:
      area = .5 * options.width * options.height;
      break;
  }

  return area;
}

console.log(getArea(shapeType.triangle, { width: 100, height: 100 })); // 5000
```
上面的代码中，把`“Triangle”`写成`shapeType`对象的`triangle`属性，这样就可以消除了强耦合。

这样仔细分析，可以发现`shapeType.triangle`等于哪个值并不重要，只要确保这个不会和其他`shapeType`属性的值冲突就行了。这样的作法特别适合改成`Symbol`值。
```js
const shapeType = {
  triangle: Symbol()
};
```
上面的代码中，除了将`shapeType.triangle`的值改成一个`Symbol`，其余的地方都不用改。

## 属性名遍历

`Symbol`作为属性名，该属性就不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`返回。但它也不是私有的属性，有一个`Object.getOwnPropertySymbols`方法获取指定对象中的所有`Symbol`属性名。

`Object.getOwnPropertySymbols`方法用于遍历当前对象中所有属性为`Symbol`的值。返回的是一个数组，成员是当前对象的所有属性名为`Symbol`值。
```js
let obj = { };
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

let objectSymbols = Object.getOwnPropertySymbols(obj);
console.log(objectSymbols); // [Symbol(a), Symbol(b)]
```
如果要得到对象里作为`Symbol`值的键名，可以使用`Object.getOwnPropertySymbols`方法。

还有一个方法新的API----`Reflect.ownKeys`方法可以返回所有类型的键名，包括常规的键名和`Symbol`键名。
```js
let sym = Symbol('sym_key');
let obj = {
  [sym]: 1,
  enum: 2,
  nonEnum: 3
};

console.log(Reflect.ownKeys(obj)); 
// ["enum", "nonEnum", Symbol(sym_key)]
```
以`Symbol`值作为名称的属性不会被常规方法遍历得到。可以用这个特性为对象定义一些非私有但又希望只用于内部的方法。
```js
let size = Symbol('size');

class Collection {
  constructor() {
    this[size] = 0;
  }

  add(item) {
    console.log(item); // foo
    console.log(this[size]); // 0
    this[this[size]] = item;
    this[size]++;
  }

  static sizeOf(instance) {
    return instance[size];
  }
}

let x = new Collection();

console.log(Collection.sizeOf(x)); // 0

x.add('foo');
console.log(Collection.sizeOf(x)); // 1

console.log(Object.keys(x)); // ["0"]
console.log(Object.getOwnPropertyNames(x)); // ["0"]
console.log(Object.getOwnPropertySymbols(x)); // [Symbol(size)]
console.log(x); // Collection {0: "foo", Symbol(size): 1}
```
上面的代码中，对象`x`的size属性是一个`Symbol`值，因此`Object.keys(x)`、`Object.getOwnPropertyNames(x)`都无法获取它。这样就造成非私有的内部方法的效果。

## Symbol.for()、Symbol.keyFor()

有时候，希望重新使用同一个`Symbol`值，可以使用`Symbol.for`方法。它接受一个字符串作为参数，然后搜索有没有该参数作为名称的`Symbol`值。如果有，就返回这个`Symbol`值，否则就创建并返回一个以该字符串为名称的`Symbol`值。
```js
let sym1 = Symbol.for('foo');
let sym2 = Symbol.for('foo');

console.log(sym1 === sym2); // true
```
上面的代码中，`sym1`和`sym2`都是`Symbol`值，但它们都是同样的参数的`Symbol.for`方法生成的，实际上都是同一个值。

`Symbol.for()`与`Symbol()`这两种写法都会生成新的`Symbol`。区别就在与，`Symbol.for()`会被登记在全局环境中供搜索，而`Symbol()`并不会。`Symbol.for()`不会在每次调用时返回一个新的`Symbol`类型的值，而是会先检查给定的`key`是否已经存在，如果不存在才会新建一个值。举个例子，如果调用`Symbol.for("cat")`30次，每次都会返回同一个`Symbol`值，但是调用`Symbol("cat")`30次则会返回30个不同的
`Symbol`值。
```js
console.log(Symbol.for("bar") === Symbol.for("bar"));
// true

console.log(Symbol("bar") === Symbol("bar"));
// false
```
上面的代码中，由于`Symbol()`写法没有登记机制，所以每次调用都会返回一个不同的值。

`Symbol.keyFor`方法返回一个已登记的`Symbol`值的`key`。
```js
let sym1 = Symbol.for("foo");
console.log(Symbol.keyFor(sym1)); // foo

let sym2 = Symbol("foo");
console.log(Symbol.keyFor(sym2)); // undefined
```
上面的代码中，变量`s2`属于未登记的`Symbol`值，然后返回`undefined`。

:::warning
`Symbol.for`为`Symbol`值登记的名字是全局环境的，可以在不同的`iframe`或者`service.worker`中取得到同一个值。
:::

## 内置的Symbol值
ES6提供了`11`个内置的`Symbol`值，指向语言内部使用方法。

### Symbol.hasInstance
`Symbol.hasInstance`属性指向一个内部方法，对象使用`instanceof`运算符时调用这个方法，判断该对象是否为某个构造函数的实例。例如：`foo instanceof Foo`实际调用的是`Foo[Symbol.hasInstance](foo)`。
```js
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

console.log([] instanceof new MyClass()); // true
```
上面的代码中，`MyClass`是一个类，`new MyClass()`会返回一个实例。该实例的`Symbol.hasInstance`方法会进行`instanceof`运算时自动调用，判断左侧的运算是否为`Array`的实例。来看另一个例子：
```js
class Even {
  static [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
}

console.log(1 instanceof Even); // false
console.log(2 instanceof Even); // true
console.log(4 instanceof Even); // true
```

### Symbol.isConcatSpreadable

`Symbol.isConcatSpreadable`属性等于一个布尔值，表示该对象使用`Array.prototype.concat()`时是否可以展开。
```js
let arr1 = ['c', 'd'];

['a', 'b'].concat(arr1, 'e');

console.log(arr1[Symbol.isConcatSpreadable]); // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;

console.log(['a', 'b'].concat(arr2, 'e'));
// ["a", "b", ["c", "d", Symbol(Symbol.isConcatSpreadable): false], "e"]
```
上面的代码中，数组默认是可以展开的。`Symbol.isConcatSpreadable`属性为`true`或`undefined`，都有这个效果。

类数组的对象也可以展开，但是要把`Symbol.isConcatSpreadable`属性设置为`true`，默认情况下是`false`。
```js
let obj = {0: 'c', 1: 'd', length: 2};
console.log(['a', 'b'].concat(obj, 'e'));
// ["a", "b", {0: "c", 1: "d", length: 2}, "e"]

obj[Symbol.isConcatSpreadable] = true;
console.log(['a', 'b'].concat(obj, 'e')); 
// ["a", "b", "c", "d", "e"]
```
对于一个类而言，`Symbol.isConcatSpreadable`属性必须写成实例的属性。
```js
class ARR1 extends Array {
  constructor(args) {
    super(args);
    this[Symbol.isConcatSpreadable] = true;
  }
}

class ARR2 extends Array {
  constructor(args) {
    super(args);
    this[Symbol.isConcatSpreadable] = false;
  }
}

let arr1 = new ARR1();

arr1[0] = 3;
arr1[1] = 4;

let arr2 = new ARR2();
arr2[0] = 5;
arr2[1] = 6;

console.log([1, 2].concat(arr1).concat(arr2));
//  [1, 2, 3, 4, [5, 6, Symbol(Symbol.isConcatSpreadable): false]]
```
上面的代码中，类`ARR1`是可以扩展的`ARR2`是不可以扩展的，然而使用`concat`时有不一样的结果。

### Symbol.species
`Symbol.species`属性指向当前对象的构造函数。创建实例时默认会调用这个方法，即使用这个属性返回的函数当作构造函数来创建新的实例对象。
```js
class MyArray extends Array {
  // 覆盖父类Array的构造函数
  static get [Symbol.species]() { return Array; }
}
```
上面的代码中，子类`MyArray`继承了父类`Array`。创建`MyArray`的实例对象时，本来会调用它自己的构造函数，但是定义了`Symbol.species`属性，所以会使用这个属性返回的函数来创建`MyArray`的实例。

这个例子说明，定义`Symbol.species`属性要采用`get`读取器。默认的`Symbol.species`属性等同下面的写法。
```js
static get [Symbol.species]() {
  return this;
}
```
来看下面的例子。
```js
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}

let a = new MyArray(1, 2, 3);
console.log(a); // MyArray(3) [1, 2, 3]
let mapped = a.map(x => x * x);
console.log(mapped); // [1, 4, 9]

console.log(mapped instanceof MyArray); // false
console.log(mapped instanceof Array); // true
```
上面的代码中，由于构造函数被替换成了`Array`，所以`mappend`对象不是MyArray的实例，而是`Array`的实例。

### Symbol.match
`Symbol.match`属性指向一个函数，当执行`str.match(myObject)`时，如果该属性存在，会调用它返回该方法的返回值。
```js
String.prototype.match(regexp);
// 等于
regexp[Symbol.match](this);

class MyMatcher {
  [Symbol.match] (string) {
    return 'hello world'.indexOf(string);
  }
}
console.log('e'.match(new MyMatcher())); // 1
```

### Symbol.replace
`Symbol.replace`属性指定了当一个字符串替换所匹配字符串所调用的方法，当对象被`String.prototype.replace`方法调用时会返回该方法的返回值。
```js
String.prototype.replace(searchValue, replaceValue);
// 等于
searchValue[Symbol.replace](this, replaceValue);
```
下面是一个例子。
```js
const x = { };
x[Symbol.replace] = (...s) => console.log(s);

console.log('hello'.replace(x, 'world'));
// ["hello", "world"]
```
`Symbol.replace`方法收到两个参数，第一个参数是`replace`方法在作用的对象，上面的例子中是`hello`，第二个参数是替换后的值，在上面的例子中是`world`。

### Symbol.search
`Symbol.search`属性指向一个方法，当对象被`String.prototype.search`方法调用时会返回该方法的返回值。
```js
String.prototype.search(regexp);
// 等于
separator[Symbol.search](this);

class MySearch {
  constructor(value) {
    this.value = value;
  }

  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}

console.log('foobar'.search(new MySearch('foo'))); // 0
```

### Symbol.split
`Symbol.split`指向一个正则表达式的索引处分割字符串的方法。这个方法通过`String.prototype.split()`调用。
```js
String.prototype.split(separator, limit);
// 等于
separator[Symbol.split](this, limit);
```
来看个例子：
```js
class MySplitter {
  constructor(value) {
    this.value = value;
  }

  [Symbol.split](string) {
    let index = string.indexOf(this.value);

    if (index === -1) {
      return string;
    }

    return [
      string.substr(0, index),
      string.substr(index + this.value.length)
    ];
  }
}

console.log('foobar'.split(new MySplitter('foo'))); // ["", "bar"]

console.log('foobar'.split(new MySplitter('bar'))); // ["foo", ""]

console.log('foobar'.split(new MySplitter('baz'))); // foobar
```
上面的代码使用`Symbol.split`方法，重新定义了字符串对象的`split`方法的行为。

### Symbol.iterator
`Symbol.iterator`为每个对象定义了默认的迭代器。该迭代器可以被`for...of`循环使用。
```js
// 自定义迭代器
let myIterable = {};

myIterable[Symbol.iterator] = function*() {
  yield 1;
  yield 2;
  yield 3;
};

console.log([...myIterable]); // [1, 2, 3]
```

### Symbol.toPrimitive
`Symbol.toPrimitive`属性指向一个方法，对象转为原始类型的值时会调用这个方法，返回该对象对应的原始类型值。`Symbol.toPrimitive`被调用时会接受一个字符串参数，表示当前运算的模式，一共有3种模式。
* Number：该场合需要转成数值。
* String：该场合需要转成字符串。
* Default：该场合可以转成数值，也可以转成字符串。

```js
let obj = {
  [Symbol.toPrimitive] (hint) {
    switch(hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
      default:
        throw new Error();
    }
  }
};

console.log(2 * obj); // 246
console.log(3 + obj); // 3default
console.log(obj === 'default'); // false
console.log(String(obj)); // str
```

### Symbol.toStringTag
`Symbol.toStringTag`属性指向一个方法，在对象上调用`Object.prototype.toString`方法时，如果这个属性存在，其返回值会出现在`toString`方法返回的字符串，表示对象的类型。也就是说，这个属性可用于定制`[object Object]`或`[object Array]`中object后面的字符串。
```js
// 例子一
console.log({[Symbol.toStringTag]: 'Foo'}.toString()); // [object Foo]

// 例子二
class Collection {
  get [Symbol.toStringTag]() {
    return 'xxx';
  }
}
let x = new Collection();
console.log(Object.prototype.toString.call(x)); // [object xxx]
```

### Symbol.unscopables
`Symbol.unscopables`属性指向一个对象，指定了一个使用`with`关键字时哪些属性会被`with`排除。
```js
console.log(Array.prototype[Symbol.unscopables]);
// {
//   copyWithin: true,
//   entries: true,
//   fill: true,
//   find: true,
//   findIndex: true,
//   flat: true,
//   flatMap: true,
//   includes: true,
//   keys: true,
//   values: true,
// }
console.log(Object.keys(Array.prototype[Symbol.unscopables]));
// ["copyWithin", "entries", "fill", "find", "findIndex", "flat", "flatMap", "includes", "keys", "values"]
```
上面的代码中说明，数组有`7`个属性会被`with`命令排除。
```js
// 没有unscopables
class MyClass {
  foo() { return 1; }
}

let foo = function() { return 2; }

with (MyClass.prototype) {
  console.log(foo());
}

// 有unscopables时
class MyClass {
  foo() { return 1; }
  get [Symbol.unscopables] () {
    return { foo: true };
  }
}

let foo = function() { return 2 };

with(MyClass.prototype) {
  console.log(foo()); // 2
}
```
上面的代码通过指定`Symbol.unscopables`属性使用`with`语法块不会在当前作用域寻找`foo`属性，即`foo`将指向外层作用域的变量。