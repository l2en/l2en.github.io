#### **基本认识**

---

> RequireJS 和 Sea.js 都是模块加载器，倡导模块化开发理念，核心价值是让 JavaScript 的模块化开发变得简单自然。
>
> + AMD 是 RequireJS 在推广过程中对模块定义的规范化产出。
> + CMD 是 SeaJS 在推广过程中对模块定义的规范化产出。



#### **发展历程: CommonJS --> AMD --> CMD**

---

+ CommonJS适用于服务端，所有模块使用同步加载；不适用于浏览器（require加载模块会导致浏览器假死状态）（**代表作:nodeJS**）
+ AMD根据CommonJS演变而来，AMD属于异步加载，从此浏览器产生模块化开发的思想(**代表作：[RequireJS](https://github.com/requirejs/requirejs)**)
+ CMD(**作者：玉伯**)由阿里前端开发工程师开发的js模块加载器，与AMD出发点一致，为了解决JavaScript 的模块化开发及合理处理模块之间依赖（**代表作：[SeaJS](https://github.com/seajs/seajs/issues/277)**）



#### **解释**

---

**CommonJS**: 为模块化而生的js规范（最初始的js模块化规范）

**AMD（异步模块定义)**: 全称Async、Module、Definition，RequireJS推广中而产生的模块定义规范

**CMD(通用模块定义)**: 由玉伯写SeaJS而产生的模块定义规范



#### **AMD与CMD模块写法**

---

```js
// AMD模块写法  依赖必须一开始就写好
// math.js
define(['./a', './b'], function(a, b) { 
    a.doSomething()
    // 此处略去 100 行
    b.doSomething()
    ...
})
```

```js
// CMD模块写法   依赖就近写
define(function(require, exports, module) {   
    var a = require('./a')   
    a.doSomething()   // 此处略去 100 行   
    var b = require('./b') // 依赖可以就近书写   
    b.doSomething()   
    ... 
})
```

#### **AMD与CMD对模块依赖处理的不同**

------

AMD:对依赖模块进行**预加载**，即：并行加载所有依赖的模块, 并同时解析后, 等待解析完成后再开始执行其他代码

CMD:对依赖模块进行**懒加载**，即：在main.js文件中先加载依赖文件，需要使用到改依赖模块时才会解析；



#### **使用**

---

```js
// 1、下载require.js文件，在html中引入如下script
<script src="js/require.js" data-main="js/main"></script>
```

