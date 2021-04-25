# Web期末项目--n阶魔方游戏  

# 1851489吕梓源

## 一、游戏玩法

本游戏是一个益智类的魔方游戏。

在开始界面选择难度和输入需要的魔方阶数（阶数推荐小于6，避免动画卡顿）

点击开始后，即可进入游戏界面。

其中有五个按钮：

重置魔方：将打乱的魔方重置到开始状态

重置位置：将视角回复到一个平面

开始游戏：根据用户选择的难度开始打乱魔方

回退一步：回退魔方的一步

返回主页：回到游戏开始主界面

本游戏所有界面都采用时刻渐变的背景，增加美观度。

## 二、游戏框架

1. 本项目采用javascript语言编写

2. 老师或者助教想复现本项目可直接用浏览器打开start.html开始游戏

## 三、游戏实现

1. 魔方的初始化函数

   ```javascript
   function Cube(a, b){};
   ```

2. 魔方视角的移动函数

```javascript
Cube.prototype.containerMouseMove=function(){};
```

3. 魔方的转动

```javascript
Cube.prototype.trun = function(a, b, c, d) {};
```

4. 魔方的重置

```javascript
Cube.prototype.initColor = function() {};
```



## 四、游戏截图

####游戏开始界面

![image-20200902120939708](/Users/admin/Library/Application Support/typora-user-images/image-20200902120939708.png)

#### 游戏主界面

![image-20200902121031467](/Users/admin/Library/Application Support/typora-user-images/image-20200902121031467.png)