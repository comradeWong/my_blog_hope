---

title: React Native 开发环境搭建
description: React Native 开发环境搭建
icon: newspaper
isOriginal: false
date: 2022/01/11 00:00:00
category:
 - 移动端
tag:
 - react
sticky: false
article: true
timeline: true
cover: https://fastly.jsdelivr.net/gh/comradeWong/ImageStorageService@master/img/17002077364441700207736078.png

---

## 调试

下载`react-native-debugger` ，[github地址](https://github.com/jhen0409/react-native-debugger)。

## 使用路由

一个很重要的插件 `react-navigation` ，详情看文档。

[官网](https://reactnavigation.org/)

## 使用Redux

引用了[@reduxjs/toolkit](https://redux-toolkit.js.org/tutorials/quick-start)、[react-redux](https://redux.js.org/)

参考资料：[https://redux-toolkit.js.org/tutorials/quick-start](https://redux-toolkit.js.org/tutorials/quick-start)

## 使用样式类或者预编译器

直接使用Stylesheet吧，不推荐用预编译器。

## 适配DarkMode

使用[react-native-dark-mode](https://github.com/codemotionapps/react-native-dark-mode)插件。

具体怎么引用这里不再说明，看文档一步一步来就问题不大。

列举几个常用的写法。

- `useDarkMode`：Boolean，判断深色模式是否开启。
- `useDarkModeContext`：返回dark或者light，也是用于判断深色模式是否开启的。
- `DynamicStyleSheet`, `DynamicValue` and `useDynamicStyleSheet`，创建style的时候使用DynamicStyleSheet，在style中可以使用DynamicValue实现css动态变化，最后在函数中使用useDynamicStyleSheet。

更多用法还是详见文档。

## 如何发送网络请求

官方提供了[访问网络](https://reactnative.cn/docs/network)的方法，不过要注意ios和android现在都会组织http请求，具体解决方案可参考[iOS](https://segmentfault.com/a/1190000002933776)、[Android](https://blog.csdn.net/qq_40347548/article/details/86766932)

或者可以使用我们最熟悉的axios。