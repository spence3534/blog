# Generator函数的异步应用

## 传统方法
异步编程对JavaScript来说是非常重要的，因为JavaScript的执行环境是单线程的，如果没有异步编程的话，根本无法使用，不然会卡死。

在ES6出现之前，异步编程的方法大概有四种。
* 回调函数
* 事件侦听
* 发布/订阅
* Promise对象

## 基本概念

### 异步
所谓的异步，就是一个任务不是连续完成的，可以理解成这个任务被分成两段，先执行第一段，然后执行其他的任务，等做好准备后再回来执行第二段。

比如，有一个任务是读取文件进行处理，任务的第一段是向操作系统发出请求，要求读取文件。然后，程序执行其他任务，等到操作系统返回文件后再接着执行任务的第二段（处理文件）。这种不连续的执行叫作异步。

相应地，连续执行叫作同步，由于连续执行，不能插入其他任务，所以操作系统从硬盘读取文件的这段时间，程序只能等待。

### 回调函数

JavaScript语言对异步编程的实现就是回调函数。所谓回调函数，就是把任务的第二段单独写在一个函数里，等到重新执行第二个任务时直接调用这个函数。回调函数的英文名字`callback`。
```js
fs.readFile('/etc/password', 'utf-8', function(err, data) {
  if (err) {
    throw err;
    console.log(data);
  }
});
```
上面的代码中，`readFile`函数的第三个参数就是回调函数，也就是任务的第二段。等到操作系统返回`/etc/password`文件以后，回调函数才会执行。

### Promise
回调函数本身并没有问题，它的问题出现在多个回调函数嵌套上，假设读取A文件之后再读取B文件，代码如下。
```js
fs.readFile(fileA, 'utf-8', function(err, data) {
  fs.readFile(fileB, 'utf-8', function(err, data) {
    // ...
  });
});
```
如果依次读取以上两个文件的话，就会出现多重嵌套。代码不是纵向发展，而是横向发展，就会乱成一团，没办法管理。因为多个异步操作形成了强耦合，只要有一个操作需要修改，它的上层回调函数和下层回调函数都要跟着修改。这种情况被称为“回调函数地狱”。

Promise对象就是为了解决这个问题被提出的。它并不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套改写为链式调用。采用Promise连续读取多个文件的写法如下。
```js
let readFile = require('fs-readfile-promise');

readFile(fileA)
.then((data) => {
  console.log(data.toString());
})
.then(() => {
  return readFile(fileB);
})
.then((data) => {
  console.log(data.toString());
})
.catch((err) => {
  console.log(err);
});
```
上面的代码中，使用了`fs-readfinle-promise`模块，它的作用就是返回Promise版本的`readFile`函数。Promise提供`then`方法加载回调函数，`catch`方法捕捉执行过程中抛出的错误。

可以看到，Promise的写法只是回调函数的改进，使用`then`方法以后，异步任务的两段执行更清楚了，除了这些之外，并没有什么新意。

Promise最大的问题就是代码冗余，原来的任务被Promise包装之后，无论什么操作，一眼看去都是一堆`then`的堆积，原来的语义变得很不清楚。

## Generator函数

### 协程
传统的编程语言中早有异步编程解决方案（其实是多任务的解决方案），其中一种叫作“协程”，意思是多个线程互相协作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下。
* 第一步，协程A开始执行。
* 第二步，协程A执行到一半，进入暂停状态，执行权转移到协程B中。
* 第三步，（一段时间后）协程B交还执行权。
* 第四步，协程A恢复执行。
上面流程的协程A就是异步任务，因为它分成两段执行。

举例来说，读取文件的协程写法如下。
```js
function *asyncJob() {
  // ...
  let f = yield readFile(fileA);
  // ...
}
```
上面代码的函数`asyncJob`是一个协程，它的奥妙在于其中的`yield`命令。它表示执行到此处时，执行权交给其他协程。也就是说，`yield`命令是异步两个阶段的分界线。

协程遇到`yield`命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点是，代码的写法非常像同步操作，如果去掉`yield`命令，是一模一样的。

### 协程的Generator函数实现
Generator函数是协程在ES6中的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

整个Generator函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方都用`yield`语句注明、Generator函数的执行方法如下。
```js
function* gen(x) {
  let y = yield x + 2;
  return y;
}

let g = gen(1);

console.log(g.next()); // {value: 3, done: false}
console.log(g.next()); // {value: undefined, done: true}
```
上面的代码中，调用Generator函数会返回一个内部指针（即遍历器）`g`。这是Generator函数和普通函数的另一个地方，就是执行它不会返回结果，而是返回指针对象。调用指针`g`的`next`方法可以移动内部指针（即执行异步任务的第一段），指向第一个遇到的`yield`语句，上例是执行到`x + 2`为止。

换句话说，`next`方法的作用是分阶段执行Generator函数。每次调用`next`方法都会返回一个对象，表示当前阶段的信息（`value`属性和`done`属性）。`value`属性是`yield`语句后面表达式的值，表示当前阶段的值；`done`属性是一个布尔值，表示Generator函数是否执行完毕，也就是是否还有下一个阶段。

### Generator函数的数据交换和错误处理

Generator函数可以暂停和恢复执行，这是它能封装异步任务的根本原因。除此之外，还有两个特性使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

`next`返回值的`value`属性是Generator函数向外输出数据；`next`方法还可以接收参数，向Generator函数体内输入数据。
```js
function* gen(x) {
  let y = yield x + 2;
  return y;
}

let g = gen(1);

console.log(g.next()); // {value: 3, done: false}
console.log(g.next(2)); // {value: 2, done: true}
```
上面的代码中，第一个`next`方法的`value`属性返回表达式`x + 2`的值`3`，第二个`next`方法带有参数`2`，这个参数可以传入Generator函数，作为上个阶段异步任务的返回结果，被函数体内的变量`y`接收。因此，这一步的`value`属性返回的就是`2`（变量y的值）。

Generator函数内还可以部署错误处理代码，捕获函数体外抛出的错误。
```js
function* gen(x) {
  try {
    let y = yield + 2;
  } catch (e) {
    console.log(e);
  }
  return y;
}

let g = gen(1);
console.log(g.next());
g.throw('出错了');
// 出错了
```
上面代码的最后一行中，Generator函数体外使用指针对象的`throw`方法抛出的错误可以被函数体内的`try...catch`代码块捕获。这意味着，出错的代码和处理错误的代码实现了时间和空间上的分离，这对于异步编程来说是很重要的。

### 异步任务的封装
下面看看如何使用Generator函数执行一个真实的异步任务。
```js
let fetch = require('node-fetch');

function* gen() {
  let url = 'https://api.github.com/users/github';
  let result = yield fetch(url);
  console.log(result.bio);
}
```
上面的代码中，Generator函数封装了一个异步操作，该操作先读取一个远程接口，然后从JSON格式的数据中解析信息。这段代码非常像同步操作，除了增加`yield`命令以外。

执行这段代码的方法如下。
```js
let g = gen();
let result = g.next();

result.value.then(function(data) {
  return data.json();
}).then((data) => {
  g.next(data);
});
```
上面的代码中首先执行Generator函数获取遍历器对象，然后使用`next`方法（第二行）执行异步任务的第一阶段。由于Fetch模块返回一个Promise对象，因此要用`then`方法调用下一个`next`方法。

可以看到，虽然Generator函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。

## Thunk函数
Thunk函数是自动执行Generator函数的一种方法。

### Thunk函数的含义
编译器的“传名调用”的实现往往是将参数放到一个临时函数里，再将这个临时函数传入函数体。这个临时函数就称为Thunk函数。
```js
let x = 3
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于

let thunk = function() {
  return x + 5;
}

function f(thunk) {
  return thunk() * 2;
}

console.log(f(thunk)); // 16
```
上面的代码中，函数`f`的参数`x + 5`被一个函数替换了。凡是用到原参数的地方，对Thunk函数求值即可。

这就是Thunk函数的定义，它是“传名调用”的一种实现策略，可以用来替换某个表达式。

### JavaScript语言的Thunk函数
JavaScript语言是传值调用，它的Thunk函数含义有所不同。在JavaScript语言中，Thunk函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。
```js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
let Thunk = function(fileName) {
  return function(callback) {
    return fs.readFile(fileName, callback);
  }
}

let readFileThunk = Thunk(fileName);
readFileThunk(callback);
```
上面的代码中，`fs`模块的`readFile`方法是一个多参数函数，两个参数分别为文件名和回调函数。经过转换器处理，它变成了一个单参数函数，只接受回调函数作为参数。这个单参数版本就叫作Thunk函数。

任何函数，只要参数有回调函数，都可以写成Thunk函数的形式。下面是一个简单的Thunk函数转换器的例子。
```js
// ES5版本
let Thunk = function(fn) {
  return function() {
    let args = Array.prototype.slice.call(arguments);
    return function(callback) {
      args.push(callback);
      return fn.apply(this, args);
    };
  };
};

// ES6版本
const Thunk = function(fn) {
  return function(...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    };
  };
};
```
使用上面的转换器，生成`fs.readFile`的Thunk函数。
```js
let readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```
下面是另一个完整的例子。
```js
function f(a, cb) {
  cb(a);
}
const ft = Thunk(f);
ft(1)(console.log);
```