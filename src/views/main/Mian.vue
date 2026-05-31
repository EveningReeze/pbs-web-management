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
    /* 确保 main 也是 flex 容器，或者直接让 container 撑满 */
    display: flex;
    flex-direction: column;
}

.main-container {
    height: 100%;
    /* 关键修复：使用 flex 布局代替固定高度计算 */
    display: flex;
    flex-direction: column;

    .el-header {
        background-color: #FFF;
        /* 确保 header 不伸缩 */
        flex-shrink: 0;
        padding: 0;
        /* 移除默认 padding */
    }

    /* 针对 el-container (横向的那个) */
    .el-container {
        flex: 1;
        /* 占据除 header 外的所有剩余空间 */
        overflow: hidden;
        /* 防止横向溢出 */
    }

    .el-aside {
        background-color: #f4f3f4;
        /* 侧边栏高度设为 100%，让它填满父容器 */
        height: 100%;
    }

    .el-main {
        background-color: #f4f3f4;
        /* 关键：让内容区域出现滚动条，而不是整个页面滚动 */
        overflow: auto;
        padding: 10px;
        /* 可选：给内容一点边距 */
    }
}
</style>