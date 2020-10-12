# Class继承

## 简介
Class可以通过`extends`关键字实现继承，这比ES5通过修改原型链实现继承，要清晰和方便很多。
```js
class Point {
}

class ColorPoint extends Point {
}
```
上面的代码中定义了一个`ColorPoint`类，该类通过`extends`关键字，继承了`Point`类的所有属性和方法。但是由于没有部署任何代码，所以这两个类完全一样，等于复制一个`Point`类。下面，修改一下`ColorPoint`的代码。
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return `${this.color} ${this.x} ${this.y}  ${super.toString()}`; // 调用父类的toString()
  }
}

const point = new Point(1, 2);
const colorPoint = new ColorPoint(3, 4, '#fff');

console.log(colorPoint.toString()); // #fff 3 4 [object Object]
```
上面的代码中，`constructor`方法和`toString`方法中，都出现了`super`关键字，它在这里表示父类的构造函数，用来新建父类的`this`对象。

子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对子类进行修改，加上子类自己的实例属性和方法。如果不调用`super`方法，子类就得不到`this`对象。
```js
class Point {
}

class ColorPoint extends Point {
  constructor() {

  }
}

let cp = new ColorPoint();
// Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```
上面的代码中，`ColorPoint`继承了父类`Point`，但是它的构造函数没有调用`super`方法，导致新建实例的时候就报错了。

ES5的继承，实质是先创造子类的实例对象`this`，然后再将父类的方法添加到`this`上面（Parent.apply(this)）。ES6的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到`this`上面（所以必须先调用`super`方法），然后再用子类的构造函数修改`this`。

如果子类没有定义`constructor`方法，这个方法会被默认添加，代码如下。也就是说，不管有没有显式定义，任何一个子类都有`constructor`方法。
```js
class ColorPoint extends Point {
}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```
另外需要注意的是，在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // 这样会报错
    super(x, y);
    this.color = color; // 这样是正确的
  }
}
```
上面代码中，子类的`constructor`方法没有调用`super`之前，就使用`this`关键字，结果就报错了，而放到`super`方法之后就是正确的。

下面是生成子类实例的代码。
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y);
    this.color = color;
  }
}
let cp = new ColorPoint(25, 8, '#fff');

console.log(cp instanceof ColorPoint); // true
console.log(cp instanceof Point); // true
```
上面代码中，实例对象`cp`同时是`ColorPoint`和`Point`两个类的实例，这和ES5的行为完全一致。

最后，父类的静态方法，也会被子类继承。
```js
class Point {
  static hello() {
    console.log('hello world');
  }
}

class Hello extends Point {
}

Hello.hello(); // hello world
```
上面代码中，`hello()`是`Point`类的静态方法，`Hello`继承了`Point`，也继承了`A`的静态方法。

## Object.getPrototypeOf()
`Object.getPrototypeOf`方法可以用来从子类获取父类。
```js
class Point {
}

class ColorPoint extends Point {
}

console.log(Object.getPrototypeOf(ColorPoint) === Point); // true
```
因此，可以使用这个方法判断，一个类是否继承了另一个类。

## super关键字
`super`关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，用法完全不同。

第一种情况，`super`作为函数调用时，代表父类的构造函数。ES6规定，子类的构造函数必须执行一次`super`函数。
```js
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```
上面的代码中，子类`B`的构造函数中的`super()`，表示调用父类的构造函数，这是必须的，不然会报错。

但是要注意，`super`虽然代表了父类`A`的构造函数，但是返回的是子类`B`的实例，即`super`内部的`this`指的是`B`的实例，因此`super()`在这相当于`A.prototype.constructor.call(this)`。
```js
class A {
  constructor() {
    console.log(new.target.name);
  }
}

class B extends A {
  constructor() {
    super();
  }
}

console.log(new A()); // A
console.log(new B()); // B
```
上面代码中，`new.target`指向当前正在执行的函数。可以看到，在`super()`执行时，它指向的是子类`B`的构造函数，而不是父类`A`的构造函数。也就是说，`super()`内部的`this`指向的是`B`。

作为函数时，`super()`只能用在子类的构造函数里，用在其他地方会报错。
```js
class A {};

class B extends A {
  m() {
    super();
  }
}
// Uncaught SyntaxError: 'super' keyword unexpected here
```
上面的代码中，`super()`用在`B`类的`m`方法之中，就会导致语法错误。

第二种情况，`super`作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
```js
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p());
  }
}

let b = new B();
```
上面的代码中，子类`B`当中的`super.p()`，就是将`super`当作一个对象使用。这时，`super`在普通方法中，指向`A.prototype`，所以`super.p()`就相当于`A.prototype.p()`。

这里需要注意，由于`super`指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过`super`调用的。
```js
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}  

let b = new B ();
console.log(b.m); // undefined
```
上面代码中，`p`是父类`A`实例的属性，`super.p`就引用不到它。

如果属性定义在父类的原型对象上，`super`就可以取到。
```js
class A {
}

A.prototype.x = 2;

class B extends A {
  constructor() {
    super();
    console.log(super.x); // 2
  }
}

let b = new B();
```
上面代码中，属性`x`是定义在`A.prototype`上面的，所以`super.x`可以取到它的值。

ES6中规定，在子类普通方法中通过`super`调用父类的方法时，方法内部的`this`指向类前的子类实例。
```js
class A {
  constructor() {
    this.x = 1;
  }

  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }

  m() {
    super.print();
  }
}

let b = new B();

b.m(); // 2
```
上面的代码中，`super.print()`虽然调用的是`A.prototype.print()`，但是`A.prototype.print()`内部的`this`指向子类`B`的实例，导致输出的是`2`，而不是`1`。也就是说，实际上执行的是`super.print.call(this)`。

由于`this`指向子类实例，所以如果通过`super`对某个属性赋值，这时`super`就是`this`，赋值的属性会变成子类实例的属性。
```js
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```
上面代码中，`super.x`赋值为`3`，也就是等于对`this.x`赋值为`3`。而当读取`super.x`的时候，读的是`A.prototype.x`，所以返回`undefined`。

如果`super`作为对象，用在静态方法里面，这时`super`将指向父类，而不是父类的原型对象。
```js
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

let child = new Child();
child.myMethod(2); // instance 2
```
上面代码中，`super`在静态方法中指向的是父类，在普通方法中指向的是父类的原型对象。

另外，在子类的静态方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类，而不是子类的实例。
```js
class A {
  constructor() {
    this.x = 1;
  }

  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }

  static m() {
    super.print();
  }
}

let b = new B();
B.x = 3;
B.m(); // 3
console.log(b); // {x: 2}
```
上面的代码中，静态方法`B.m`里面的`super.print()`指向父类的静态方法。这个方法里面的`this`指向的是`B`，而不是`B`的实例`b`。

要注意的是，使用`super`的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。
```js
class A {};

class B extends A {
  constructor() {
    super();
    console.log(super); // 这里使用super会导致报错
  }
}
```
上面的代码中，`console.log(super)`当中的`super`，无法看出是作为函数使用，还是作为对象使用，所以就报错了。如果能清晰地表明`super`的数据类型，就不会报错。
```js
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super.valueOf() instanceof B); // true
  }
}

let b = new B();
```
上面的代码中，`super.valueOf()`表明`super`是一个对象，因此就不会报错。同时，由于`super`使得`this`指向`B`的实例，所以`super.valueOf()`返回的是一个`B`的实例。

由于对象总是继承其他对象，所以可以在任意一个对象中，使用`super`关键字。
```js
let obj = {
  toString() {
    return "MyObject：" + super.toString();
  }
};

console.log(obj.toString());
// MyObject：[object Object]
```