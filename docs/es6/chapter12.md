# Proxy

## 概述
`Proxy`对象用于定义基本操作的自定义行为（例如：属性查找，赋值、枚举、函数调用等）。

`Proxy`可以理解成，在对象之前设了一层拦截，对该对象的访问都必须通过这层拦截。因此提供了一种机制，可以对外界的访问
进行过滤和改写。
```js
let obj = new Proxy({}, {
  get(target, propKey, receiver) {
    console.log("getting" + propKey);
    return Reflect.get(target, propKey, receiver);
  },

  set(target, propKey, value, receiver) {
    console.log("setting" + propKey);
    return Reflect.set(target, propKey, value, receiver);
  }
});

obj.count = 1;
// settingcount
console.log(++obj.count); 
// gettingcount
// settingcount
// 2
```
上面的代码中，对一个空对象设了一层拦截，重定义了属性的读取（`get`）和设置（`set`）行为。对设置了拦截行为的对象
`obj`，读写它的属性时，就得到以上的结果。

创建Proxy语法如下：
```js
var proxy = new Proxy(target, handler);
```
`Proxy`对象的所有用法，都像上面的形式。`target`表示要拦截的目标对象，`handler`参数也是一个对象，用来定义拦截行为。

来看个例子。
```js
let p = new Proxy({}, {
  get(target, propKey) {
    console.log(propKey);
    // "time"
    // "name"
    // "title"
    return 35;
  }
});

console.log(p.time); // 35
console.log(p.name); // 35
console.log(p.title); // 35
```
上面的代码中，`Proxy`接受两个参数。第一个参数就是要代理的对象，也就是上面例子中的空对象。如果没有`Proxy`的介入，操
作原来要访问的就是这个对象；第二个参数就是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，这个函数将
拦截对应的操作。例如：上面的代码中，配置对象有一个`get`方法，用来拦截对目标对象属性的访问。`get`方法的两个参数分别是
目标对象和所要访问的属性。由于拦截函数总是返回`35`，所以访问任何属性都是返回`35`。

如果要使得`Proxy`起作用，必须是针对`Proxy`实例进行操作（也就是上面的`p`对象），而不是针对目标对象（上例中的空对象）进行操作。

如果`handler`没有设置任何拦截的情况下，就等于直接通向原对象。
```js
let target = {};
let handler = {};
let p = new Proxy(target, handler);

p.name = "tutu";
console.log(target.name); // tutu
```
上面的代码中，`handler`是一个空对象，没有任何拦截效果，访问`p`就等于访问`target`。

把`Proxy`对象，设置到`object.proxy`属性，从而可以在`object`对象上调用。
```js
const target = {};
const handler = {
  get(target, propKey) {
    console.log(`getting ${propKey}`);
    return target[propKey];
  }
};
const obj = { proxy: new Proxy(target, handler) };

obj.proxy.time = 3;
console.log(obj.proxy.time);
// getting time
// 3
```
`Proxy`实例也可以作为其他对象的原型对象。
```js
let p = new Proxy({}, {
  get(target, propKey) {
    return 50;
  }
});
let obj = Object.create(p);
console.log(obj.time); // 50
console.log(obj.prototype === p.prototype); // true
```
上面的代码中，`p`对象是`obj`对象的原型，`obj`对象本身没有`time`属性，所以根据原型链，就可以在`proxy`上获取到该属性，
导致被拦截。

同一个拦截器函数，可以设置拦截多个操作。
```js
let handler = {
  get(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return `Hello, ${name}`;
  },

  apply(target, thisBinding, args) {
    return args[0];
  },

  construct(target, args) {
    return {value: args[1]};
  }
};

let f = new Proxy(function(x, y) {
  return x + y;
}, handler);

f(1, 2);
console.log(new f(1, 2)); // 2
console.log(f.prototype === Object.prototype); // true
console.log(f.foo === "Hello, foo"); // true
```
## Proxy实例的方法
`Proxy`一共有13种拦截方法操作如下：

`get(target, propKey, receiver)`：拦截对象属性的读取，比如`p.foo`和`proxy['foo']`。

`set(target, propKey, vlaue)`：拦截对象属性的设置，比如`p.foo = v`或`p['foo'] = v`，返回一个布尔值。

`has(target, propKey)`：拦截`propKey in p`的操作，返回一个布尔值。

`deleteProperty(target, propKey)`：拦截`delete p[propKey]`的操作，返回一个布尔值。

`ownKeys(target)`：拦截`Object.getOwnPropertyNames(p)`、`Object.getOwnPropertySymbols(p)`、`Object.keys(p)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。

`getOwnPropertyDescriptor(target, propKey)`：拦截`Object.getOwnPropertyDescriptor(p, propKey)`，返回属性的描述对象。

`defineProperty(target, propKey, propDesc)`：拦截`Object.defineProperty(p, propKey, propDesc)`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。

`preventExtensions(target)`：拦截`Object.preventExtensions(p)`，返回一个布尔值。

`getPrototypeOf(target)`：拦截`Object.getPrototypeOf(p)`，返回一个对象。

`isExtensible(target)`：拦截`Object.isExtensible(p)`，返回一个布尔值。

`setPrototypeOf(target, proto)`：拦截`Object.setPrototypeOf(p, proto)`，返回一个布尔值。如果目标对象是函数的话，还有两种额外操作可以拦截。

`apply(target, object, args)`：拦截`Proxy`实例作为函数调用的操作，比如`p(...args)`、`p.call(object, ...args)`、`p.apply(...)`。

`construct(target, args)`：拦截`Proxy`实例作为构造函数调用的操作，比如`new p(...args)`。