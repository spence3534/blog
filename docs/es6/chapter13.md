# Reflect

## 概述
`Reflect`对象跟`Proxy`对象一样，也是ES6提供的新API。`Reflect`对象的设计目的有以下几个。

1. 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`）放在`Reflect`对象上。可以从`Reflect`对象上拿到`Object`对象的内部方法。

2. 修改某些`Object`方法的返回结果，能够变得更加合理。例如，`Object.defineProperty(obj, name, desc)`在无法定义属性时会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`方法会返回`false`。
```js
// 旧写法
try {
  Object.defineProperty(target, property, attributes);
  // 成功
} catch(e) {
  // 失败
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // 成功
} else {
  // 失败
}
```

3. 让`Object`操作变成函数行为。某些`Object`操作是命令式，例如：`name in ob`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`变成了函数行为。
```js
// 旧写法
console.log('assign' in Object); // true
console.log('name' in Object); // true
console.log('defineProperty' in Object); // true

// 新写法
console.log(Reflect.has(Object, 'assign'));
console.log(Reflect.has(Object, 'name'));
```
4. `Reflect`对象的方法和`Proxy`对象的方法是一一对应的，只要`Proxy`对象上有的方法，在`Reflect`对象上就一定有。无论`Proxy`怎么修改默认行为，都可以在`Reflect`上获取默认行为。
```js
var target = {};
var handler = {
  set(target, name, value, receiver) {
    var success = Reflect.set(target, name, value, receiver);

    if (success) {
      console.log("成功");
    }
    return success;
  }
}

var proxy = new Proxy(target, handler);
```
上面的代码中，`Proxy`方法拦截`target`对象的属性赋值行为。采用`Reflect.set`方法将值赋给对象的属性，确保完成原有的行为，然后再部署额外的功能。再来看另外一个例子：
```js
const person = {
  name: 'tutu',
  age: 18 
};
var loggedObj = new Proxy(person, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },

  deleteProperty(target, name) {
    console.log('delete ' + name);
    return Reflect.deleteProperty(target, name);
  },

  has(target, name) {
    console.log('has ' + name);
    return Reflect.has(target, name);
  }
});

console.log(loggedObj.name);
// get {name: "tutu", age: 18} name
// tutu

console.log('age' in loggedObj);
// has age
// true

delete loggedObj.age;
console.log(loggedObj.age);
// get {name: "tutu"} age
// undefined
```
上面的代码中，每一个`Proxy`对象的拦截操作（`get、delete、has`）内部调用对应的`Reflect方法`，保证原生行为能够正常执行。添加的工作就是将每一个操作输出一行日志。

## 静态方法
`Reflect`对象一共有13个静态方法，如下：
* `Reflect.apply(target, thisArg, args)`
* `Reflect.construct(target, args)`
* `Reflect.get(target, name, receiver)`
* `Reflect.set(target, name, value, receiver)`
* `Reflect.defintProperty(target, name, desc)`
* `Reflect.deleteProperty(target, name)`
* `Reflect.has(target, name)`
* `Reflect.ownKeys(target)`
* `Reflect.isExtensible(target)`
* `Reflect.preventExtensions(target)`
* `Reflect.getOwnPropertyDescriptor(target, name)`
* `Reflect.getPrototypeOf(target)`
* `Reflect.setPrototypeOf(target, prototype)`

以上的这些方法的作用大部分跟`Object`对象的同名方法的作用是一样的，而且跟`Proxy`对象的方法也是一一对象的。

### Reflect.get(target, name, receiver)
`Reflect.get`方法是查找并返回`target`对象的`name`属性，如果没有这个属性，会返回`undefined`。
```js
var obj = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
}

console.log(Reflect.get(obj, 'foo')); // 1
console.log(Reflect.get(obj, 'bar')); // 2
console.log(Reflect.get(obj, 'baz')); // 3
```
如果`name`属性部署了读取函数（getter），则读取函数的`this`绑定`receiver`。
```js
var person = {
  name: 'tutu',
  age: 18,
  get getInfo() {
    return this.name + this.age;
  }
};

var receiver = {
  name: 'honghong',
  age: 16
};

console.log(Reflect.get(person, 'getInfo', receiver));
// honghong16
```
要注意的是，如果第一个参数不是对象，`Reflect.get`方法会报错。

### Reflect.set(target, name, value, receiver)
`Reflect.set`方法设置`target`对象的`name`属性等于`value`。
```js
const person = {
  name: 'tutu',
  age: 18,
  set setAge(value) {
    return this.age = value;
  }
}

console.log(person.age); // 18

Reflect.set(person, 'age', 20);
console.log(person.age); // 20
```
一样的，如果`name`属性设置了赋值函数，那么赋值函数的`this`绑定`receiver`。
```js
const person = {
  name: 'xiaoli',
  age: 22,
  set setAge(value) {
    return this.age = value;
  }
};

const myReceiver = {
  age: 18
};

Reflect.set(person, 'setAge', 16, myReceiver);
console.log(person.age); // 22
console.log(myReceiver.age); // 16
```
要注意的是，如果`Proxy`对象和`Reflect`对象一起使用，前者拦截赋值操作，而后者完成赋值的默认行为，而且传入了`receiver`，`Reflect.set`就会触发`Proxy.defineProperty`拦截。
```js
const obj = {
  a: 'a'
};

const handler = {
  set(target, key, value, receiver) {
    console.log('set');
    return Reflect.set(target, key, value, receiver);
  },

  defineProperty(target, key, attribute) {
    console.log('defineProperty');
    Reflect.defineProperty(target, key, attribute);
  }
};

let proxy = new Proxy(obj, handler);

proxy.a = 'A';
// set
// defineProperty
```
上面的代码中，`Proxy.set`拦截使用了`Reflect.set`，并且传入了`reciver`会导致触发了`Proxy.defineProperty`拦截。这是因为`Proxy.set`的`receiver`参数总是指向当前的`Proxy`实例（也就是上面的`proxy`），而`Rflect.set`一旦传入`receiver`，就会将属性赋值到`receiver`上面（上面的`proxy`），导致触发了`Proxy.defineProperty`拦截。如果`Reflect.set`没有传`receiver`，就不会触发`defineProperty`拦截。

如果第一个参数不是对象，`Reflect.set`方法也会报错。

### Reflect.has(obj, name)
`Reflect.has`方法对应`name in obj`里面的`in`运算符。
```js
var obj = {
  num: 10
};

// 旧写法
console.log('num' in obj); // true

// 新写法
console.log(Reflect.has(obj, 'num')); // true
console.log(Reflect.has(obj, 'name')); // false
```
如果`Reflect.has`方法的第一个参数不是对象，就会报错。

### Reflect.deleteProperty(obj, name)
`Reflect.deleteProperty`方法等同于`delete obj[name]`，用于删除对象的属性。
```js
var person = {
  name: 'tutu',
  age: 18
};

// 旧写法
delete person.name;

// 新写法
console.log(Reflect.deleteProperty(person, 'age')); // true
```
如果删除成功或者被删除的属性不存在，返回`true`。删除失败，被删除的属性依然存在，返回`false`。

如果`Reflect.deleteProperty()`方法的第一个参数不是对象，则会报错。

### Reflect.construct(target, args)
`Reflect.construct`方法和`new target()`这种形式调用构造函数是一样的。`Reflect.construct`只是不需要使用`new`来调用构造函数的方法。
```js
function Person(name) {
  this.name = name;
}

// new 写法
const instance1 = new Person('tutu');

const instance2 = Reflect.construct(Person, ['xiaoming']);

console.log(instance1); // Person {name: "tutu"}
console.log(instance2); // Person {name: "xiaoming"}
```
如果`Reflect.construct`方法的第一个参数不是对象，就会报错。

### Reflect.getPrototypeOf(obj)
`Reflect.getPrototype`方法用于读取对象的`__proto__`属性，对应`Object.getPrototypeOf(obj)`。
```js
function Person(name) {
  this.name = name;
}
const obj = new Person();
console.log(Object.getPrototypeOf(obj) === Person.prototype); // true
console.log(Reflect.getPrototypeOf(obj) === Person.prototype); // true
```
这两个方法的唯一区别在于，如果参数不是对象，`Object.getPrototype`会将这个参数转为对象，而`Reflect.getPrototypeOf`会报错。

### Reflect.setPrototypeOf(obj, newProto)
`Reflect.setPrototypeOf`方法用于目标对象的原型（prototype），对应`Object.setPrototypeOf(obj, newProto)`方法。它返回一个布尔值，表示是否设置成功。
```js
const obj = {};

// 旧写法
console.log(Object.setPrototypeOf(obj, Array.prototype)); 
// Array {}

// 新写法
console.log(Reflect.setPrototypeOf(obj, Array.prototype)); 
// true

console.log(obj.length); // 0
```
如果无法设置目标对象的原型（例如，目标对象禁止扩展），`Reflect.setPrototype`方法返回`false`。
```js
console.log(Reflect.setPrototypeOf({}, null));
// true

console.log(Reflect.setPrototypeOf(Object.freeze({}), null));
// false
```
如果第一个参数不是对象，`Object.setPrototypeOf`和`Reflect.setPrototypeOf`都会报错。
```js
console.log(Object.setPrototypeOf(null, {}));
// TypeError: Object.setPrototypeOf called on null or undefined

console.log(Reflect.setPrototypeOf(null, {}));
// TypeError: Reflect.setPrototypeOf called on non-object
```

### Reflect.apply(func, thisArg, args)
`Reflect.apply`方法和`Function.prototype.apply.call(func, thisArg, args)`方法一模一样，用于绑定`this`对象后执行给定函数。

```js
const nums = [10, 11, 9, 30, 21, 15];

// 旧写法
// const min = Math.min.apply(Math, nums);
// const max = Math.max.apply(Math, nums);
// const type = Object.prototype.toString.call(min);
// console.log(min); // 9
// console.log(max); // 30
// console.log(type); // [object Number]

// 新写法
const min = Reflect.apply(Math.min, Math, nums);
const max = Reflect.apply(Math.max, Math, nums);
const type = Reflect.apply(Object.prototype.toString, nums, []);
console.log(min); // 9
console.log(max); // 30
console.log(type); // [object Array]
```

### Reflect.defineProperty(target, proptertyKey, attributes)
`Reflect.defineProperty`方法和`Object.defineProperty`，用来为对象定义属性。未来，后者会被逐渐废除，现在开始使用`Reflect.defineProperty`代替它。
```js
const myDate = {};

// 旧写法
Object.defineProperty(myDate, 'date', {
  value: "2020-09-14"
});

// 新写法
Reflect.defineProperty(myDate, 'date', {
  value: "2020-09-14"
});

console.log(myDate.date); // 2020-09-14 
```
如果`Reflect.defineProperty`的第一个参数不是对象，就会抛出错误，比如`Reflect.defineProperty(1, 'foo')`。

这个方法可以和`Proxy.defineProperty`配合使用。
```js
const p = new Proxy({}, {
  defineProperty(target, prop, descriptor) {
    console.log(descriptor);
    return Reflect.defineProperty(target, prop, descriptor);
  }
});

p.foo = 'bar';
// {value: "bar", writable: true, enumerable: true, configurable: true}

console.log(p.foo); // bar
```
上面的代码中，`Proxy.defineProperty`对属性赋值设置了拦截，然后`Reflect.defineProperty`完成了赋值。

### Reflect.getOwnPropertyDescriptor(target, propertyKey)
`Reflect.getOwnPropertyDescriptor`和`Object.getOwnPropertyDescriptor`，用于获取指定属性的描述对象。
```js
const obj = {};

Object.defineProperty(obj, 'hidden', {
  value: true,
  enumerable: false,
});

// 旧写法
console.log(Object.getOwnPropertyDescriptor(obj, 'hidden'));
// {value: true, writable: false, enumerable: false, configurable: false}

// 新写法
console.log(Reflect.getOwnPropertyDescriptor(obj, 'hidden'));
// {value: true, writable: false, enumerable: false, configurable: false}
```
两个方法的区别在于，如果第一个参数不是对象，`Object.getOwnPropertyDescriptor(1, 'foo')`不报错，返回`undefined`，而`Reflect.getOwnPropertyDescriptor(1, 'foo')`会抛出错误，表示参数非法。

### Reflect.isExtensible(target)
`Reflect.isExtensible`方法和`Object.isExtensible`，返回一个布尔值，表示当前对象是否可以扩展。
```js
const obj = {};

// 旧写法
console.log(Object.isExtensible(obj)); // true

// 新写法
console.log(Reflect.isExtensible(obj)); // true
```
如果参数不是对象，`Object.isExtensible`返回`false`，因为非对象本来就是不可扩展的，而`Reflect.isExtensible`会报错。

### Reflect.preventExtensions(target)
`Reflect.preventExtensions`和`Object.preventExtensions`方法一样，用于让一个对象变成不可扩展。返回一个布尔值，表示是否操作成功。
```js
var obj = {};

console.log(Object.preventExtensions(obj)); // {}

console.log(Reflect.preventExtensions(obj)); // true
```
如果参数不是对象，两个方法都会报错。

### Reflect.ownKeys(target)
`Reflect.ownKeys`方法用于返回对象的所有属性。是`Object.getOwnPropertyNames`、`Object.getOwnPropertySymbols`之和。
```js
const obj = {
  a: 1,
  b: 2,
  [Symbol.for('c')]: 3,
  [Symbol.for('d')]: 4,
}

// 旧写法
console.log(Object.getOwnPropertyNames(obj));
// ["a", "b"]

console.log(Object.getOwnPropertySymbols(obj));
// [Symbol(c), Symbol(d)]

// 新写法
console.log(Reflect.ownKeys(obj));
// ["a", "b", Symbol(c), Symbol(d)]
```
如果`Reflect.ownKeys()`方法的第一个参数不是对象的话，就会报错。

## 实例：使用Proxy实现观察者模式
观察这模式指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。
```js
const queueObservers = new Set();

const observe = (fn) => queueObservers.add(fn);

const observable = obj => new Proxy(obj, {
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    queueObservers.forEach(observer => observer());
    return result;
  }
});

const person = observable({
  name: 'tutu',
  age: 18
});

function print() {
  console.log(`${person.name}, ${person.age}`);
}

observe(print);

person.name = '小明';
person.age = 20;
// 小明, 18
// 小明, 20
```
上面的代码中，数据对象`person`是观察目标，函数`print`是观察者，一旦数据对象发生变化，`print`就会自动执行。使用`Proxy`写一个观察模式最简单的实现，就是上面的`observeable`和`observe`这两个函数。思路是`observeable`函数返回一个原始对象的`Proxy`代理，拦截赋值操作，触发充当观察者的各个函数。先定义一个`set`集合，所有观察者函数都放在这个集合里，然后，`observable`函数返回原始对象的代理，拦截赋值操作。拦截函数`set`之中，会自动执行所有观察者。