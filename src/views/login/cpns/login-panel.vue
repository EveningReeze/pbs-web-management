<template>
    <div class="login-panel">
        <div class="title">
            <h1>个人博客后台管理系统</h1>
        </div>
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="accountData" :rules="loginRules" label-width="auto">
            <el-form-item label="账号：" prop="username">
                <el-input v-model="accountData.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="密码：" prop="password" show-password>
                <el-input v-model="accountData.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
        </el-form>
        <div class="operation">
            <el-checkbox v-model="isRememberPwd" label="记住密码" size="large" />
            <el-link type="primary">忘记密码?</el-link>
        </div>
        <el-button @click="handleLogin(ruleFormRef)" class="login-btn" type="primary" size="large">登录</el-button>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { loginApi } from "@/api/index"
import { ElMessage } from 'element-plus'
import useLoginStore from "@/store/login/login"
import type { LoginForm, LoginResponse } from "@/types"
const isRememberPwd = ref(false)
const ruleFormRef = ref<FormInstance>()
const loginStore = useLoginStore()
const accountData = reactive<LoginForm>({
    username: "",
    password: ""
})
const loginRules = reactive<FormRules>({
    username: [{ required: true, message: '请输入账号~', trigger: 'change' }],
    password: [{ required: true, message: '请输入密码~', trigger: 'change' }]
})
const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    let data = {
        username: accountData.username,
        password: accountData.password,
    }

    await formEl.validate(async (valid, fields) => {

        if (valid) {
            try {
                const res = await loginApi(data);
                if (res.code === 200) {
                    console.log(res.data);

                    loginStore.loginAccountActions(res.data); // res.data 的类型为 LoginUserInfo
                    ElMessage.success('登录成功');
                } else {
                    ElMessage.error(res.message);
                }
            } catch (err) {
                ElMessage.error('网络错误或服务器异常');
            }
        } else {
            ElMessage.error('账号密码错误请重新输入')
        }
    })
}


onMounted(() => {
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