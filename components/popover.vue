<template>
    <ElCollapseTransition>
        <div 
            ref="popover"
            v-show="((rootMenu.mode === 'vertical' && rootMenu.collapse) || rootMenu.mode === 'horizontal') && showPopover" 
            class="popover"
            :style="`
                    z-index: ${zIndex}; 
                `"
        >
            <slot></slot>
        </div>
    </ElCollapseTransition>
</template>

<script>
let zIndex = 3000;
import {generateId, getScrollTop, getScrollLeft} from './../js/util.js';
import {throttle} from './../js/throttle.js';
import ElCollapseTransition from './../js/collapse-transition.js';
export default {
    name: 'popover',
    components: {ElCollapseTransition},

    data() {
        return {
            zIndex: '',
            showPopover: false,
            delay: 200,
        }
    },

    props: {
        placement: {
            type: String,
            default: 'right',
            validator(value) {
                return ['right', 'left', 'top', 'bottom'].includes(value);
            }
        },
    },

    inject: [
        'rootMenu',
    ],

    watch: {
        showPopover(val) {
            if (val) {
                this.initPopover();
            }
        }
    },

    methods: {
        // 设置坐标
        allocation() {
            let _parent = this.$parent;
            while (_parent.$options.name !== 'submenu') {
                _parent = _parent.$parent;
            }
            let styles = _parent.$refs.submenu.getBoundingClientRect();
            if (this.placement === 'right') {
                _parent.$refs.submenuUl.style.margin = `0 0 0 ${4 * _parent.currentLevel}px`;
                if (_parent.currentLevel === 1) {
                    this.$refs.popover.style.left = `${styles.right + getScrollLeft()}px`;
                    this.$refs.popover.style.top = `${styles.top + getScrollTop()}px`;
                } else {
                    try {
                        let _popover = _parent.$parent;
                        while (_popover.$options.name !== 'popover') {
                            _popover = _popover.$parent;
                        }
                        let top1 = _popover.$refs.popover.getBoundingClientRect().top;
                        let top2 = _parent.$refs.submenu.getBoundingClientRect().top;
                        this.$refs.popover.style.left = `${styles.width}px`;
                        this.$refs.popover.style.top = `${top2 - top1}px`;
                    }
                    catch (err) {
                        // console.log(err)
                    }
                }
            } else if (this.placement === 'bottom') {
                _parent.$refs.submenuUl.style.margin = `4px 0 0 0`;
                this.$refs.popover.style.left = `${_parent.$refs.submenu.getBoundingClientRect().left}px`;
                this.$refs.popover.style.top = `${_parent.$refs.submenu.getBoundingClientRect().bottom}px`;
            } else {

            }
        },

        /**
         * setBindEvents - 设置与组件交互相关的绑定事件
         * */
        setBindEvents() {
            // 绑定hover方法
            //// 防抖节流效果
            let _parent = this.$parent;
            let parentDom = _parent.$refs.submenu || _parent.$refs.submenuTitle;
            let currentDom = this.$refs.popover;
            let _this = this;

            // 节流操作
            const throttleFunc = throttle(function(val) {
                _this.showPopover = val;
            }, _this.delay);

            if (_parent.rootMenu.mode === 'horizontal' && _parent.rootMenu.menuTrigger === 'click' && _parent.currentLevel === 1) {
                parentDom.addEventListener('click', function() {
                    throttleFunc(_parent.ifOpen);
                })
            } else {
                parentDom.addEventListener('mouseenter', function() {
                    throttleFunc(true);
                })
                parentDom.addEventListener('mouseleave', function() {
                    throttleFunc(false);
                })
            }

            currentDom.addEventListener('mouseenter', function() {
                throttleFunc(true);
            })
            currentDom.addEventListener('mouseleave', function() {
                throttleFunc(false);
            })
 
        },

        /**
         * getParentPopovers - 获取所有的祖先popover元素
         * */
        getParentPopovers() {
            let doms = [];
            let parent = this.$parent;
            while (parent.$options.name !== 'customMenu') {
                if (parent.$options.name === 'popover') {
                    doms.push(parent.$refs.popover);
                }
                parent = parent.$parent;
            }
            return doms;
        },

        /**
         * initPopover - 初始化
         * */
        initPopover() {
            this.allocation();
            this.setBindEvents();
        },
    },

    created() {
        if (!this.zIndex) {
            this.zIndex = zIndex++;
        }   
    },


    mounted() {
        this.initPopover();
    },
}
</script>

<style lang="scss" scoped>
    .popover {
        width: 200px;
        position: absolute;
    }
</style>