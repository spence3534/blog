# Promise对象

## Promise的含义
`Promise`是异步编程的一种解决方案。总所周知，在JS中，所有的代码都是单线程的。`Promise`的出现就解决了这个问题。`Promise`简单的说就是一个容器，里面存着某个未来才会结束的事件（通常是一个异步操作）的结果。

`Promise`对象有两个特点：

1. 对象的状态不受外界的影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，来决定当前是哪一种状态，任何其他的操作都修改不了这个状态。

2. 一旦状态改变，就不会再变了，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。只要这两种情况发生，状态就固定了，不会改变了，一直都会保持这个结果，这成为`resolved`（已定型）。如果改变已经发生了，再对`Promise`对象添加回调函数，也会立即得到这个结果。

`Promise`的缺点：
1. 无法取消`Promise`，一旦新建它就会立马执行，无法中途取消。
2. 如果不设置回调函数，`Promise`内部抛出错误，不会反应到外部。
3. 当处于`pending`状态时，没办法知道当前进展到哪一个阶段。

## 基本用法
ES6规定，`Promise`对象是一个构造函数，用来生成`Promise`实例。

看下面的代码。
```js
const promise = new Promise((resolve, reject) => {
  // 当作例子
  let bool = true;

  if (bool) {
    resolve(bool);
  } else {
    reject("失败");
  }
});

promise.then(res => console.log(res)); // true
```
`Promise`构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。它们是两个函数。

`resolve`函数的作用是，把`Promise`对象的状态从“未完成”变成“成功”，在异步操作成功时调用，并且把异步操作结果，当作参数传递出去；`reject`函数的作用时，把`Promise`对象的状态从“未完成”变成“失败”，在异步操作失败时调用，并且把异步操作报的错，当作参数传递出去；

`Promise`实例生成以后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数。
```js
const promise = new Promise((resolve, reject) => {
  // 当作例子
  let bool = false;

  if (bool) {
    resolve(bool);
  } else {
    reject("失败");
  }
});

promise.then((res) => {
  console.log(res, "异步成功");
}, (err) => {
  console.log(err, "异步失败");
  // 失败 异步失败
});
```
`then`方法接受两个回调函数作为参数。第一个回调函数就是`Promise`对象的状态变为`resolved`时调用，第二个回调函数是`Promise`对象状态为`rejected`时调用。第二个函数是可选的，也不一定需要选择第二个函数。这两个函数都接受`Promise`对象传出的值作为参数。

看下面的例子：
```js
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}

timeout(100).then((value) => {
  console.log(value);
});
```
上面的代码中，`timeout`方法返回一个`Promise`实例，表示一段时间才会发生的结果。过了指定的时间（`ms`参数）以后，`Promise`实例的状态变为`resolved`，就会触发`then`方法绑定的回调函数。

`Promise`新建后就会立即执行。
```js
let promise = new Promise((resolve, reject) => {
  console.log('Promise');
  resolve();
});

promise.then(() => {
  console.log('resolved.');
});

console.log('Hi!');
// Promise
// Hi!
// resolved.
```
上面的代码中，`Promise`新建后立即执行，所以输出的是`Promise`。然后，`then`方法指定的回调函数，将在当前脚本所有同步的代码执行完才会执行，所以`resolved`最后输出。

下面是异步加载图片的例子。
```js
function loadImageAsync(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    }

    image.src = url;
  })
}
```
上面的代码种，使用`Promise`包装了一个图片加载的异步操作。如果加载成功。就调用`resolve`方法，否则调用`reject`方法。

下面是一个用`Promise`对象实现的Ajax操作的例子。
```js
const ajax = function(url) {
  const promise = new Promise((resolve, reject) => {
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }

      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    }

    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.onreadystatechange = handler;
    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
  });
  
  return promise
};

ajax("/posts.json").then((res) => {
  console.log("调用成功", res);
}, (err) => {
  console.log("调用出错", err);
});
```
上面代码中，`ajax`是对`XMLHttpRequest`对象的封装，用于发出一个针对`JSON`数据的`HTTP`请求，并且返回一个`Promise`对象。但要注意的是，在`ajax`内部，`resolve`函数和`reject`函数调用时，都会带有参数。

如果调用`resolve`函数和`reject`函数带有参数的话，它们的参数会被传递给回调函数。`reject`函数的参数一般是`Error`对象的实例，表示抛出错误；`resolve`函数的参数除了正常的值之外，还有可能是另一个Promise实例，看下面的例子：
```js
const promise1 = new Promise((resolve, reject) => {
  // 做某些操作...
});

const promise2 = new Promise((resolve, reject) => {
  // 做某些操作...
});
```
这个例子中，`promise1`和`promise2`都是Promise的实例，但是`promise2`的`resolve`方法把`promise1`作为参数，也就是说，一个异步操作
的结果是返回另一个异步操作。

要注意的是，`promise1`的状态就传递给了`promise2`，也就是说，`promise1`的状态决定了`promise2`的状态。如果`promise1`的状态是进行中（`pending`），那`promise2`的回调函数就会等待`promise1`的状态改变；如果`promise`的状态已经是`resolved`或者`rejected`，那`promise2`的回调函数就会立马执行。
```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('fail')), 3000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve(promise1), 1000);
});

promise2
  .then(res => {
    console.log("调用成功", res);
  })
  .catch(err => {
    console.log("调用出错", err);
    // 调用出错 Error: fail
  });
```
上面的代码中，`promise1`是一个Promise，3秒后变成`rejected`。`promise2`的状态在1秒之后改变，`resolve`方法返回的是`promise1`。由于`promise2`返回的是另一个Promise，就导致`promise2`自己的状态无效了。是由`promise1`的状态来决定`promise2`的状态。所以，后面的`then`语句就变成针对`promise1`。又过了2秒，`promise1`变成了`rejected`，就导致触发`catch`方法指定的回调函数。

要注意的是，调用`resolve`或`reject`并不会结束Promise的参数函数执行。
```js
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(res => {
  console.log(res);
});
// 2
// 1
```
上面的代码中，调用`resolve(1)`后，后面的`console.log(2)`还会执行，并且是首先在控制台输出。这是因为立即resolved的Promise是在本轮的事件循环的最后才执行的，总会在本轮循环的同步任务之后才执行。

为了避免一些意外，调用`resolve`或`reject`之后，Promise也就完成了，后面的操作应该放到`then`方法里面，而不是写在`resolve`或`reject`后面。
```js
new Promise((resolve, reject) => {
  return resolve();

  // return之后的代码都不会执行
  console.log("打印某些东西");
});
```

## Promise.then()
`then`方法是定义在原型对象`Promise.prototype`上的。

`then`方法返回一个新的`Promise`实例，并不是原来的那个`Promise`实例。这样就可以采用链式写法，`then`方法后面再去调用另一个`then`方法。
```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("调用成功"), 500);
});

promise.then(msg => {
  return msg;
}).then(res => {
  console.log(res);
  // 调用成功
});
```
上面的代码使用`then`方法，依次指定了两个回调函数，第一个回调函数完成之后，把返回结果作为参数传进第二个回调函数。

```js
const promise = function(bool) {
  return new Promise((resolve, reject) => {
    if (bool) {
      resolve("调用成功");
    } else {
      reject("调用出错");
    }
  });
}

promise(true).then(msg => {
  return promise(false);
}).then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
  // 调用出错
});
```
上面的代码中，第一个`then`方法指定的回调函数（参数为`msg`的回调函数），返回另一个`Promise`对象。这时，第二个`then`方法指定的回调函数（参数为`res`的回调函数），就等待这个新的`Promise`对象（`return promise(false)`）状态发生变化。如果是`resolved`，就调用第一个回调函数，如果是`rejected`，就调用第二个回调函数（参数为`err`的回调函数）。

## Promise.catch()

`Promise.catch()`方法用于发生错误时的回调函数。
```js
const promise = function(bool) {
  return new Promise((resolve, reject) => {
    if (bool) {
      resolve("调用成功");
    } else {
      reject("调用出错");
    }
  });
};

promise(false)
  .then(res => {
    console.log("成功", res);
  })
  .catch(err => {
    // 处理`promise()`方法和前一个回调函数运行时发生的错误
    console.log("异常", err);
    // 异常 调用出错
  });
```
上面的代码中，`promise()`方法返回一个Promise对象，如果该对象状态变为`resolved`，就会调用`then()`方法；如果异步操作抛出错误，状态就会变成`rejected`，就会调用`catch()`方法，处理这个错误。还有，如果`then()`方法运行中抛出错误，也会被`catch()`方法捕获。

看下面的例子：
```js
const promise = new Promise((resolve, reject) => {
  throw new Error("test");
});

promise
  .then(res => {
    console.log("调用成功", res);
  })
  .catch(err => {
    console.log("调用出错", err);
    // 调用出错 Error: test
  })
```
上面的代码中，`promise`抛出一个错误，就被`catch()`方法捕获。

如果Promise状态已变成`resolved`，再抛出错误也是无效的，看下面的例子。
```js
const promise = new Promise((resolve, reject) => {
  resolve('成功');
  throw new Error('test');
});

promise
  .then((res) => {
    console.log(res); // 成功
  })
  .catch((err) => {
    console.log(err);
  })
```
上面的例子中，Promise的`resolve`语句后面，抛出的错误，都不会被捕获，就等于没抛出。因为`Promise`的状态一旦改变，就会永远保持这个状态，不会再变。

Promise对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总会被下一个`catch`语句捕获。
```js
const promise = function(bool) {
  return new Promise((resolve, reject) => {
    if (bool) {
      resolve('调用成功');
    } else {
      reject('调用出错');
    }
  });
};

promise(true)
  .then(res => {
    return res
  })
  .then(msg => {
    throw new Error("调用出错");
  })
  .catch(err => {
    console.log(err);
    // Error: 调用出错
  });
```
上面的代码中，一共有三个Promise对象：一个是`promise()`产生的，两个由`then()`产生。它们之中任何一个抛出错误，都会被最后一个`catch()`捕获。

如果没有使用`catch()`方法，Promise对象抛出的错误不会传递到外出代码，也就是不会有任何的反应。
```js
const promise = function() {
  return new Promise((resolve, reject) => {
    resolve(x + 2);
  });
}

promise().then((res) => {
  console.log("成功");
});

setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```
上面的代码中，`promise`函数产生的Promise对象，内部出现了语法错误，浏览器运行到这一行，就打印出错误提示`ReferenceError: x is not defined`，但是不会退出进程、终止脚本执行，2秒后还会输出`123`。这就证明了，Promise内部的错误不会影响到Promise外部的代码。简单的说“Promise会吃掉错误”。

一般建议，Promise对象后面要跟`catch()`方法，这样就可以处理Promise内部发生的错误。`catch()`方法返回的还是一个Promise对象，所以还可以在后面接着调用`then()`方法。
```js
const promise = function() {
  return new Promise((resolve, reject) => {
    // 下面一行会报错，因为a没有声明
    resolve(a + 2);
  });
};

promise()
  .catch(err => {
    console.log('调用出错', err);
  })
  .then(res => {
    console.log("继续调用");
  });
  // 调用出错 ReferenceError: a is not defined
  // 继续调用
```
上面的代码中，运行完`catch()`方法后，接着运行后面的`then()`方法。如果没有报错，会直接跳过`catch`方法。
```js
Promise.resolve()
  .catch(err => {
    console.log('失败');
  })
  .then(res => {
    console.log("继续");
  })
  // 继续
```
上面的代码没有报错，因此跳过了`catch()`方法，直接执行后面的`then()`方法。这时，要是`then()`方法里面报错，就跟前面的`catch()`无关了。

`catch()`方法中还能再抛出错误。
```js
const promise = function() {
  return new Promise((resolve, reject) => {
    // 下面一行会报错，因为a没有声明
    resolve(a + 2);
  });
};

promise().then((res) => {
  return promise();
})
.catch((err) => {
  console.log('调用出错', err);
  // 下面一行会报错，因为b没有声明
  b + 2;
})
.then(() => {
  console.log('继续');
});
// 调用出错 ReferenceError: a is not defined
// Uncaught (in promise) ReferenceError: b is not defined
```
上面的代码中，`catch`方法抛出一个错误，因为后面没有`catch()`方法了，所以导致这个错误无法捕获，也不会传递到外层。再来看下面的例子：
```js
const promise = function() {
  return new Promise((resolve, reject) => {
    resolve(a * 2);
  });
};

promise().then(res => {
  return promise();
})
.catch(err => {
  console.log("调用出错", err);
  y * 2
})
.catch(err => {
  console.log('继续', err);
});
// 调用出错 ReferenceError: a is not defined
// 继续 ReferenceError: y is not defined
```
上面的代码中，第二个`catch()`方法用来捕获前一个`catch`方法抛出的错误。

## Promise.prototype.finally()

`finally()`方法用于指定不管Promise对象最后的状态是什么，都会执行的操作。这样就可以在`Promise`是否成功完成后都需要执行的代码提供了一种方式。
```js
const promise = new Promise((resolve, reject) => {
  resolve(a + 2);
});

promise
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
  .finally(() => {
    console.log('hello world');
  })
  // ReferenceError: a is not defined
  // hello world
```
上面的代码中，不管`promise`最后的状态是什么，在执行完`then`或者`catch`方法后，都会执行`finally`方法。再来看下面的例子：
```js
let isLoading = true;

const promise = function() {
  return new Promise((resolve, reject) => {
    // 下面一行会报错，因为a没有声明
    resolve(a + 2);
  });
};

promise()
  .then(res => {
    console.log("调用成功", res);
  })
  .catch(err => {
    console.log("调用出错", err);
  })
  .finally(() => {
    isLoading = false;
    console.log(isLoading);
  });

  // 调用出错 ReferenceError: a is not defined
  // false
```
`finally`方法的回调函数不接受任何参数，因此没有办法知道，前面的Promise状态到底是成功还是拒绝。这就意味着，`finally`方法里面的操作，应该是跟状态无关的，不依赖`Promise`的执行结果。

`finally`本质上是`then`方法的特例。
```js
const promise = new Promise((reslove, reject) => {
  reslove(a + 1);
});

promise.finally(() => {
  // 做某些操作
});

// 等于
promise.then(
  res => {
    console.log('调用成功');
  },
  err => {
    throw new Error('test')
  }
);
```
上面代码中，如果不使用`finally`方法，同样的语句需要为成功和失败两种情况各写一次，有了`finally`方法之后，只需要写一次。

如果你想在Promise执行完毕后无论结果怎么样都去做一些操作或者处理，`finally`方法就有用。

## Promise.all()

`Promise.all()`方法用于把多个Promise实例，包装成一个新的`Promise`实例。
```js
Promise.all([p1, p2, p3]);
```
上面的代码中，`Promise.all()`方法接受一个数组当作参数，`p1`、`p2`、`p3`都是Promise实例，如果不是的话，就会先调用`Promise.resolve`方法，将参数转成`Promise`实例，再进行处理。还有，`Promise.all()`方法的参数可以不是数组，但是必须具有`Iterator`接口，且返回的每个成员都是Promise实例。

`p`的状态由`p1`、`p2`、`p3`决定，分成两种情况。

1. 只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。

2. 只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调汉函数。
```js
const p1 = new Promise((resolve, reject) => {
  resolve('成功');
});

const p2 = new Promise((resolve, reject) => {
  resolve('成功');
});

const p3 = new Promise((resolve, reject) => {
  resolve('成功');
});

Promise.all([p1, p2, p3]).then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
// ["成功", "成功", "成功"]
```
上面代码中，一共有3个Promise实例，只有这3个实例的状态都变成`fulfilled`，或者其中有一共变成`rejected`，才会调用`Promise.all`方法后面的回调函数。

看下面的例子。
```js
function promise1() {
  return new Promise((resolve, reject) => {
    resolve('成功');
  });
}

function promise2() {
  return new Promise((resolve, reject) => {
    resolve('成功');
  });
}

const p1 = promise1()
  .then(console.log("成功"));

const p2 = promise2()
  .then(console.log('成功'))

Promise.all([p1, p2]).then(([text1, text2]) => {
  console.log(text1, text2);
})
  .catch(err => {
    console.log(err);
  });
```
上面的代码中，`p1`和`p2`都是异步操作，只有等它们的结果都返回了，才会触发`Promise.all().then`这个方法。

要注意的是，作为参数的Promise实例，自己定义了`catch`方法，如果它一旦被`rejected`，并不会触发`Promise.all()`的`catch`方法。
```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
  .then(res => res)
  .catch(err => err);

const p2 = new Promise((resolve, reject) => {
  throw new Error('啊，又有bug了');
})
  .then(res => res)
  .catch(err => err);

Promise.all([p1, p2])
  .then(res => console.log(res))
  .catch(err => err);

// ["hello", Error: 啊，又有bug了]
```
上面代码中，`p1`会`resolved`，`p2`会`rejected`，但是`p2`有自己的`catch`方法，该方法返回的是一个新的Promise实例，`p2`指向的是这个实例。该实例执行完`catch`方法后，也会变成`resolved`，所以导致`Promise.all()`方法参数里面的两个实例都会`resolved`，因此会调用`then`方法指定的回调函数，而不会调用`catch`方法指定的回调函数。

如果`p2`没有自己的`catch`方法，就会调用`Promise.all()`的`catch`方法。
```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
  .then(res => res)
  .catch(err => err);

const p2 = new Promise((resolve, reject) => {
  throw new Error('啊，又有bug了');
})
  .then(res => res)

Promise.all([p1, p2])
  .then(res => console.log(res))
  .catch(err => console.log(err));
// Error: 啊，又有bug了
```

## Promise.allSettled()

`Promise.allSettled()`方法也是接受一组Promise实例作为参数，包装成一个新的Promise实例。只有等到所有的参数实例都返回结果，不管`fulfilled`还是`rejected`，包装实例才会结束。 
```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve(2), 2000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => reject('哎呀，出bug了'), 3000);
});

const p = Promise.allSettled([p1, p2, p3]);

p.then((res) => {
  console.log(res);
});
// [
//   {status: "fulfilled", value: 1}, 
//   {status: "fulfilled", value: 2}, 
//   {status: "rejected", reason: "哎呀，出bug了"}
// ]
```
上面的代码有三个Promise实例，都设置了不同毫秒的定时器，然后3秒后在` Promise.allSettled`的回调函数`then`中打印出结果。这是因为`Promise.allSettled`要等这三个`Promise`实例执行完后才会得到结果。

该方法会返回新的Promise实例，一旦结束，状态总会是`fulfilled`，并不会变成`rejected`。状态变成`fulfilled`后，Promise的监听函数接收的参数是一个数组，每个成员对应一个传入`Promise.allSettled()`的Promise实例。
```js
const resolved = Promise.resolve(1);
const reject = Promise.reject(-100);

const allSettled = Promise.allSettled([resolved, reject]);

allSettled.then(res => {
  console.log(res);
});
// [
//   {status: "fulfilled", value: 1},
//   {status: "rejected", reason: -100}
// ]
```
上面的代码中，`Promise.allSettled()`的返回值`allSettled`，状态只能变成`fulfilled`。它的监听函数接收的参数是一个数组`res`。该数组的每个成员都是一个对象，对应传入`Promise.allSettled()`的两个Promise实例。每个对象都有`status`属性，这个属性的值只能是字符串`fulfilled`或`rejected`。当`fulfilled`时，对象有一个`value`属性，如果时`rejected`就有`reason`属性。对应两种状态的返回值。

有时候不关异步操作的结果，只关心这些操作有没有结束。`Promise.allSettled()`方法就显得很有用。

## Promise.resolve()

`Promise.resolve()`方法返回一个以给定解析后的`Promise`对象。也就是说，将现有的对象转为Promise对象。
```js
const promise1 = Promise.resolve('foo');
// 等于
const promise2 = new Promise(resolve => resolve('foo'));
```
`Promise.resolve()`方法的参数分成四种情况。

#### 1. 参数是一个Promise实例
如果参数是Promise实例，`Promise.resolve`不会做任何修改，原封不动地返回这个实例。

#### 2. 参数是一个`thenable`对象
`thenable`对象也就是包含有`then`方法的对象，例如下面的对象。
```js
let thenable = {
  then(resolve, reject) {
    resolve(100);
  }
};
```
`Promise.resolve()`方法会把这个对象转成Promise对象，然后立即执行`thenable`对象的`then()`方法。
```js
let thenable = {
  then(resolve, reject) {
    resolve(100);
  }
};

let p = Promise.resolve(thenable);

p.then(res => { 
  console.log(res);
});
// 100
```
上面的代码中，`thenable`对象的`then()`方法执行后。对象`p`的状态就变成了`resolved`，然后立即执行最后那个`then`方法，输出了`100`。

#### 3. 参数不是含有`then()`方法的对象，或者是根本不是对象
如果参数是一个原始值，或者是一个不含`then()`方法的对象，则`Promise.resolve()`方法返回一个新的Promise对象，状态是`resolved`。
```js
const p = Promise.resolve('Hello');

p.then(res => {
  console.log(res);
});
// Hello
```
上面的代码生成一个新的Promise对象实例`p`。由于字符串`Hello`不属于异步操作，返回Promise实例的状态从一生成就是`resolved`，所以回调函数会立即执行。`Promise.resolve()`方法的参数，也会传给回调函数。

#### 4. 不带有任何参数
`Promise.resolve()`方法允许调用时不带参数，直接返回一个`resolved`状态的Promise对象。

如果希望得到一个Promise对象，直接调用`Promise.resolve()`方法。
```js
const p = Promise.resolve();

p.then(() => {
  console.log('Hello Wrold');
});

// Hello Wrold
```
上面的代码中，变量`p`就是一个Promise对象。

要注意的是，立即`resolve()`的Promise对象，是在本轮“事件循环”结束时执行，而不是在下一轮“事件循环”的开始执行。
```js
setTimeout(() => {
  console.log(1);
}, 0);

Promise.resolve().then(() => {
  console.log(2);
});

console.log(3);

// 3
// 2
// 1
```
上面的代码中，`setTimeout(fn, 0)`在下一轮“事件循环”开始时执行，`Promise.resolve()`是在本轮“事件循环”结束时执行，`console.log('one')`则是立即执行，因此最先输出。

## Promise.reject()
`Promise.reject(reason)`方法也是会返回一个新的Promise实例，这个实例的状态为`rejected`。
```js
const p = Promise.reject('出错了');

// 等于
const p = new Promise((resolve, reject) => reject('出错了'));

p.then(null, (s) => {
  console.log(s);
});
// 出错了
```
上面的代码中，有一个Promise对象的实例`p`，状态为`rejected`，回调函数会立即执行。

`Promise.reject()`方法的参数，会原封不动地作为`reject`的理由，变成后续方法的参数。
```js
Promise.reject('出错了')
.catch(e => {
  console.log(e);
  console.log(e === '出错了');
});
// 出错了
// true
```
上面的代码中，`Promise.reject()`方法的参数是一个字符串，后面`catch()`方法的参数`e`就是这个字符串。