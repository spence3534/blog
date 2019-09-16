# 引用类型

## object类型
对象是某个特定引用类型的实例。新对象是使用new操作符后跟一个构造函数来创建的。构造函数本身就是一个函数，只不过该函数是出于创建新对象的目的而定义的。
```js
var person = new Object();
// 这段代码创建了object引用类型的一个新实例，然后把该实例保存在了变量person中。
// 使用的构造函数是Object，它只为新对象定义了默认的属性和方法。 
```
#### object是ECMAscript中使用最多的一个类型。
创建object实例的方式有两种。第一种是使用new操作符后跟object构造函数，请看下面的例子
```js
var person = new Object();
person.name = "xiaoli";
person.age = 21;
console.log(person)// age=21 name=xiaoli
```
第二种方式是使用对象字面量表示法。对象字面量是对象定义的一种简写方式，目前在简化创建包含大量属性的对象的过程。请看下面这个例子
```js
var person = {
  name:"xiaoli",
  age:29
}
console.log(person) //{name: "xiaoli", age: 29}
```
虽然可以使用前面介绍的任何一种方法来定义对象，但是开发人员更青睐对象字面量语法因为这种语法要求的代码量少，而且能够给人封装数据的感觉，实际上，对象字面量也是向函数传递大量可选参数的首选方式

**下面这个例子中**，函数displayInfo()接受一个名为args的参数。这个参数可能带有一个名为name或age的属性，也可能这两个属性都有或者都没有。在这个函数内部，我们通过typeof操作符来检测每个属性是否存在，然后再基于相应的属性来构建一条要显示的消息。然后我们调用了两次这个函数，每次都使用一个对象字面量来指定不同的数据。这两次调用传递的参数虽然不同，但函数都能正常执行。
```js
function displayInfo (args) {
  var output = '';
  if (typeof args.name === "string") {
    output += 'Name：' + args.name + "\n"
  }
  if(typeof args.age === "number") {
    output += "Age：" + args.age + "\n"
  }
  console.log(output)//Name：xiaoli Age：29  Name：xiaolun
}
displayInfo({
  name:'xiaoli',
  age:21
})
displayInfo({
  name: "xiaolun"
})
```
## Array类型
除了object之外，Array类型恐怕是ECMAscript中最常用的类型了，而且与其他多数语言中的数组有着相当大的区别，虽然与其他语言中的数组都是数据的有序列表但是与其他语言不同的是，ECMAscript数组的每一项可以保存任何类型的数据。也就是说，可以用数组的第一个位置保存字符串，第二个位置来保存数值,第三个位置来保存对象，ECMAscript数组的大小是可以动态调整的，即可以随着数据的添加自动增长以容纳新增数据。

创建数组的基本方式有两种。第一种是使用Array构造函数，看下面的例子:
```js
var colors = new Array();
console.log(colors); //Array(0)
```

如果提前想知道数组要保存的项目数量，也可以给构造函数传递该数量，而该数量会自动变成length属性的值，下面的代码将创建length值为20的数组。
```js
var colors = new Array(20);
console.log(colors) //(20);
```

也可以向Array构造函数传递数组中应该包含的项。以下代码创建了一个包含3个字符串值的数组:
```js
var colors = new Array("red","blue","green");
console.log(colors) //["red", "blue", "green"]
```
当然，给构造函数创建一个值也可以创建数组。但这时候问题就复杂一点了，因为如果传递的是数值，则会按照该数值创建包含给定项数的数组，而如果传递的是其他类型的参数，则会创建包含那个值的只有一项的数组。请看下面的例子：
```js
var colors = new Array(3);  //创建一个包含3项的数组
var names = new Array("green"); //创建一个包含1项，即字符串"green"的数组
console.log(colors); //(3)
console.log(names); //["green"]

// 另外，在使用Array构造函数时也可以省略new操作符。下面这个例子等价于上面的例子：
var colors = Array(3);
var names = Array("green");
console.log(colors);
console.log(names);
```

创建数组的第二种基本方式是使用数组字面量表示法。数组字面量由一对包含数组项的方括号表示，多个数组项之间以逗号隔开
```js
var colors = ["red","green","blue"];
var names = [];
console.log(colors); // Array(3)
console.log(names); // Array(0)
```

在读取和设置数组的值时，要使用方括号并提供相应值的基于0的数字索引，看下面的例子：
```js
var colors = ["red","green","blue"];
console.log(colors[0]); //显示第一项
colors[2] = "black"; //修改第三项
colors[3] = "brown"; //新增第四项 因为是从0开始 所以color[3]实际上是第四位
console.log(colors) //["red", "green", "black", "brown"]
```
在数组的项数保存在其length属性中，这个属性始终会返回0或更大的值。看下面的例子：
```js
var colors = ["red","green","blue"];
var names = [];
console.log(colors.length); //3
console.log(names.length); //0
```
数组length属性很有特点----它不只是读的。通过设置这个属性，可以从数组的末尾移
除项或向数组添加新项。看下面的例子。
```js
var colors = ["red","blue","green"];
colors.length = 2;
console.log(colors[2]); //undefined
```
在上面例子中的数组一开始有3个值，将其length属性设置为2会移除最后一项，结果再
访问colors[2]就会显示undefined了。如果将其length设置为大于数组项数的值，则
新增的每一项都会取得undefined，如下所示:
```js
var colors = ["red","blue","green"];
colors.length = 4
console.log(colors[3]); //undefined
// 在此，虽然colors数组包含3个项，但把它的length属性设置成了4。这个数组不存在位置3，所以访问这个位置的值就得到了undefined。
```
利用length属性也可以方便在数组末尾添加新项，如下所示:
```js
var colors = ["red","blue","green"];
colors[colors.length] = "black"; //在位置3添加了一种颜色
colors[colors.length] = "brown"; //在位置4添加了一种颜色
console.log(colors); // ["red", "blue", "green", "black", "brown"]
```
由于数组最后一项的索引始终是length-1，因此下一个新项的位置就是length。每当在数组末尾添加一项后，其length属性都会自动更新以反应这一变化。也就是说，上面的例子第二行中的colors[colors.length]为位置3添加了一个值，最后一行的colors[colors.length]则为位置4添加了一个值。当把一个值放在超出当前数组大小的位置上时，数组就会重新计算其长度值，即长度值等于最后一项的索引加1，如下面所示：
```js
var colors = ["red","blue","green"];
colors[99] = "black";
console.log(colors.length); //100
// 在这个例子中，我们向colors数组的位置99插入了一个值，结果数组新长度(length)就是100(99+1)。而位置3到位置98实际上都是不存在的，所以访问它们都将返回undefined
```
### 检查数组
确定某个对象是不是数组的经典问题。对于一个网页，或者一个全局作用域而言，使用instanceof操作符就能得到满意的结果:
```js
if (value instanceof Array) {
  // 对数组执行某些操作
}
```
instanceof操作符的问题在于，它假定只有一个全局执行环境。如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的Array构造函数。如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数。为了解决这个问，ECMAScript新增了Array.isArray()方法。这个方法的目的是最终确定某个值到底是不是数组，而不管它是在哪个全局执行环境中创建的，这个方法的用法如下：
```js
if (Array.isArray(value)) {
  // 对数组执行某些操作
}
```
### 转换方法
如前所述，所有对象都具有toLocaleString()，toString()和valueof()方法。其中调用valueof()返回的还是数组本身，而调用数组的toString()方法会返回由数组中每一个只的字符串形式拼接而成的一个以逗号分隔的字符串。实际上，为了创建这个字符串会调用数组每一项的toString()方法。

这个例子中，我们首先显式地调用toString()方法，以便返回数组的字符串表示，每个值的字符串表示拼接成了一个字符串，中间以逗号分隔。接着调用valueOf()方法，而最后一行代码直接将数组传递给了alert()。由于alert()要接收字符串参数，所以它会在后台调用toString()方法，由此会得到与直接调用toString()方法相同结果。
```js
var colors = ["red","blue","green"];
console.log(colors.toString()); //red,blue,green
console.log(colors.valueOf()); //["red", "blue", "green"]
alert(colors); //red,blue,green
```
另外，toLocaleString()方法经常也会返回与toString()和valueOf()方法相同的值，但也不总是如此，当调用数组的toLocaleString()方法时，它也会创建一个数组值的以逗号分隔的字符串。而与前两个方法唯一的不同之处在于，这一次为了取得每一项的值，调用的是每一项的toLocaleString()，而不是toString()方法。请看下面这个例子：
```js
var person1 = {
  toLocaleString: function () {
    return "xiaoli";
  },     
  toString: function () {
    return "xiaozhu";
  }
};
var person2 = {
  toLocaleString: function () {
    return "xiaohong";
  },
  toString: function () {
    return "xiaoming";
  }
};
var people = [person1,person2];
alert(people); //xiaozhu,xiaoming
alert(people.toString()); //xiaozhu,xiaoming
alert(people.toLocaleString()); //xiaoli,xiaohong
```
在这个例子里定义了两个对象:person1和person2。而且还分别为每一个对象定义了一个toString()方法和一个toLocaleString()方法，这两个方法返回不同的值。然后，创建一个包含前面定义的两个对象的数组。在将数组传递给alert()时，输出结果是"xiaozhu,xiaoming"因为调用了数组每一项的toString()方法（同样，这与下一行显式调用toString()方法得到的结果相同）。而当调用数组的toLocaleString()方法时，输出结果是"xiaoli,xiaohong",原因是调用了数组每一项的toLocaleString()。


如果使用join()方法，则可以使用不同的分隔符来构建这个字符串。join()方法只接收一个参数，即用作分隔符的字符串，然后返回包含所有数组项的字符串。下面的例子:
```js
var colors = ["red","blue","green"];
console.log(colors.join(",")); //red,blue,green
console.log(colors.join("||")); //red||blue||green
```
这里，我们使用了join()方法重现了toString()方法输出。在传递逗号的情况下，得到了以逗号分隔的数组值。而在最后一行代码中，我们传递了双竖线符号，结果就得到了字符串"red||blue||green"。如果不给join()方法传入任何值，或者给它传入undefined，则使用逗号作为分隔符。
### 栈方法
数组可以表现得就像栈一样，后者是一种可以限制插入和删除项的数据结构。栈是一种LIFO(后进先出)的数据结构，也就是最新添加的项最早被移除，而栈中项的插入(叫做推入)和移除(叫做弹出)，只发生在一个位置-----栈的顶部。ECMAscript为数组专门提供了push()和pop()方法，以便实现类似栈的行为。

push()方法可以接收任何数量的参数，把它们逐个添加到数组末尾，并返回修改后数组的长度。而pop()方法则从数组末尾移除最后一项，减少数组的length值，然后返回移除的项，请看下面的例子:
```js
var colors = new Array(); //创建一个数组
var count = colors.push("red","blue"); //推入两项
console.log(count); // 2
count = colors.push("green"); // 推入另一项
console.log("count",count); //3

var item = colors.pop(); // 取得最后一项
console.log("item",item); // "green"
console.log(colors.length); //2

// 数组可以看成是栈(代码本身没什么区别，而push()和pop()都是数组默认的方法)  
// 可以将栈方法与其他数组方法连用，像下面的例子一样。
var colors = ["red", "blue"];
colors.push("brown"); // 添加一项
colors[3] = "black"; // 添加一项
console.log(colors.length); //4

var item = colors.pop(); // 取得最后一项
console.log(item); //black
// 在此，我们首先用两个值来初始化一个数组。然后，使用push()添加第三个值，再通过直接在位值3上赋值
// 来添加第四个值。而在调用pop()时，该方法返回了字符串"black"，即最后一个添加到数组的值
```
### 队列方法
队列数据结构的访问规则是(先进先出)。队列的列表的末端添加项，从列表的前端移除项。由于push()是向数组末端添加项的方法，因此要模拟队列只需要一个从数组前端取得项的方法。使用shift()就是实现这一操作的数组方法。它能够移除数组中的第一项并返回该项，同时将数组长度减1。结合使用shift()和push方法，可以像使用队列一样使用数组。

这个例子首先使用push()方法创建了一个包含3个颜色名称的数组。代码中加粗的那一行使用shift()方法从数组中取得了第一项，即"red"。在移除第一项之后，"green"就变成了第一项而"black"则变成了第二项，数组也只包含两项了。
```js
var colors = new Array(); //创建一个数组
var count = colors.push("red","green"); //添加两项
alert(count); //2
count = colors.push("black"); // 添加一项
alert(count); //3
var item = colors.shift(); // 取得第一项
alert(item); //red 
alert(colors.length); //2
```

ECMAscript还为数组提供了一个unshift()方法。顾名思义，unshift()与shift()的用途相反:它能在数组前端添加任意个项并返回新数组的长度。因此，同时使用unshift()和pop()方法，可以从相反的方向来模拟队列，即在数组的前端添加项，从数组末端移除项，请看下面的例子:
```js
var colors = new Array(); //创建一个数组
var count = colors.unshift("red","green"); //推入两项
console.log(count); //2

count = colors.unshift("black"); //推入另一项
console.log(count); //3

var item = colors.pop(); //取得最后一项
console.log(item); //green
console.log(colors.length) //2
```
### 重排序方法
## Date类型
## RegExp类型
## Funciton类型