import navMenu from './components/navMenu.vue';
import submenu from './components/submenu.vue';
import menuItem from './components/menuItem.vue';

let navMenuPlugin = {
    install: function(Vue, Options){
        Vue.component('navMenu', navMenu);
        Vue.component('submenu', submenu);
        Vue.component('menuItem', menuItem);
    }
}
export default navMenuPlugin;