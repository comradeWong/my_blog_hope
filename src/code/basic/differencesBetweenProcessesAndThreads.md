---

title: 进程和线程的区别
shortTitle: 进程和线程的区别
description: 进程和线程的区别
icon: newspaper
isOriginal: false
date: 2023/01/30 14:16:00
category:
 - 计算机基础
tag:
 - 原理
sticky: false
article: true
timeline: true
cover: https://fastly.jsdelivr.net/gh/comradeWong/ImageStorageService@master/img/202311171529119.png

---

# 进程和线程的区别
做个简单的比喻：进程=火车，线程=车厢

- 线程在进程下行进（*单纯的车厢无法运行*）

- 一个进程可以包含多个线程（*一辆火车可以有多个车厢*）

- 不同进程间数据很难共享（*一辆火车上的乘客很难换到另外一辆火车，比如站点换乘*）

- 同一进程下不同线程间数据很易共享（*A车厢换到B车厢很容易*）

- 进程要比线程消耗更多的计算机资源（*采用多列火车相比多个车厢更耗资源*）

- 进程间不会相互影响，一个线程挂掉将导致整个进程挂掉（*一列火车不会影响到另外一列火车，但是如果一列火车上中间的一节车厢着火了，将影响到所有车厢*）

- 进程可以拓展到多机，进程最多适合多核（*不同火车可以开在多个轨道上，同一火车的车厢不能在行进的不同的轨道上*）

- 进程使用的内存地址可以上锁，即一个线程使用某些共享内存时，其他线程必须等它结束，才能使用这一块内存。（*比如火车上的洗手间*）－"``互斥锁``"

- 进程使用的内存地址可以限定使用量（*比如火车上的餐厅，最多只允许多少人进入，如果满了需要在门口等，等有人出来了才能进去*）－“``信号量``”