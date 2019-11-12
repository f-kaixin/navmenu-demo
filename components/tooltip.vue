<template>
    <div 
        ref="tooltip" 
        v-show="showTooltip" 
        :id="`tooltip_${id}`" 
        class="tooltip"
        :style="`
                z-index: ${zIndex}; 
            `"
    >
        <slot></slot>
    </div>
</template>>

<script>
let idList = [];
let zIndex = 2000;
import {generateId, getScrollTop, getScrollLeft} from './../js/util.js';
export default {
    data() {
        return {
            id: '',
            zIndex: '',
            showTooltip: false,
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

    watch: {
        showTooltip(val) {
            if (val) {
                this.allocation();
            }
        }
    },

    methods: {
        /**
         * allocation - 点设置收缩后tooltip位置
         * */
        allocation() {  
            // 得到父元素的大小及其相对于视口的位置
            // 默认设置在右边显示
            let _parent = this.$parent,
                styles = _parent.$refs.menuItem.getBoundingClientRect(),
                ifParentRoot = _parent.$parent.$options.name === 'customMenu' ? true : false;
            if (this.placement === 'right') {
                if (ifParentRoot) {
                    this.$refs.tooltip.style.left = `${styles.right + getScrollLeft() + 4 * _parent.currentLevel}px`;
                    this.$refs.tooltip.style.top = `${styles.top + getScrollTop()}px`;
                } else {
                    this.$refs.tooltip.style.left = `${styles.width + 4 * _parent.currentLevel}px`;
                }
            }
        },
    },

    created() {
        if (!this.id || !this.zIndex) {
            let id = generateId();
            while (idList.includes(id)) {
                id = generateId();
            }
            idList.push(id);
            this.id = id;
            this.zIndex = zIndex++;
        }   
    },

    mounted() {
        this.allocation();

        // 为父元素绑定hover方法
        let parent = this.$parent.$refs.menuItem;
        let _this = this;
        parent.addEventListener('mouseenter', function() {
            _this.showTooltip = true;
        })
        parent.addEventListener('mouseleave', function() {
            _this.showTooltip = false;
        })
    }
}
</script>>

<style lang="scss" scoped>
    .tooltip {
        background: #303133;
        color: #fff;
        position: absolute;
        border-radius: 4px;
        padding: 10px;
        z-index: 2000;
        font-size: 12px;
        line-height: 1.2;
        min-width: 10px;
        max-width: 160px;
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>