<template>
    <ul 
        class="custom-menu" 
        :class="{
            'custom-menu-horizontal': mode === 'horizontal',
            'custom-menu-vertical': mode === 'vertical',
            'collapsed-menu': mode === 'vertical' && collapse,
        }"
    >
        <slot></slot>
    </ul>
</template>

<script>
import { styleConstants } from './../js/constants.js';
import { ifHex } from './../js/util.js';
export default {
    name: 'customMenu',

    props: {
        // 显示模式：横向/竖向
        mode: {
            type: String,
            default: 'vertical',
            validator: function(value) {
                return ['horizontal', 'vertical'].includes(value);
            }
        },
        // 是否开启折叠（只在mode为vertical时有效）
        collapse: {
            type: Boolean,
            default: false,
        },
        // 子菜单展开的触发方式(hover只在 mode 为 horizontal 时有效)
        menuTrigger: {
            type: String,
            default: 'hover',
            validator: function(value) {
                return ['hover', 'click'].includes(value);
            }
        },
        // 默认选中的菜单
        activeIndex: {
            type: [String, Number],
            default: ''
        },
        // 是否同时只能展开一个submenu
        uniqueOpened: {
            type: Boolean,
            default: true,
        },
        // 路由模式：选中进行路由跳转
        router: {
            type: Boolean,
            default: false,
        },

        // submenu样式（仅支持 hex 格式）
        submenuBgColor: {
            type: String,
            default: '#fff',
            validator: function(value) {
                return ifHex(value);
            }
        },
        submenuTextColor: {
            type: String,
            default: styleConstants.baseColor,
            validator: function(value) {
                return ifHex(value);
            }
        },
        submenuActiveBgColor: {
            type: String,
            default: styleConstants.baseColor,
            validator: function(value) {
                return ifHex(value);
            }
        },
        submenuActiveTextColor: {
            type: String,
            default: '#fff',
            validator: function(value) {
                return ifHex(value);
            }
        },

        // menu-item样式（仅支持 hex 格式）
        menuItemBgColor: {
            type: String,
            default: '#f2f2f2',
            validator: function(value) {
                return ifHex(value);
            }
        },
        menuItemTextColor: {
            type: String,
            default: '#797979',
            validator: function(value) {
                return ifHex(value);
            }
        },
        menuItemActiveBgColor: {
            type: String,
            default: styleConstants.baseColor,
            validator: function(value) {
                return ifHex(value);
            }
        },
        menuItemActiveTextColor: {
            type: String,
            default: '#fff',
            validator: function(value) {
                return ifHex(value);
            }
        },
    },

    provide() {
        return {
            rootMenu: this,
            menuTrigger: this.mode === 'vertical' ? 'click' : this.menuTrigger,
            
        }
    },

    data() {
        return {
            // 实际选中的菜单项
            choosedIndex: '',
        }
    },

    watch: {
        mode(val) {
            if (this.collapse && val === 'horizontal') {
                console.error(`不能在横向模式收缩`);
            }
        },
        collapse(val) {
            if (this.mode === 'horizontal' && val) {
                console.error(`不能在横向模式收缩`);
            }
        },
    },

    methods: {
        // 获取指定的submenu/ment-item
        getAppointVdom(dom, index, limitTag) {
            for (let item of dom.$children) {
                this.getAppointVdom(item);
                if (item.index === index) {
                    if (limitTag) {
                        if (limitTag === item.$options.name) {
                            return item
                        }
                    } else {
                        return item
                    }
                }
            }
        },

        // 点击菜单项回调
        selectedItem(index) {
            // 开启路由模式
            if (this.router) {
                try {
                    this.$router.push({path: index});
                } 
                catch(err) {
                    console.log(err)
                }
            }

            this.$emit('select', index);
        },

        // 展开菜单回调
        openSubmenu(val) {
            this.$emit('open', val);
        },

        // 收起菜单回调
        closeSubmenu(val) {
            this.$emit('close', val);
        },
    },

    mounted() {
        // console.log(this);
        // console.log(this.$options.name);
        
        // 判断菜单及菜单组是否存在相同的index 
        let indexRecords = {},
            relativesName = ['submenu', 'menuItem'];
        const getIndexRecords = (el) => {
            for (let item of el.$children) {
                let name = item.$options.name;
                if (relativesName.includes(name)) {
                    getIndexRecords(item);
                    indexRecords[item.index] ?
                        indexRecords[item.index].push(name) :
                        indexRecords[item.index] = [name];
                }
            }
        }
        getIndexRecords(this);
        for (let key in indexRecords) {
            if (indexRecords[key].length > 1) {
                let tags = [...new Set(indexRecords[key])];
                if (tags.includes('submenu') && tags.includes('menuItem')) {
                    console.error(`菜单组组件及菜单组件存在重复index：${key}`);
                } else if (tags.includes('submenu')) {
                    console.error(`菜单组组件存在重复index：${key}`);
                } else {
                    console.error(`菜单组件存在重复index：${key}`);
                }
            }
        }
    },

    created() {
        this.choosedIndex = this.activeIndex;
    }
}
</script>

<style>
@import './../style/base.css';
</style>

<style scoped lang='scss'>
    .custom-menu {
        transition: width .3s ease-in-out;
        width: 100%;
        // height: 100%;
    }
    .custom-menu-horizontal {
        padding: 0 20px;
        border-bottom: 1px solid #e6e6e6;
        height: 40px;
        >li {
            float: left;
        }
    }
    .custom-menu-vertical {
        border-right: 1px solid #e6e6e6;
    }
    .unshown {
        display: none;
    }
    .collapsed-menu {
        width: 64px;
    }
</style>

