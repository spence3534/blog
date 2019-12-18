# HTML5脚本编程
## 跨文档消息传递
跨文档消息传送，简称为**XDM**，指的是来自不同域的页面间传递消息。

**XDM** 的核心是 **postMessage()** 方法。都是为了同一个目的：向另一个地方传递数据。对于XDM而言，
另一个地方指的是包含在当前页面中的`<iframe>`元素，或者由当前页面弹出的窗口。

**postMessage()** 方法接收两个参数：一条消息和一个表示消息接收来自哪个域的字符串。第二个参数对保
障安全通信非常重要，可以防止浏览器把消息发送到不安全的方法。来看下面的例子：
```js
// 所有支持XDM的浏览器也支持iframe的contextWindow属性
var iframe = document.getElementById("iframe").contentWindow;
iframe.postMessage("A secret", "http://www.wrox.com");
```
如果传给 **postMessage()** 的第二个参数是"*"，则表示可以把消息发送给来自任何域的文档，但不推荐这样做。

接收到XDM消息时，会触发window对象的 **message** 事件。这个事件是以异步形式触发的，因此从发送消息到接收消息（触发接收窗口的message事件）可能要经过一段时间的延迟。触发message事件后，传递给onmessage事件对象包含以下三方面的重要消息。
* **data**：作为postMessage()第一个参数传入的字符串数据。
* **origin**：发送消息的文档所在的域，例如"http://www.wrox.com"。
* **source**：发送消息的文档window对象代理。这个代理对象主要用于在发送上一条消息的窗口中调用
  **postMessage()** 方法。如果发送消息的窗口来自同一个域，那这个对象就是window。

接收到消息验证发送窗口的来源是至关重要的。就像给postMessage()方法指定第二个参数，以确保浏览器不会把消息发送给未知页面一样，在onmessage处理程序中检测消息来源可以确保传入的消息来自己知的页面。

基本的检测模式如下：
```js
var iframe = document.getElementById("iframe").contentWindow;
iframe.postMessage("A secret", "http://www.wrox.com");

window.addEventListener("message", function(event) {
  // 确保发送消息的域是已知的域
  if (event.origin == "http://www.wrox.com") {
    // 处理接收到的数据
    processMessage(event.data);

    // 可选：向来源窗口发送回执
    event.source.postMessage("Received", "http://www.biadu.com");
  }
})
```
使用 **postMessage()** 时，最好还是只传字符串。如果你想传入结构化的数据，最佳选择是先在要传入的数据上调用 **JSON.stringify()**，通过 **postMessage()** 传入得到的字符串，然后再在onmessage事件中调用**JSON.parse()**。

## 原生拖放
通过拖放事件，可以控制拖放相关的各个方面。拖动某元素时，将依次触发下列事件：
1. dragstart
2. drag
3. dragend

按下鼠标键并开始移动鼠标时，会在拖放的元素上触发 **dragstart** 事件。此时光标变成"不能放"符号（圆环中一条反斜线），表示不能把元素放到自己上面。

触发 dragstart 事件后，即会触发 **drag** 事件，而且在元素被拖动期间会持续触发该事件。当拖动停止时，会触发 **dragend** 事件。

当某个元素被拖动到一个有效的放置目标上时，下列事件会一次发生：
1. dragenter
2. dragover
3. dragleave或drop

只要有元素被拖动到放置目标上，就会触发 **dragenter** 事件。紧随其后的是 **dragover** 事件，而且在被拖动的元素还在放置目标的范围内移动时，就会持续触发该事件。如果元素被拖出了放置目标，**dragover** 事件不再发生，但会触发 **dragleave** 事件。如果元素被放到了放置目标中，则会触发 **drop** 事件。

### 自定义放置目标
可以把任何元素变成有效的放置目标，方法是重写 **dragenter** 和 **dragover** 事件的默认行为。
```html
<div id="box" draggable="true" class="box"></div>
```
```js
var box = document.getElementById("box");

box.addEventListener("dragover", function(event) {
  event.preventDefault();
  console.log("dragover事件");
});

box.addEventListener("dragenter", function(event) {
  console.log("dragenter事件");
  event.preventDefault();
});

box.addEventListener("dragleave", function(event) {
  console.log("dragleave事件");
});

box.addEventListener("drop", function(event) {
  console.log("drop事件");
})
```
释放鼠标也会触发drop事件。如果想把元素可以被拖动，在元素上设置 **draggable** 设置为true即可。
:::warning 提醒
为了让Firefox支持正常的拖放，还要取消drop事件的默认行为，在使用`<a>`拖放的过程中，阻止它打开URL。
:::

### dataTransfer对象
**dataTransfer** 对象，它是事件对象的一个属性，用于从被拖动元素向放置目标传递字符串格式的数据。因为它是事件对象的属性，所以只能在拖放事件中访问 **dataTransfer** 对象。

**dataTransfer** 对象有两个主要方法：**getData()** 和 **setData()**。
* **setData()**：接收两个参数，第一个参数是"text"和"URL"。第二个参数是设置的对应的文本和url。
* **getData()**：接收一个参数，就是 **setData()** 的第一个参数"text"和"URL"。

请看下面的例子：
```js
var redBox = document.getElementById("redBox");
var blueBox = document.getElementById("blueBox");

// 红色盒子
redBox.addEventListener("dragenter", function(event) {
  event.preventDefault();
  console.log("dragenter事件");
});

redBox.addEventListener("dragover", function(event) {
  event.preventDefault();
  console.log("dragover事件");
});

redBox.addEventListener("dragleave", function() {
  console.log("dragleave事件");
});

redBox.addEventListener("drop", function(event) {
  console.log("drop事件");
  var text = event.dataTransfer.getData("text");
  redBox.innerText = text;
  console.log(redBox.innerText);
});

// 蓝色盒子
blueBox.addEventListener("dragstart", function(event) {
  console.log("dragstart事件");
  event.dataTransfer.setData("text", "Hello world");
});

blueBox.addEventListener("drag", function(event) {
  console.log("drag事件");
});

blueBox.addEventListener("dragend", function(event) {
  console.log("dragend");
});
```
保存在dataTransfer对象中的数据只能在drop事件中读取。如果ondrop事件中没有读到数据，那就是dataTransfer对象已经被销毁，数据也丢失了。

### dropEffect与effectAllowed
利用dataTransfer对象，可不光是能够传输数据，还能通过它来确定被拖动的元素以及作为放置目标的元素能够接收什么操作。为此，需要访问dataTransfer对象的两个属性：**dropEffect** 和 **effectAllowed**。

其中，通过dropEffect属性可以知道被拖动的元素能够执行哪种放置行为。这个属性有下列4个可能的值。
* "none"：不能把拖动的元素放在这里。这是除文本框之外所有元素的默认值。
* "move"：应该把拖动的元素移动到放置目标。
* "copy"：应该把拖动的元素复制到放置目标。
* "link"：表示放置目标会打开拖动的元素（但拖动的元素必须是一个链接，有URL）。

在把元素拖动到放置目标上时，以上每一个值都会导致光标显示为不同的符号。如果你不介入，没有什么会自动地移动、复制，也不会打开链接。总之，浏览器只能帮你改变光标的样式，而其他的都要靠你自己来实现。要使用 **dropEffect** 属性，必须在 **ondragenter** 事件处理程序中针对放置目标来设置它。

**dropEffect** 属性只有搭配 **effectAllowed** 属性才有用。effectAllowed属性表示允许拖动元素的哪种dropEffect，effectAllowed属性可能的值如下：
* "uninitialized"：没有给被拖动的元素设置任何放置行为。
* "none"：被拖动的元素不能有任何行为。
* "copy"：只允许值为"copy"的dropEffect。
* "link"：只允许值为"link"的dropEffect。
* "move"：只允许值为"move"的dropEffect。
* "copyLink"：允许值为"copy"和"link"的dropEffect。
* "copyMove"：允许值为"copy"和"move"的dropEffect。
* "linkMove"：允许值为"link"和"move"的dropEffect。
* "all"：允许任意dropEffect。

必须在ondragstart事件中设置effectAllowed属性。

假设你想允许用户把文本框中的文本拖放到一个`<div>`元素中。必须将dropEffect和effectAllowed设置为"move"，由于`<div>`元素的放置事件的默认行为是什么也不做，所以文本不能自动移动。重写这个默认行为，就能从文本框中移走文本。然后你就可以自己编写代码将文本插入到`<div>`中。如果你将dropEffect和effectAllowed的值设置为"copy"，那就不会自动移走文本框中的文本。

### 其他成员
dataTransfer对象还应该包含下列方法和属性。
* addElement：为拖动操作添加一个元素。添加这个元素只影响数据（即增加作为拖动源而响应回调对象），不会影响拖动操作时页面元素的外观。
* clearData：清除以特定格式保存的数据。
* setDragImage：指定一幅图像，当拖动发生时，显示在光标下方。这个方法接收的三个参数分别是要显示的HTML元素和光标在图像中的x、y坐标。其中，HTML元素可以是一幅图像，也可以是其他元素。是图像则显示图像，是其他元素则显示渲染后的元素。
* types：当前保存的数据类型。这是一个类似数组的集合，以"text"这样的字符串形式保存着数据类型。

## 媒体元素
HTML5新增了两个与媒体相关的标签，这个两个标签是`<audio>`和`<video>`。这两个标签除了能嵌入媒体文件之外，都提供了用于实现常用功能的JavaScriptAPI，允许为媒体创建自定义的控件。这两个元素的用法如下：
```html
<!-- 嵌入视频 -->
<video src="conference.mpg" id="myVideo">Video player not available.</video>

<!-- 嵌入音频 -->
<audio src="song.mp3" id="myAudio">Audio player not available.</audio>
```
使用这两个元素时，至少要在标签中包含src属性，指向要加载的媒体文件。还可以设置width和height属性以指定视频播放器的大小，而为poster属性指定图像的URI可以在加载视频内容期间显示一幅图像。如果标签中有controls属性，则意味着浏览器应该显示UI控件，以便用户直接操作媒体。

因为并非所有浏览器都支持所有媒体格式，所以可以指定多个不同的媒体来源。为此，不用在标签中指定src属性，而是要像下面这样使用一或多个`<source>`元素。
```html
<!-- 嵌入视频 -->
<video id="myVideo">
  <source src="conference.webm" type="video/webm; codecs='vp8 vorbis'">
  <source src="conference.ogv" type="video/ogg; codecs='theora, vorbis'">
  <source src="conference.mpg">
  Video player not available.
</video>

<!-- 嵌入音频 -->
<video id="myAudio">
  <source src="song.ogg" type="audio/ogg">
  <source src="song.mp3" type="audio/mpeg">
  Audio player not available.
</video>
```

### 属性
`<video>`和`<audio>`元素都提供了完善的JavaScript接口。下表列出了这两个元素共有的属性，通过这些属性可以知道媒体的当前状态。
|属性|数据类型|说明|
|----|----|----|
|autoplay|布尔值|取得或设置autoplay标志|
|buffered|时间范围|表示已下载的缓冲的时间范围的对象|
|bufferedBytes|字节范围|表示已下载的缓冲的字节范围的对象|
|bufferingRate|整数|下载过程中每秒钟平均接收到的位数|
|bufferingThrottled|布尔值|表示浏览器是否对缓冲进行了节流|
|controls|布尔值|取得或设置controls属性，用于显示或隐藏浏览器内置的控件|
|currentLoop|整数|媒体文件已经循环的次数|
|currentSrc|字符串|当前播放的媒体文件的URL|
|currentTime|浮点数|已经播放的秒数|
|defaultPlaybackRate|浮点数|取得或设置默认的播放速度。默认值为1.0秒|
|duration|浮点数|媒体的总播放时间（整数）|
|ended|布尔值|表示媒体文件是否播放完成|
|loop|布尔值|取得或设置媒体文件在播放完成后是否再从头开始播放|
|muted|布尔值|取得或设置媒体文件是否静音|
|networkState|整数|表示当前媒体的网络连接状态：0表示空，1表示正在加载，2表示正在加载元数据，3表示已经加载了第一帧，4表示加载完成|
|paused|布尔值|表示播放是否暂停|
|playbackRate|浮点数|取得或设置当前的播放速度。用户可以改变这个值，让媒体播放速度变快或变慢。|
|played|时间范围|到目前为止已经播放的时间范围|
|readyState|整数|表示媒体是否已经就绪（可以播放了）。0表示数据不可用，1表示可以显示当前帧, 2表示可以开始播放, 3表示媒体可以从头到尾播放|
|seekable|时间范围|可以搜索的时间范围|
|seeking|布尔值|表示播放器是否正移动到媒体文件中的新位置|
|src|字符串|媒体文件的来源。任何时候都可以重写这个属性|
|start|浮点数|取得或设置媒体文件中开始播放的位置，以秒表示|
|totalBytes|整数|当前资源所需的总字节数|
|videoHeight|整数|返回视频（不一定是元素）的高度。只适用于`<video>`|
|videoWidth|整数|返回视频（不一定是元素）的宽度。只适用于`<video>`|
|volume|浮点数|取得或设置当前音量，值为0.0到1.0|

其中很多属性也可以直接在`<audio>`和`<video>`元素中设置。

### 事件
除了大量属性之外，这两个媒体元素还可以触发很多事件。这些事件监控着不同的属性的变化，这些变化
可能是媒体播放的结果，也可能是用户操作播放器的结果。下表列出了媒体元素相关的事件。
|事件|触发时机|
|----|----|
|abrot|下载中断|
|canplay|可以播放时；readyState值为2|
|canplaythrough|播放可继续，而且应该不会中断；readyState值为3|
|canshowcurrentframe|当前帧已经下载完成；readyState值为1|
|dataunavailable|因为没有数据而不能播放；readyState值为0|
|durationchange|duration属性的值改变|
|emptied|网络连接关闭|
|empty|发生错误阻止了媒体下载|
|ended|媒体已播放到末尾，播放停止|
|error|下载期间发生网络错误|
|load|所有媒体已加载完成。这个事件可能会被废弃，建议使用canplaythrough|
|loadeddata|媒体的第一帧已加载完成|
|loadedmetadata|媒体的元数据已加载完成|
|loadstart|下载已开始|
|pause|播放已暂停|
|play|媒体已接收到指令开始播放|
|playing|媒体已实际开始播放|
|progress|正在下载|
|ratechange|播放媒体的速度改变|
|seeked|搜索结束|
|seeking|正移动到新位置|
|stalled|浏览器尝试下载，但未接收到数据|
|timeupdate|currentTime被以不合理或意外的方式更新|
|volumechange|volume属性值或muted属性值已改变|
|waiting|播放暂停，等待下载更多数据|

### 自定义媒体播放器
使用`<audio>`和`<video>`元素的 **play()** 和 **pause()**方法，可以手工控制媒体文件的播放。
组合使用属性、事件和这两个方法，很容易创建一个自定义的媒体播放器，如下面的例子所示。
```html
<div class="mediaplayer">
  <div class="video">
    <video
      id="player"
      src="movie.mov"
      poster="mymovie.jpg"
      width="300"
      height="300"
    >
    Video player not available
    </video>
  </div>
  <div class="controls">
    <input type="button" value="Play" id="video-btn">
    <span id="curtime">0</span>/ <span id="duration">0</span>
  </div>
</div>
```
以上基本的HTML再加上一些JavaScript就可以变成一个简单的视频播放器。以下是JavaScript代码。
```js
// 取得元素的引用
var player = document.getElementById("player"),
    btn = document.getElementById("video-btn"),
    curtime = document.getElementById("curtiem"),
    duration = document.getElementById("duration");

// 更新播放时间
duration.innerHTML = player.duration;

btn.addEventListener("click", function(event){
  if (player.paused) {
    player.play();
  } else {
    player.pause();
    btn.value = "Play";
  }
});

// 定时更新当前时间
setInterval(function() {
  curtime.innerHTML = player.currentTime;
}, 250)
```

### 检测编解码的支持情况
有一个JavaScript API能检测浏览器是否支持某种格式和编解码器。这两个媒体元素都有一个 **canPlayType()**，
该方法接收一种格式/编解码器字符串，返回"probably"、"maybe"或""（空字符串），空字符串是假值。
```js
if (audio.canPlayType("audio/mpeg")) {
  // 进一步处理
}
```
而"probably"和"maybe"都是真值，因此在if语句的条件测试中可以转换成true。

### Audio类型
`<audio>`元素还有一个原生的JavaScript构造函数Audio，可以在任何时候播放音频。看下面的例子：
```js
var audio = new Audio("sound.mp3");
audio.addEventListener("canplaythrough", function(event){
  audio.play();
})
```
创建新的Audio实例即可开始下载指定的文件。下载完成后，调用play()就可以播放音频。

## 历史状态管理
通过状态管理API，能够在不加载新页面的情况下改变浏览器的URL。需要使用 **history.pushState()** 方法，该方法可以接收三个参数：状态对象、新状态的标题和可选的相对URL。
```js
history.pushState({name:"xiaoli"}, "xiaoli page", "index.html");
```
执行 **pushState()** 方法后，新的状态信息就会被加入历史状态栈，而浏览器地址栏也会变成新的相对URL。但是，浏览器并不会真的向服务器发送请求，即使状态改变之后查询location.href也会返回与地址栏中相同的地址。另外，第二个参数完全可以只传入一个空字符串，或者一个短标题也可以。而第一个参数则应该尽可能提供初始化页面状态所需的各种信息。

因为 **pushState()** 会创建新的历史状态，所以你会发现 “后退” 按钮也能使用了。按下 “后退” 按钮，会会触发window对象的popstate事件。popstate事件的事件对象有一个state属性，这个属性就包含着当初以第一个参数传递给pushState()的状态对象。
```js
window.addEventListener("popstate", function(event) {
  var state = event.state;

  if (state) { // 第一个页面加载时state为空
    processState(state);
  }
})
```
:::warning 警告
记住，浏览器加载的第一个页面没有状态，因此单击 “后退” 按钮返回浏览器加载的第一个页面时，event.state值为null。
:::

要更新当前状态，可以调用 **replaceState()**，传入的参数与pushState()的前两个参数相同。
调用这个方法不会在历史状态栈中创建新状态，只会重写当前状态。
```js
history.replaceState({name: "Greg"}, "Greg s page");
```