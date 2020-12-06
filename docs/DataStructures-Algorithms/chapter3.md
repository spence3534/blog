# 数组

## 为什么使用数组

假如有一个这样的需求：保存班级上的同学的分数。可以这样做：

```js
const xiaoming = 90
const xiaohong = 85
const xiaohuang = 75
const xiaolan = 80
```

但是这并不是最好的方案，如果按照这种方式，只存部分同学的成绩，要创建几个到十几个变量，如果说存全班同学的成绩就要创建很多变量。
显然这样是行不通的，那么我们就可以用数组来解决这个问题，更加简洁的呈现同样的信息。

```js
const fractions = []

fractions[0] = 90
fractions[1] = 85
fractions[2] = 75
fractions[3] = 80
console.log(fractions)
// 数组fraction的内容展示如下：
// [ 90, 85, 75, 80 ]
```

## 创建和初始化数组

用 js 声明、创建和初始化数组很简单，就像下面这样。

```js
let daysOfweek = new Array()
daysOfweek = new Array(7)
daysOfweek = new Array("1", "2", "3", "4", "5")
```

使用`new`关键字，就能简单地声明并初始化一个数组（第一行）。用这种方法，还可以创建一个指定长度的数组（第二行）。
另外也可以直接将数组元素作为参数传递给它的构造器（第三行）。

但是，用`new`创建数组并不是最好的方式。如果想在 js 中创建一个数组，只用中括号（`[]`）的形式就可以了，如下所示。

```js
const daysOfweek = []
```

也可以用一些元素初始化数组，如下所示。

```js
let numbers = ["1", "2", "3", "4", "5"]
```

如果你想知道数组里存了多少个元素（也就是它的长度），可以使用数组的`length`属性。下面的代码输出的是`5`。

```js
let numbers = ["1", "2", "3", "4", "5"]
console.log(numbers.length) // 5
```

### 访问元素和迭代数组

要访问数组里特定位置的元素，可以用中括号传递数值的位置，就可以得到想知道的值或者赋新的值。假如想输出数组
`numbers`里的所有元素，可以通过循环迭代数组、打印元素，如下：

```js
let numbers = ["1", "2", "3", "4", "5"]
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i])
}
```

来看另一个例子：求斐波那契数列的前 20 个数。已知斐波那契数列中的前两项是 1，从第三项开始，每一项都等于前两项之和。

```js
const fibonacci = []
fibonacci[1] = 1
fibonacci[2] = 2
for (let i = 3; i < 20; i++) {
  fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2]
  console.log(fibonacci[i])
}

for (let i = 0; i < fibonacci.length; i++) {
  console.log(fibonacci[i])
}

console.log(fibonacci)
// [undefined, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765]
```

下面来梳理一下上面的代码。

- 首先声明并创建一个数组。
- 然后把斐波那契数列中的前两个数分别赋给了数组的第二和第三个位置（在 js 中，数组第一位的索引始终是`0`。因为斐波那契数列不存在 0，所以在这里直接就省略了。从第二位开始分别保存斐波那契数列中对应位置的元素。）
- 然后，需要做的就是想办法得到斐波那契数列中第三到第二十个位置上的数，（前两个值已经初始化过了）。我们就可以用循环来处理，把数组中前两位上的元素相加，结果赋给当前位置上的元素。
- 最后，看看输出，我们只需要循环迭代数组的各个元素，或者直接打印`fibonacci`数组都能看到结果。

## 添加元素

在数组中添加和删除元素也很容易，假如我们有一个数组`numbers`，初始化成了`0`到`9`；

```js
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 在数组末尾插入元素

如果想要给数组添加一个元素（比如`10`），只要把值赋给数组中最后一个空位上的元素就可以了。

```js
numbers[numbers.length] = 10
```

:::warning
在 js 中，数组是一个可修改的对象。如果添加元素，它就会自动增长。
在 C 和 Java 等其他语言中，要决定数组的大小，想添加元素就要创建一个全新的数组，不能简单地往其中添加所需的元素。
:::

#### 使用 push 方法

另外，有一个`push`方法，能把元素添加到数组的末尾。通过`push`方法，能添加任意个元素。

```js
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
numbers[numbers.length] = 10
numbers.push(11)
numbers.push(12, 13)
console.log(numbers)
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
```

在最后打印`numbers`就得到了从`0`到`13`的值。

#### 在数组开头插入元素

在数组中插入一个新元素（数`-1`），不像之前那样在末尾插入，而是放到数组的开头。实现这个需求，首先腾出数组里第一个
元素的位置，把所有的元素向右移动一位。我们可以循环数组中的元素，从最后一位（长度就是数组的末尾位置）开始，将对应的
前一个元素（`i-1`）的值赋给它（`i`），依次处理，最后把我们想要的赋给第一个位置（索引`0`）上。我们可以把这段逻辑
写成一个函数，甚至将这个方法直接挂在`Array`的原型上，使所有数组的实例都可以访问到这个方法。来看下面的代码。

```js
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
Array.prototype.insertFirstPosition = function(value) {
  for (let i = this.length; i >= 0; i--) {
    this[i] = this[i - 1]
  }
  this[0] = value
}
numbers.insertFirstPosition(-1)
console.log(numbers)
// [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

#### 使用 unshift 方法

在 js 里，数组有一个方法叫`unshift`，可以直接把数值插入数组的开头（这个方法的逻辑和`insertFirstPosition`方法）
的行为是一模一样的。

```js
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
numbers.unshift(-1, -2)
numbers.unshift(-3, -4)
console.log(numbers)
// [-3, -4, -1, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

用`unshift`方法，就可以在数组的开始处添加值了。
