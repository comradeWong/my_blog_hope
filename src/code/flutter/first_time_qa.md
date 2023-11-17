---

title: Flutter初体验入门问题
description: 开发Flutter的入门问题
icon: fa-brands fa-think-peaks
isOriginal: false
date: 2022/07/09
category:
 - 移动端
tag:
 - flutter
sticky: false
article: true
timeline: true
cover: https://fastly.jsdelivr.net/gh/comradeWong/ImageStorageService@master/img/202311171537461.png

---


# Flutter初体验入门问题

## 初体验入门问题

*   注意配置flutter环境变量的时候，记得也需要把dart的地址也配置进Path中，否则就不能在命令行中使用dart的各种指令。

*   如果使用vscode开发，记得配置.vscode文件，需要配置一下launch.json，在里面加入-no-sound-null-safety，用于解决第三方库不支持安全模式导致报错的问题。

*   android运行的时候需要去`android/build.gradle` 下`repositories` 和`allprojects.repositories`中添加如下代码

```
repositories {
        maven {
            url '<https://maven.aliyun.com/repository/central>'
        }
        maven {
            url '<https://maven.aliyun.com/repository/public/>'
        }
        maven {
            url '<https://maven.aliyun.com/repository/google/>'
        }
        google()
        // mavenCentral()
    }
allprojects {
    repositories {
        maven {
            url '<https://maven.aliyun.com/repository/central>'
        }
        maven {
            url '<https://maven.aliyun.com/repository/public/>'
        }
        maven {
            url '<https://maven.aliyun.com/repository/google/>'
        }
        google()
        // mavenCentral()
    }
}

```

## 学习资源

发点flutter的学习资料

flutter官网：<https://flutter.dev/> flutter中文官网：<https://flutter.cn/> 这个是与flutter官网内容一致的，只是配上了中文的翻译 flutter中文网：<https://flutterchina.club/> 这是国内做的比较好的一个flutter社区，跟flutter官方没太大关系

电子书可以看这个：<https://book.flutterchina.club/>

Fair：<https://fair.58.com/zh/>

cafecat blog：<https://ducafecat.tech/>

getx doc：<https://1467602180.github.io/flutter-getx-doc/quick-start/> （非官方）

## 插件

这里总结了一个叫helber的软件，[作者自己披露的使用的插件](https://zhuanlan.zhihu.com/p/425857518)，该应用已上线APP Store 和 Google Play，所以应该是可以应用于正式项目的插件。

[线上可用的一些常用插件](https://www.notion.so/196b242e239449feacdcbc09878170d2)

## 文章

[The ultimate guide to GetX state management in Flutter - LogRocket Blog](https://blog.logrocket.com/ultimate-guide-getx-state-management-flutter/)

## 开发时遇到的问题

[如何更改TextField的高度和宽度？](https://www.jianshu.com/p/f8cfc4038802)

[flutter row 里面的元素分别居左和居右对齐?](https://www.cnblogs.com/lavinia/p/13491191.html)

[EdgeInsets对象的一些用法？](https://juejin.cn/post/6844903944485879816)

[Flutter系列之Container宽度自适应？](https://blog.csdn.net/shving/article/details/107744954)

[Flutter DataTable](https://blog.csdn.net/mengks1987/article/details/104661591)

[Flutter TextField样式要怎么修改？](https://www.cnblogs.com/yongfengnice/p/14143805.html)

**[Flutter：如何从 api 获取数据并在分页数据表中绑定](https://stackoverflow.com/questions/68811827/flutter-how-to-get-data-from-api-and-bind-in-paginateddatatable)**

[Flutter 132: 图解 PaginatedDataTable 分页表格](https://developer.aliyun.com/article/786665)

[Flutter 的命名规范和代码规范？](https://dart.cn/guides/language/effective-dart)