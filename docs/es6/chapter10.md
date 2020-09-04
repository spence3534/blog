# 对象的新增方法

## Object.is()
`Object.is()`方法是为了弥补`==`和`===`这两个运算符的缺陷。`==`相等运算符会自动转换类型，`===`严格等于运算符`NaN`不等于自身，
以及`+0`等于`-0`。`Object.is()`方法用来比较两个值是否严格等于，和严格等于`===`运算符的效果一样。
```js
console.log(Object.is('foo', 'foo'));
console.log(Object.is({}, {}));
```
唯一的不同之处就在于`+0`不等于`-0`，二是`NaN`等于自身。
```js
console.log(+0 === -0); // true
console.log(NaN === NaN); // false

console.log(Object.is(+0, -0)); // false
console.log(Object.is(NaN, NaN)); // true
```

## Object.assign()
`Object.assign()`方法用于合并对象，将源对象（source）的所有可枚举属性，复制到目标（target）对象上。
```js
const target = { a: 1 };

const source1 = { b: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
console.log(target); // {a: 1, b: 2, c: 3}
```
`Object.assign()`方法的第一个参数是目标对象，其余的参数都是源对象。

但是，如果目标对象于源对象有同名的属性或者多个源对象有同名属性的话，后面的属性会覆盖前面的属性。
```js
const target = { a: 1, b: 1 };

const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
console.log(target);
```
如果只有一个参数时，会直接返回这个参数。
```js
const obj = { a: 1 };
console.log(Object.assign(obj) === obj); // true
```
如果这个参数不是对象，会优先转成对象，然后返回，要注意的是，传入的参数为`undefined`或者`null`时，会直接报错。
```js
console.log(typeof Object.assign(2)); // object

console.log(Object.assign(undefined)); // Cannot convert undefined or null to object
```
如果非对象参数出现在源对象（不是第一个参数）时，处理的规则就不一样了，会先把这些参数转成对象，如果无法转成对象，就跳过。那么`undefined`和`null`不在第一个参数时，就不会报错了。
```js
const obj = { x: 1 };
console.log(Object.assign(obj, undefined) === obj); // true
console.log(Object.assign(obj, null) === obj); // true
```
其他类型值不在第一个参数时，也不会报错。除了字符串会以数组形式，拷贝到目标对象，其他值都不会产生效果。
```js
const str = 'abcd';
const bool = true;
const num = 10;

const obj = Object.assign({}, str, bool, num);
console.log(obj); // {0: "a", 1: "b", 2: "c", 3: "d"}
```
上面的例子中，`str`、`bool`、`num`分别是字符串、布尔值、数值，结果只有字符串被合入目标对象，其余的类型值都被忽略了。是因为字符串的包装对象，会产生可枚举属性。

`Object.assign()`拷贝的属性也是有限制的，只拷贝对象自身的属性并不会拷贝继承属性，也不会拷贝不可枚举的属性`enumberble: false`。
```js
const obj = Object.assign({b: 'c'}, 
  Object.defineProperty({}, 'invisible', {
    enumerable: false,
    value: 'hello'
  })
)
console.log(obj); // {b: "c"}
```
上面的例子中，`Object.assign()`要拷贝的对象只有一个不可枚举属性`invisible`，而这个属性没有被拷贝进去。

属性名为`Symbol`值的属性，也会被`Object.assign()`拷贝。

### 注意事项

#### 浅拷贝
`Object.assign()`方法只是浅拷贝而已，并不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用而已。
```js
const obj1 = { a: { b: 1 } };
const obj2 = Object.assign({}, obj1);

obj1.a.b = 2;
console.log(obj2.a.b); // 2
```
上面的代码中，源对象`obj1`的`a`属性的值是一个对象，`Object.assign()`拷贝得到的是这个对象的引用。这个对象的引用。这个对象的任何变化，都会影响到目标对象中。

#### 同名属性替换
对于嵌套的对象来说，如果遇到同名属性时，`Object.assign()`只是替换而已，并不是添加。
```js
const obj1 = { a: { b: 'c', d: 'e' } };
const obj2 = { a: { b: 'hello' } };
const obj3 = Object.assign(obj1, obj2);

console.log(obj3); // {a: {b: 'hello'}}
```
上面的例子中，`obj1`对象的`a`的属性被`obj2`对象的`a`属性整个替换掉了，而不会得到`{ a: { b: 'hello', d: 'e' } }`的结果。
所以大家使用的时候要特别小心。

#### 数组的处理
`Object.assign()`可以用来处理数组，但是会把数组当作对象。
```js
const arr = [1, 2, 3];
console.log(Object.assign(arr, [4, 5])); // [4, 5, 3]
```
上面的代码中，`Object.assign()`会把数组当作属性名为0、1、2的对象，因此源数组的0号属性`4`覆盖了目标数组的0号属性`1`。

#### 取值函数的处理
`Object.assign()`只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。
```js
const obj1 = {
  get foo() {
    return 1
  }
};
const obj2 = {};

console.log(Object.assign(obj1, obj2)); // { foo: 1 }
```
上面代码中，`obj1`对象的`foo`属性是一个取值函数，`Object.assign()`不会复制这个函数，只会拿到值以后，将这个值复制过去。

### 常见用途

#### 为对象添加属性
```js
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}

const obj = new Point(1, 2);
console.log(obj); // {x: 1, y: 2}
```
上面的方法通过`Object.assign()`方法，将`x`属性和`y`属性添加到`Point`类的对象实例。

#### 为对象添加方法
```js
class Person {
  constructor() {
    this.name = 'tutu';
    this.age = 18;
  }
}

Object.assign(Person.prototype, {
  getName() {
    console.log(this.name);
  },

  getAge() {
    console.log(this.age);
  }
});

const person1 = new Person();
console.log(person1.getName()); // tutu
console.log(person1.getAge()); // 18
```
上面的代码使用了对象属性简洁表达法，直接将两个函数放在大括号中，再使用`assign()`方法添加到`Person.prototype`之中。

#### 克隆对象
```js
function clone(origin) {
  return Object.assign({}, origin);
}
```
上面的代码将原始对象拷贝到一个空对象，就得到了原始对象的克隆。

不过，采用这种方法克隆，只能克隆原始对象的自身的值，并不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码。
```js
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin)
}
```

#### 合并多个对象
将多个对象合并到某个对象。
```js
const merge = (target, ...sources) => Object.assign(target, ...sources);
console.log(merge({}, { a: 1 }, { b: 2 }, { c: 3 })); // {a: 1, b: 2, c: 3}
```

#### 为属性指定默认值
```js
const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html'
};

function processContent(options) {
  options = Object.assign({}, DEFAULTS, options);
  console.log(options);
}

processContent({ a: 1 }); // {logLevel: 0, outputFormat: "html", a: 1}
```
上面的代码中，`DEFAULTS`对象是默认值，`options`对象是传进来的参数。`Object.assign()`方法把`DEFAULTS`和`options`合并成一个新对象，如果这两个对象都有同名属性，则`options`的属性值会覆盖`DEFAULTS`的属性值。

但是要注意的是，存在浅拷贝的问题，`DEFAULTS`和`options`对象的所有属性的值，最好不要设置为另一个对象，否则，`DEFAULTS`对象的该属性很可能不会起作用。
```js
const DEFAULTS = {
  url: {
    host: 'baidu.com',
    port: 3000
  },
};

function processContent(options) {
  options = Object.assign({}, DEFAULTS, options);
  console.log(options);
}

processContent({ url: { port: 8000 } });
```
上面的例子中，是想把`url.port`改成8000，`url.host`不变，结果却把`options.url`覆盖掉了`DEFAULTS.url`，所以`url.host`不存在了。

## Object.getOwnPropertyDescriptors()
`Object.getOwnPropertyDescriptors()`方法返回指定对象自身所有（非继承属性）属性的描述。而在ES5中有一个`Object.getOwnPropertyDescriptor()`方法用于返回某个对象属性的描述对象。 通俗点说，前者是用来查看某个对象的所有属性的描述，而后者是查看某个对象里面的某个属性的描述。来看个例子：
```js
const obj = {
  foo: 123,
  get bar() { return 'hello' },
};

console.log(Object.getOwnPropertyDescriptor(obj, 'foo')); 
// {value: 123, writable: true, enumerable: true, configurable: true}

console.log(Object.getOwnPropertyDescriptors(obj));
// {
//   bar: {set: undefined, enumerable: true, configurable: true, get: ƒ},
//   foo: {value: 123, writable: true, enumerable: true, configurable: true}
// }
```
上面的例子中，`Object.getOwnPropertyDescriptor`方法返回的是`obj`对象中的`foo`属性的描述，而`Object.getOwnPropertyDescriptors()`方法则是返回`obj`对象中的所有属性的描述。

这个方法的引入是为了解决`Object.assign()`无法正确拷贝`get`属性和`set`属性的问题。
```js
const obj = {
  set foo(value) {
    console.log(value);
  }
}

const target1 = {};
Object.assign(target1, obj);

console.log(Object.getOwnPropertyDescriptor(target1, 'foo')); 
// {value: undefined, writable: true, enumerable: true, configurable: true}
```
上面的代码中，`source`对象的`foo`属性的值是一个赋值函数，`Object.assign`方法将这个属性拷贝给`target1`对象，结果属性的值变成了`undefined`。是因为`Object.assign`方法总是拷贝一个属性的值，并不会拷贝它的赋值方法或者取值方法。

可以用`Object.getOwnPropertyDescriptors()`方法配合`Object.defineProperties()`方法实现正确的拷贝。
```js
const obj = {
  set foo(value) {
    console.log(value);
  }
}

const target1 = {};
Object.defineProperties(target1, Object.getOwnPropertyDescriptors(obj));
console.log(Object.getOwnPropertyDescriptor(target1, 'foo'));
// {
//   get: undefined, 
//   enumerable: true, 
//   configurable: true, 
//   set: foo(value)
// }
```
来优化一下上面的代码，把两个对象合并的逻辑写成一个函数。
```js
const shallowMerge = (target1, source) => Object.defineProperties(
  target1, 
  Object.getOwnPropertyDescriptor(target1, 'foo')
);
```
`Object.getOwnPropertyDescriptors()`方法还有另一个用处，配合`Object.create()`方法，将对象属性克隆到一个新对象。注意，这只是浅拷贝而已。
```js
const shallowClone = (obj) => Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);

let obj1= {
  a: 1,
  b: 2,
};

let obj2 = shallowClone(obj1);
obj2.b = 3;
console.log(obj1); // {a: 1, b: 2}
console.log(obj2); // {a: 1, b: 3}
```
另外，`Object.getOwnPropertyDescriptors()`方法可以实现一个对象继承另一个对象。
```js
class Person {
  constructor() {
    this.a = 1;
    this.b = 2;
  }
}
const prot = new Person();
const obj = Object.create(prot, Object.getOwnPropertyDescriptors({ foo: 123 }));
console.log(obj);
// {
//   foo: 123
//   __proto__: Person
//     a: 1
//     b: 2
// }
```

## __proto__属性
`__proto__`，用来读取或者设置当前对象的原型对象，实际上跟`prototype`一样的。所有浏览器都支持这个属性，包括IE11。这个属性只有浏览器有，在其他环境不一定有。从兼容性来看，都不要使用这个属性。

`__proto__`调用的是`Object.prototype.__proto__`，具体实现的代码如下：
```js
Object.defineProperty(Object.prototype, '__proto__', {
  get() {
    let _thisObj = Object(this);
    return Object.getPrototypeOf(_thisObj);
  },

  set(proto) {
    if (this === undefined || this === null) {
      throw new TypeError();
    }

    if (!isObject(this)) {
      return undefined;
    }

    if (!isObject(proto)) {
      return undefined;
    }

    let status = Reflect.setPrototypeOf(this, proto);

    if (!status) {
      throw new TypeError();
    }
  },
});

function isObject(value) {
  return Object(value) === value;
}
```
如果一个对象本身部署了`__proto__`属性，该属性的值就是对象的原型。
```js
console.log(Object.getPrototypeOf({__proto__: null})); // null
```

## Object.setPrototypeOf()
`Object.setPrototypeOf`方法的用处和`__proto__`是一样的，用于设置一个对象的原型对象，返回参数对象本身。
```js
let proto = {};

let obj2 = { x: 10 };

otherProto.y = 20;
otherProto.z = 40;

Object.setPrototypeOf(obj2, otherProto);
console.log(obj2.y); // 20
console.log(obj2.z); // 40
```
上面的代码将`Proto`对象设为`obj2`对象的原型，所以从`obj2`对象中可以读取`Proto`对象的属性。

如果第一个参数不是对象的话，会自动转成对象，但是返回的还是第一个参数，这个操作并不会产生任何的效果。
```js
console.log(Object.setPrototypeOf(1, {})); // 1
console.log(Object.setPrototypeOf('foo', {})); // foo
console.log(Object.setPrototypeOf(true, {})); // true

console.log(Object.setPrototypeOf(1, {}) === 1); // true
console.log(Object.setPrototypeOf('foo', {}) === 'foo'); // true
console.log(Object.setPrototypeOf(true, {}) === true); // true
```
由于`undefined`和`null`无法转成对象，如果第一个参数是`undefined`或`null`的话，会直接报错。
```js
console.log(Object.setPrototypeOf(undefined, {}));
// Object.setPrototypeOf called on null or undefined
console.log(Object.setPrototypeOf(null, {}));
// Object.setPrototypeOf called on null or undefined
```

## Object.getPrototypeOf()

`Object.getPrototypeOf()`方法是用来读取一个对象的原型对象。
```js
Object.getPrototypeOf(obj);
```
看下面的例子：
```js
function Person() {

}

let obj = new Person();

console.log(Object.getPrototypeOf(obj) === Person.prototype); // true

Object.setPrototypeOf(obj, Object.prototype);
console.log(Object.getPrototypeOf(obj) === Person.prototype); // false
```
如果参数不是对象，也会被自动转成对象。
```js
console.log(Object.getPrototypeOf(1)); // Number {0, constructor: ƒ, toExponential: ƒ, toFixed: ƒ, toPrecision: ƒ,}
console.log(Object.getPrototypeOf('foo')); // String {"", constructor: ƒ, anchor: ƒ, big: ƒ, blink: ƒ,}
console.log(Object.getPrototypeOf(true)); // Boolean {false, constructor: ƒ, toString: ƒ, valueOf: ƒ}

console.log(Object.getPrototypeOf(1) === Number.prototype); // true
console.log(Object.getPrototypeOf('foo') === String.prototype); // true
console.log(Object.getPrototypeOf(true) === Boolean.prototype); // true
```

## Object.values()
`Object.values()`方法返回一个数组。成员是参数对象自身的所有可遍历属性的键值，但是不包含继承属性。
```js
const obj = { foo: 'bar', baz: 42 };
console.log(Object.values(obj)); // ["bar", 42]
```
如果属性名为数值的属性，是按照数值大小、从小到大遍历的。
```js
const obj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.values(obj)); // ["b", "c", "a"]
```
`Object.values`只返回对象自身的可遍历属性。
```js
const obj = Object.create({}, {p: {value: 42}});
console.log(Object.values(obj)); // []
```
上面代码中，`Object.create`方法的第二个参数添加的对象属性，也就是属性`p`，如果不显式声明，默认是不可遍历的，
因为`p`的属性描述对象的`enumerable`默认是`false`，`Object.values`不会返回这个属性。只能把`enumerable`改成`true`，
`Object.values`才会返回属性`p`的值。
```js
const obj = Object.create({}, { p: {
    value: 42,
    enumerable: true,
  }
});

console.log(Object.values(obj)); // [42]
```
`Object.values`会过滤属性名为`Symbol`值的属性。
```js
console.log(Object.values({ [Symbol()]: 123, foo: 'abc' })); // ["abc"]
```
如果`Object.values()`方法的参数是一个字符串，返回的是各个字符串的一个数组。
```js
console.log(Object.values('foo')); // ["f", "o", "o"]
```
上面代码中，字符串会先转成一个类似数组的对象，字符串的每个字符，就是这个对象的属性，因此，`Object.values`返回每个属性的键值，
就是各个字符组成的一个数组。

如果参数不是对象，`Object.values`会将其转为对象。由于数值和布尔值的包装对象，都不会为实例添加非继承属性，所以，`Object.values`
会返回空数组。
```js
console.log(Object.values(42)); // []
console.log(Object.values(true)); // []
```

## Object.entries() 

`Object.entries()`方法返回一个数组。成员是参数对象自身的所有可遍历属性的键值对儿数组，当然也不包含继承的属性。
```js
const obj = { foo: 'bar', baz: 42 };
console.log(Object.entries(obj)); // [["foo", "bar"], ["baz", 42]]
```
这个方法除了返回值不一样，行为和`Object.values`基本一致。也会过滤掉属性名为Symbol值的属性。

`Object.entries`的基本是用来遍历对象的属性。
```js
let obj = { x: 1, y: 2 };

for (let [key, value] of Object.entries(obj)) {
  console.log(key, value);
  // x 1
  // y 2
}
```
`Object.entries`方法的另一个用处是，把对象转成真正的`Map`结构。
```js
const obj = { foo: 'bar', baz: 42 };
const map = new Map(Object.entries(obj));
console.log(map); // {"foo" => "bar", "baz" => 42}
```
实现一个`Object.entries`方法。
```js
function entries(obj) {
  let arr = [];
  for (let key of Object.keys(obj)) {
    arr.push([key, obj[key]]);
  }
  return arr;
}
```

## Object.fromEntries()

`Object.fromEntries()`方法是`Object.entries()`的逆向操作，用于将一个键值对数组转为对象。
```js
console.log(Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
]));
// {foo: "bar", baz: 42}
```
这个方法的主要目的是为了将键值对的数据结构还原为对象，这种行为适合将Map结构转为对象。
```js
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);

console.log(Object.fromEntries(entries)); // {foo: "bar", baz: 42}

const map = new Map().set('foo', true).set('bar', false);
console.log(Object.fromEntries(map)); // {foo: true, bar: false}
```
配合`URLSearchParams`对象，将查询字符串转为对象。
```js
const params = new URLSearchParams('foo=bar&baz=qux');
console.log(Object.fromEntries(params));
```