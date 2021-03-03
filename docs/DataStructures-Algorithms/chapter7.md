# 集合

集合是一种不允许重复的数据结构。

## 构建数据集合

集合是由一组无序且不能重复的项所组成的数据结构。集合数据结构使用了和有限集合相同的数学概念。有限集合也就是由有限个元素组成的集合，也叫有穷集合。

在数学里，集合是一组不同对象的集。比如说，一个由大于等于`0`的整数组成的自然集合：`N = {0, 1, 2, 3, 4, 5, 6, ...}`。集合中的对象列表用`{}`包围。

还有一个概念叫做空集。空集就是不包含任何元素的集合。比如 24 和 29 之间的素数集合，由于 24 和 29 之间没有素数（除了 1 和自身以外，不能被其他正整数整除，就叫做素数），这个集合就是空集。空集用`{}`表示。

也可以把集合当成一个既没有重复元素，又没有顺序概念的数组。

## 创建集合

在`ES6`里`Set`数据结构就是一个集合。这里将基于`ES6`中的`Set`类来实现一个自己的`Set`类。下面还有``ES6`里没有提供的集合运算，例如并集、交集和差集。

下面声明一个`Set`类。

```js
class Set {
  constructor() {
    this.items = {};
  }
}
```

这里是用对象而不使用数组来表示集合，主要原因是对象不允许一个键指向两个不同的属性，也确保集合中的元素都是唯一的。当然也可以使用数组。

下面要声明一些集合用到的方法。

- `add(ele)`：添加一个元素。
- `delete(ele)`：移除一个元素。
- `has(ele)`：查询一个元素是否在集合中，如果在就返回`true`，否则返回`false`。
- `clear()`：移除集合中的所有元素。
- `size()`：获取集合中所有元素的数量。
- `values()`：返回一个包含集合中所有值的数组。

### has 方法

`has`方法用来检查某个元素是否存在集合中。

```js
has(ele) {
  return Object.prototype.hasOwnProperty.call(this.items, ele);
}
```

既然用对象来存储集合的元素，就可以用`in`操作符来验证某个元素是否是`items`对象的属性。但是这并不是最好的方式，使用`Object`原型上的`hasOwnProperty`方法是最稳妥的，这个方法返回一个表示对象是否包含特定属性的布尔值。`in`运算符返回表示对象在原型链上是否包含特定属性的布尔值。

### add 方法

下面来实现添加元素的方法。

```js
add(ele) {
  if (!this.has(ele)) {
    this.items[ele] = ele;
    return true;
  }
  return false;
}
```

对于添加元素，首先检查它有没有在集合里。如果不在，就添加到集合里，返回`true`，表示添加了该元素。如果集合里有了这个元素，返回`false`，说明集合中已经存在该元素。

:::tip
添加一个元素时，把它作为键和值保存，这样有利于查找该元素。
:::

### delete 和 clear 方法

```js
delete(ele) {
  if (this.has(ele)) {
    delete this.items[ele];
    return true;
  }
  return false;
}
```

在`delete`方法中，首先验证集合里是否存在传入的元素。如果存在，就从集合中移除该元素并返回`true`表示已移除该元素。如果不存在，就返回`false`。

`clear`方法就很简单了。

```js
clear() {
  this.items = {};
}
```

直接把`items`设置成初始化的时候就可以了。但还有一种方法，通过迭代集合，用`delete`方法逐个移除所有值，不过这样显得麻烦。

### size 方法

有三种方式可以实现`size`方法。

1. 第一种就像队列，栈，链表那样，在使用`add`和`delete`方法时用一个`count`变量控制它。
2. 第二种是使用`Object.keys`方法，该方法返回一个给定对象所有属性的数组。然后用这个数组的`length`属性返回`items`对象的属性个数。

```js
size() {
  return Object.keys(this.items).length;
}
```

3. 第三种是用`for-in`语句遍历`items`对象的属性，记录属性的个数并返回这个数。

```js
sizeLegacy() {
  let count = 0;
  for (let key in this.items) {
    if (this.has(key)) {
      count++;
    }
  }
  return count;
}
```

迭代`items`对象的所有属性，用`has`方法检查它们是否是自身的属性。如果是，递增`count`的值，最后返回`count`。

:::warning
但是不能简单使用`for-in`语句迭代`items`对象的属性，并递增`count`变量的值，还要用`has`方法检查对象是否具有该属性，因为对象的原型里包含了额外的属性（属性既有继承`Object`类的，也有属于对象自身、未用于数据结构的）。
:::

### values 方法

对于`values`方法，用`Object.values`和`for-in`迭代都可以。

```js
values() {
  return Object.values(this.items);
}

valuesLegacy() {
  let values = [];
  for (let key in this.items) {
    if (this.has(key)) {
      values.push(key);
    }
  }
  return values;
}
```

迭代`items`对象的所有属性，把它们添加到一个数组里面，并返回数组。这个方法和`sizeLegacy`一样的，只不过这里不是计算属性个数而已。

### 使用 Set 类

下面就来测试一下`Set`类的功能。

```js
const set = new Set();

set.add(1);
set.add(2);
console.log(set.values()); // [ 1, 2 ]
console.log(set.has(2)); // true
console.log(set.has(3)); // false
console.log(set.size()); // 2
```

### 整体代码

```js
class Set {
  constructor() {
    this.items = {};
  }

  has(ele) {
    return Object.prototype.hasOwnProperty.call(this.items, ele);
  }

  add(ele) {
    if (!this.has(ele)) {
      this.items[ele] = ele;
      return true;
    }
    return false;
  }

  delete(ele) {
    if (this.has(ele)) {
      delete this.items[ele];
      return true;
    }
    return false;
  }

  clear() {
    this.items = {};
  }

  size() {
    return Object.keys(this.items).length;
  }

  sizeLegacy() {
    let count = 0;
    for (let key in this.items) {
      if (this.has(key)) {
        count++;
      }
    }
    return count;
  }

  values() {
    return Object.values(this.items);
  }

  valuesLegacy() {
    let values = [];
    for (let key in this.items) {
      if (this.has(key)) {
        values.push(key);
      }
    }
    return values;
  }
}
```

## 集合运算

### 并集

给定的两个集合，返回一个包含两个集合中所有元素的集合。

下面来实现并集方法。

```js
union(otherSet) {
  const unionSet = new Set();
  this.values().forEach((value) => unionSet.add(value));
  otherSet.values().forEach((value) => unionSet.add(value));
  return unionSet;
}
```

测试代码如下。

```js
const setA = new Set();
const setB = new Set();

setA.add(1);
setA.add(2);
setA.add(3);

setB.add(3);
setB.add(4);
setB.add(5);
setB.add(6);

const otherSetB = setA.union(setB);

console.log(otherSetB.values());
// [ 1, 2, 3, 4, 5, 6 ]
```

这里注意的是`setA`和`setB`都添加了`3`，但它在结构集合只出现了一次。

### 交集

给定的两个集合，返回一个包含两个集合中共有元素的集合。

下面来实现交集方法。

```js
intersection(otherSet) {
  const intersection = new Set();

  const values = this.values();

  for (let i = 0; i < values.length; i++) {
    if (otherSet.has(values[i])) {
      intersection.add(values[i]);
    }
  }
  return intersection;
}
```

`intersection`方法需要找到当前`Set`实例中所有也存在于给定`Set`实例（otherSet）中的元素。先创建一个新的实例，然后迭代当前`Set`实例所有的值，使用`has`方法验证它们是否也存在`otherSet`集合中。如果这个值也存在于`otherSet`集合里，就把它添加到一开始创建的`intersection`的集合中，最后返回它。

测试代码如下。

```js
const setA = new Set();
const setB = new Set();

setA.add(1);
setA.add(2);
setA.add(3);

setB.add(2);
setB.add(3);
setB.add(4);
setB.add(6);

const intersection = setA.intersection(setB);

console.log(intersection.values());
// [ 2, 3 ]
```

#### 修改交集方法

假如有两个集合

- `setA`的值是`[1, 2, 3, 4, 5, 6, 7]`
- `setB`的值是`[4, 6]`

使用刚才创建的`intersection`方法，就要迭代七次`setA`的值，然后还要把这七个值和`setB`里的两个值做比较。现在来改成只需要迭代两次`setB`就好了，更少的迭代次数减少性能的消耗。

```js
otherIntersection(otherSet) {
  const intersection = new Set();
  const values = this.values();
  const otherValues = otherSet.values();
  // 当前集合实例Set的值
  let biggerSet = values;
  // 传入的Set集合的值
  let smallerSet = otherValues;

  // 如果传入的Set集合的元素长度大于当前集合实例Set的元素长度就交换
  if (otherValues.length - values.length > 0) {
    biggerSet = otherValues;
    smallerSet = values;
  }

  // 迭代元素数量比较小的集合
  smallerSet.forEach((value) => {
    if (biggerSet.includes(value)) {
      intersection.add(value);
    }
  });

  return intersection;
}
```

先创建一个新的集合来存放`intersection`方法的返回结果，同样是获取当前集合实例中的值还有传入的`otherSet`的值。然后，如果当前的集合元素比较多，另一个集合元素比较少。就比较两个集合的元素个数，如果另一个集合元素个数比当前集合的元素个数多的话，就交换`biggerSet`和`smallerSet`的值。最后，迭代较小集合计算出两个集合的共有元素并返回。

测试代码如下。

```js
const setA = new Set();
const setB = new Set();

setA.add(10);
setA.add(20);
setA.add(30);

setB.add(30);
setB.add(20);
setB.add(40);

const intersection = setA.otherIntersection(setB);

console.log(intersection.values());
// [ 20, 30 ]
```

### 差集

给定的两个集合，返回一个包含所有存在于第一个集合且不存在第二个集合中的元素的新集合。

```js
difference(otherSet) {
  const difference = new Set();
  this.values().forEach((value) => {
    if (!otherSet.has(value)) {
      difference.add(value);
    }
  });
  return difference;
}
```

`difference`方法会得到存在于集合`A`但不存在于集合`B`的元素。先创建结果集合，然后迭代集合中的所有值。检查当前值是否存在于给定集合中，如果不存在，把值加入结果集合中。

就用`intersection`相同的集合来做测试了。

```js
const setA = new Set();
const setB = new Set();

setA.add(10);
setA.add(20);
setA.add(30);

setB.add(30);
setB.add(20);
setB.add(40);

const difference = setA.difference(setB);

console.log(difference.values());
// [ 10 ]
```

这里输出`[10]`，因为`10`是唯一一个仅存在于`setA`的元素。如果执行`setB.difference(setA)`，会输出`[40]`，因为`40`只存在于`setB`中的元素。

:::warning
这里有些人会有疑惑，为什么不像优化`intersection`方法一样去优化`difference`呢？这是因为`setA`和`setB`之间的差集可能与`setB`和`setA`之间的差集不同。
:::

### 子集

验证一个集合是否是另一个集合的子集。

```js
isSubsetOf(otherSet) {
  if (this.size() > otherSet.size()) {
    return false;
  }

  let isSubset = true;
  this.values().every((value) => {
    if (!otherSet.has(value)) {
      isSubset = false;
      return false;
    }
    return true;
  });
  return isSubset;
}
```

首先验证当前`Set`实例的元素个数大小，如果当前实例中的元素比`otherSet`实例多，那就不是子集，直接返回`false`。子集的元素个数是要小于或等于要比较的集合的。

上面的代码中，假定当前实例是给定集合的子集。然后迭代当前集合中的所有元素，验证这些元素是否存在`otherSet`中。如果有任何元素不存在于`otherSet`中，就说明它不是一个子集，返回`false`。如果所有元素都存在`otherSet`中，`isSubset`就不会赋值为`false`。返回`true`，`isSubset`的值也不会变。

这里之所以使用`every`方法，是因为在子集逻辑中，发现一个值不存在`otherSet`中时，可以停止迭代值，表示这不是一个子集。只要回调函数返回`true`，`every`方法就会被调用。如果回调函数返回`false`，循环直接停止。

测试代码如下。

```js
const setA = new Set();
const setB = new Set();
const setC = new Set();

setA.add(10);
setA.add(20);

setB.add(10);
setB.add(20);
setB.add(30);

setC.add(20);
setC.add(30);
setC.add(40);

console.log(setA.isSubsetOf(setB)); // true
console.log(setA.isSubsetOf(setC)); // false
```

这里有三个集合：`setA`是`setB`的子集，输出了`true`。`setA`不是`setC`的子集，因为`setC`只包含了`setA`里的`20`，所以输出`false`。

## ES6Set 类的运算

下面用 ES6 的`Set`类来模拟**并集、交集、差集、子集**。

下面的例子会用到这两个集合。

```js
const setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);

const setB = new Set();
setB.add(2);
setB.add(3);
setB.add(4);
```

### 模拟并集

```js
const union = (setA, setB) => {
  const union = new Set();
  setA.forEach((value) => union.add(value));
  setB.forEach((value) => union.add(value));
  return union;
};
console.log(union(setA, setB));
// { 1, 2, 3, 4 }
```

### 模拟交集

```js
const intersection = (setA, setB) => {
  const intersection = new Set();
  setA.forEach((value) => {
    if (setB.has(value)) {
      intersection.add(value);
    }
  });
  return intersection;
};
console.log(intersection(setA, setB));
// { 2, 3 }
```

### 模拟差集

```js
const difference = (setA, setB) => {
  const difference = new Set();
  setA.forEach((value) => {
    if (!setB.has(value)) {
      difference.add(value);
    }
  });
  return difference;
};
console.log(difference(setA, setB));
// { 1 }
```

### 模拟子集

```js
const isSubsetOf = (setA, setB) => {
  if (setA.size > setB.size) {
    return false;
  }
  let isSubset = true;
  let arr = [...setA];
  arr.every((value) => {
    if (!setB.has(value)) {
      isSubset = false;
      return false;
    }
    return true;
  });
  return isSubset;
};

console.log(isSubsetOf(setA, setB));
// false
```
