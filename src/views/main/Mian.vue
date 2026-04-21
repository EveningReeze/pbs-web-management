<template>
    <div class="main">
        <el-container class="main-container">
            <el-header height="65px">
                <main-header></main-header>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <main-menu></main-menu>
                </el-aside>
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import mainHeader from "@/components/main-header/main-header.vue"
import mainMenu from "@/components/main-menu/main-menu.vue"
import useCounterStore from "@/store/counter"

const counterStore = useCounterStore()

function handleChang() {
    counterStore.changeCounterAction(400)
}
</script>

<style lang="less" scoped>
.main {
    height: 100%;
}

.main-container {
    height: 100%;

    .el-header {
        background-color: #FFF;
    }

    .el-aside {
        background-color: #f4f3f4;
    }

    .el-main {
        background-color: #f4f3f4;
    }
}
</style>