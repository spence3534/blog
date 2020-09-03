# 对象扩展

## 属性简洁表达法

在ES6里加入了允许在大括号里面直接写入变量或者函数，作为对象的属性和方法。这样看起来就更加简洁了。
```js
const foo = 'bar';
const say = function() {
  return this.foo;
}
const obj = { foo, say};
console.log(obj);
console.log(obj.say());
```
上面的例子中，变量`foo`和`say`都是直接写在大括号里去，然而，属性名就是变量名，值就就是变量的值。

看另外一个例子：
```js
function fun(x, y) {
  return {x, y};
}

console.log(fun('a', 'b')); // {x: "a", y: "b"}
```
除了属性简写之外，方法也可以简写。
```js
const obj = {
  say() {
    return 'hello';
  }
}

console.log(obj.say()); // hello
```
再来看一个例子：
```js
let birth = "2020/9/2";
const person = {
  name: '王三',
  birth,
  hello() {
    return `大家好，我叫${this.name}`
  }
}

console.log(person); // {name: "王三", birth: "2020/9/2", hello: ƒ}
console.log(person.hello()); // 大家好，我叫王三
```

这种写法用在函数的返回值时，是非常方便的一种写法。
```js
function getPoint() {
  const x = 1;
  const y = 10;

  return {x, y};
}

console.log(getPoint()); // {x: 1, y: 10}
```
需要注意的是，简写的对象方法是不能当作构造函数的，看下面的例子。
```js
let obj = {
  fun() {
    this.foo = 'bar';
  }
};
let o = new obj.fun(); 
// obj.fun is not a constructor
```
上面的例子中，`fun`是一个简写的对象方法，所以`obj.fun`不能当作构造函数使用。

## 属性名表达式
定义对象的属性有两种方法，请看下面的例子：
```js
const obj = {};

// 方法一
obj.foo = true;

// 方法二
obj['a' + 'bc'] = 123;

console.log(obj); // {foo: true, abc: 123}
```
上面代码的方法一是直接用标识符作为属性名，方法二是用表达式作为属性名，但是要将表达式放在方括号里面。

如果使用字面量方式定义对象（使用大括号），在ES5中只能使用方法一（标识符）定义属性。
```js
var obj = {
  foo: true,
  abc: 123
};
```

在ES6中允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内。
```js
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};

console.log(obj); // {foo: true, abc: 123}
```

再看另外一个例子：
```js
let hong = 'xiaohong';

const name = {
  'ming': 'xiaoming',
  [hong]: 'xiaohong'
};

console.log(name['ming']); // xiaoming
console.log(name[hong]); // xiaohong
console.log(name['xiaohong']); // xiaohong
```
当然属性名表达式还可以用于定义方法名。
```js
let obj = {
  ['h' + 'ello']() {
    return 'hi';
  }
};
console.log(obj.hello()); // hi
```
在我看来属性名表达式在项目里面用得比较少，用来获取属性的值比较多，用属性名表达式定义属性名是比较少的。

## 属性的可枚举性和遍历

对象里的每个属性都有一个描述对象，是用来控制该属性的行为。通过`Object.getOwnPropertyDescriptor`方法可以获取该属性的描述对象。
```js
let obj = { num: 123 };
console.log(Object.getOwnPropertyDescriptor(obj, 'num'));
// {
//   value: 123,  --属性的值
//   writable: true,  --可写的
//   enumerable: true, --可枚举
//   configurable: true --可配置
// }
```
以上的代码，描述对象的enumerable属性为`true`，表示可枚举，如果为`false`，就表示某些操作会忽略当前属性。

有四个操作会忽略`enumerable`为`false`时。
* `for...in`循环：只遍历对象自身和继承的可枚举的属性。
* `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
* `JSON.stringify()`：只串行化对象自身的可枚举的属性。
* `Object.assign()`：忽略enumerable为`false`的属性。只拷贝对象自身的可枚举的属性。

另外，ES6规定了所有`Class`的原型方法都是不可枚举的。
```js
class Person {
  foo() {

  }
}

console.log(Object.getOwnPropertyDescriptor(Person.prototype, 'foo').enumerable); // false
```
总之，操作中引入继承的属性会让问题复杂化，大多数时候，只需要关心对象自身的属性。所以，尽量不要用`for...in`循环，而用`Object.keys()`代替。

### 属性的遍历
ES6一共有5种方法可以遍历对象的属性。
1. **for...in**  
`for...in`循环遍历对象自身和继承的可枚举属性（不含Symbol）属性。
2. **Object.kes(obj)**  
`Object.keys`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含Symbol属性）的键名。
3. **Object.getOwnPropertyNames(obj)**  
`Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不包含Symbol属性，但是包含不可枚举属性）的键名。
4. **Object.getOwnPropertySymbols(obj)**  
`Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有Symbol属性的键名。
5. **Reflect.ownKeys(obj)**  
`Reflect.ownKeys`返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是Symbol或字符串，也不管是否可枚举。

以上的5种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。
* 首先遍历所有数值键，按照数值升序排列。
* 其次遍历所有字符串键，按照加入时间升序排列。
* 最后遍历所有Symbol键，按照加入时间升序排列。

```js
console.log(Reflect.ownKeys({ [Symbol()]: 0, b:0, 10:0, 2:0, a:0}));
// ["2", "10", "b", "a", Symbol()]
```
上面的例子中，`Reflect.ownKeys`返回一个数组，包含了参数对象的所有属性。这个数组的属性次序首先是数值属性`2`和`10`，其次是字符串`b`和`a`，
最后是`Symbol`属性。

## super关键字

this关键字总是指向函数所在的当前对象，ES6中新增了另一个类似的关键字`super`，用于指向当前对象的原型对象。
```js
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
}

console.log(Object.setPrototypeOf(obj, proto)); // {foo: "world", find: ƒ}
console.log(obj.find()); // hello
```
上面代码中，对象`obj.find()`方法中，通过`super.foo`引用了原型对象`proto`的`foo`属性。

但是要注意的是，`super`关键表示原型对象时，只是用在对象的方法之中，用在其他地方都会报错。
```js
const obj1 = {
  foo: super.foo
}

const obj2 = {
  foo: () => super.foo
}

const obj3 = {
  foo: function() {
    return super.foo
  }
}
```
`super.foo`相当于`Object.getPrototypeOf(this).foo`或者`Object.getPrototypeOf(this).foo.call(this)`这两个方法。

```js
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x);
  }
};

const obj = {
  x: 'world',
  foo() {
    super.foo();
  }
}

Object.setPrototypeOf(obj, proto);

console.log(obj.foo()); // world
```
上面的例子中，`super.foo`指向原型对象proto的`foo`方法，但是绑定的`this`却还是当前对象`obj`，因此控制台看到的就是`world`;

## 对象的扩展运算符
对象的解构赋值用于一个对象取值，相当于把目标对象自身的所有可以遍历的、但未被读取的属性，分配到指定的对象上面去。所有的键和它们的值，都会复制到新的对象上。
```js
let obj = { 
  x: 1,
  y: 2,
  a: 3,
  b: 4
}
const { x, y, ...z } = obj;

console.log(x, y, z); // 1 2 {a: 3, b: 4}
```
上面的例子中，变量`z`是解构赋值所在的对象。它获取等号右边的所有没有读取的键（也就是`a`和`b`），将它们连同值一起复制过来。

由于解构赋值要求等号右边必须是一个对象，所以如果等号右边是`undefined`或者`null`的话就会报错。因为它们无法转为对象。
```js
let { ...foo } = null; // Cannot destructure 'null' as it is null.
let { ...bar } = undefined; // Cannot destructure 'undefined' as it is undefined
```
还有解构赋值必须是最后一个参数，否则报错。
```js
let { ...a, b, z } = someObject; // Rest element must be last element
let { x, ...y, z } = obj; // Rest element must be last element
```
上面的例子中，解构赋值不是最后一个参数，所以出现了报错。

解构赋值的拷贝只是浅拷贝而已，即如果一个键的值是引用类型或者函数的话，解构赋值拷贝的是这个值的引用，而不是这个值的副本。
```js
let obj = { a: {b: 1} };
let { ...x } = obj;
obj.a.b = 2;
console.log(x.a.b); // 2
```
上面的例子中，`x`是解构赋值所在的对象，拷贝了对象`obj`的`a`属性。`a`属性引用了一个对象，修改这个对象的值，会影响到解构赋值对它的引用。

另外，扩展运算符的解构赋值是不能复制继承自原型对象的属性的。
```js
let o1 = { a: 1 };
let o2 = { b: 2 };
o2.__proto__ = o1;
let { ...o3 } = o2;
console.log(o3); // {b: 2}
console.log(o3.a); // undefined
```
上面的例子中，对象`o3`复制了o2，但是只是复制了`o2`自身的属性，并没有复制它的原型对象`o1`的属性。

来看个例子：
```js
const obj = Object.create({ x: 1, y: 2});
obj.z = 3;

let { x, ...newObj } = obj;
let { y, z } = newObj;
console.log(x); // 1
console.log(y); // undefined
console.log(z); // 3
```
上面的例子中，变量`x`是单纯的解构赋值，所以可以读取对象`o`继承的属性; 变量`y`和`z`是扩展运算符的解构赋值，只能读取对象`o`自身的属性，所以变量`z`可以赋值成功，变量`y`取不到值。ES6规定，变量声明语句之中，如果使用解构赋值，扩展运算符后面必须是一个变量名，而不能是一个解构赋值表达式。所以上面代码引入了中间变量`newObj`，如果写成下面这样会报错。
```js
let { x, ...{ y, z } } = o; // `...` must be followed by an identifier in declaration contexts
```
解构赋值的一个很大的用处就是扩展函数的参数，引入其他的操作。
```js
function foo({ a, b }) {
  return a + b;
}

function bar({x, y, ...restConfig}) {
  return foo(restConfig);
}

console.log(bar({x: 1, y: 2, a: 10, b: 20})); // 30
```
上面的例子中，原始函数`foo`接受`a`和`b`作为参数，函数`bar`在`foo`的基础上进行了扩展，接受多余的参数，并且保留原始函数的行为。

### 扩展运算符
对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，复制到当前对象中。
```js
let z = { a: 3, b: 4};
let n = { ...z };
console.log(n);
```
对象的扩展运算符也可以用于数组。
```js
let foo = { ...['a', 'b', 'c'] };
console.log(foo); // {0: "a", 1: "b", 2: "c"}
```
如果扩展运算符后面是一个空对象，并不会产生什么效果。
```js
let obj = { ...{}, a: 1 };
console.log(obj); // {a: 1}
```
如果扩展运算符后面不是一个对象，会自动转为对象。
```js
let obj = { ...1 };
console.log(obj); // {}
```
上面的代码中，扩展运算符后面是一个整数`1`，会自动转为数值的包装对象`Number{1}`。由于该对象没有自身属性，所以返回了一个空对象。

但是，如果扩展运算符后面是个字符串，会自动转成一个类数组的对象，因此返回的不是空对象。
```js
let strting = { ...'hellotutu' };
console.log(strting); // {0: "h", 1: "e", 2: "l", 3: "l", 4: "o", 5: "t", 6: "u", 7: "t", 8: "u"}
```
对象的扩展运算符相当于`Object.assign()`方法。
```js
let a = "hello";
let aClone = { ...a };
console.log(aClone); // {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}

const obj = Object.assign({}, a);
console.log(obj); // {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}
```
上面的例子只是拷贝了对象实例的属性而已，想要完整复制一个对象，还要复制对象原型的属性，可以看下面的例子：
```js
let person = { name: "tutu", age: 18, height: "180cm" };

// 写法一
const clone1 = {
  __proto__: Object.getPrototypeOf(person),
  ...person
}
console.log(clone1); // { name: "tutu", age: 18, height: "180cm" }

// 写法二
const clone2 = Object.assign(
  Object.create(Object.getPrototypeOf(person)),
  person
)
console.log(clone2); // { name: "tutu", age: 18, height: "180cm" }

// 写法三
const clone3 = Object.create(
  Object.getPrototypeOf(person),
  Object.getOwnPropertyDescriptors(person)
)
console.log(clone3); // { name: "tutu", age: 18, height: "180cm" }
```
上面的代码中，写法一的`__proto__`属性在`node`环境下不一定能生效，所以推荐大家使用写法二和写法三。

扩展运算符也可以用于合并两个对象。
```js
let obj1 = { a: 1, b: 2 };
let obj2 = { c: 3, d: 4 };
let objConcat = { ...obj1, ...obj2 };
console.log(objConcat); // {a: 1, b: 2, c: 3, d: 4}
```
如果自定义的属性，放在扩展运算符后面，则扩展运算符内部同名的属性会被覆盖。
```js
let obj = { a: 3, b: 4, c: 5 };

let objWithOverrides1 = { ...obj, a: 1, b: 2 };
console.log(objWithOverrides1); // {a: 1, b: 2, c: 5}

let a = 1;
let b = 2;
let objWithOverrides2 = { ...obj, a, b };
console.log(objWithOverrides2); // {a: 1, b: 2, c: 5}

let objWithOverrides3 = Object.assign({}, obj, { a, b });
console.log(objWithOverrides3); // {a: 1, b: 2, c: 5}
```
上面代码中，`obj`对象的`x`属性和`y`属性，拷贝到新对象后会被覆盖了。

如果把自定义属性放在扩展运算符前面的话，就变成了设置新对象的默认属性值了。就拿上面的例子。
```js
let obj = { a: 3, b: 4, c: 5 };

let objWithOverrides1 = { a: 1, b: 2, ...obj };
console.log(objWithOverrides1); // {a: 3, b: 4, c: 5}

let a = 1;
let b = 2;
let objWithOverrides2 = { a, b, ...obj };
console.log(objWithOverrides2); // {a: 3, b: 4, c: 5}

let objWithOverrides3 = Object.assign({ a, b }, obj);
console.log(objWithOverrides3); // {a: 3, b: 4, c: 5}
```
和数组的扩展运算符一样，对象的扩展运算符后面也可以写表达式。
```js
let x = 2;
const obj = {
  ...(x > 1 ? {a: 1} : {}),
  b: 2
}
console.log(obj); // {a: 1, b: 2}
```
扩展运算符的参数对象中，如果有函数`get`函数，这个函数是会执行的。
```js
let a = {
  get x() {
    throw new Error('not throw yet');
  }
}

let withGetter = { ...a }; // Error: not throw yet
```
上面的例子中，`get`函数在扩展`a`对象时会自动执行，导致报错。

## 链判断运算符
通常我们读取对象里面的某个属性，往往都要判断一下对象是否存在。看下面的例子：
```js
let person = {
  // age: {
  //   ageNum: {
  //     num: 18
  //   }
  // }
}

let age = (
  person && person.age && person.age.ageNum && person.age.ageNum.num
) || 19;
console.log(age); // 19
```
上面的例子中，`num`属性在`person`对象里面的第四层，所以就要判断四次，判断每一层是否有值。这样看起来就很不直观。还有一种方法就是使用三元运算符`?:`来判断对象是否存在。
```js
const obj = {
  a: {
    text: "我在这"
  }
};

const val = obj ? obj.a.text : "没找到";
console.log(val); // 我在这
```
上面的例子中，首先，必须判断`obj`是否存在，才能取得`text`的值。使用三元运算符要比第一个例子简洁很多。

像第一个例子这样的层层判断不仅不直观不简洁，而且主要是麻烦。因此ES2020引入了“链判断运算符”`?.`，简化了第一个例子的写法。
```js
let person = {
  // age: {
  //   ageNum: {
  //     num: 18
  //   }
  // }
}

let age = person ?. age ?. ageNum ?. num || 19;
console.log(age); // 19
```
这个例子中，使用了`?.`运算符，直接在链式调用的时候进行判断对象是否为`null`或`undefined`。如果是，就不再往下进行运算了，并返回`undefined`。

链式运算符用来判断函数或者对象方法调用非常有用，看下面的例子：
```js
let obj = {  }

if (obj.foo?.() === false) {
  console.log("找到啦");
} else {
  console.log("没找到");
}
```
上面的例子中，`obj`对象中是否存在`foo()`这个方法，这时`?.`运算符就返回了`undefined`，判读语句就变成了`undefined === false`，所以就执行了`false`分支的代码。

链式判断运算符有三种用法：`obj?.prop`对象属性，`obj.[expr]`也是对象属性，`func?.(...args)`函数或者对象方法的调用。

但是使用这个运算符有几点需要注意的。

#### 短路机制

`?.`运算符相当于一种短路机制，只要不满足条件，就不会往下执行。
```js
let a = {
  x: 1
};
let y = "";
y = a?.["x"];
console.log(y); // 1
// 上面的操作等于
// y = a == null ? undefined : a["x"];
```
上面的例子中，如果`a`是`undefined`或者`null`，那么`y`就等于`undefined`。也就是说，链式判断运算符一旦为真，右侧的表达式就不执行了。

#### delete运算符
```js
let a = {
  b: ""
};
delete a?.b;
console.log(a);
// 等同于
// a == null ? undefined: delete a.b;
```
上面的例子中，如果`a`是`undefined`或`null`，会直接返回`undefined`，而不会进行`delete`运算符。

#### 括号影响
如果属性链有圆括号，链判断运算对圆括号外部没有影响，只对圆括号有影响。
```js
(a?.b).c
// 等价于
(a == null ? undefined : a.b).c
```
上面代码中，`?.`对圆括号外部并没有影响，不管`a`对象存不存在，圆括号后面的`.c`总是会执行。

这个例子说明，使用`?.`运算符的场景，不应该使用圆括号。

#### 报错场合
以下写法都是禁止的，会导致报错。
```js
// 构造函数
new obj?.()
new obj?.foo()

// 链判断运算符的右侧有模板字符串
obj?.`{num}`
obj?.num`{text}`

// 链判断运算符的左侧是super
super?.()
super?.foo

// 链运算符用于赋值运算左侧
a?.b = c
```

## Null判断运算符

通常我们在读取对象属性或者变量的时候，如果值是`null`或`undefined`，并且需要设置一个默认值的时候。通常做法是使用`||`运算符指定默认值。
```js
let obj = {}
let value = obj.objDescr || 50;
console.log(value); // 50

let text = false;
let num = text || 10;
console.log(num); // 10
```
上面的代码都是通过`||`运算符指定默认值，但是这样写存在一个问题，我们只想属性和变量的值为`null`或`undefined`，默认值才会生效，但是属性和变量的值为空字符串或者`false`或`0`，也生效了。

为了避免这种情况，ES2020引入了一个新的NUll判断运算符`??`。它的作用类似`||`，但是变量或者对象属性为`null`或`undefined`时，
才会设置默认值。
```js
let obj = {};
let value = obj.objDescr ?? 50;
// 生效了
console.log(value); // 50

let text = false;
let num = text ?? 10;
console.log(num); // false
```
上面的代码中，`text`变量的值是一个布尔类型，并不是`null`或`undefined`，而在`num`变量设置默认值时使用了`??`运算符判断`text`变量是不是`null`或`undefined`时。由于`text`变量是一个布尔值，所以`??`运算符并没有生效，而是直接把`text`的值赋给了`num`，只有在变量或者对象属性为`null`或`undefined`时，返回右边的值。

`??`有一个运算符优先级的问题，它跟`&&`和`||`的优先级孰高孰低。现在的规则是，如果多个逻辑运算符一起使用，必须用括号表明优先级，否则会报错。
```js
let a = undefined;
let b = undefined;
let c = 10;
// 直接报错
console.log(a && b ?? c);
console.log(a ?? b && c);
console.log(a || b ?? c);
console.log(a ?? b || c);
```
上面的四个表达式都会报错，如果要使用这种表达式。必须加入表明优先级的括号。
```js
let a = undefined;
let b = undefined;
let c = 10;
console.log((a && b) ?? c); // 10
console.log((a || b) ?? c); // 10
console.log((a ?? b) || c); // 10
```