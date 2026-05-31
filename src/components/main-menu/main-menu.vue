<template>
    <div class="main-menu">
        <el-menu router :default-active="$route.path">
            <el-menu-item index="/main/overview">
                <span>总览</span>
            </el-menu-item>
            <el-menu-item index="/main/music">
                <span>音乐</span>
            </el-menu-item>
            <el-menu-item index="/main/article">
                <span>文章</span>
            </el-menu-item>
            <el-menu-item index="/main/article-list">
                <span>博客文章</span>
            </el-menu-item>
            <el-menu-item index="/main/echart">
                <span>EChart</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router';

// const router = useRouter()
// const handleItme = (path: string) => {
//     router.push(path)
// }

</script>

<style lang="less" scoped>
.main-menu {}

.el-menu {
    background-color: #f3f3f3;
    border: none;


}
</style>