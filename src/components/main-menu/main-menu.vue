<template>
    <div class="main-menu">
        <el-menu default-active="1">
            <el-menu-item index="1" @click="handleItme('/main/overview')">
                <span>总览</span>
            </el-menu-item>
            <el-menu-item index="2" @click="handleItme('/main/article')">
                <span>添加文章</span>
            </el-menu-item>
            <el-menu-item index="3" @click="handleItme('/main/article-list')">
                <span>博客文章</span>
            </el-menu-item>
            <el-menu-item index="4" @click="handleItme('/main/echart')">
                <span>EChart</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
const handleItme = (path: string) => {
    router.push(path)
}

</script>

<style lang="less" scoped>
.main-menu {}

.el-menu {
    background-color: #f3f3f3;
    border: none;


}
</style>