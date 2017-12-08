这是一个在web app里如何使用rem类库，


### 安装

```
npm install hotrem --save


```
或
```
yarn add hotrem 

```

### 使用

或者手动复制hotrem.js到你项目里引用


用法:
```
//引入js文件后 
hotrem.init({
    //这里设置初始化参数,或者在html页面里得meta里设置
    designWidth:640,
    maxWidth:640,
    rootFontSize:40
});
//执行下初始化,再执行
hotrem.listener();
//即可

```

初始化参数,或者在html页面里得meta里设置

```
<meta name="hotrem" content="design-width=640px,max-width=640px,initial-dpr=2,root-fontsize=40" />

```
项目css里的单位使用rem，px转rem可以使用sublime插件https://github.com/flashlizi/cssrem

或者使用相关的gulp和webpack打包插件，请自行搜索配置


### 测试demo

在test文件夹里，执行
```
yarn 

```

安装测试demo依赖包 iflex

浏览器打开test.html就可以看到效果



