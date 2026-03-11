<template>
    <div class="login">
        <LoginPanel></LoginPanel>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import LoginPanel from './cpns/login-panel.vue';

</script>

<style lang="less" scoped>
.login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('../../assets/img/login-bg.svg');
    background-size: cover;
}
</style>