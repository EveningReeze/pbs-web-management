<template>
    <div class="register-box">
        <div class="register">
            <div class="title">
                <h1>账号注册</h1>
            </div>
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="accountData" :rules="registerRules"
                label-width="80">
                <el-form-item label="用户名：" prop="name">
                    <el-input v-model="accountData.name" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="账号：" prop="username">
                    <el-input v-model="accountData.username" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input v-model="accountData.password" type="password" placeholder="请输入密码" show-password />
                </el-form-item>
            </el-form>

            <el-button @click="handleLogin(ruleFormRef)" class="login-btn" type="primary" size="large">注册</el-button>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue';
import { registerApi } from "@/api/index"
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter, useRoute } from "vue-router"
interface RuleForm {
    name: string,
    password: string,
    username: string
}
const router = useRouter()//路由实例
const route = useRoute() //路由信息
const ruleFormRef = ref<FormInstance>()
const accountData = reactive<RuleForm>({
    name: "",
    password: "",
    username: ""
})
const registerRules = reactive<FormRules>({
    name: [{ required: true, message: '请输入用户名~', trigger: 'change' }],
    username: [{ required: true, message: '请输入账号~', trigger: 'change' }],
    password: [{ required: true, message: '请输入密码~', trigger: 'change' }]
})


const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return


    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                let data = {
                    name: accountData.name,
                    username: accountData.username,
                    password: accountData.password,
                    moment: new Date()
                }
                const res = await registerApi(data);
                if (res.code === 200) {
                    ElMessage.success('注册成功');
                    router.push('/login');
                } else {
                    ElMessage.error(res.message);
                }
            } catch (err) {
                ElMessage.error('注册失败，请稍后重试');
            }
        } else {
            ElMessage.error(fields)

        }
    })
}




onMounted(() => {
})

</script>

<style lang="less" scoped>
.register-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

}

.register {
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