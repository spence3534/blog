# 数值扩展

## Number.isFinite(), Number.isNaN()

ES6 在`Number`对象上，提供了`Number.isFinite()`和`Number.isNaN()`两个方法。

`Number.isFinite()`是用来检查一个数值是否为有限的，即不是`Infinity`。

```js
console.log(Number.isFinite(15)); // true
console.log(Number.isFinite(0.8)); // true
console.log(Number.isFinite(NaN)); // false
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isFinite(-Infinity)); // false
console.log(Number.isFinite('foo')); // false
console.log(Number.isFinite('15')); // false
console.log(true); // true
```

如果参数类型不是数值的话，`Number.isFinite`一律返回`false`。

`Number.isNaN()`用来检查一个值是否为`NaN`。

```js
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN(15)); // false
console.log(Number.isNaN('15')); // false
console.log(Number.isNaN(true)); // false
console.log(Number.isNaN(9 / NaN)); // true
console.log(Number.isNaN('true' / 0)); // true
console.log(Number.isNaN('true' / 'true')); // true
```

如果参数类型不是`NaN`，`Number.isNaN`一律返回`false`。

它们和传统的全局方法`isFinite()`和`isNaN()`的区别在于，传统方法先调用`Number()`将非数值的值
转为数值，再进行判断，而这两个新方法只对数值有效，`Number.isFinite()`对于非数值一律返回`false`，
`Number.isNaN()`只有对于`NaN`才返回`true`，非`NaN`一律返回`false`。

```js
console.log(isFinite(25)); // true
console.log(isFinite('25')); // true
console.log(Number.isFinite(25)); // true
console.log(Number.isFinite('25')); // false
console.log(isNaN(NaN)); // true
console.log(isNaN('NaN')); // true
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN('NaN')); // false
console.log(Number.isNaN(1)); // false
```

## Number.parseInt(), Number.parseFloat()

ES6 把全局方法`parseInt()`和`parseFloat()`，移植到`Number`对象上面，行为完全保持不变。

```js
// 以前的写法
console.log(parseInt('12.34')); // 12
console.log(parseFloat('123.45#')); // 123.45

// ES6的写法
console.log(Number.parseInt('12.34')); // 12
console.log(Number.parseFloat('123.45#')); // 123.45
```

这样做是逐步减少了全局性方法，逐渐变成模块化。

## Number.isInteger()

`Number.isInteger()`用来判断一个数值是否为整数。

```js
console.log(Number.isInteger(25)); // true
console.log(Number.isInteger(25.5)); // false
```

js 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。

```js
console.log(Number.isInteger(25)); // true
console.log(Number.isInteger(25.0)); // true
```

如果参数不是数值的话，`Number.isInteger`返回`false`。

```js
console.log(Number.isInteger()); // false
console.log(Number.isInteger(null)); // false
console.log(Number.isInteger('15')); // false
console.log(Number.isInteger(true)); // false
```

要注意的是，js 数值储存为 64 位双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位于 52 个有效位）。如果
数值的精度超过这个限度，第 54 位及后端的位就会被丢弃，这种情况下，`Number.isIntger`可能会误判。

```js
console.log(Number.isInteger(3.0000000000000002)); // true
```

上面代码中，`Number.isInteger`的参数明明不是整数，但是会返回`true`。原因就是这个小数的精度达到了小数点后 16 个
十进制位，转成二进制位超过了 53 个二进制位，导致最后的那个 2 被丢弃了。

类似的情况还有，如果一个数值的绝对值小于`Number.MIN_VALUE`（5E-324），即小于 js 能够分辨的最小值，会被自动转为 0。
这时，`Number.isInteger`也会误判。

```js
console.log(Number.isInteger(5e-324)); // false
console.log(Number.isInteger(5e-325)); // true
```

上面代码中，`5E-325`由于值太小，会被自动转为 0，因此返回`true`。

总之，如果对数值精度的要求较高，不建议使用`Number.isInteger()`判断一个数值是否为整数。

## Number.EPSILON

ES6 在`Number`对象上面，新增一个极小的常量`Number.EPSILON`。根据规格，它表示 1 与大于 1 的最小浮点数之间的差。

对于 64 位浮点数来说，大于 1 的最小浮点数相当于二进制的`1.00..001`，小数点后面有连续 51 个零。这个值减去 1 之后，
就等于 2 的-52 次方。

```js
console.log(Number.EPSILON === Math.pow(2, -52)); // true
console.log(Number.EPSILON); // 6.5.html:20 2.220446049250313e-16
console.log(Number.EPSILON.toFixed(20)); // 0.00000000000000022204
```

`Number.EPSILON`实际上是 js 能够表示的最小精度。误差如果小于这个值，可以认为没有意义了，即不存在误差了。

引入一个这么小的量的目的，在于为浮点数计算，设置一个误差范围。我们知道浮点数计算是不是精确的。

```js
console.log(0.1 + 0.2);
// 0.30000000000000004
console.log(0.1 + 0.2 - 0.3);
// 5.551115123125783e-17
console.log((5.551115123125783e-17).toFixed(20));
// 0.00000000000000005551
```

上面代码解释了，为什么比较`0.1+0.2`与`0.3`得到的结果是`false`。

```js
console.log(0.1 + 0.2 === 0.3); // false
```

`Number.EPSILON`可以用来设置“能够接收的误差范围”。比如，误差范围设为 2 的-50 次方（即`Number.EPSILON * Math.pow(2, 2)`），
即如果两个浮点数的差小于这个值，我们就认为这两个浮点数相等。

```js
console.log(5.551115123125783e-17 < Number.EPSILON * Math.pow(2, 2));
// true
```

因此，`Number.EPSILON`的实质是一个可以接受的最小误差范围。

```js
function withinErrorMargin(left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

console.log(0.1 + 0.2 === 0.3); // false
console.log(withinErrorMargin(0.1 + 0.2, 0.3)); // true

console.log(1.1 + 1.3 === 2.4); // false
console.log(withinErrorMargin(1.1 + 1.3, 2.4)); // true
```

上面的代码为浮点数运算，部署了一个误差检查函数。

## 安全整数和 Number.isSafeInteger()

js 能够精确表示的整数范围在`-2^53`到`2^53`之间（不含两个端点），超过这个范围，无法精确表示这个值。

```js
console.log(Math.pow(2, 53));
// 9007199254740992
console.log(Math.pow(2, 53) === Math.pow(2, 53) + 1);
// true
```

上面代码中，超出 2 的 53 次方之后，一个数就不精确了。

ES6 引入了`Number.MAX_SAFE_INTEGER`和`Number.MIN_SAFE_INTEGER`这两个常量，用来表示这个范围的上下限。

```js
console.log(Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1);
// true
console.log(Number.MAX_SAFE_INTEGER === 9007199254740991);
// true

console.log(Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER);
// true
console.log(Number.MIN_SAFE_INTEGER === -9007199254740991);
// true
```

上面代码中，可以看到 JavaScript 能够精确表示的极限。

`Number.isSafeInteger()`则是用来判断一个整数是否落在这个范围之内。

```js
console.log(Number.isSafeInteger('a')); // false
console.log(Number.isSafeInteger(null)); // false
console.log(Number.isSafeInteger(NaN)); // false
console.log(Number.isSafeInteger(Infinity)); // false
console.log(Number.isSafeInteger(-Infinity)); // false

console.log(Number.isSafeInteger(3)); // true
console.log(Number.isSafeInteger(1.2)); // false
console.log(Number.isSafeInteger(9007199254740990)); // true
console.log(Number.isSafeInteger(9007199254740992)); // false

console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1)); // false
console.log(Number.isSafeInteger(Number.MIN_SAFE_INTEGER)); // true
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)); // true
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)); // false
```

这个函数的实现很简单，就是跟安全整数的两个边界值比较一下。

```js
Number.isSafeInteger = function (n) {
  return (
    typeof n === 'number' &&
    Math.round(n) === n &&
    Number.MIN_SAFE_INTEGER <= n &&
    n <= Number.MAX_SAFE_INTEGER
  );
};
```

实际使用这个函数时，需要注意。验证运算结果是否落在安全整数的范围内，不要只验证运算结果，而要同时验证参与运算的每个值。

```js
console.log(Number.isSafeInteger(9007199254740993));
// false
console.log(Number.isSafeInteger(990));
// true
console.log(Number.isSafeInteger(9007199254740993 - 990));
// true
console.log(9007199254740993 - 990);
// 9007199254740002
```

上面代码中，`9007199254740993`不是一个安全整数，但是`Number.isSafeInteger`会返回结果，显示计算结果是安全的。这是因为，
这个数超出了精度范围，导致在计算机内部，以`9007199254740992`的形式储存。

```js
console.log(9007199254740993 === 9007199254740992);
// true
```

所以，如果只验证运算结果是否为安全整数，很可能得到错误结果。下面的函数可以同时验证两个运算数和运算结果。

```js
function trusty(left, right, result) {
  if (
    Number.isSafeInteger(left) &&
    Number.isSafeInteger(right) &&
    Number.isSafeInteger(result)
  ) {
    return result;
  }
  throw new RangeError('Operation cannot be trusted');
}

// console.log(trusty(9007199254740993, 990, 9007199254740993 - 900));
// Uncaught RangeError: Operation cannot be trusted

console.log(trusty(1, 2, 3));
// 3
```

## Math 对象的扩展

ES6 在 Math 对象上新增了 17 个跟数学有关的方法。这些方法都是静态方法，只能在 Math 对象上调用。

### Math.trunc()

`Math.trunc`方法用于去除一个数的小数部分，返回整数部分。

```js
console.log(Math.trunc(4.1)); // 4
console.log(Math.trunc(4.9)); // 4
console.log(Math.trunc(-4.1)); // -4
console.log(Math.trunc(-4.9)); // -4
console.log(Math.trunc(-0.1234)); // -0
```

对于非数值，`Math.trunc`内部使用`Number`方法将其转为数值。

```js
console.log(Math.trunc('123.456')); // 123
console.log(Math.trunc(true)); // 1
console.log(Math.trunc(false)); // 0
console.log(Math.trunc(null)); // 0
```

对于空值和无法截取整数的值，返回`NaN`。

```js
console.log(Math.trunc(NaN)); // NaN
console.log(Math.trunc('foo')); // NaN
console.log(Math.trunc()); // NaN
console.log(Math.trunc(undefined)); // NaN
```

对于没有部署这个方法的环境，可以用下面的代码模拟。

```js
Math.trunc =
  Math.trunc ||
  function (x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
  };
```

### Math.sign()

`Math.sign`方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。会返回五种值。

- 参数为正数，返回`+1`;
- 参数为负数，返回`-1`;
- 参数为 0，返回 0;
- 参数为-0，返回-0;
- 其他值，返回`NaN`。

```js
console.log(Math.sign(-5)); // -1
console.log(Math.sign(5)); // 1
console.log(Math.sign(0)); // 0
console.log(Math.sign(-0)); // -0
console.log(Math.sign(NaN)); // NaN
```

如果参数是非数值，会自动转为数值。对于那些无法转为数值的值，会返回`NaN`。

```js
console.log(Math.sign('')); // 0
console.log(Math.sign(true)); // 1
console.log(Math.sign(false)); // 0
console.log(Math.sign(null)); // 0
console.log(Math.sign('9')); // 1
console.log(Math.sign('foo')); // NaN
console.log(Math.sign()); // NaN
console.log(Math.sign(undefined)); // NaN
```

对于没有部署这个方法的环境，可以用下面的代码模拟。

```js
Math.sign =
  Math.sign ||
  function (x) {
    x = +x;
    if (x === 0 || isNaN(x)) {
      return x;
    }
    return x > 0 ? 1 : -1;
  };
```

### Math.cbrt()

`Math.cbrt()`方法用于计算一个数的立方根。

```js
console.log(Math.cbrt(-1)); // -1
console.log(Math.cbrt(0)); // 0
console.log(Math.cbrt(1)); // 1
console.log(Math.cbrt(2)); // 1.2599210498948732
```

对于非数值，`Math.cbrt()`方法内部也是先使用`Number()`方法将其转为数值。

```js
console.log(Math.cbrt('8')); // 2
console.log(Math.cbrt('hello')); // NaN
```

对于没有部署这个方法的环境，可以用下面的代码模拟。

```js
Math.cbrt =
  Math.cbrt ||
  function (x) {
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
```

### Math.clz32()

`Math.clz32()`方法将参数转为 32 位无符号整数的形式，然后返回这个 32 位值里面有多少个前导 0。

```js
console.log(Math.clz32(0)); // 32
console.log(Math.clz32(1)); // 31
console.log(Math.clz32(1000)); // 22
console.log(Math.clz32(0b01000000000000000000000000000000)); // 1
console.log(Math.clz32(0b00100000000000000000000000000000)); // 2
```

上面代码中，0 的二进制形式全为 0，所以有 32 个前导 0；1 的二进制形式是 0b1，只占 1 位，所以 32 位之中有 31 个前导 0；1000 的二进制形式是`0b1111101000`，一共有 10 位，所以 32 位之中有 22 个前导 0。

左移运算符（`<<`）与`Math.clz32`方法直接相关。

```js
console.log(Math.clz32(0)); // 32
console.log(Math.clz32(1)); // 31
console.log(Math.clz32(1 << 1)); // 30
console.log(Math.clz32(1 << 2)); // 29
console.log(Math.clz32(1 << 29)); // 2
```

对于小数，`Math.clz32`方法只考虑整数部分。

```js
console.log(Math.clz32(3.2)); // 30
console.log(Math.clz32(3.9)); // 30
```

对于空值或其他类型的值，`Math.clz32`方法会将它们先转为数值，然后再计算。

```js
console.log(Math.clz32()); // 32
console.log(Math.clz32(NaN)); // 32
console.log(Math.clz32(Infinity)); // 32
console.log(Math.clz32(null)); // 32
console.log(Math.clz32('foo')); // 32
console.log(Math.clz32([])); // 32
console.log(Math.clz32({})); // 32
console.log(Math.clz32(true)); // 31
```

### Math.imul()

`Math.imul`方法返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数。

```js
console.log(Math.imul(2, 4)); // 8
console.log(Math.imul(-1, 8)); // -8
console.log(Math.imul(-2, -2)); // 4
```

如果只考虑最后 32 位，大多数情况下，`Math.imul(a, b)`和`a * b`的结果相同的，即该方法等同于`(a * b)|0`的效果。之所以需要部署这个方法，是因为 js 有精度限制，超过 2 的 53 次方的值无法精确表示。这就是说，对于那些很大的数的乘法，地位数值往往都是不精确的，`Math.imul`方法可以返回正确的低位数值。

### Math.fround()

`Math.fround`方法返回一个数的 32 位但精度浮点数形式。

对于 32 位单精度格式来说，数值精度是 24 个二进制位（1 位隐藏与 23 位有效位），所以对于-2 的 24 次方到 2 的 24 次方之间的整数（不含两个端点），返回结果与参数本身一致。

```js
console.log(Math.fround(0)); // 0
console.log(Math.fround(1)); // 1
console.log(Math.fround(2 ** 24 - 1)); // 6.7.html:159 16777215
```

如果参数的绝对值大于 2 的 24 次方，返回结果开始丢失精度。

```js
console.log(Math.fround(2 ** 24)); // 16777216
console.log(Math.fround(2 ** 24 + 1)); // 16777216
```

`Math.fround`方法的主要作用，是将 64 位双精度浮点数转为 32 位单精度浮点数。如果小数的精度超过 24 个二进制位，返回值就会不同于值，否则返回值不变（即与 64 位双精度值一致）。

```js
// 未丢失有效精度
console.log(Math.fround(1.125)); // 1.125
console.log(Math.fround(7.25)); // 7.25

// 丢失有效精度
console.log(Math.fround(0.3)); // 0.30000001192092896
console.log(Math.fround(0.7)); // 0.699999988079071
console.log(Math.fround(1.0000000123)); // 1
```

对于`NaN`和`Infinity`，此方法返回原值。对于其它类型的非数值，`Math.fround`方法会先将其转为数值，再返回单精度浮点数。

```js
console.log(Math.fround(NaN)); // NaN
console.log(Math.fround(Infinity)); // Infinity

console.log(Math.fround('5')); // 5
console.log(Math.fround(true)); // 1
console.log(Math.fround(null)); // 0
console.log(Math.fround([])); // 0
console.log(Math.fround({})); // NaN
```

对于没有部署这个方法的环境，可以用下面的代码模拟。

```js
Math.fround =
  Math.fround ||
  function (x) {
    return new Float32Array([x])[0];
  };
```

### Math.hypot()

`Math.hypot`方法返回返回参数的平方和平方根。

```js
console.log(Math.hypot(3, 4)); // 5
console.log(Math.hypot(3, 4, 5)); // 200 7.0710678118654755
console.log(Math.hypot()); // 0
console.log(Math.hypot(NaN)); // NaN
console.log(Math.hypot(3, 4, 'foo')); // NaN
console.log(Math.hypot(3, 4, '5')); // 204 7.0710678118654755
console.log(Math.hypot(-3)); // 3
```

上面代码中，3 的平方加上 4 的平方，等于 5 的平方。

如果参数不是数值，`Math.hypot`方法会将其转为数值。只要有一个参数无法转为数值，就会返回 NaN。

### 对数方法

ES6 新增了 4 个对数相关方法。

#### Math.expm1()

`Math.expm1(x)`返回 e 的 x 次方-1，即`Math.exp(x) - 1`。

```js
console.log(Math.expm1(-1)); // -0.6321205588285577
console.log(Math.expm1(0)); // 0
console.log(Math.expm1(1)); // 1.718281828459045
```

对于没有部署这个方法的环境，可以用下面的方法模拟。

```js
Math.expm1 =
  Math.expm1 ||
  function (x) {
    return Math.exp(x) - 1;
  };
```

#### Math.log1p()

`Math.log1p(x)`方法返回`1 + x`的自然对数，即`Math.log(1 + x)`。如果`x`小于-1，返回`NaN`。

```js
console.log(Math.log1p(1)); // 0.6931471805599453
console.log(Math.log1p(0)); // 0
console.log(Math.log1p(-1)); // -Infinity
console.log(Math.log1p(-2)); // NaN
```

对于没有部署这个方法的环境，可以用下面的代码模拟。

```js
Math.log10 =
  Math.log10 ||
  function (x) {
    return Math.log(x) / Math.LN10;
  };
```

#### Math.log2()

`Math.log2(x)`返回以 2 为底的`x`的对数。如果`x`小于 0，则返回`NaN`。

```js
console.log(Math.log2(3)); // 1.584962500721156
console.log(Math.log2(2)); // 1
console.log(Math.log2(1)); // 0
console.log(Math.log2(0)); // -Infinity
console.log(Math.log2(-2)); // NaN
console.log(Math.log2(1024)); // 10
console.log(Math.log2(1 << 29)); // 29
```

对于没有部署这个方法的环境，可以用下面的代码模拟。

```js
Math.log2 =
  Math.log2 ||
  function (x) {
    return Math.log(x) / Math.LN2;
  };
```

### 双曲函数方法

ES6 新增了 6 个双曲函数方法。

- `Math.sinh(x)`返回`x`的双曲正弦（hyperbolic sine）
- `Math.cosh(x)`返回`x`的双曲余弦（hyperbolic cosine）
- `Math.tanh(x)`返回`x`的双曲正切（hyperbolic tangent）
- `Math.asinh(x)`返回`x`的反双曲正弦（inverse hyperbolic sine）
- `Math.acosh(x)`返回`x`的反双曲余弦（inverse hyperbolic cosine）
- `Math.atanh(x)`返回`x`的反双曲正切（inverse hyperbolic tangent）

## 指数运算符

ES6 新增了一个指数运算符（`**`）。

```js
console.log(2 ** 2); // 4
console.log(2 ** 3); // 8
```

这个运算符的一个特点是右结合，而不是常见的左结合。多个指数运算符连用时，是从最右边开始计算的。

```js
// 相当于 2 ** (3 ** 2)
console.log(2 ** (3 ** 2)); // 512
```

上面代码中，首先计算的是第二个指数运算符，而不是第一个。

指数运算符可以与等号结合，形成一个新的赋值运算符（`**=`）。

```js
let a = 1.5;
// 等同于 a = a * a;
console.log((a **= 2)); // 2.25

let b = 4;
// 等同于 b = b * b * b
console.log((b **= 3)); // 64
```

## BigInt 类型

JavaScript 所有数字都保存成 64 位浮点数，这给数值的表示带来了两个限制。一是数值的精度只能到 53 个二进制位
（相当于 16 个十进制位），大于这个范围的整数，JavaScript 是无法精确表示的，这使得 JavaScript 不适合进行
科学和金融方面的精确计算。二是大于或等于 2 的 1024 次方的数值，JavaScript 无法表示，会返回`Infinity`。

```js
// 超过53个二进制位的数值，无法保持精度
console.log(Math.pow(2, 53) === Math.pow(2, 53) + 1); // true

// 超过2的1024次方的数值，无法表示
console.log(Math.pow(2, 1024)); // Infinity
```

ES2020 引入了一种新的数据类型 BigInt（大整数），来解决这个问题，这是 ECMAScript 的第八种数据类型。BigInt
只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

```js
const a = 2172141653n;
const b = 15346349309n;

// BigInt 可以保持精度
console.log(a * b); // 33334444555566667777n

// 普通整数无法保持精度
console.log(Number(a) * Number(b)); // 33334444555566670000
```

为了与 Number 类型区别，BigInt 类型的数据必须添加后缀`n`。

```js
console.log(123); // 普通整数
console.log(123n); // BigInt

// BigInt的运算
console.log(1n + 2n); // 3n
```

BigInt 同样可以使用各种进制表示，都要加上后缀`n`。

```js
console.log(0b1101n); // 二进制 13n
console.log(0o777n); // 八进制 511n
console.log(0xffn); // 十六进制 255n
```

BigInt 与普通整数是两种值，它们之间并不相等。

```js
console.log(42n === 42); // false
```

`typeof`运算符对于 BigInt 类型的数据会返回`bigint`。

```js
console.log(typeof 123n); // bigint
```

BigInt 可以使用负号（-），但是不能使用正号（+），因为会和 asm.js 冲突。

```js
console.log(-42n); // 这是正确的
console.log(+42n); // 报错了
```

JavaScript 以前不能计算 70 的阶乘，因为超出了可以表示的精度。

```js
let p = 1;
for (let i = 1; i <= 70; i++) {
  p *= i;
}
console.log(p); // 1.197857166996989e+100
```

现在支持大整数了，就可以算了，浏览器的开发者工具运行下面代码，就可以了。

```js
let p = 1n;
for (let i = 1n; i <= 70n; i++) {
  p *= i;
}
console.log(p);
// 11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000n
```

### BigInt 对象

JavaScript 原生提供`BigInt`对象，可以用作构造函数生成 BigInt 类型的数值。转换规则基本与`Number()`一致，将其他类型
的值转为 BigInt。

```js
console.log(BigInt(123)); // 123n
console.log(BigInt('123')); // 123n
console.log(BigInt(false)); // 0n
console.log(BigInt(true)); // 1n
```

`BigInt()`构造函数必须有参数，而且参数必须可以正常转为数值，下面的用法都会报错。

```js
console.log(new BigInt()); // Uncaught TypeError: BigInt is not a constructor
console.log(BigInt(undefined)); // Uncaught TypeError: Cannot convert undefined to a BigInt
console.log(BigInt(null)); // Uncaught TypeError: Cannot convert null to a BigInt
console.log(BigInt('123n')); // Uncaught SyntaxError: Cannot convert 123n to a BigInt
console.log(BigInt('abc')); // Uncaught SyntaxError: Cannot convert abc to a BigInt
```

上面代码中，尤其值得注意字符串`123n`无法解析成 Number 类型，所以会报错。

参数如果是小数，也会报错。

```js
console.log(BigInt(1.5));
// Uncaught RangeError: The number 1.5 cannot be converted to a BigInt because it is not an integer
console.log(BigInt('1.5'));
// Uncaught SyntaxError: Cannot convert 1.5 to a BigInt
```

BigInt 对象继承了 Object 对象的两个实例方法。

- `BigInt.prototype.toString()`
- `BigInt.prototype.valueOf()`
  它还继承了 Number 对象的一个实例方法。
- BigInt.prototype.toLocaleString()
  此外，还提供了三个静态方法。
- `BigInt.asUintN(width, BigInt)`：给定的 BigInt 转为 0 到 2 的 width 次方-1 之间对应的值。
- `BigInt.asIntN(width, BigInt)`：给定的 BigInt 转为-2 的 width-1 次方到 2 的 width-1 次方-1 之间对应的值。
- `BigInt.parseint(string, [radix])`：和`Number.parseInt()`类似，将一个字符串转成指定进制的 BigInt。

```js
const max = 2n ** (64n - 1n) - 1n;

console.log(BigInt.asIntN(64, max));
// 9223372036854775807n
console.log(BigInt.asIntN(64, max + 1n));
// -9223372036854775808n
console.log(BigInt.asUintN(64, max + 1n));
// 9223372036854775808n
```

上面代码中，`max`是 64 位带符号的 BigInt 所能表示的最大值。如果对这个值加`1n`，`BigInt.asIntN()`将会
返回一个负值，因为这时新增的一位将被解释为符号位。而`BigInt.asUintN()`方法由于不存在符号位，所以可以
正确返回结果。

如果`BigInt.asIntN()`和`BigInt.asUintN()`指定的位数，小于数值本身的位数，那么头部的位将被舍弃。

```js
const max = 2n ** (64n - 1n) - 1n;

console.log(BigInt.asIntN(32, max)); // -1n
console.log(BigInt.asUintN(32, max)); // 4294967295n
```

上面代码中，`max`是一个 64 位的 BigInt，如果转为 32 位，前面的 32 位都会舍弃。

下面是`BigInt.parseInt()`的例子。

```js
// Number.parseInt()和BigInt.parseInt()的对比
console.log(Number.parseInt('9007199254740993', 10));
// 9007199254740992
console.log(BigInt.parseInt('9007199254740993', 10));
// 9007199254740992n
```

上面代码中，由于有效数字超出了最大限度，`Number.parseInt`方法返回的结果是不精确的，而`BigInt.parseInt`方法
正确返回了对应的 BigInt。

对于二进制数组，BigInt 新增了两个类型`BigUint64Array`和`BigInt64Array`，这两种数据类型返回的都是 64 位 BigInt。
`DataView`对象的实例方法`DataView.prototype.getBigInt64()`和`DataView.prototype.getBigUint64()`，返回的也是
BigInt。

### 转换规则

可以使用`Boolean()`、`Number()`和`String()`这两个方法，将 BigInt 可以转为布尔值、数值和字符串类型。

```js
console.log(Boolean(0n)); // false
console.log(Boolean(1n)); // true
console.log(Number(1n)); // 1
console.log(String(1n)); // 1
```

上面代码中，最后一个例子，转为字符串时后缀`n`会消失。

另外，取反运算符（`!`）也可以将 BigInt 转为布尔值。

```js
console.log(!0n); // true
console.log(!1n); // false
```

### 数学运算

数学运算方面，BigInt 类型的`+`、`-`、`*`和`**`这四个二元运算符，与 Number 类型的行为一致。除法运算`/`会舍去小数
部分，返回一个整数。

```js
console.log(9n / 5n); // 1n
```

几乎所有的数值运算符都可以用在 BigInt，但是有两个例外。

- 不带符号的右移位运算符`>>>`
- 一元的求正运算符`+`
  上面两个运算符用在 BigInt 会报错。前者是因为`>>>`运算符是不带符号的，但是 BigInt 总是带有符号的，导致该运算无意义，完全
  等同于右移运算符`>>`。后者是因为一元运算符`+`在 asm.js 里面总是返回 Number 类型，为了不破坏 asm.js 就规定`+1n`会报错。

BigInt 不能与普通树脂进行混合运算。

```js
console.log(1n + 1.3);
// Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions
```

上面代码报错是因为无论返回的是 BigInt 或者 Number，都会导致丢失精度信息。比如`(2n**53n + 1n) + 0.5`这个表达式，如果返回
BigInt 类型，`0.5`这个小数部分会丢失；如果返回 Number 类型，有效精度只能保持 53 位，导致精度下降。

同样的原因，如果一个标准库函数的参数预期是 Number 类型，但是得到的是一个 BigInt，就会报错。

```js
// 错误的写法
console.log(Math.sqrt(4n)); // 报错

// 正确的写法
console.log(Math.sqrt(Number(4n))); // 2
```

上面代码中，`Math.sqrt`的参数预期是 Number 类型，如果是 BigInt 就会报错，必须先用`Number`方法转一下类型，才能进行计算。

asm.js 里面，`|0`跟在一个数值的后面会返回一个 32 位整数。根据不能和 Number 类型混合运算的规则，BigInt 如果和`|0`进行运算会报错。

```js
console.log(1n | 0);
// Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions
```

### 其他运算

BigInt 对应的布尔值，和 Number 类型一致，即`0n`会转为`false`，其他值转为`true`。

```js
if (0n) {
  console.log('111');
} else {
  console.log('222');
}
// 222
```

上面代码中，`0n`对应`false`，所以会进入`222`子句。

比较运算符（比如`>`）和相等运算符（`==`）允许 BigInt 和其他类型的值混合计算，因为这样做不会损失精度。

```js
console.log(0n < 1); // true
console.log(0n < true); // true
console.log(0n == 0); // true
console.log(0n == false); // true
console.log(0n === 0); // false
```

BigInt 和字符串混合运算时，会先转为字符串，再进行运算。
