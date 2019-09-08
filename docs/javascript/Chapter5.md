# 引用类型

## object类型
对象是某个特定引用类型的实例。新对象是使用new操作符后跟一个构造函数来创建的。构造函数本身就是一个函数，只不过该函数是出于创建新对象的目的而定义的。
```js
var person = new Object();
// 这段代码创建了object引用类型的一个新实例，然后把该实例保存在了变量person中。
// 使用的构造函数是object，它只为新对象定义了默认的属性和方法。 
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

## Date类型
## RegExp类型
## Funciton类型