(function(){ //window,document

    'use strict';

    //注意：这个js默认使用的是基准屏幕宽度为320px,font-size为20px的标准下进行适配其他屏幕尺寸的

    //用法:引入js文件后 hotrem.init()执行下初始化,再执行hotrem.listener(); 即可 

    //给hotrem开辟个命名空间，别问我为什么，我要给你准备你会用到的方法，免得用到的时候还要自己写。
    var hotrem = {};

    hotrem.init=function() {
        //根据devicePixelRatio自定计算scale
        //可以有效解决移动端1px这个世纪难题。
        var viewportEl = document.querySelector('meta[name="viewport"]'),
            hotremEl = document.querySelector('meta[name="hotrem"]'),
            dpr = window.devicePixelRatio || 1,
            maxWidth = 540,
            designWidth = 640,
            rootFontSize = 40
        ;

        dpr = dpr >= 3 ? 3 : ( dpr >=2 ? 2 : 1 );

        //允许通过自定义name为hotrem的meta头，通过initial-dpr来强制定义页面缩放
        if (hotremEl) {
            var hotremCon = hotremEl.getAttribute('content');
            if (hotremCon) {
                var initialDprMatch = hotremCon.match(/initial\-dpr=([\d\.]+)/);
                if (initialDprMatch) {
                    dpr = parseFloat(initialDprMatch[1]);
                }
                var maxWidthMatch = hotremCon.match(/max\-width=([\d\.]+)/);
                if (maxWidthMatch) {
                    maxWidth = parseFloat(maxWidthMatch[1]);
                }
                var designWidthMatch = hotremCon.match(/design\-width=([\d\.]+)/);
                if (designWidthMatch) {
                    designWidth = parseFloat(designWidthMatch[1]);
                }
            }
        }

        //<meta name="hotrem" content="design-width=640px,max-width=640px,initial-dpr=2" />

        document.documentElement.setAttribute('data-dpr', dpr);
        hotrem.dpr = dpr;

        document.documentElement.setAttribute('max-width', maxWidth);
        hotrem.maxWidth = maxWidth;

        if( designWidth ){
            document.documentElement.setAttribute('design-width', designWidth);
        }
        hotrem.designWidth = designWidth; // 保证px2rem 和 rem2px 不传第二个参数时, 获取hotrem.designWidth是undefined导致的NaN

        var scale = 1 / dpr,
            content = 'width=device-width, initial-scale=' + scale + ', minimum-scale=' + scale + ', maximum-scale=' + scale + ', user-scalable=no';

        if (viewportEl) {
            viewportEl.setAttribute('content', content);
        } else {
            viewportEl = document.createElement('meta');
            viewportEl.setAttribute('name', 'viewport');
            viewportEl.setAttribute('content', content);
            document.head.appendChild(viewportEl);
        }

    };

    hotrem.px2rem = function( px , designWidth ){
        //预判你将会在JS中用到尺寸，特提供一个方法助你在JS中将px转为rem。就是这么贴心。
        if( !designWidth ){
            //如果你在JS中大量用到此方法，建议直接定义 hotrem.designWidth 来定义设计图尺寸;
            //否则可以在第二个参数告诉我你的设计图是多大。
            designWidth = parseInt(hotrem.designWidth , 10);
        }

        return (parseInt(px,10)/20)*(320/designWidth);
    }

    hotrem.rem2px = function( rem , designWidth ){
        //新增一个rem2px的方法。用法和px2rem一致。
        if( !designWidth ){
            designWidth = parseInt(hotrem.designWidth , 10);
        }
        //rem可能为小数，这里不再做处理了
        return rem*20*designWidth/320;
    }

    hotrem.mresize = function(){
        //对，这个就是核心方法了，给HTML设置font-size。
        var innerWidth = document.documentElement.getBoundingClientRect().width || window.innerWidth;

        if( hotrem.maxWidth && (innerWidth/hotrem.dpr > hotrem.maxWidth) ){
            innerWidth = hotrem.maxWidth*hotrem.dpr;
        }

        if( !innerWidth ){ return false;}

        document.documentElement.style.fontSize = ( (innerWidth/320)*20 ) + 'px';

        hotrem.callback && hotrem.callback();

    };

    hotrem.listener=function(){
        hotrem.mresize(); 
        //直接调用一次

        //var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

        window.addEventListener( 'resize' , function(){
            clearTimeout( hotrem.tid );
            hotrem.tid = setTimeout( hotrem.mresize , 33 );
        } , false ); 
        //绑定resize的时候调用

        window.addEventListener( 'load' , hotrem.mresize , false ); 
        //防止不明原因的bug。load之后再调用一次。


        setTimeout(function(){
            hotrem.mresize(); 
            //防止某些机型怪异现象，异步再调用一次
        },333)
    };

    

    //window.hotrem = hotrem; 
    //命名空间暴露给你，控制权交给你，想怎么调怎么调。
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(function() {
            return hotrem;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = hotrem;
    } else {
        window.hotrem = hotrem;
    }


})( this ); //window,document


