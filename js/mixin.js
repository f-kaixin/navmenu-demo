export const mixins = {
    data() {
        return {
            // 间隔
            paddingLeft: '',
            // 当前组件层级（默认根组件为0）
            currentLevel: undefined,
        }
    },

    watch: {
    　　'rootMenu.collapse'(newValue, oldValue) {
    　　　　this.setGepLeft();
    　　},
        'rootMenu.mode'(newValue, oldValue) {
    　　　　this.setGepLeft();
    　　},
    },

    methods: {
        /**
         * setGepLeft - 设置文字距左边间隔
         * */
        setGepLeft() {
            this.paddingLeft = `${(this.rootMenu.mode === 'vertical' && !this.rootMenu.collapse) ? this.currentLevel * 20 : 20}px`;
        },

        /**
         * getCurrentLevel - 获取当前组件所在层级
         * */
        getCurrentLevel() {
            this.currentLevel = 0;
            let _this = this;
            while (_this.$options.name !== 'customMenu') {
                if (['submenu', 'menuItem'].includes(_this.$options.name)) {
                    this.currentLevel++;
                }
                _this = _this.$parent;
                ['submenu', 'menuItem'].includes();
            }
        }
    },

    created() {
        this.getCurrentLevel();
        this.setGepLeft();
    }
}