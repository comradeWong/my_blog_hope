---

title: 美腾面试题实录
description: 美腾面试题实录
icon: newspaper
isOriginal: false
date: 2020/03/09 06:00:00
category:
 - 面试题
tag:
 - interview
sticky: false
article: true
timeline: true
cover: https://fastly.jsdelivr.net/gh/comradeWong/ImageStorageService@master/img/202311171551902.png

---

> 1.vue项目中遇到的难题？
> 2.说一下组件传参的类型
> 3.html的存储方式
> 4.promise的方式？
> 5.说一下ES6
> 6.哈希和history的区别
> 7.http请求的一些（值？类似404
500的）
> 8.vuex的几种方法
> 9.vue-router的两种路由跳转
> 10.vue生命周期及特点
> 11.说一下知道的几种数组原生方法
> 12.跨域以及跨域的解决方法
> 13.获得对象属性的方法




---

# vue项目中遇到的难题？

- 使用eventBus传值时，$emit 和$on方法是存在先后顺序的，必须是$on事件监听的绑定要在$emit事件发送之前建立，否则就是能监听到事件，但是传递的值也会丢失。
- js的异步编程的问题。
- Vue中数据更新，但是dom没有被更新的问题（vm.$set()解决）
- watch监听object时，需要进行深度监听，因为vue默认只监听data中的属性一级。
# 说一下组件传参的方式
## 1.Vuex

      - 优点
         - 解决了多层组件之间繁琐的事件传播。
         - 解决了多组件依赖统同一状态的问题。
         - 单向数据流
         - 为Vue量身定做，学习成本不高
      - 缺点
         - 不能做数据持久化，刷新页面就要重制，要做数据持久化可以考虑使用localstorage。
         - 增加额外的代码体积，简单的业务场景不建议使用。
## 2.EventBus


```javascript
// bus.js
import Vue from 'vue'
export default new Vue({})

// component-a.js
import bus from './bus.js'
export default {
  created () {
    bus.$on('event-name', (preload) => {
      // ...
    })
  }
}

// component-b.js
import bus from './bus.js'
export default {
  created () {
    bus.$emit('event-name', preload)
  }
}
```

      - 优点
         - 解决了多层组件之间繁琐的事件传播。
         - 使用原理十分简单，代码量少。
      - 缺点
         - 由于是都使用一个Vue实例，所以容易出现重复触发的情景，例如：
            1. 多人开发时，A、B两个人定义了同一个事件名。
            1. 两个页面都定义了同一个事件名，并且没有用$off销毁（常出现在路由切换时）。
            1. 在for出来的组件里注册。
         - 项目一大用这种方式管理事件会十分混乱，这时候建议用vuex。



## 3.props和$emit/$on
这个我想不用赘述了，这是最基本的组件之间传值的方式。

      - 优点
         - 使用最为简单，也是父子组件传递最常见的方法。
         - Vue为给props提供了类型检查支持。
         - $emit不会修改到别的组件的同名事件，因为他只能触发父级的事件，这里和event-bus不同
      - 缺点
         - 单一组件层级一深需要逐层传递，会有很多不必要的代码量。
         - 不能解决了多组件依赖统同一状态的问题。



$attrs/$listeners可以将父组件的props和事件监听器继承给子元素，在子组件可以调用到父组件的事件和props
[$attrs使用传送门](https://cn.vuejs.org/v2/guide/components-props.html#%E7%A6%81%E7%94%A8%E7%89%B9%E6%80%A7%E7%BB%A7%E6%89%BF)
[$listeners使用传送门](https://cn.vuejs.org/v2/guide/components-custom-events.html#%E5%B0%86%E5%8E%9F%E7%94%9F%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A%E5%88%B0%E7%BB%84%E4%BB%B6)
    
## 4.provide/inject
在父组件上通过provide提供给后代组件的数据/方法，在后代组件上通过inject来接收被注入的数据/方法。
### 使用方法
[官方传送门](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5)
### 优缺点

      - 优点
         - 不用像props一层层传递，可以跨层级传递。
      - 缺点
         - 用这种方式传递的属性是非响应式的，所以尽可能来传递一些静态属性。
         - 引用官网的话是`它将你的应用以目前的组件组织方式耦合了起来，使重构变得更加困难。`，我对这句话的理解是用了provide/inject你就要遵循它的组件组织方式，在项目的重构时如果要破坏这个组织方式会有额外的开发成本，其实event-bus也有这个问题。
## 5.slot
### 介绍
你可以在组件的html模版里添加自定义内容，这个内容可以是任何代码模版，就像：


```vue
<navigation-link url="/profile">
  <!-- 添加一个 Font Awesome 图标 -->
  <span class="fa fa-user"></span>
  Your Profile
</navigation-link>
复制代码
```


> 父组件模板的所有东西都会在父级作用域内编译；子组件模板的所有东西都会在子级作用域内编译。

你也可以通过`slot-scope`属性来实现从子组件将一些信息传递给父组件，注意这个属性是vue2.1.0+新增的。
### 使用方法
[官方传送门](https://cn.vuejs.org/v2/guide/components-slots.html#%E6%8F%92%E6%A7%BD%E5%86%85%E5%AE%B9)
### 优缺点

      - 优点
         - 可以在父组件里自定义插入到子组件里的内容，虽然其他属性也可以，但是我觉得slot更倾向于自定义的条件是来自于父容器中。
         - 复用性好,适合做组件开发。
      - 缺点
         - 和props一样不支持跨层级传递。



## 6.$parent/$children
### 介绍
通过$parent/$children可以拿到父子组件的实例，从而调用实例里的方法，实现父子组件通信。并不推荐这种做法。
### 使用方法
通过`this.$parent`或者`this.$children`拿到父或子组件实例。[官方传送门](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E8%AE%BF%E9%97%AE%E7%88%B6%E7%BA%A7%E7%BB%84%E4%BB%B6%E5%AE%9E%E4%BE%8B)
### 优缺点

      - 优点
         - 可以拿到父子组件实例，从而拥有实例里的所有属性。
      - 缺点
         - 用这种方法写出来的组件十分难维护，因为你并不知道数据的来源是哪里，有悖于单向数据流的原则
         - `this.$children`拿到的是一个数组，你并不能很准确的找到你要找的子组件的位置，尤其是子组件多的时候。



# html的存储方式
## localStorage
### 存储方式
以键值对(Key-Value)的方式存储，永久存储，永不失效，除非手动删除。
### 大小
每个域名5M
### 支持情况

![](https://cdn.nlark.com/yuque/0/2020/jpeg/711095/1586702956274-458648b6-fd2c-4686-a5c3-30f0dcc36f75.jpeg#align=left&display=inline&height=152&margin=%5Bobject%20Object%5D&originHeight=152&originWidth=637&size=0&status=done&style=none&width=637)
注意：IE9 localStorage不支持本地文件，需要将项目署到服务器，才可以支持！

## sessionStorage

HTML5 的本地存储 API 中的 localStorage 与 sessionStorage 在使用方法上是相同的，区别在于 sessionStorage 在关闭页面后即被清空，而 localStorage 则会一直保存。
## cookies
h5之前，存储主要是用cookies。cookies缺点有在请求头上带着数据，大小是4k之内。主Domain污染。
主要应用：购物车、客户登录
对于IE浏览器有UserData，大小是64k,只有IE浏览器支持。
## Web sql
关系数据库，通过SQL语句访问
Web SQL 数据库 API 并不是 HTML5 规范的一部分，但是它是一个独立的规范，引入了一组使用 SQL 操作客户端数据库的 APIs。
## IndexDB
索引数据库 (IndexedDB) API（作为 HTML5 的一部分）对创建具有丰富本地存储数据的数据密集型的离线 HTML5 Web 应用程序很有用。同时它还有助于本地缓存数据，使传统在线 Web 应用程序（比如移动 Web 应用程序）能够更快地运行和响应。
## application cache
本地缓存应用所需的文件

## 参考网址
[https://www.cnblogs.com/LuckyWinty/p/5699117.html](https://www.cnblogs.com/LuckyWinty/p/5699117.html)

# promise的方式？

先说是什么，Promise函数是ES6 异步编程的一个方案，它的出现解决了回调地狱的问题。
在执行中，他会同步执行传入的函数，不会执行注册.then() 回调中的函数。同步代码执行完了之后，才会在事件循环中检测是否有可用的promise回调，如果有，则执行，如果没有，进入下一个事件循环。
```javascript
// 我需要 买菜、做饭、给虚空的女朋友送饭、完事了之后打电话给我妈

function buyVegetables(resolve) {
  setTimeout(() => {
    resolve(["西红柿", "鸡蛋", "面条"]); // 我要做番茄鸡蛋面
  }, 3000);
}

function cook(resolve) {
  setTimeout(() => {
    resolve({
      main: "西红柿鸡蛋面",
    });
  }, 5000);
}

function transport(resolve) {
  resolve("虚空的女朋友加油！");
}

function call() {
  console.log("妈 ！ 我有女朋友了！");
}

let howToGotAGirlFriend = new Promise(buyVegetables)
  .then((value) => {
    return new Promise(cook); // 做饭
  })
  .then((noodles) => {
    return new Promise(transport); // 送给虚空女朋友
  })
  .then((gangbadei) => {
    call();
  });
```
(参考博文：[面试精选之Promise](https://juejin.im/post/5b31a4b7f265da595725f322#heading-7))
# 说一下ES6
ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。
![es6](https://raw.githubusercontent.com/comradeWong/ImageStorageService/master/img/es6%E6%A0%B8%E5%BF%83%E7%89%B9%E6%80%A7.png)

## ECMAScript 和 Javascript 的关系
ECMAScript 和 JavaScript 的关系是，前者是后者的规格，后者是前者的一种实现。
## ES6 和 ECMAScript 2015 的关系
ES6 既是一个历史名词，也是一个泛指，含义是 5.1 版以后的 JavaScript 的下一代标准，涵盖了 ES2015、ES2016、ES2017 等等，而 ES2015 则是正式名称，特指该年发布的正式版本的语言标准。
## 值得一看的参考资料
[ES6核心特性](https://juejin.im/post/5b037b536fb9a07aa9260b39)
[ES6、ES7、ES8特性一锅炖(ES6、ES7、ES8学习指南)](https://juejin.im/post/5b9cb3336fb9a05d290ee47e)
# Vue router 中 hash 和 history 的区别？
vue 是渐进式前端开发框架，为了实现 SPA ，需要引入前端路由系统（vue-router）。
前端路由的核心是：改变视图的同时不会向后端发出请求。
为了达到这一目的，浏览器提供了 hash 和 history 两种模式。
最直观的区别就是在url中`hash`带了一个很丑的 `#` ，而`history`是没有`#`的。vue`默认`使用hash。
## hash mode
地址栏 URL 中的 # 符号，比如这个 URL：https://www.shenhuishan.com/#/home, hash的值为 #/home。
它的`特点`在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全`没有影响`，因此改变 hash `不会`重新加载页面。
### 原理
hash 模式的原理是 onhashchange 事件，可以在 window 对象上监听这个事件
## history mode
history 利用了 html5 history interface 中新增的`pushState()` 和 `replaceState()` 方法。这两个方法应用于浏览器记录栈，在当前已有的 back、forward、go 基础之上，它们提供了对历史记录修改的功能。只是当它们执行修改时，虽然改变了当前的 URL ，但浏览器不会立即向后端发送请求。
### 原理
hashchange 只能改变 # 后面的代码片段，history api （pushState、replaceState、go、back、forward） 则给了前端完全的自由，通过在window对象上监听popState()事件。

## 总结
> 1. 通过`history中`，丢掉了`#`，但是：`不怕前进，不怕后退，就怕刷新`，刷新是实实在在地去`请求`服务器的。

> 1. 在`hash`模式下，前端路由修改的是#中的信息，而浏览器请求时`不会`将 # 后面的数据发送到后台，所以没有问题。但是在history下，你可以自由的修改path，当刷新时，如果服务器中没有相应的响应或者资源，则会刷新出来404页面。




(推荐一篇文章：[https://www.jianshu.com/p/3fcae6a4968f](https://www.jianshu.com/p/3fcae6a4968f))
# http状态码？
## HTTP状态码（常见）
当浏览者访问一个网页时，浏览者的浏览器会向网页所在服务器发出请求。当浏览器接收并显示网页前，此网页所在的服务器会返回一个包含HTTP状态码的信息头（server header）用以响应浏览器的请求。
HTTP状态码的英文为HTTP Status Code。
下面是常见的HTTP状态码：

- 200 - 请求成功
- 301 - 资源（网页等）被永久转移到其它URL
- 404 - 请求的资源（网页等）不存在
- 500 - 内部服务器错误
## HTTP状态码分类
HTTP状态码由三个十进制数字组成，第一个十进制数字定义了状态码的类型，后两个数字没有分类的作用。HTTP状态码共分为5种类型：
1xx：信息，服务器收到请求，需要请求继续执行操作。
2xx：成功，操作被成功接收并处理。
3xx：重定向，需要进一步的操作以完成请求。
4xx：客户端错误，请求包含语法错误或无法完成请求。
5xx：服务器错误，服务器在处理请求的过程中发生了错误。
## HTTP部分状态码
100：Continue --- 继续。客户端应继续其请求。
200：OK --- 请求成功。一般用于GET与POST请求。
301：Moved Permanently --- 永久重定向。
302：Found --- 暂时重定向。
400：Bad Request --- 客户端请求的语法错误，服务器无法理解。
403：Forbideen --- 服务器理解请求客户端的请求，但是拒绝执行此请求。
404：Not Found --- 服务器无法根据客户端的请求找到资源（网页）。
500：Internal Server Error --- 服务器内部错误，无法完成请求。
502：Bad Gateway --- 作为网关或者代理服务器尝试执行请求时，从远程服务器接收到了一个无效的响应。
# vuex的几种方法
## 概念
**vuex 的几个核心概念Store：**Vuex 使用一个 Store 对象管理应用的状态，一个 Store 包括 State, Getter, Mutation, Action 四个属性。
**State**：State 意为“状态”，是 vuex 状态管理的数据源。
**Getter**：Getter 的作用与 filters 有一些相似，可以将 State 进行过滤后输出。
**Mutation**：Mutaion 是 vuex 中改变 State 的唯一途径（严格模式下），并且只能是同步操作。Mutaion 使得状态变得可追踪，配合一些 devtools 可以实现 time-travel 的调试体验。
**Action**：一些对 State 的异步操作可以放在 Action 中，并通过在 Action 提交 Mutaion 变更状态。
**Module**：当 Store 对象过于庞大时，可根据具体的业务需求分为多个 Module。

## 调用方法
vue 项目中 会将Store添加到Vue的原型链中，所以可以使用this.$store来进行调用。



| 调用 | 方法 | 语法糖（辅助函数） | 定义位置 |
| --- | --- | --- | --- |
| state | this.$store.state[模块名].token | mapState | computed |
| getters | this.$store.getters. xxx | mapGetters | computed |
| mutations | this.$store.commit('', value) | mapMutations | methods |
| actions | this.$store.dispatch('', value) | mapActions | methods |

```javascript
<script>
import { mapState , mapMutations , mapActions , mapGetters  } from 'vuex';
export default {
  data(){
    return{

    }
  },
  computed:{
    ...mapState({
      counts:(state) => state.count
    }),
    //mapState就等于下面这个
    // counts(){
    //   return this.$store.state.count
    // },
    ...mapGetters({
      getternum:'doneTodos'
    }),
    //mapGetters就等于下面的这个
    // getternum(){
    //   return this.$store.getters.doneTodos
    // }

  },
  methods:{
    ...mapMutations({
      addnum:'addNum'
    }),
    addnum1(){
      this.addnum()
    },
    //mapMutations就等于下面的这个
    // addnum1(){
    //   this.$store.commit('addNum')
    // },
    
    ...mapActions({
      actionnum:'actionNumAdd'
    }),
    actionnum6(){
      this.actionnum()
    },
    //mapActions就等于下面的这个
    //  actionnum6(){
    //   this.$store.dispatch('actionNumAdd')
    // }
    
  }
}
</script>
```


# vue-router的两种路由跳转
## router-link
### 1.不带参数
```vue

<router-link :to="{name:'home'}"> 
<router-link :to="{path:'/home'}"> //name,path都行, 建议用name  
// 注意：router-link中链接如果是'/'开始就是从根路由开始，如果开始不带'/'，则从当前路由开始。
```
### 2.带参数
```vue
2.带参数
 
<router-link :to="{name:'home', params: {id:1}}">  
 
// params传参数 (类似post)
// 路由配置 path: "/home/:id" 或者 path: "/home:id" 
// 不配置path ,第一次可请求,刷新页面id会消失
// 配置path,刷新页面id会保留
 
// html 取参  $route.params.id
// script 取参  this.$route.params.id
 
 
<router-link :to="{name:'home', query: {id:1}}"> 
 
// query传参数 (类似get,url后面会显示参数)
// 路由可不配置
// html 取参  $route.query.id

```


## this.$router.push() (函数里面调用) 
```javascript

1.  不带参数
 
this.$router.push('/home')
this.$router.push({name:'home'})
this.$router.push({path:'/home'})
 
 
 
2. query传参 
 
this.$router.push({name:'home',query: {id:'1'}})
this.$router.push({path:'/home',query: {id:'1'}})
 
// html 取参  $route.query.id
// script 取参  this.$route.query.id
 
 
 
3. params传参
 
this.$router.push({name:'home',params: {id:'1'}})  // 只能用 name
 
// 路由配置 path: "/home/:id" 或者 path: "/home:id" ,
// 不配置path ,第一次可请求,刷新页面id会消失
// 配置path,刷新页面id会保留
 
// html 取参  $route.params.id
// script 取参  this.$route.params.id
 
 
 
4. query和params区别
query类似 get, 跳转之后页面 url后面会拼接参数,类似?id=1, 非重要性的可以这样传, 密码之类还是用params刷新页面id还在
 
params类似 post, 跳转之后页面 url后面不会拼接参数 , 但是刷新页面id 会消失
```


## this.$router.replace() (用法同上,push)
同上
## this.$router.go(n)
```javascript
this.$router.go(n)
// 向前或者向后跳转n个页面，n可为正整数或负整数
```
## 区别
```javascript
this.$router.push
// 跳转到指定url路径，并想history栈中添加一个记录，点击后退会返回到上一个页面
this.$router.replace
// 跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上上个页面 (就是直接替换了当前页面)

this.$router.go(n)
// 向前或者向后跳转n个页面，n可为正整数或负整数
```
# vue生命周期及特点
它可以总共分为8个阶段：创建前/后, 载入前/后,更新前/后,销毁前/销毁后。
beforeCreate、created、beforeMounted、mounted、beforeUpdated、updated、beforeDestroy、destroyed.
![](https://cdn.nlark.com/yuque/0/2020/png/711095/1588598792284-88226e12-cbfb-4e1b-aaf4-5a140b665c7a.png#align=left&display=inline&height=1520&margin=%5Bobject%20Object%5D&originHeight=3039&originWidth=1200&size=0&status=done&style=shadow&width=600)

## beforeCreate
在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
## created
在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，`$el` property 目前尚不可用。
## beforeMount
在挂载开始之前被调用：相关的 `render` 函数首次被调用。
**该钩子在服务器端渲染期间不被调用。**
## mounted
实例被挂载后调用，这时 `el` 被新创建的 `vm.$el` 替换了。如果根实例挂载到了一个文档内的元素上，当 `mounted` 被调用时 `vm.$el` 也在文档内。
注意 `mounted` **不会**保证所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 `mounted` 内部使用 [vm.$nextTick](https://cn.vuejs.org/v2/api/#vm-nextTick)。
**该钩子在服务器端渲染期间不被调用。**
## beforeUpdate
数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
**该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。**
## updated
由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用[计算属性](https://cn.vuejs.org/v2/api/#computed)或 [watcher](https://cn.vuejs.org/v2/api/#watch) 取而代之。
注意 `updated` **不会**保证所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以在 `updated` 里使用 [vm.$nextTick](https://cn.vuejs.org/v2/api/#vm-nextTick)。
**该钩子在服务器端渲染期间不被调用。**

## activated
被 keep-alive 缓存的组件激活时调用。
**该钩子在服务器端渲染期间不被调用。**
## deactivated
被 keep-alive 缓存的组件停用时调用。
**该钩子在服务器端渲染期间不被调用。**
## beforeDestory
实例销毁之前调用。在这一步，实例仍然完全可用。
**该钩子在服务器端渲染期间不被调用。**
## destoryed
实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。
**该钩子在服务器端渲染期间不被调用。**
## errorCaptured
(err: Error, vm: Component, info: string) => ?boolean
当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 `false` 以阻止该错误继续向上传播。
# 说一下知道的几种数组原生方法
### arr.push() 
> **从后面添加元素，返回值为添加完后的数组的长度**

```javascript
let arr = [1,2,3,4,5]
console.log(arr.push(5))   // 6
console.log(arr) // [1,2,3,4,5,5]
```
### arr.pop()
> **从后面删除元素，只能是一个，返回值是删除的元素**

```javascript
let arr = [1,2,3,4,5]
console.log(arr.pop())     // 5
console.log(arr)  //[1,2,3,4]
```
### **arr.shift()**
> **从前面删除元素，只能删除一个 返回值是删除的元素**

```javascript
let arr = [1,2,3,4,5]
console.log(arr.shift())  // 1
console.log(arr)   // [2,3,4,5]
```
### **arr.unshift()**
> **从前面添加元素, 返回值是添加完后的数组的长度**



```javascript
let arr = [1,2,3,4,5]
console.log(arr.shift())  // 1
console.log(arr)   // [2,3,4,5]
```


### arr.splice(i,n)
> **删除从i(索引值)开始之后的那个元素。返回值是删除的元素。**
> 参数： i 索引值      n 个数

```javascript
let arr = [1,2,3,4,5]
console.log(arr.splice(2,2))     //[3,4]
console.log(arr)    // [1,2,5]
```


### arr.concat()
> **连接两个数组 返回值为连接后的新数组**

```javascript
let arr = [1,2,3,4,5]
console.log(arr.concat([1,2]))  // [1,2,3,4,5,1,2]
console.log(arr)   // [1,2,3,4,5]
```
### str.split()
> **将字符串转化为数组**

```javascript
let str = '123456'
console.log(str.splite('')) // ["1", "2", "3", "4", "5", "6"]
```
### arr.sort()
> **将数组进行排序,返回值是排好的数组，默认是按照最左边的数字进行排序，不是按照数字大小排序的，见例子。**

```javascript
let arr = [2,10,6,1,4,22,3]
console.log(arr.sort())   // [1, 10, 2, 22, 3, 4, 6]
let arr1 = arr.sort((a, b) =>a - b)  
console.log(arr1)   // [1, 2, 3, 4, 6, 10, 22]
let arr2 = arr.sort((a, b) =>b-a)  
console.log(arr2)  // [22, 10, 6, 4, 3, 2, 1]
```
### arr.reverse()
> **将数组反转,返回值是反转后的数组**

```javascript
let arr = [1,2,3,4,5]
console.log(arr.reverse())    // [5,4,3,2,1]
console.log(arr)    // [5,4,3,2,1]
```
### arr.slice(start, end) 
> **切去索引值start到索引值end的数组，不包含end索引的值，返回值是切出来的数组。**
> **该方法不会影响原数组。**

```javascript
let arr = [1,2,3,4,5]
console.log(arr.slice(1,3))   // [2,3]
console.log(arr)    //  [1,2,3,4,5]
```
### arr.forEach(callback) 
> **遍历数组,无return  即使有return，也不会返回任何值，并且会影响原来的数组。**
> callback的参数： value --当前索引的值
> 　　　　　　　　index --索引
> 　　　　　　　　array --原数组

```javascript
let arr = [1,2,3,4,5]
arr.forEach( (value,index,array)=>{
        console.log(`value:${value}    index:${index}     array:${array}`)
    })   
    //  value:1    index:0     array:1,2,3,4,5
    //  value:2    index:1     array:1,2,3,4,5
    //  value:3    index:2     array:1,2,3,4,5
    //  value:4    index:3     array:1,2,3,4,5
    //  value:5    index:4     array:1,2,3,4,5

let arr = [1,2,3,4,5]
arr.forEach( (value,index,array)=>{
        value = value * 2
        console.log(`value:${value}    index:${index}     array:${array}`)
    })   
    console.log(arr)
    // value:2    index:0     array:1,2,3,4,5
    // value:4    index:1     array:1,2,3,4,5
    // value:6    index:2     array:1,2,3,4,5
    // value:8    index:3     array:1,2,3,4,5
    // value:10   index:4     array:1,2,3,4,5
    // [1, 2, 3, 4, 5]

var arr = [1,2,3,4]; 
var res = arr.forEach((item,index,arr)=>{     
 arr[index] = item * 2; 
 return arr 
})
console.log(arr); // [2,4,6,8]
console.log(res); // undefined 
```
### arr.map(callback) 
> **映射数组(遍历数组),有return 返回一个新数组 。**
> callback的参数： value --当前索引的值
> 　　　　　　　　index --索引
> 　　　　　　　　array --原数组

```javascript
let arr = [1,2,3,4,5]
arr.map( (value,index,array)=>{
        value = value * 2
        console.log(`value:${value}    index:${index}     array:${array}`)
})   
console.log(arr)

var arr1 = [1,2,3,4]; 
var res1 = arr1.map((item,index,arr)=>{ 
 item = item * 3; 
 return item; 
})
console.log(arr1); // [1,2,3,4]
console.log(res1); // [3,6,9,12]
```
**ps: arr.forEach()和arr.map()的区别**
1. arr.forEach()是和for循环一样，是代替for。arr.map()是修改数组其中的数据，并返回新的数据。
2. arr.forEach() 没有return  arr.map() 有return
### arr.filter(callback) 
> **过滤数组，返回一个满足要求的数组 **
> callback的参数： value --当前索引的值
> 　　　　　　　   index --索引

```javascript
let arr = [1,2,3,4,5]
let arr1 = arr.filter( (value, index) => value<3)
console.log(arr1)    // [1, 2]
```
### arr.every(callback) 
> **依据判断条件，数组的元素是否全满足，若满足则返回ture。**
> callback的参数： value --当前索引的值
> 　　　　　　　   index --索引

```javascript
let arr = [1,2,3,4,5]
let arr1 = arr.every( (value, index) =>value<3)
console.log(arr1) // false
let arr2 = arr.every( (value, index) =>value<6)
console.log(arr2)  // true
```
PS：return fasle 的时候可以跳出遍历。

### arr.some(callback) 
> **依据判断条件，数组的元素是否有一个满足，若有一个满足则返回ture。**
> callback的参数： value --当前索引的值
> 　　　　　　　   index --索引

```javascript
let arr = [1,2,3,4,5]
let arr1 = arr.some( (value, index) =>value<3)
console.log(arr1) // true
let arr2 = arr.some( (value, index) =>value>6)
console.log(arr2) // false
```
PS：return true 的时候可以跳出遍历。

### arr.reduce(callback, initialValue) 
> **迭代数组的所有项，累加器，数组中的每个值（从左到右）合并，最终计算为一个值**
> 参数： callback: previousValue 必选 --上一次调用回调返回的值，或者是提供的初始值（initialValue）
> 　　　                currentValue 必选 --数组中当前被处理的数组项
> 　　　                index 可选 --当前数组项在数组中的索引值
> 　　　                array 可选 --原数组
> 　　　initialValue: 可选 --初始值
> 　　实行方法：回调函数第一次执行时，preValue 和 curValue 可以是一个值，如果 initialValue 在调用 reduce() 时被提供，那么第一个 preValue 等于 initialValue ，并且curValue 等于数组中的第一个值；如果initialValue 未被提供，那么preValue 等于数组中的第一个值.

```javascript
let arr = [0,1,2,3,4]
let arr1 = arr.reduce((preValue, curValue) => 
    preValue + curValue
)
console.log(arr1)    // 10
```
### arr.reduceRight(callback, initialValue)
> **与arr.reduce()功能一样，不同的是，reduceRight()从数组的末尾向前将数组中的数组项做累加。**
> 　　实行方法：reduceRight()首次调用回调函数callbackfn时，prevValue 和 curValue 可以是两个值之一。如果调用 reduceRight() 时提供了 initialValue 参数，则 prevValue 等于 initialValue，curValue 等于数组中的最后一个值。如果没有提供 initialValue 参数，则 prevValue 等于数组最后一个值， curValue 等于数组中倒数第二个值。

```javascript
let arr = [0,1,2,3,4]
let arr1 = arr.reduceRight((preValue, curValue) => 
    preValue + curValue
)
console.log(arr1)    // 10
```

ps：
(如果对这两个方法不明白，可以查看大漠老师的实例 [http://www.w3cplus.com/javascript/array-part-8.html](http://www.w3cplus.com/javascript/array-part-8.html))

### arr.indexOf()
> **查找某个元素的索引值，若有重复的，则返回第一个查到的索引值若不存在，则返回 -1。**

```javascript
let arr = [1,2,3,4,5,2]
let arr1 = arr.indexOf(2)
console.log(arr1)  // 1
let arr2 = arr.indexOf(9)
console.log(arr2)  // -1
```


### arr.lastIndexOf()
> **和arr.indexOf()的功能一样，不同的是从后往前查找**

```javascript
let arr = [1,2,3,4,5,2]
let arr1 = arr.lastIndexOf(2)
console.log(arr1)  // 5
let arr2 = arr.lastIndexOf(9)
console.log(arr2)  // -1
```
### arr.find(callback) 
> **找到第一个符合条件的数组成员**

```javascript
let arr = [1,2,3,4,5,2,4]
let arr1 = arr.find((value, index, array) =>value > 2)
console.log(arr1)   // 3
```
### arr.findIndex(callback) 
> **找到第一个符合条件的数组成员的索引值**

```javascript
let arr = [1,2,3,4,5]
let arr1 = arr.findIndex((value, index, array) => value > 3)
console.log(arr1)  // 3
```




### Array.from() Es6
> **将伪数组变成数组，就是只要有length的就可以转成数组。 **

```javascript
let str = '12345'
console.log(Array.from(str))    // ["1", "2", "3", "4", "5"]
let obj = {0:'a',1:'b',length:2}
console.log(Array.from(obj))   // ["a", "b"]
```


### Array.of() Es6
> **将一组值转换成数组，类似于声明数组。**

```javascript
let str = '11'
console.log(Array.of(str))   // ['11']

// 等价于 

console.log(new Array('11'))  // ['11]
```


```javascript
ps:
但是new Array()有缺点，就是参数问题引起的重载
console.log(new Array(2))   //[empty × 2]  是个空数组
console.log(Array.of(2))    // [2]
```
### arr.includes() Es6
> **判断数中是否包含给定的值**

```javascript
let arr = [1,2,3,4,5]
let arr1 = arr.includes(2)  
console.log(arr1)   // ture
let arr2 = arr.includes(9) 
console.log(arr2)    // false
let arr3 = [1,2,3,NaN].includes(NaN)
console.log(arr3)  // true
```


ps:与indexOf()的区别：
1 indexOf()返回的是数值，而includes()返回的是布尔值
2 indexOf() 不能判断NaN，返回为-1 ，includes()则可以判断
### arr.keys() Es6
> **遍历数组的键名**

```javascript
let arr = [1,2,3,4]
let arr2 = arr.keys()
for (let key of arr2) {
    console.log(key);   // 0,1,2,3
}
```


### arr.values() Es6
> **遍历数组键值**

```javascript
let arr = [1,2,3,4]
let arr1 = arr.values()
for (let val of arr1) {
     console.log(val);   // 1,2,3,4
}
```
### arr.keys() Es6
> **遍历数组的键名和键值**

```javascript
let arr = [1,2,3,4]
let arr1 = arr.entries()
for (let e of arr1) {
    console.log(e);   // [0,1] [1,2] [2,3] [3,4]
}
```


### 更多方法
[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)




# 跨域以及跨域的解决方法

- 古老的jsonp技术
- vue中可以设置proxyTable来解决
- axios.defalut.baseUrl 中也可以设置。
# 获得对象属性的方法

- Object.keys()
- Object.values()
- Object.entries()
