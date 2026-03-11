<template>
    <div class="login-panel">
        <div class="title">
            <h1>个人博客后台管理系统</h1>
        </div>
        <el-form style="max-width: 600px" :model="accountData" :rules="loginRules" label-width="auto">
            <el-form-item label="账号：" prop="name">
                <el-input v-model="accountData.name" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="accountData.password" />
            </el-form-item>
        </el-form>
        <div class="operation">
            <el-checkbox v-model="isRememberPwd" label="记住密码" size="large" />
            <el-link type="primary">忘记密码?</el-link>
        </div>
        <el-button @click="handleLogin()" class="login-btn" type="primary" size="large">Primary</el-button>

    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, reactive, onMounted } from 'vue';
import { isRegisterApi } from "@/api/index"

const isRememberPwd = ref(false)
const accountData = reactive({
    name: "",
    password: ""
})
const loginRules = {
    name: [{ required: true, message: '请输入账号~', triiger: 'change' }],
    password: [{ required: true, message: '请输入密码~', triiger: 'change' }]
}
const handleLogin = async () => {
    // try {
    //     const response = await axios.post('http://localhost:8080/api/test', {
    //         name: accountData.name,
    //         password: accountData.password,
    //         remember: isRememberPwd.value
    //     })

    //     if (response.data.code === 200) {
    //         ElMessage.success('登录成功！')
    //         console.log('用户信息：', response.data.data)
    //         // 这里可以跳转到主页
    //         // router.push('/dashboard')
    //     } else {
    //         ElMessage.error(response.data.message)
    //     }
    // } catch (error) {
    //     ElMessage.error('登录失败，请检查网络连接')
    //     console.error('登录错误：', error)
    // }
}

const isRegister = () => {
    isRegisterApi().then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err, "err")
    })
}
onMounted(() => {
    isRegister()
})

</script>

<style lang="less" scoped>
.login-panel {
    width: 320px;
    padding: 20px;
    margin-bottom: 50px;
    text-align: center;
    background-color: #fff;

    .title {
        margin-bottom: 20px;

        p {
            font-size: 12px;
            color: #999;
        }
    }

    .verify-code {
        display: flex;

        .el-button {
            margin-left: 10px;
        }
    }

    .operation {
        display: flex;
        justify-content: space-between;
    }

    .login-btn {
        width: 100%;
        margin-top: 15px;
    }
}
</style>