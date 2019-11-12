<template>
    <submenu v-if="data.children && data.children.length" :index="data.index">
        <template slot="title">
            <img src="./imgs/link.png"  alt="" />
            <span>{{data.title}}</span>
        </template>
        <init v-for="item in data.children" :key="item.index" :data="item"></init>
    </submenu>
    <menuItem v-else :index="data.index">
        <p slot="content">{{data.title}}</p>
    </menuItem>
</template>

<script>
import init from './init.vue';
export default {
    name: 'init',
    components: {init},
    props: ['data']
}
</script>
