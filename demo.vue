<template>
  <div class="" :style="`width: ${mode === 'vertical' ? '300px' : '800px'}`">
        <div style="min-width: 800px;">
            <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="mode" style="margin-bottom: 20px;">
                <el-radio-button :label="'vertical'">竖直</el-radio-button>
                <el-radio-button :label="'horizontal'">横向</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="uniqueOpened" style="margin-bottom: 20px;">
                <el-radio-button :label="true">唯一展开</el-radio-button>
                <el-radio-button :label="false">不唯一展开</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="router" style="margin-bottom: 20px;">
                <el-radio-button :label="true">开启路由模式</el-radio-button>
                <el-radio-button :label="false">关闭路由模式</el-radio-button>
            </el-radio-group>
        </div>

        <navMenu
            ref="menu"
            :mode="mode"
            :collapse="isCollapse"
            :activeIndex="activeIndex"  
            :uniqueOpened="uniqueOpened"
            :router="router"
            @select="select"  
            @open="open"  
            @close="close"  
        >
        <init v-for="item in data" :key="item.index" :data="item"></init>
    </navMenu>

    <!-- :menuItemBgColor="'#fff'"
        :menuItemTextColor="'#000'"
        :menuItemActiveBgColor="'#000'"
        :menuItemActiveTextColor="'#fff'" -->
            <!-- :backgroundColor="'red'" 
            :textColor="'yellow'" 
            :activebackgroundColor="'green'" 
            :activeTextColor="'blue'"  -->
  </div>
</template>

<script>
import init from './init.vue';
export default {
  name: 'demo',
  components: {init},

  data () {
    return {
      activeIndex: '',
      isCollapse: false,
      mode: 'vertical',
      uniqueOpened: true,
      router: false,

      data: [
          {title: '处理中心', index: '10', children: [
              {title: '事件处理', index: '10-1'},
              {title: '用户处理', index: '10-2'},
              {title: '错误处理', index: '10-3'},
            ]},
            {title: '我的工作台', index: '20'},
            {title: '消息中心', index: '30', children: [
                {title: '紧急消息', index: '30-1'},
                {title: '领导消息', index: '30-2'},
                {title: '部门消息', index: '30-3', children: [
                    {title: '当前部门消息', index: '30-3-1'},
                    {title: '其它部门消息', index: '30-3-2'},
                ]},
                {title: '业务消息', index: '30-4', children: [
                    {title: '当前业务消息', index: '30-4-1'},
                    {title: '其它业务消息', index: '30-4-2'},
                ]},
            ]},
            {title: '订单管理', index: '40', children: [
              {title: '待审批', index: '40-1'},
              {title: '待发起', index: '40-2', children: [
                  {title: '领导发起', index: '40-2-1'},
                  {title: '用户发起', index: '40-2-2'},
              ]},
              {title: '已发起', index: '40-3', children: [
                  {title: '不需要审批', index: '40-3-1'},
                  {title: '需要审批', index: '40-3-2', children: [
                      {title: '查看审批流', index: '40-3-2-1'},
                      {title: '催促审批流', index: '40-3-2-2'},
                  ]},
              ]},
            ]},
      ]
    }
  },

  methods: {
    // 点击菜单项回调 
    select(val) {
        console.log('点击回调');
    },

    // 展开菜单回调 
    open(val) {
        console.log('展开回调')
    },

    // 收起菜单回调 
    close(val) {
        console.log('收起回调')
    },
  },
}
</script>

<style scoped>
.hello {
    width: 300px;
    height: 780px;
}
</style>
