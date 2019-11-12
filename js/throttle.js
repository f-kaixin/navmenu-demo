let index = 1000;

// 节流
export const throttle = function(fn, interval) {
    let timerName = `timer_${index++}`;
    //是否是第一次调用
    let firstTime = true;   

    // 初始化定时器
    let initTimer = function(_this, args) {
        window[timerName] = setTimeout(function() {  
            clearTimeout(window[timerName]);
            firstTime = true;
            window[timerName] = null;
            fn.apply(_this, args);
        }, interval || 300);
    }

    return function() {
        let args = arguments;
        let _this = this;
        //如果第一次调用，不需要延迟执行
        if (firstTime) {  
            fn.apply(_this, args);
            return firstTime = false;
        }
        //如果定时器还在，说明前一次延迟执行还没有完成,刷新定时器
        if (window[timerName]) {  
            clearTimeout(window[timerName]);
            initTimer(_this, args);
            return false;
        }
        initTimer(_this, args);
    };
};