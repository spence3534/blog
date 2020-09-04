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