<template>
    <div class="main">
        <h1> main： {{ counterStore.counter }}-{{ counterStore.doubleCounter }}</h1>
        <button @click="handleChang()">改变</button>
        <el-button>Default</el-button>
        <el-button type="primary">Primary</el-button>
        <el-button type="success">Success</el-button>
        <el-button type="info">Info</el-button>
        <el-button type="warning">Warning</el-button>
        <el-button type="danger">Danger</el-button>
    </div>
</template>

<script setup lang="ts">
import useCounterStore from "@/store/counter"

const counterStore = useCounterStore()
console.log(counterStore)

function handleChang() {
    counterStore.changeCounterAction(400)
}
</script>

<style lang="less" scoped>
.main {
    color: aqua;
}
</style>