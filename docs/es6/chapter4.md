# 字符串扩展

## includes()、startsWith()、endsWith()

ES6新增了3种对字符串操作的新方法
  1. `includes()`：返回布尔值，表示是否找到了参数字符串。
  2. `startsWith()`：返回布尔值，表示参数字符串是否在源字符串的头部。
  3. `endsWith()`：返回布尔值，表示参数字符串是否在源字符串的尾部。

```js
var s = 'Hello world！';

console.log(s.startsWith('Hello')); // true
console.log(s.includes('o')); // true
console.log(s.endsWith('！')); // true
```

这三个方法都支持接收第二个参数，表示开始搜索的位置。
```js
var s = 'Hello world！';

console.log(s.startsWith('world', 6)); // true
console.log(s.endsWith('Hello', 5)); // true
console.log(s.includes('Hello', 6)); // false
```
上面的代码表示，使用第二个参数`n`时，`endsWith`的行为与其他两个方法有所不同。它针对前`n`个字符，而其他两个方法针对从第`n`个位置到字符串结束位置之间的字符。

## repeat()
repeat方法返回一个新的字符串，表示将原来的字符串重复`n`次。
```js
console.log('hello'.repeat(3)); // hellohellohello
console.log('l'.repeat(5)); // lllll
console.log('ni'.repeat(4)); // nininini
```
如果参数是个小数的话，会被转换为整数。
```js
console.log('hello'.repeat(3.5)); // hellohellohello
console.log('l'.repeat(5.8)); // lllll
console.log('ni'.repeat(4.2)); // nininini
```
如果`repeat`的参数是负数或者`Infinity`，就会抛出错误。
```js
'na'.repeat(Infinity); // Uncaught RangeError: Invalid count value
'ni'.repeat(-1); // Uncaught RangeError: Invalid count value
```
但如果参数是`0`到`-1`之间的小数，则等同于`0`，这是因为会先进行取整运算。`0`到`-1`之间的小数取整以后等于`-0`，`repeat`视同为`0`。参数如果是`NaN`的话也等同于`0`。
```js
console.log('na'.repeat(-0.9)); // ""
console.log('na'.repeat(NaN)); // ""
```
如果`repeat`的参数是字符串，则会先转换成数字。
```js
console.log('na'.repeat('na')); // ""
console.log('na'.repeat('3')); // "nanana"
```

## padStart()、padEnd()
ES6引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或者尾部补全。

`padStart()`是在字符串头部补全，`padEnd()`是在字符串尾部补全。
```js
console.log('x'.padStart(5, 'ab')); // ababx
console.log('x'.padEnd(4, 'ab')); // xaba
```
上面的代码中，`padStart`和`padEnd`都接收两个参数，第一个参数是用来指定字符串的最小长度，第二个参数是用来补全的字符串。

如果原字符串的长度等于或大于指定的最小长度时，则会返回原来的字符串。
```js
console.log('xxx'.padStart(2, 'ab')); // xxx
console.log('xxx'.padEnd(2, 'ab')); // xxx
```
如果用来补全的字符串与原字符串的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串。
```js
console.log('abc'.padEnd(10, '0123456789')); // abc0123456
```
如果第二个参数省略了，则会用空格来补全。
```js
console.log('x'.padStart(10)); // '         x'
console.log('x'.padEnd(10)); // 'x         '
```
`padStart`的常见用途是给数值补全指定位数。下面的代码将生成`10`位的数值字符串。
```js
console.log('1'.padStart(10, '0')); // 0000000001
console.log('12'.padStart(10, '0')); // 0000000012
console.log('123456'.padStart(10, '0')); // 0000123456
```
另一个用途是提示字符串格式。
```js
console.log('12'.padStart(10, 'YYYY-MM-DD')); // YYYY-MM-12
console.log('09-12'.padStart(10, 'YYYY-MM-DD')); // YYYY-09-12
```

## 模板字符串
模板字符串是增强版的字符串，用反引号 **（`）** 标识。它可以当作普通字符串使用。也可以用来定义多行字符串，或者在字符串中嵌入变量。
```js
console.log(`hello world`); // hello world
```
如果是多行字符串可以像下面这样使用。
```js
console.log(`hello
world
图图
`);
// hello
//     world
//     图图
```
字符串中嵌入变量的用法。
```js
let name = "tutu", time = 'today';
console.log(`Hello ${name}, how are you ${time}`); // Hello tutu, how are you today
```
上面代码中的字符串都使用了反引号。如果在模板字符串中需要使用反引号，则在其前面要用反斜杠转义。
```js
let greeting = `\`Well\` World！`;
console.log(greeting); // `Well` World！
```
使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出中。

```js
let string = `
hello world
`
```
上面的代码中，所有模板字符串的空格和换行都是被保留的，比如hello前面有一个换行。如果不想要这个换行，可以使用`trim`方法消除。
```js
let string = `
hello world
`
console.log(string.trim()); // hello world
```
在模板字符串中写入变量，需要将变量名写在`${}`中。
```js
let name = 'tutu';
console.log(`hello ${name}`); // hello tutu
```
大括号内可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性。
```js
let x = 1;
let y = 2;
console.log(`${x} + ${y} = ${x + y}`); // 1 + 2 = 3
console.log(`${x} + ${y * 2} = ${x + y * 2}`); // 1 + 4 = 5

let obj = {x: 1, y: 2};
console.log(`${obj.x * obj.y}`); // 2
```
模板字符串还可以调用函数。
```js
function fn() {
  return "hello world";
}

console.log(`foo ${fn()} bar`);
```
如果大括号中的值不是字符串，将按照一般的规则转为字符串。比如，大括号中是一个对象，将默认调用对象的`toString`方法。

如果模板字符串中的变量没有声明，将会报错。
```js
// 变量名str没有声明
console.log(`hello ${str}`); // str is not defined
```

由于模板字符串的大括号内部就是要执行的JavaScript代码，因此如果大括号内部是一个字符串，将会原样输出。
```js
console.log(`hello ${'World'}`); // hello World
```
模板字符串甚至还能嵌套。
```js
const tmpl = addrs => `
  <table>
    ${
      addrs.map(addr => `
        <tr><td>${addr.first}</td></tr>
        <tr><td>${addr.last}</td></tr>
      `).join('')
    }
  </table>
`;

const data = [
  { first: '<Jane>', last: 'Bond' },
  { first: 'Lars', last: '<Croft>' },
];

console.log(tmpl(data));

// <table>
    
//     <tr><td><Jane></td></tr>
//     <tr><td>Bond</td></tr>
  
//     <tr><td>Lars</td></tr>
//     <tr><td><Croft></td></tr>
  
// </table>
```
如果需要引用模板字符串本身，可以像下面这样写。
```js
// 写法一
let str = 'return' + '`hello ${name}!`';
let func = new Function('name', str);

console.log(func('Jack')); // hello Jack!

// 写法二
let str = '(name) => `hello ${name}!`';
let func = eval.call(null, str);
console.log(func('tutu')); // hello tutu!
```