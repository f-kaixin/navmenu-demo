<template>
    <li ref="submenu" v-show="ifShow" class="submenu">
        <p 
            ref="submenuTitle"
            :style="`
                padding-left: ${paddingLeft}
                background-color: ${backgroundColor || rootMenu.submenuBgColor} !important; 
                color: ${textColor || rootMenu.submenuTextColor} !important;
            `"
            class="submenu-title" 
            :class="{'is-collapse': rootMenu.collapse && rootMenu.mode === 'vertical' && currentLevel === 1, 'is-opened': ifOpen, 'is-disabled': disabled, 'first-horizontal-submenu-title': (rootMenu.mode === 'horizontal' && currentLevel === 1)}"
            @click="clickSubmenuTitle"
            @mouseenter="handleMouseenter"
            @mouseleave="handleMouseleave"
        >
            <slot name="title"></slot>
            <i 
                v-show="
                    (rootMenu.mode === 'horizontal') ||
                    (!rootMenu.collapse) ||
                    (rootMenu.mode === 'vertical' && rootMenu.collapse && $parent.$options.name !== 'customMenu')
                "
                :class="`
                    iconfont
                    submenu-icon-arrow 
                    icon-arrow-${((rootMenu.mode === 'vertical' && rootMenu.collapse) || (rootMenu.mode === 'horizontal' && currentLevel > 1)) ? 'right' : 'down'} 
                    submenu-icon-${rootMenu.mode}
                `"
            >
            </i>
        </p>
        
        <ElCollapseTransition>
            <ul ref="submenuUl" v-show="rootMenu.mode === 'vertical' && ifOpen && !rootMenu.collapse">
                <slot></slot>
            </ul>
        </ElCollapseTransition>

        <template>
            <popover :placement="(rootMenu.mode === 'horizontal' && currentLevel === 1) ? 'bottom' : 'right'">
                <ul ref="submenuUl" class="popover-ul">
                    <slot></slot>
                </ul>
            </popover>
        </template>
    </li>
</template>

<script>
import ElCollapseTransition from './../js/collapse-transition.js';
import { ifHex } from './../js/util.js';
import { mixins } from './../js/mixin.js';
import popover from './popover.vue';
export default {
    name: 'submenu',
    mixins: [mixins],
    components: {ElCollapseTransition, popover},

    props: {
        // 每个菜单组唯一index
        index: {
            type: [Number, String],
            required: 'true',
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            default: false,
        },
        // 是否显示
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

    inject: [
        'rootMenu',
    ],

    data() {
        return {
            // 是否处于打开状态
            ifOpen: false,
            // 判断该组件是否为选中菜单项组件的上级
            ifSelectedLink: false,
        }
    },

    methods: {
        /**
         * clickSubmenuTitle - 点击·
         * */
        clickSubmenuTitle() {
            if (this.disabled) {
                return;
            }

            if (this.rootMenu.mode === 'horizontal') {
                if (this.rootMenu.menuTrigger === 'click') {
                    this.changeOpenStatus();
                    this.setUniqueOpened();
                }
            } else {
                this.changeOpenStatus();

                // 保持唯一展开
                if (!this.rootMenu.collapse && this.rootMenu.uniqueOpened && this.ifOpen) {
                    this.setUniqueOpened();
                }
            }
        },

        /**
         * setUniqueOpened - 设置submenu唯一展开
         * */
        setUniqueOpened() {
            // 记录当前组件及其祖先组件
            let openComponentIds = [];
            let _this = this;
            while(_this.$options.name !== 'customMenu') {
                if (_this.$options.name === 'submenu') {
                    openComponentIds.push(_this._uid)
                }
                _this = _this.$parent;
            }
            // 设置其它组件的ifOpen为false
            const setIfOpenFalse = function(component) {
                for (let item of component) {
                    if (item.$children) {
                        setIfOpenFalse(item.$children);
                    }
                    if (item.$options.name === 'submenu' && !openComponentIds.includes(item._uid)) {
                        console.log(11)
                        item.ifOpen = false;   
                    }
                }
            }
            setIfOpenFalse(this.rootMenu.$children);
        },

        /**
         * setActiveStyle - 设置激活时的样式
         * */
        setActiveStyle() {
            this.$refs.submenuTitle.style.backgroundColor = this.activebackgroundColor || this.rootMenu.submenuActiveBgColor;
            this.$refs.submenuTitle.style.color = this.activeTextColor || this.rootMenu.submenuActiveTextColor;
        },

        setUnActiveStyle() {
            this.$refs.submenuTitle.style.backgroundColor = this.backgroundColor || this.rootMenu.submenuBgColor;
            this.$refs.submenuTitle.style.color = this.textColor || this.rootMenu.submenuTextColor;
        },

        /**
         * handleMouseenter - 鼠标移入
         * */
        handleMouseenter() {
            if (this.disabled) {
                return;
            }

            // 样式设置
            this.setActiveStyle();

            if ((this.rootMenu.menuTrigger === 'hover' && this.rootMenu.mode === 'horizontal') ||
                (this.rootMenu.mode === 'vertical' && this.rootMenu.collapse)
            ) {
                this.ifOpen = true;
                this.rootMenu.openSubmenu(this.index);
            }
        },

        /**
         * handleMouseleave - 鼠标移出样式设置
         * */
        handleMouseleave() {
            if (this.disabled) {
                return;
            }

            this.setUnActiveStyle();

            if  ((this.rootMenu.menuTrigger === 'hover' && this.rootMenu.mode === 'horizontal') ||
                (this.rootMenu.mode === 'vertical' && this.rootMenu.collapse)
            ) {
                this.ifOpen = false;
                this.rootMenu.closeSubmenu(this.index);
            }
        },

        /**
         * changeOpenStatus - 改变菜单组展开状态
         * */
        changeOpenStatus() {
            this.ifOpen = !this.ifOpen;
            this.ifOpen ?
                this.rootMenu.openSubmenu(this.index) :
                this.rootMenu.closeSubmenu(this.index);
        },
    },
}
</script>

<style lang='scss' scoped>
@import './../style/common.scss';
@import './../fonts/iconfont.css';

    .submenu {
        min-height: $menu_height;
        line-height: $menu_height;
    }

    .submenu-title {
        padding: 0 20px;
        position: relative;
        text-align: left;
        cursor: pointer;
    }
    .first-horizontal-submenu-title {
        padding-right: 44px;
    }
    .submenu-icon-arrow {
        transform:rotate(0deg);
        transform-origin: center center;
        transition: transform .3s;
    }
    .submenu-icon-vertical,
    .submenu-icon-horizontal {
        position: absolute;
        right: 20px;
        top: 0;
    }
    .is-collapse {
        overflow: hidden;
        max-height: 40px;
        .submenu-icon-arrow {
            display: none;
        }
    }
    .is-opened {
        .submenu-icon-arrow {
            transform:rotate(180deg);
        }
    }
    .is-disabled {
        background: #ccc !important;
        color: #000 !important;
        opacity: .25;
        cursor: not-allowed;
        &:hover {
            background: inherit;
            color: inherit;
        }
    }

    .popover-ul {
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border-radius: 2px;
    }
</style>

