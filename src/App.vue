<script setup lang="ts">


// 响应式数据
// const count = ref(0)

// 创建阶段的代码直接写在顶层
// console.log('相当于 beforeCreate 和 created')
// const initData = '初始化数据'

// 挂载阶段
// onBeforeMount(() => {
//   console.log('组件挂载前 - onBeforeMount')
// })

// onMounted(() => {
//   console.log('组件已挂载 - onMounted')
//   // 可以访问 DOM 元素、发起 API 请求等
// })

// 更新阶段
// onBeforeUpdate(() => {
//   console.log('组件更新前 - onBeforeUpdate')
// })

// onUpdated(() => {
//   console.log('组件已更新 - onUpdated')
//   // 注意：避免在此处修改状态，可能导致无限循环 [citation:2]
// })

// 卸载阶段
// onBeforeUnmount(() => {
//   console.log('组件卸载前 - onBeforeUnmount')
//   // 清理定时器、取消事件监听等
// })

// onUnmounted(() => {
//   console.log('组件已卸载 - onUnmounted')
// })

// 方法定义
// const increment = () => {
//   count.value++
// }
</script>

<template>
  <div class="app">
    <router-view></router-view>
  </div>



</template>

<style scoped lang="less">
.app {
  height: 100vh;
  width: 100vw;
}
</style>
