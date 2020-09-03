# JSON
## 语法
JSON的语法可以表示以下三种类型的值。
* **简单值**: 使用JavaScript相同的语法，可以在JSON中表示字符串、数值、布尔值和null。
  但JSON不支持JavaScript中的特殊值undefined。
* **对象**: 对象作为一种复杂数据类型，表示的是一组无序的键值对儿。每个键值对儿中的值
  可以是简单值，也可以是复杂数据类型的值。
* **数组**: 数组也是一种复杂数据类型，表示一组有序的值的列表，可以通过数值索引来访问
  其中的值。数组的值也可以是任何类型————简单值、对象或数组。

JSON不支持变量、函数或对象实例，它就是一种表达结构化数据的格式。

### 简单值
最简单的JSON数据形式就是简单值。例如，下面这个值是有效的JSON数据：
```json
5
```
这是JSON表示数值5的方式。类似地，下面是JSON表示字符串的方式：
```json
"Hello world！"
```
JavaScript字符串与JSON字符串的最大区别在于，JSON字符串必须使用双引号（单引号会导致语法错误）。
布尔值和null也是有效的JSON形式。

### 对象
JSON中的对象与JavaScript字面量稍微有一些不同。下面是一个JavaScript中的对象字面量：
```js
var person = {
  name:"xiaoli",
  age: 21
}
```
JSON中的对象要求给属性加引号。实际上，在JavaScript中，前面的对象字面量完成可以写成下面这样：
```js
var object = {
  "name": "xiaoli",
  "age": 21
}
```
JSON表示上述对象的方式如下：
```json
{
  "name": "xiaoli"
  "age": 21
}
```
JSON对象有两个地方不一样。首先，没有声明变量。其次，没有末尾的分号。对象的属性必须加双引号，这在JSON中是必需的。属性的值可以是简单值，也可以是复杂类型值，因此可以像下面这样在对象中嵌入对象：
```json
{
  "name": "xiaoli",
  "age": 21,
  "info": {
    "company": "chimeng",
    "location": "guangxi"
  }
}
```
与JavaScript不同，JSON中对象的属性名任何时候都必须加引号。手工编写JSON时，忘了给对象属性名加双引号或者把双引号写成单引号都是常见的错误。

### 数组
JSON中的第二种复杂数据类型是数组。JSON数组采用的就是JavaScript中的数组字面量形式。下面是JavaScript中的数组字面量：
```js
var values = [25, "hi", true];
```
在JSON中，可以采用同样的语法表示同一个数组：
```json
[25, "hi", true]
```
同样要注意，JSON数组也没有变量和分号。把数组和对象结合起来，可以构成更复杂的数据集合，例如：
```json
[
  {
    "title": "Professional JavaScript",
    "authors": [
      "Nicholas C. Zakas"
    ],
    "edition": 3,
    "year": 2011
  },
  {
    "title": "Professional JavaScript",
    "authors": [
      "Nicholas C. Zakas"
    ],
    "edition": 2,
    "year": 2009
  }
]
```
这个数组中包含一些表示图书的对象。每个对象都有几个属性，其中一个属性是"authors"，这个属性的
值又是一个数组。对象和数组通常是JSON数据结构的最外层形式（这不是强制规定的），利用它们能够
创造各种各样的数据结构。

## 解析与序列化
可以把JSON数据结构解析为有用的JavaScript对象。

### JSON对象
JSON对象有两个方法：**stringify()** 和 **parse()**。在最简单的情况下，这两个方法分别用于把
JavaScript对象序列化为JSON字符串和把JSON字符串解析为原生JavaScript值。例如：
```js
var book = {
  "title": "Professional JavaScript",
  "authors": [
    "Nicholas C. Zakas"
  ],
  "edition": 3,
  "year": 2011
};

var jsonText = JSON.stringify(book);

console.log(jsonText);
// 打印出来JSON字符串{"title":"Professional JavaScript","authors":["Nicholas C. Zakas"],"edition":3,"year":2011}
```
默认情况下，JSON.stringify()输出的JSON字符串不包含任何空格字符串或缩进。

在序列化JavaScript对象时，所有函数及原型成员都会被有意忽略，不体现在结果中。值为undefined的任何属性也都会被跳过，结果中最终都是值为有效JSON数据类型的实例属性。

将JSON字符串直接传递给 **JSON.parse()** 就可以得到相应的JavaScript值，就拿上面的变量jsonText来说：
```js
var bookCopy = JSON.parse(jsonText);
console.log(bookCopy); // 打印出一个json数据
```
注意，虽然book与bookCopy具有相同的属性，但它们是两个独立的、没有任何关系的对象。

如果传给JSON.parse()的字符串不是有效的JSON，该方法会抛出错误。

### 序列化选项
`JSON.stringify()`除了要序列化的JavaScript对象外，还可以接收另外两个参数，这两个参数用于指定以不同的方式序列化JavaScript对象。第一个参数是个过滤器，可以是一个数组，也可以是一个函数；第二个参数是一个选项，表示是否在JSON字符串中保留缩进。单独或组合使用这两个参数，可以更全面深入地控制JSON的序列化。

#### 过滤结果
如果过滤器参数是个数组，那么`JSON.stringify()`的结果中将只包含数组中列出的属性。来看下面的例子：
```js
var book = {
  "title": "Professional JavaScript",
  "authors": [
    "Nicholas C. Zakas"
  ],
  "edition": 3,
  "year": 2011
};

var jsonText = JSON.stringify(book, ["title", "edition"]);

console.log(jsonText);
// 返回的结果字符串，只会包含这两个属性{"title":"Professional JavaScript","edition":3}
```
如果第二个参数是函数，行为会稍有不同。传入的函数接收两个参数，属性（键）名和属性值。根据属性（键）名可以知道应该如何处理要序列化的对象中的属性。属性名只能是字符串，而在值并非键值对儿结构的值时，键名可以是空字符串。

为了改变序列化对象的结果，函数返回的值就是相应键的值。不过要注意，如果函数返回了undefined，那么相应的属性会被忽略。来看一个例子：
```js
var book = {
  "title": "Professional JavaScript",
  "authors": [
    "Nicholas C. Zakas"
  ],
  "edition": 3,
  "year": 2011
};

var jsonText = JSON.stringify(book, function(key, value){
  switch(key) {
    case "authors":
      return value.join(",");
    case "year":
      return 5000;
    case "adition":
      return undefined;
    default:
      return value;
  }
});

console.log(jsonText);
// 序列化后的JSON字符串结果 {"title":"Professional JavaScript","authors":"Nicholas C. Zakas","edition":3,"year":5000}
```
要序列化的对象中的每一个对象都要经过过滤器，因此数组中的每个带有这些属性的对象经过过滤之后，每个对象
都只会包含`title`、"authors`和`year`属性。

#### 字符串缩进
`JSON.stringify()`方法的第三个参数用于控制结果中的缩进和空白符。如果这个参数是一个数值，那它表示的是每个级别缩进的空格数。例如，要在每个级别缩进4个空格，可以这样写代码：
```js
var book = {
  "title": "Professional JavaScript",
  "authors": [
    "Nicholas C. Zakas"
  ],
  "edition": 3,
  "year": 2011
};

var jsonText = JSON.stringify(book, null, 4);
```
保存在`jsonText`中的字符串如下所示：
```json
{
    "title": "Professional JavaScript",
    "authors": [
        "Nicholas C. Zakas"
    ],
    "edition": 3,
    "year": 2011
}
```
最大缩进空格数为10，所有大于10的值都会自动转换为10。

如果缩进参数是一个字符串而非数值，则这个字符串将在JSON字符串中被用作缩进字符（不再用空格）。在使用字符串的情况下，可以将缩进字符设置为制表符，或者两个短划线之类的任意字符。
```js
var jsonText = JSON.stringify(book, null, "- -");
```
这样，jsonText中的字符串将变成如下所示：
```json
{
- -"title": "Professional JavaScript",
- -"authors": [
- -- -"Nicholas C. Zakas"
- -],
- -"edition": 3,
- -"year": 2011
}
```
缩进字符串最长不能超过10个字符长。如果字符串长度超过了10个，结果中将只出现前10个字符。

#### toJSON()方法
有时候，`JSON.stringify()`还是不能满足对某些对象进行自定义序列化的需求。可以给对象定义`toJSON()`方法，返回其自身的JSON数据格式。原生Date对象有一个toJSON()方法，能够将JavaScript的`Date`对象自动转换成ISO 8601日期字符串（与在`Date`对象上调用`toISOString()`的结果完全一样）。

可以为任何对象添加toJSON()方法，比如：
```js
var book = {
  "title": "Professional JavaScript",
  "authors": [
    "Nicholas C. Zakas"
  ],
  "edition": 3,
  "year": 2011,
  toJSON: function() {
    return this.title;
  }
};

var jsonText = JSON.stringify(book);

console.log(jsonText); // "Professional JavaScript"
```
以上代码在`book`对象上定义了一个`toJSON()`方法，该方法返回图书的书名。

`toJSON()`可以作为函数过滤器的补充，因此理解序列化的内部顺序十分重要。假设把一个对象传入`JSON.stringify()`，序列化该对象的顺序如下。
1. 如果存在`toJSON()`方法而且能通过它取得有效的值，则调用该方法。否则，返回对象本身。
2. 如果提供了第二个参数，应用这个函数过滤器。传入函数过滤器的值是第1步返回的值。
3. 对第2步返回的每个值进行相应的序列化。
4. 如果提供了第三个参数，执行相应的格式化。

无论是考虑定义`toJSON()`方法，还是考虑使用函数过滤器，亦或需要同时使用两者，理解这个顺序是至关重要的。

### 解析选项
`JSON.parse()`方法也可以接受另一个参数，该参数是一个函数，将在每个键值对上调用。为了区别`JSON.stringify()`接收的替换（过滤）函数（replacer），这个函数被称为还原函数（`reviver`），但实际上这两个函数的签名是相同的————它们都接收两个参数，一个键和一个值，而且都需要返回一个值。

如果还原函数返回`undefined`，则表示要从结果中删除相应的键；如果返回其他的值，则将该值插入到结果中。在将日期字符串转换为`Date`对象时，经常要用到还原函数。例如：
```js
var book = {
  "title": "Professional JavaScript",
  "authors": [
    "Nicholas C. Zakas"
  ],
  "edition": 3,
  "year": 2011,
  releaseDate: new Date(2011, 11, 1)
};

var jsonText = JSON.stringify(book);


var bookCopy = JSON.parse(jsonText, function(key, value){
  if (key == "releaseDate") {
    return new Date(value);
  } else {
    return value;
  }
});

console.log(bookCopy.releaseDate.getFullYear()); // 2011
```
以上代码先是为`book`对象新增了一个`releaseData`属性，该属性保存着一个`Date`对象。该属性保存着一个`Date`对象。这个对象在经过序列化之后变成了有效的`JSON`字符串，然后经过解析又在`bookCopy`中还原为一个`Date`对象。还原函数在遇到`releaseDate`键时，会基于相应的值创建一个新的`Date`对象。结果就是`bookCopy.releaseDate`属性中会保存一个`Date`对象。正因为如此，才能基于这个对象调用`getFullYear()`方法。