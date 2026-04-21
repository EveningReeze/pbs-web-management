<template>
    <div class="main-header">
        <div class="header-left">
            <img src="../../assets/img/logo.svg" alt="">
            <h2>个人博客系统</h2>
        </div>
        <div class="header-right">
            <el-button type="primary" @click="handleLoginQuit()">退出</el-button>
            <img src="../../assets/img/userimg.jpg" alt="">
        </div>
    </div>
</template>

<script setup lang="ts">
import { sessionCache, localCache } from '@/utils/cache';
import { useRouter } from 'vue-router'

const router = useRouter()
const handleLoginQuit = () => {
    localCache.clear()
    sessionCache.clear()
    ElMessage.success("退出成功")
    router.push("/login")
}
</script>

<style lang="less" scoped>
.main-header {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
        display: flex;

        img {
            width: 20px;
            margin: 0px 10px;
        }
    }

    .header-right {
        display: flex;
        align-items: center;

        img {
            width: 40px;
            border-radius: 20px;
            margin: 0 15px;
        }

        .el-button {
            width: 40px;
            height: 25px;
        }
    }
}
</style>