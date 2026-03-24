<template>
    <div class="main">
        <SubMenu></SubMenu>
    </div>
</template>

<script setup lang="ts">
import SubMenu from "@/components/sub-menu/index.vue"
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