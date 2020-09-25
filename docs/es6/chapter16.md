# Generator函数语法

## 基本概念

Generator函数是ES6提供的一种异步编程解决方案，语法行为和传统的函数完全不一样。从语法上来说，可以把它理解成一个状态机，封装了多个内部状态。

执行Generator函数会返回一个遍历器对象。也就是说，Generator函数除了是状态机，还是一个遍历器对象生成函数。返回的遍历器对象可以依次遍历Generator函数内部的每个状态。

Generator函数是一个普通函数，但是有两个特性：一是`function`命令和函数名之间有一个星号；二是函数体内使用`yield`语句定义不同的内部状态。
```js
function* namesGenerator() {
  yield 'tutu';
  yield 'xiaohong';
  return 'ending';
};

let names = namesGenerator();
```
上面的代码中，定义了一个`Generator`函数----`namesGenerator`，它内部有两个`yield`语句“tutu”和“xiaohong”，也就是这个函数有3个状态：`tutu`、`xiaohong`和`return`语句。

Generator函数调用方法和普通函数是一样的，也是在函数名后面加上一对圆括号。不同之处是，调用Generator函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象（Iterator Object）。

下一步，必须调用遍历器对象的`next`方法，从而使得指针移向下一个状态。也就是说，每次调用`next`方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个`yield`表达式或者`return`语句为止。换句话说，Generator函数是分段执行的，`yield`表达式是暂停执行的标记，而`next`方法可以恢复执行。
```js
function* namesGenerator() {
  yield 'tutu';
  yield 'xiaohong';
  yield 'xiaoming';
  return 'ending';
};

let names = namesGenerator();

console.log(names.next()); // {value: "tutu", done: false}
console.log(names.next()); // {value: "xiaohong", done: false}
console.log(names.next()); // {value: "xiaoming", done: false}
console.log(names.next()); // {value: "ending", done: true}
console.log(names.next()); // {value: undefined, done: true}
```
上面代码调用了四次`next`方法。

每调用一次，Generator函数开始执行，直到遇到`yield`表达式为止（或者`return`语句）。`next`方法返回的是一个对象，对象包含`value`和`done`属性。`value`属性就是当前`yield`表达式的值`tutu`、`xiaohong`、`xiaoming`，`done`属性的值`false`，表示遍历没有结束。如果`done`的值`为true`，表示遍历已结束。再次调用`next`方法会返回对象的`value`属性为`undefined`，`done`属性为`true`，之后再调用`next`方法，依旧都会返回这个值。

调用Generator函数，返回一个遍历器对象，代表Generator函数的内部指针。之后，每次调用遍历器对象的`next`方法，都会返回一个具有`value`和`done`两个属性的对象。`value`属性表示当前的内部状态的值，是`yield`表达式后面的那个表达式的值；`done`属性是一个布尔值，表示是否遍历结束。

ES6并没有规定，`function`关键字与函数名之间的星号，写在哪个位置。这导致了一些写法都可以通过，看下面的例子。
```js
function * fun(x, y) {  };
function *fun(x, y) {  };
function* fun(x, y) {  };
function*fun(x, y) {  };
```
由于Generator函数是一个普通函数，所以一般的写法是上面的第三种，星号紧跟在`function`后面。

### yield
由于Generator函数返回的遍历器对象，只有调用`next`方法才会遍历下一个内部状态，所以提供了一种可以暂停执行的函数。`yield`表达式就是暂停标志。

遍历器对象的`next`方法的运行逻辑有四点：
1. 遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。
2. 下次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。
3. 如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。
4. 如果函数没有`return`语句，则返回的对象的`value`属性为`undefined`。

要注意的是，`yield`表达式后面的表达式，只有当调用`next`方法、内部指针指向该语句的时候才会执行，这样就等于可以手动的“惰性求值”的语法功能。
```js
function* func() {
  yield 1 + 1;
}

const num = func();

console.log(num.next()); // {value: 2, done: false}
```
上面的代码中，`yield`后面的表达式`1 + 1`，不会立即求值，只会在`next`方法将指针移到这一句时，才会求值。

`yield`表达式和`return`语句既有相似之处，也有区别。相似之处在于，都能返回紧跟在语句后面的那个表达式的值。区别在于每次遇到`yield`，函数暂停执行，下次再从该位置继续往后执行，而`return`语句不具备位置记忆的功能。一个函数里面，只能执行一次（或者说一个）`return`语句，但是可以执行多次（或者说多个）`yield`表达式。正常函数只能返回一个值，因为只能执行一次`return`；Generator函数可以返回一系列的值，因为可以由多个`yield`。从另一个角度看，也可以说Generator生成一系列的值，这就是它的名称的由来。

Generator函数可以不用`yield`表达式，这样就变成了一个单纯的暂缓执行函数。
```js
function* func() {
  console.log('hello');
}

let generator = func();

setTimeout(() => generator.next(), 2000);
```
上面的代码中，如果函数`func`是一个普通函数，在给变量`generator`赋值的时候就会执行。但是，函数`func`是一个Generator函数，所以变成了只有调用`next`方法时，才会执行函数`func`。

要注意的时，`yield`表达式只能在Generator函数里面使用。在其他地方使用`yield`都会报错。

看另外一个例子。
```js
let arr = [1, [2, 3], [5, 6], 7, [8, 9]];

let flat = function* (a) {
  a.forEach(function (item) {
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  });
}

for (let item of flat(arr)) {
  console.log(item);
}

// Uncaught SyntaxError: Unexpected identifier
```
上面的代码会产生语法错误，是因为`forEach`方法的参数是一个普通函数，但是里面使用了`yield`表达式。可以改用`for`循环。
```js
let arr = [1, [2, 3], [4, 5], 6, [7, 8]];

let flat = function* (a) {
  let length = a.length;
  for (let i = 0; i < length; i++) {
    let item = a[i]
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
}

for (let item of flat(arr)) {
  console.log(item);
}
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
```

另外，`yield`表达式如果用在另一个表达式里面，必须放在圆括号里面。
```js
function* demo() {
  // 这种错误的写法，在vscode编辑器中会直接提示异常。
  // console.log('hello' + yield);
  // console.log('hello' + yield 123);

  console.log('hello' + (yield));
  console.log('hello' + (yield 123));
}
```
`yield`表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
```js
function foo() {
  console.log(arguments);
}
function* demo() {
  foo(yield 'a', yield 'b');

  let input = yield;
}

const test = demo();

console.log(test.next()); // {value: "a", done: false}
console.log(test.next()); // {value: "b", done: false}
```

### 与Iterator接口的关系

任意一个对象的`Symbol.iterator`方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。

由于Generator函数就是遍历器生成函数，因此可以把Generator赋值给对象的`Symbol.iterator`属性，这样就可以让该对象具有Iterator接口。
```js
let myIterable = {};

myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
}

console.log([...myIterable]); // [1, 2, 3]
```
上面的代码中，Generator函数赋值给`Symbol.iterator`属性，这样`myIterator`对象就具备了Iterator接口，可以被`...`运算符遍历。

Generator函数执行后，返回一个遍历器对象。该对象本身也具有`Symbol.iterator`属性，执行后返回自身。
```js
function* func () { 
  yield 1;
  yield 2;
  yield 3;
}

const test = func();
console.log(test);

console.log(test[Symbol.iterator]() === test); // true
```
上面代码中，`func`是一个Generator函数，调用它生成一个遍历器对象`test`。它的`Symbol.iterator`属性，也是一个遍历器对象生成函数，执行后返回它自己。

## next方法的参数
`yield`表达式本身是没有返回值的，也可以说总会返回`undefined`。`next`方法可以带一个参数，该参数就会被当作上一个`yield`表达式的返回值。
```js
function* f() {
  for (let i = 0; true; i++) {
    let reset = yield i;
    if (reset) { i = -1; }
  }
}

let g = f();

console.log(g.next()); // {value: 0, done: false}
console.log(g.next()); // {value: 1, done: false}
console.log(g.next(true)); // {value: 0, done: false}
console.log(g.next()); // {value: 1, done: false}
console.log(g.next()); // {value: 2, done: false}
console.log(g.next()); // {value: 3, done: false}
```
上面的代码中先定义了一个可以无限运行的Generator函数`f`，如果`next`方法没有参数，每次运行到`yield`表达式，变量`reset`的值总是`undefined`。当`next`方法带一个参数`true`时，变量`reset`就被重置为这个参数（也就是true），这时`i`就等于`-1`，在下一轮循环就会从`-1`开始递增。

这个功能有很重要的语法意义。Generator函数从暂停状态到恢复运行，它的上下文状态是不变的。通过`next`方法的参数，就有办法在Generator函数开始运行之后，继续向函数提内部注入值。也就是说，可以在`Generator`函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

再来看一个例子。
```js
function* foo(x) {
  const y = 2 * (yield (x + 1));
  const z = yield (y / 3);
  return (x + y + z);
}

let a = foo(5);
console.log(a.next()); // {value: 6, done: false}
console.log(a.next()); // {value: NaN, done: false}
console.log(a.next()); // {value: NaN, done: true}
```
上面代码中，第二次运行`next`方法的时候不带参数，导致`y`的值等于`2 * undefined`（即`NaN`），除以3以后还是`NaN`，因此返回对象的`value`属性也等于`NaN`。第三次运行`next`方法的时候不带参数，所以`z`等于`undefined`，返回对象的`value`属性等于`5 + NaN + undefined`，即`NaN`。
```js
function* foo(x) {
  const y = 2 * (yield (x + 1));
  const z = yield (y / 3);
  return (x + y + z);
}

let b = foo(5);
console.log(b.next()); // {value: 6, done: false}
console.log(b.next(12)); // {value: 8, done: false}
console.log(b.next(13)); // {value: 42, done: true}
```
如果向`next`方法提供参数，返回结果那就不一样了。上面的代码第一次调用`b`的`next`方法时，返回`x+1`的值`6`；第二次调用`next`方法，将上一次`yield`表达式的值设为`12`，因此`y`等于`24`，返回`y / 3`的值`8`；第三次调用`next`方法，将上一次`yield`表达式的值设为`13`，因此`z`等于`13`，这时`x`等于`5`，`y`等于`24`，所以`return`语句的值等于`42`。

要注意的是，由于`next`方法的参数表示上一个`yield`表达式的返回值，所以在第一次使用`next`方法时，传递参数是无效的。只有从第二次使用`next`方法开始，参数才是有效的。从语义上讲，第一个`next`方法用来启动遍历器对象而已，所以不需要带参数。
```js
function* dataConsumer() {
  console.log('start');

  console.log(`1, ${yield}`);
  console.log(`2, ${yield}`);
}

let genObj = dataConsumer();

genObj.next(); // start
genObj.next('a'); // 1, a
genObj.next('b'); // 2, b
```
上面的代码是一个很直观的例子，每次通过`next`方法向Generator函数输入值，然后打印出来。

如果想要第一次调用`next`方法时，就能够输入值，可以在Generator函数外面再包一层。
```js
function wrapper(generatorFunction) {
  return function(...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  };
}

const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});

wrapped().next('hello!');
// First input: hello!
```
上面代码中，Generator函数如果不用`wrapper`先包一层，是无法第一次调用`next`方法，就输入参数的。

## for...of循环
`for...of`循环可以自动遍历Generator函数运行时生成的`Iterator`对象，所以就不需要调用`next`方法。
```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
};

for (let item of foo()) {
  console.log(item);
}
// 1
// 2
// 3
// 4
// 5
```
上面的代码中，使用`for...of`循环，列出了5个`yield`表达式的值，需要注意的是，凡是`next`方法的返回对象的`done`属性为`true`，`for...of`循环就中止了，也不包含该返回对象，所以上面代码里的`return`语句返回的`6`。不包括在`for...of`循环之中。

使用Generator函数和`for...of`循环，实现一个斐波那契数列。
```js
function* fibonacci() {
  let [prev, curr] = [0, 1];

  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 100) break;
  console.log(n);
}
```
从上面的代码上看，使用`for...of`循环就不需要用`next`方法了。

利用`for...of`循环，可以写出遍历任何对象的方法。原生的js对象没有遍历接口，无法使用`for...of`循环，通过Generator函数给它加上这个接口，就可以用了。
```js
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
};

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}, ${value}`);
}
// first, Jane
// last, Doe
```
上面代码中，对象`jane`原生不具有Iterator接口，就无法使用`for...of`遍历。通过Generator函数`objectEntries`给它加上遍历器接口，就可以用`for...of`进行遍历了。还有另外一种写法，就是将Generator函数加到对象的`Symbol.iterator`属性上面。
```js
function* objectEntries() {
  const propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, [this[propKey]]];
  }
};

const obj = { first: 'Jane', last: 'Doe' };

obj[Symbol.iterator] = objectEntries;

for (let [key, value] of obj) {
  console.log(`${key}, ${value}`);
}
// first, Jane
// last, Doe
```
除了`for...of`循环之外，扩展运算符（`...`）、解构赋值和`Array.from`方法内部调用的，都是遍历器接口，那就意味着，它们都可以将Generator函数返回的Iterator对象作为参数。
```js
function* numbers() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  return 5;
  yield 6;
};

console.log(...numbers()); // 1 2 3 4

console.log(Array.from(numbers()));
// [1, 2, 3, 4]

const [a, b] = numbers();
console.log(a, b);
// 1 2

for(let item of numbers()) {
  console.log(item);
}
// 1
// 2
// 3
// 4
```

## Generator.prototype.throw()
Generator函数返回的遍历器对象，有一个`throw`方法，可以在函数体外抛出错误，然后在Generator函数体内捕获。
```js
let gen = function* () {
try {
    yield;
  } catch(e) {
    console.log('内部捕获错误', e);
  }
};

let i = gen();

i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获错误', e);
}
// 内部捕获错误 a
// 外部捕获错误 b
```
上面的代码中，遍历器对象`i`抛出了两个错误。第一个错误被Generator函数体内的`catch`语句捕获。`i`第二次抛出错误，是由于Generator函数内部的`catch`语句已经执行过了，不会再捕捉到这个错误，所以这个错误就被抛出了Generator函数体，被函数体外的`catch`语句捕获。

`throw`方法接受一个参数，该参数会被`catch`语句接收，建议使用`Error`的实例。
```js
let gen = function* () {
  try {
    yield;
  } catch(e) {
    // 在这里打印了throw传过来的参数
    console.log(e);
    // Error: 又有bug了
  }
}

let i = gen();
i.next();
i.throw(new Error('又有bug了'));
```
上面的代码中，是用遍历器对象的`throw`方法抛出的，而不是用全局的`throw`命令抛出的，不要混淆遍历器对象的`throw`方法和全局`throw`命令，全局的`throw`只能被函数体外的`catch`语句捕获。
```js
let gen = function* () {
  while (true) {
    try {
      yield;
    } catch(e) {
      console.log(e);
      if (e !== 'a')  throw e;
      console.log('内部捕获', e);
    }
  }
};

let i = gen();

i.next();

try {
  throw new Error('a');
  throw new Error('b');
} catch (e) {
  console.log('外部捕获', e);
}
```
上面代码之所以只捕获了`a`，是因为函数体外的`catch`语句，捕获了抛出的`a`错误以后，就不会再继续`try`代码块里面剩余的语句了。

如果Generator函数内部没有`try...catch`语句的话，使用`throw`方法抛出的错误，会被函数体外的`try...catch`代码块捕获。
```js
function* gen() {
  while (true) {
    yield;
    console.log('内部捕获', e);
  }
};

let i = gen();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 a
```
上面的代码中，Generator函数`gen`内部没有`try...catch`语句，所以抛出的错误就被外部的`catch`代码块捕获。

如果Generator函数内部和外部都没有部署`try...catch`语句，会直接报错。而且会中断执行。
```js
function* gen() {
  yield console.log('1');
  yield console.log('2');
};

let i = gen();

i.next();
i.throw();
// 1
// Uncaught undefined
```
上面的代码中，`i.throw`抛出错误之后，没有任何`try...catch`语句捕获这个错误，所以导致报错，中断了执行。

`throw`方法抛出的错误想要被内部捕获的话，前提是必须执行一次过`next`方法。
```js
function* gen() {
  try {
    yield 1;
  } catch (e) {
    console.log('内部捕获');
  }
}

let g = gen();
g.throw(1);
// Uncaught 1
```
上面的代码中，`g.throw(1)`执行时，`next`方法一次都没有执行。抛出的错误不会被内部捕获，而是直接在外部抛出，导致报错了。这是因为第一次执行`next`方法，就等于启动执行Generator函数的内部代码，不然Generator函数还没有执行，`throw`方法抛错只可能抛出在函数外部。

`throw`方法被捕获之后，会附带执行下一条`yield`表达式。也就是说，捕获错误的同时，会执行一次`next`方法。
```js
function* gen() {
  try {
    yield console.log('1');
  } catch (e) {
    console.log('内部捕获错误', e);
  }
  yield console.log('2');
  yield console.log('3');
}

let g = gen();
g.next();
g.throw('哎呀，又出bug了');
g.next();
// 1
// 内部捕获错误 哎呀，又出bug了
// 2
// 3
```
上面的代码中，`g.throw`方法被捕获之后，自动执行了一次`next`方法，所以打印了`2`。也可以看到，只要Generator函数内部部署了`try...catch`代码块，遍历器的`throw`方法抛出错误，也不会影响到下一次遍历。

`throw`命令和`g.throw`方法是无关的。两者互不影响。
```js
let gen = function* gen() {
  yield console.log('hello');
  yield console.log('world');
}

let g = gen();
g.next();

try {
  throw new Error();
} catch (e) {
  g.next();
}
// hello
// world
```
上面的代码中，`throw`命令抛出的错误毫不影响到遍历器的状态，两次执行`next`方法，都进行了正确的操作。

这种函数体内捕获错误的机制，方便了对错误的处理。多个`yield`表达式，只用一个`try...catch`代码块来捕获错误。如果使用回调函数的写法，想要捕获多个错误，不得不为每个函数内部写一个错误处理语句，现在只在Generator函数内部写一次`catch`语句就可以了。

Generator函数体外抛出的错误，可以在函数体内捕获；反过来，Generator函数体内抛出的错误，也可以被函数体外的`catch`捕获。
```js
function* foo() {
  let x = yield 3;
  let y = x.toUpperCase();
  yield y;
}

let it = foo();

it.next();

try {
  it.next(42);
} catch (err) {
  console.log(err);
}
// TypeError: x.toUpperCase is not a function
```
上面的代码中，第二个`next`方法向函数体内传入一个参数42，而数值是没有`toUpperCase`方法，就抛出了一个错误，被函数体外的`catch`捕获。

一旦Generator执行过程中抛出错误，如果没有被内部捕获，就不会再执行下去。如果之后再调用`next`方法，会返回一个`value`属性等于`undefined`、`done`属性等于`true`的对象。JavaScript引擎会认为这个Generator已经运行结束了。
```js
function* g() {
  yield 1;
  console.log('throwing an exception');
  throw new Error('generator broke!');
  yield 2;
  yield 3;
}

function log(generator) {
  let v;
  console.log('starting generator');

  try {
    v = generator.next();
    console.log('第一次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }

  try {
    v = generator.next();
    console.log('第二次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }

  try {
    v = generator.next();
    console.log('第三次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  console.log('caller done');
}

log(g());
// starting generator
// 第一次运行next方法 {value: 1, done: false}
// throwing an exception
// 捕捉错误 {value: 1, done: false}
// 第三次运行next方法 {value: undefined, done: true}
// caller done
```
上面代码中，一共运行了三次`next`方法，第二次运行就会抛出错误，然后第三次运行的时候，Generator函数已经结束了，不再执行下去了。

## Generator.prototype.return()
Generator函数返回的遍历器对象，有一个`return`方法，可以返回给定的值，并且会结束遍历Generator函数。
```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

let i = gen();

console.log(i.next()); // {value: 1, done: false}
console.log(i.return('100')); // {value: "100", done: true}
console.log(i.next()); // {value: undefined, done: true}
```
上面的代码中，遍历器对象`i`调用`return`方法后，返回值的`value`属性就是`return`方法的参数`100`。并且，Generator函数的遍历结束了。返回值的`done`属性为`true`，之后再调用`next`方法，`done`属性都是返回`true`。

如果`return`方法在调用的时候没有传递参数，返回值的`value`属性为`undefined`。
```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

let i = gen();
console.log(i.next()); // {value: 1, done: false}
console.log(i.return()); // {value: undefined, done: true}
```
如果Generator函数内部有`try...finally`代码块，`return`方法会导致正在执行的`try`代码块立即进入`finally`代码块，执行完以后，整个函数才会结束。
```js
function* numbers() {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
let g = numbers();

console.log(g.next()); // {value: 1, done: false}
console.log(g.next()); // {value: 2, done: false}
console.log(g.return(7)); // {value: 4, done: false}
console.log(g.next()); // {value: 5, done: false}
console.log(g.next()); // {value: 7, done: true}
```
上面的代码中，调用`return()`方法后，就执行了`finally`代码块，不执行`try`里面剩下的代码。然后`finally`代码块执行完后，再返回`return()`方法指定的返回值。

## next()、throw()、return()的共同点
`next()`、`throw()`、`return()`这三个方法本质上都是同一件事。它们的作用都是让Generator函数恢复执行，并且使用不同的语句替换`yield`表达式。

`next()`是将`yield`表达式替换成一个值。
```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);

console.log(gen.next()); // {value: 3, done: false}
console.log(gen.next(1)); // {value: 1, done: true}
// 相当于把let result = yield x + y
// 替换成 let result = 1;
```
上面代码中，第二个`next(1)`方法就相当于把`yield`表达式替换成一个值`1`。如果`next`方法没有传递参数，就相当于替换成`undefined`。`throw()`是把`yield`表达式替换成一个`throw`语句。
```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);

gen.throw(new Error('哎呀，又有bug了'));
// Uncaught Error: 哎呀，又有bug了
// 相当于把let result = yield x + y
// 替换成let result = new Error('哎呀，又有bug了')
```
`return()`是把`yield`表达式替换成一个`return`语句。
```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);

console.log(gen.return(2)); 
// {value: 2, done: true}
// 相当于把let result = yield x + y
// 替换成let result = return 2;
```
## yield* 表达式
如果在Generator函数内部，调用另一个Generator函数。需要在前者的函数体内，手动遍历。
```js
function* foo() {
  yield 1;
  yield 2;
}

function* bar() {
  yield 3;
  for (let i of foo()) {
    console.log(i);
  }
  yield 4;
}

for (let v of bar()) {
  console.log(v);
}

// 3
// 1
// 2
// 4
```
上面的代码中，`foo`和`bar`都是Generator函数，在`bar`里面调用`foo`，就要手动遍历`foo`。如果说未来有多个Generator函数嵌套的话，这种写法就很麻烦。

使用`yield*`可以解决这类问题，它的作用就是用来在一个Generator函数里面执行另一个Generator函数的。
```js
function* bar() {
  yield 1;
  yield 2;
  yield* foo();
  yield 5;
}

function* foo() {
  yield 3;
  yield 4;
}

for (let item of bar()) {
  console.log(item);
}
// 1
// 2
// 3
// 4
// 5
```
再来看个例子：
```js
function* inner() {
  yield 'hello';
}

function* outer1() {
  yield '打开';
  yield inner();
  yield '退出';
}

let gen1 = outer1();
console.log(gen1.next().value); // 打开
console.log(gen1.next().value); // inner {<suspended>}
console.log(gen1.next().value); // 退出

function* outer2() {
  yield '打开';
  yield* inner();
  yield '退出';
}

let gen2 = outer2();
console.log(gen2.next().value); // 打开
console.log(gen2.next().value); // hello
console.log(gen2.next().value); // 退出
```
上面的例子中，`outer2`使用了`yield*`，`outer1`没使用。结果`outer1`返回了一个遍历器对象，而`outer2`返回的是该遍历器对象的内部值。

如果`yield`表达式后面是一个遍历器对象的话，就需要在`yield`表达式后面加一个星号，表示它返回的是一个遍历器对象。这被成为`yield*`表达式。
```js
let delegatedIterator = (function* () {
  yield 'hello';
  yield 'Bye!';
}());

let delegatingIterator = (function* () {
  yield 'Greetings!';
  yield* delegatedIterator;
  yield 'ok, bye.';
}());

for (let value of delegatingIterator) {
  console.log(value);
}
// Greetings!
// hello
// Bye!
// ok, bye.
```
上面代码中，`delegatingIterator`是代理者，`delegatedIterator`是被代理者。由于`yield* delegatedIterator`语句得到的值，是一个遍历器，所以要用幸好表示。运行结果就是使用一个遍历器，遍历了多个Generator，有递归的效果。

`yield*`后面的Generator函数（没有return语句时），就等于在Generator函数内部，部署一个`for...of`循环。
```js
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

for (let value of concat(arr1, arr2)) {
  console.log(value);
}
// 1
// 2
// 3
// 4
// 5
// 6

function* concat(iter1, iter2) {
  for (let value of iter1) {
    yield value;
  }

  for (let value of iter2) {
    yield value;
  }
} 
```
上面代码说明，`yield*`后面的Generator函数（没有`return`语句时），不过是`for...of`的一种简写形式，完全可以用后者代替前者。反而如果在有`return`语句时，就需要`var value = yield* iterator`的形式获取`return`语句的值。

如果`yield*`后面跟着一个数组，数组原生本来就支持遍历器，所以就会遍历数组成员。
```js
function* gen() {
  yield* ['a', 'b', 'c'];
}

console.log(gen().next()); // {value: "a", done: false}
```
上面代码中，`yield`命令后面如果不加星号，返回的是整个数组，加了星号就表示返回的是数组的遍历器对象。

任何数据结构只要有Iterator接口，就可以被`yield*`遍历。

```js
let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

console.log(read.next().value); // hello
console.log(read.next().value); // h

for (let item of read) {
  console.log(item);
}
// hello
// h
// e
// l
// l
// o
```
上面代码中，`yield`表达式返回了整个字符串，而`yield*`语句返回的是单个，这是因为字符串具有Iterator接口，所以会被`yield*`遍历。

如果被代理的Generator函数有`return`语句的话，就可以向代理它的Generator函数返回数据。
```js
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  let f = yield * foo();
  console.log(`v：${f}`);
  yield 4;
}

let it = bar();

for (let item of it) {
  console.log(item);
}
// 1
// 2
// 3
// v：foo
// 4
```
上面代码中，使用`for...of`循环遍历`it`，在输出`3`之后就会输出Generator函数`foo`的返回值。这是因为函数`foo`的`return`语句，向函数`bar`提供了返回值。

来看另一个例子。
```js
function* genFuncWithReturn() {
  yield 1;
  yield 2;
  return 'The result';
}

function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}

console.log([...logReturned(genFuncWithReturn())]);
```
上面的代码中，存在了两次遍历。第一次是扩展运算符遍历函数`logReturned`返回的遍历器对象，第二次是`yield*`语句遍历`genFuncWithReturn`返回的遍历器对象。这两次遍历的效果都是叠加的，也就是扩展运算符遍历函数`genFuncWithReturn`返回的遍历器对象。最后表达式得到的值等于`[1, 2]`。但是函数`genFuncWithReturn`的`return`语句的返回值`The result`，会返回给函数`logReturned`内部的`result`变量，就在控制台输出。

`yield*`命令可以方便地取出嵌套数组的所有成员。
```js
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i< tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [1, [2, 3, 4], 5, [[6, 7]]];

for (let item of iterTree(tree)) {
  console.log(item);
}
// 1
// 2
// 3
// 4
// 5
// 6
// 7
```
扩展运算符`...`会默认调用Iterator接口，所以上面这个函数也可以用于嵌套数组拉平。
```js
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i< tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [1, [2, 3, 4], 5, [[6, 7]]];

console.log([...iterTree(tree)]);
// [1, 2, 3, 4, 5, 6, 7]
```

## 作为对象属性的Generator函数
如果一个对象的属性是Generator函数，可以通过以下的形式简写。
```js
let person = {
  // getName前面有个星号，表示这个属性是一个Generator函数。
  * getName() {
    yield 'tutu';
  }
}

console.log(person.getName().next());
// {value: "tutu", done: false}

// 等价于
let person = {
  getName: function* () {
    yield 'tutu';
  }
}

console.log(person.getName().next()); 
// {value: "tutu", done: false}
```

## Generator函数的this
Generator函数总是会返回一个遍历器，ES6规定这个遍历器是Generator函数的实例，也继承了Generator函数的`prototype`对象上的方法。
```js
function* g() {
  
}

g.prototype.hello = function() {
  return 'hi!';
}

let obj = g();

console.log(obj instanceof g); // true
console.log(obj.hello()); // hi!
```
上面代码中，`obj`就是Generator函数`g`返回的遍历器，`obj`是`g`的实例，也继承了`g.prototype`。但是，如果把`g`当作普通的构造函数，并不会生效，因为`g`返回的总是遍历器对象，而不是`this`对象。
```js
function* g() {
  this.a = 1;
}

let obj = g();
console.log(obj.next()); // {value: undefined, done: true}
console.log(obj.a); // undefined
```
上面的代码中，Generator函数`g`在`this`对象上面添加了一个属性`a`，但是`obj`对象拿不到这个属性。

Generator函数不能和`new`操作符一起使用，会导致报错。
```js
function* Func() {
  yield this.x = 2;
  yield this.y = 3;
}

const gen = new Func();
// Uncaught TypeError: Func is not a constructor
```
上面的代码中，`new`操作符跟构造函数`Func`一起使用，就报错了，因为F不是构造函数。

下面是一个变通方法。首先，生成一个空对象，使用`call`方法绑定Generator函数内部的`this`。这样，构造函数调用以后，这个空对象就是Generator函数的实例对象了。
```js
function* Func() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

let obj = {};
let f = Func.call(obj);

console.log(f.next()); // {value: 2, done: false}
console.log(f.next()); // {value: 3, done: false}
console.log(f.next()); // {value: undefined, done: true}

console.log(obj.a); // 1
console.log(obj); // {a: 1, b: 2, c: 3}
```
上面代码中，`F`内部的`this`对象绑定`obj`对象，然后调用它返回一个Iterator对象。这个对象执行了三次`next`方法（因为F内部有两个`yield`表达式），完成`F`内部所有代码的运行。这时，所有内部属性都绑定在`obj`对象上了，因此`obj`对象也就成了`F`的实例。

上面代码中，执行的是遍历器对象`f`，但是生成的对象实例是`obj`。为了把这两个对象统一，把`obj`换成`F.prototype`。
```js
function* Func() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

let f = Func.call(Func.prototype);

console.log(f.next()); // {value: 2, done: false}
console.log(f.next()); // {value: 3, done: false}
console.log(f.next()); // {value: undefined, done: true}

console.log(f.a); // 1
console.log(f.b); // 2
console.log(f.c); // 3
```
再把`F`改成构造函数，就可以对它执行`new`操作符。
```js
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function Func() {
  return gen.call(gen.prototype);
}

let f = new Func();

console.log(f.next()); // {value: 2, done: false}
console.log(f.next()); // {value: 3, done: false}
console.log(f.next()); // {value: undefined, done: true}

console.log(f.a); // 1
console.log(f.b); // 2
console.log(f.c); // 3
```

## 含义

### Generator与状态机
Generator是实现状态的最佳结构。比如，下面的`clock`函数就是一个状态机。
```js
let tickting = true;
let clock = function() {
  if (tickting) {
    console.log('开', tickting);
  } else {
    console.log('关', tickting);
  }
  tickting = !tickting;
}

clock(); // 开 true
clock(); // 关 false
```
上面的代码中，`clock`函数一共有两种状态（`开`和`关`），每次运行，就会改变一次状态。如果使用Generator函数改写，就是下面这样。
```js
let clock = function* () {
  while (true) {
    console.log('开');
    yield;
    console.log('关');
    yield;
  }
}

let gen = clock();

gen.next(); // 开
gen.next(); // 关
```
使用Generator函数写法，除了少个用来保存状态的外部变量`ticking`，这样更简洁，也安全，而且状态不会被非法篡改。从写法上看更加优雅。Generator之所以可以不用外部变量保存状态，是因为它本身就包含饿了一个状态信息。

### Generator与协程
协程是一种程序运行的方式，可以理解成“协作的线程”或“协作的函数”。协程既可以用单线程实现，也可以用多线程实现。单线程是一种特殊的子例程，多线程则是一种特殊的线程。

#### 1.协程和子例程的差异
传统的“子例程”采用堆栈式“后进先出”的执行方式，只有当调用的子函数完全执行完毕，才会结束执行父函数。协程就不一样了，多个线程（单线程情况，就是多个函数）可以并行执行，但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停状态，线程（或函数）之间可以交换执行权。也就是说，一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），等到之后收回执行权的时候，再恢复执行。这种可以并行执行、交换执行权的线程（或函数），就是协程。

从实现上看，在内存中，子例程只使用一个栈，而协程是同时存在多个栈，但是只有一个栈是在运行状态，也就是说，协程是以多占用内存的代价，实现
多任务的并行。

#### 2.协程和普通线程的差异
不难看出，协程适合用于多任务运行的环境。在这个意义上，它与普通的线程很相似，都有自己的执行上下文、可以分享全局变量。它们的不同之处在于，同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停装填。此外，普通的线程是抢先式的，到底哪个线程先得到资源，必须由运行环境决定，但是协程是合作式的，执行权由协程自己分配的。

由于JavaScript是单线程语言，只能保持一个调用栈，引入协程之后，每个任务可以保持自己的调用栈，这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。不至于像异步操作的回调函数那样，一旦出错，原始的调用栈早就结束。

Generator函数是ES6对协程的实现，但属于不完全实现。Generator函数被称为“半协程”，意思就是只有Generator函数的调用者，才能将程序的执行权还给Generator函数。如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。

如果将Generator函数当作协程，完全可以将多个需要互相协作的任务写成Generator函数，它们之间使用`yield`表达式交换执行权。

### Generator和上下文
JavaScript代码运行时，会产生一个全局的上下文环境（context，又称运行环境），包含了当前所有的变量和对象。然后，执行函数（或块级代码）的时候，又会在当前上下文环境的上层，产生一个函数运行的上下文，变成当前的上下文，由此形成一个上下文环境的堆栈。

这个堆栈是“后进先出”的数据结构，最后产生的上下文环境首先执行完成，退出堆栈，然后再执行完成它下层的上下文，直到所有代码执行完成，堆栈清空。

Generator函数不是这样的，它执行产生的上下文环境，一旦遇到`yield`命令，就会暂时退出堆栈，但是不会消失，里面的所有变量和对象会冻结在当前状态。等到对它执行`next`命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。
```js
function* gen() {
  yield 1;
  return 2;
}

let g = gen();

console.log(g.next().value, g.next().value); // 1 2
```
上面代码中，第一次执行`g.next`时，Generator函数`gen`的上下文会加入堆栈，就是开始运行`gen`内部的代码。等遇到`yield 1`时，`gen`上下文退出堆栈，内部状态冻结。第二次执行`g.next()`时，`gen`上下文重新加入堆栈，变成当前的上下文，重新恢复执行。