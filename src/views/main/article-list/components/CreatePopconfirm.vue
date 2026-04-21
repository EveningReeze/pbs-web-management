<template>
    <!-- 弹出框 -->
    <el-popconfirm hide-icon :width="220" :title="title" @cancel="handleCancel" @confirm="handleConfirm">
        <template #reference>
            <slot name="reference">
                <el-button key="primary" type="primary" :icon="Plus" text>
                    {{ buttonText }}
                </el-button>
            </slot>
        </template>
        <template #actions="{ confirm, cancel }">
            <el-input v-model="inputValue" :placeholder="placeholder" size="small" style="margin-bottom: 10px"
                :maxlength="maxlength" type="text" show-word-limit @keydown.enter="handleEnter(confirm)" />
            <div style="display: flex; justify-content: flex-end; gap: 8px">
                <el-button size="small" @click="handleCancelClick(cancel)">
                    取消
                </el-button>
                <el-button type="primary" size="small" :disabled="!inputValue.trim()"
                    @click.stop="handleConfirmClick(confirm)">
                    确定
                </el-button>
            </div>
        </template>
    </el-popconfirm>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'

interface Props {
    title: string
    buttonText?: string
    placeholder?: string
    maxlength?: number
    modelValue?: string
}

interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'confirm', value: string): void
    (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
    buttonText: '新建',
    placeholder: '请输入名称',
    maxlength: 6,
    modelValue: ''
})

const emit = defineEmits<Emits>()

const inputValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    inputValue.value = val
})

watch(inputValue, (val) => {
    emit('update:modelValue', val)
})

const handleConfirm = () => {
    if (inputValue.value.trim()) {
        emit('confirm', inputValue.value.trim())
        inputValue.value = ''
    }
}

const handleCancel = () => {
    emit('cancel')
    inputValue.value = ''
}

const handleConfirmClick = (confirmCallback: (e?: any) => void) => {
    if (inputValue.value.trim()) {
        confirmCallback()
    }
}

const handleCancelClick = (cancelCallback: (e?: any) => void) => {
    cancelCallback()
}

const handleEnter = (confirmCallback: (e?: any) => void) => {
    if (inputValue.value.trim()) {
        confirmCallback()
    }
}
</script>