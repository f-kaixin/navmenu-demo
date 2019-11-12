import { addClass, removeClass } from './util.js';

function Transition() {

}

Transition.prototype.beforeEnter = function(el) {
  addClass(el, 'collapse-transition');
  if (!el.dataset) el.dataset = {};
  
  el.dataset.oldPaddingTop = el.style.paddingTop;
  el.dataset.oldPaddingBottom = el.style.paddingBottom;
  
  el.style.height = '0';
  el.style.paddingTop = 0;
  el.style.paddingBottom = 0;
}

Transition.prototype.enter = function(el) {
  setTimeout(function() {
    // el.style.overflow = 'hidden';
    el.dataset.oldOverflow = el.style.overflow;
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    } else {
      el.style.height = '';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }
  }, 0)
}

Transition.prototype.afterEnter = function(el) {
  removeClass(el, 'collapse-transition');
  el.style.height = '';
  el.style.overflow = el.dataset.oldOverflow;
}

Transition.prototype.beforeLeave = function(el) {
  addClass(el, 'collapse-transition');
  
  if (!el.dataset) el.dataset = {};
  el.dataset.oldPaddingTop = el.style.paddingTop;
  el.dataset.oldPaddingBottom = el.style.paddingBottom;
  el.dataset.oldOverflow = el.style.overflow;

  el.style.height = el.scrollHeight + 'px';
  el.style.overflow = 'hidden';
}

Transition.prototype.leave = function(el) {
  addClass(el, 'collapse-transition');
  if (el.scrollHeight !== 0) {
    // for safari: add class after set height, or it will jump to zero height suddenly, weired
    el.style.height = 0;
    el.style.paddingTop = 0;
    el.style.paddingBottom = 0;
  }
}

Transition.prototype.afterLeave = function(el) {
    removeClass(el, 'collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
    el.style.paddingTop = el.dataset.oldPaddingTop;
    el.style.paddingBottom = el.dataset.oldPaddingBottom;
}

  
  // 返回一个函数式组件
  export default {
    name: 'ElCollapseTransition',
    functional: true,
    render(h, { children }) {
      const data = {
        on: new Transition()
      };
      return h('transition', data, children);
    }
  };
  