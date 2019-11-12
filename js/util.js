/**
 * addClass - 添加类
 * @param  dom el
 * @param  string cls 要添加的类名
 * */
export const addClass = (el, cls) => {
    if (!el) {
        return;
    }
    let curClass = el.className;
    let classes = (cls || '').split(' ');

    for (var i = 0, j = classes.length; i < j; i++) {
        let clsName = classes[i];
        if (!clsName) {
            continue;
        }

        if (el.classList) {
            el.classList.add(clsName);
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
};

/**
 * removeClass - 删除类
 * @param  dom el
 * @param  string cls 要删除的类名
 * */
export const removeClass = (el, cls) => {
    if (!el || !cls) {
        return;
    }
    let classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        let clsName = classes[i];
        if (!clsName) {
            continue;
        }

        if (el.classList) {
            el.classList.remove(clsName);
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
        }
    }
    if (!el.classList) {
        el.className = trim(curClass);
    }
};

/**
 * ifHex - 判断是否时hex格式
 * */
export const ifHex = (val) => {
    return (typeof(val) === 'string' && /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val)) ? true : false;
}

/**
 * generateId - 生成随机id
 * */
export const generateId = function() {
    return Math.floor(Math.random() * 10000);
};

/**
 * getScrollTop
 * */
export const getScrollTop = function() {
    var scroll_top = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scroll_top = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scroll_top = document.body.scrollTop;
    }
    return scroll_top;
}

/**
 * getScrollLeft
 * */
export const getScrollLeft = function() {
    var scroll_left = 0;
    if (document.documentElement && document.documentElement.scrollLeft) {
        scroll_left = document.documentElement.scrollLeft;
    }
    else if (document.body) {
        scroll_left = document.body.scrollLeft;
    }
    return scroll_left;
}