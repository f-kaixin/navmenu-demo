<template>
    <li 
        ref="menuItem"
        v-show="ifShow"
        :style="`
                padding-left: ${paddingLeft}; 
                background-color: ${isActive ? (activebackgroundColor || rootMenu.menuItemActiveBgColor) : (backgroundColor || rootMenu.menuItemBgColor)} !important; 
                color: ${isActive ? (activeTextColor || rootMenu.menuItemActiveTextColor) : (textColor || rootMenu.menuItemTextColor)} !important;
            `"
        class="custom-menu-item"
        :class="{'is-active': isActive, 'is-disabled': disabled, 'is-collapse': rootMenu.collapse && rootMenu.mode === 'vertical' && currentLevel === 1}"
        @click="clickMenuItem"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
    >   
        <template v-if="rootMenu.mode === 'vertical' && rootMenu.collapse">
            <tooltip>
                <slot name="content">
                </slot>
            </tooltip>
        </template>
        <slot name="content">
        </slot>
    </li>
</template>

<script>
import tooltip from './tooltip.vue';
import { ifHex } from './../js/util.js';
import { mixins } from './../js/mixin.js';
export default {
    name: 'menuItem',
    mixins: [mixins],
    components: {tooltip},

    inject: ['rootMenu'],

    props: {
        // 每个菜单唯一index
        index: {
            type: [Number, String],
            required: 'true',
        },
        // 菜单是否禁用
        disabled: {
            type: Boolean,
            default: false,
        },
        // 菜单是否显示
        ifShow: {
            type: Boolean,
            default: true,
        },
        // 背景颜色
        backgroundColor: {
            type: String,
            default: '',
            validator: function(value) {
                return !value || ifHex(value);
            }
        },
        // 文字颜色
        textColor: {
            type: String,
            default: '',
            validator: function(value) {
                return !value || ifHex(value);
            }
        },
        // 激活时背景颜色
        activebackgroundColor: {
            type: String,
            default: '',
            validator: function(value) {
                return !value || ifHex(value);
            }
        },
        // 激活时文字颜色
        activeTextColor: {
            type: String,
            default: '',
            validator: function(value) {
                return !value || ifHex(value);
            }
        },
    },

    data() {
        return {
            paddingLeft: '',
        }
    },

    computed: {
        isActive() {
            return this.index === this.rootMenu.choosedIndex
        },
    },

    watch: {
        // 通过点击或其它方式选中该菜单项时
        isActive(val) {
            if (val) {
                this.ergodicByLine(this, function(_this) {
                    if (_this.$options.name === 'submenu') {
                        _this.ifOpen = true;
                        _this.ifSelectedLink = true;
                    }
                });

                // 判断是否唯一展开,收起其它的submenu
                if (this.rootMenu.uniqueOpened) {
                    for (let item of this.rootMenu.$children) {
                        if (item.$options.name === 'submenu' && !item.ifSelectedLink) {
                            item.ifOpen = false;
                        }
                    }
                }
                
            }
        }
    },

    methods: {
        // 从指定组件开始遍历到根组件并在每一层级执行函数
        ergodicByLine(_this, fn = () => {}) {
            fn(_this);
            if (_this.$options.name === 'customMenu') {
                return;
            }
            this.ergodicByLine(_this.$parent, fn);
        },

        clickMenuItem() {
            if (!this.disabled) {
                let rootMenu = this;
                const getRootMenu = () => {
                    rootMenu = rootMenu.$parent;
                    if (rootMenu.$options.name === 'customMenu') {
                        return;
                    } else {
                        getRootMenu();
                    }
                }
                getRootMenu();
                rootMenu.choosedIndex = this.index;
                // 激活选中回调，返回index
                this.rootMenu.selectedItem(this.index);
            }
        },

        // 鼠标移入
        handleMouseenter() {
            if (this.disabled) {
                return;
            }

            // 设置样式
            this.$nextTick(function() {
                try {
                    this.$refs.menuItem.style.backgroundColor = this.activebackgroundColor || this.rootMenu.menuItemActiveBgColor;
                    this.$refs.menuItem.style.color = this.activeTextColor || this.rootMenu.menuItemActiveTextColor;
                }
                catch (err) {

                }
            })
        },

        // 鼠标移出设置样式
        handleMouseleave() {
            if (this.disabled) {
                return;
            }

            this.$refs.menuItem.style.backgroundColor = this.isActive ? (this.activebackgroundColor || this.rootMenu.menuItemActiveBgColor) : (this.backgroundColor || this.rootMenu.menuItemBgColor)
            this.$refs.menuItem.style.color = this.isActive ? (this.activeTextColor || this.rootMenu.menuItemActiveTextColor) : (this.textColor || this.rootMenu.menuItemTextColor)
        },
    },
}
</script>

<style lang='scss' scoped>
@import './../style/common.scss';

    .custom-menu-item {
        height: $menu_height;
        line-height: $menu_height;
        
        padding: 0 20px;
        text-align: left;
        cursor: pointer;
    }
    .is-disabled {
        background: #fff !important;
        color: $menu_item_color !important;
        opacity: .25;
        cursor: not-allowed;
        &:hover {
            background: inherit;
            color: inherit;
        }
    }
    .is-collapse {
        overflow: hidden;
        max-height: 40px;
    }
</style>
