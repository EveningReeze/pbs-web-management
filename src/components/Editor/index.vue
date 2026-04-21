<template>
    <div class="rich-editor-container" :style="{ height: height }">
        <!-- 工具栏 -->
        <Toolbar class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />

        <!-- 编辑器主体 -->
        <Editor class="editor-body" v-model="contentHtml" :defaultConfig="editorConfig" :mode="mode"
            @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed" />
    </div>
</template>

<script setup>
import { shallowRef, computed, onBeforeUnmount, ref } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { ElMessage } from 'element-plus'
import { BASE_URL } from '@/utils/env'

// --- Props 定义 ---
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: '500px'
    },
    placeholder: {
        type: String,
        default: '请输入文章内容...'
    }
})

// --- Emits 定义 ---
const emit = defineEmits(['update:modelValue', 'update:content'])

// --- 核心变量 ---
const editorRef = shallowRef(null)
const mode = 'default'  // 使用默认模式

// --- 双向绑定 ---
const contentHtml = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit('update:modelValue', val)
    }
})

// --- 工具栏配置 ---
const toolbarConfig = {
    toolbarKeys: [
        // 标题和文本格式
        'headerSelect',
        'bold',
        'italic',
        'underline',
        'through',
        'code',
        'clearStyle',
        '|',

        // 颜色
        'color',
        'bgColor',
        '|',

        // 段落和列表
        'blockquote',
        'bulletedList',
        'numberedList',
        'todo',
        '|',

        // 对齐方式
        'justifyLeft',
        'justifyRight',
        'justifyCenter',
        'justifyJustify',
        '|',

        // 缩进
        'indent',
        'delIndent',
        '|',

        // 链接和图片
        'insertLink',
        'insertImage',
        'insertVideo',
        'insertTable',
        'codeBlock',
        '|',

        // 撤销重做
        'undo',
        'redo',
        '|',

        // 全屏
        'fullScreen'
    ]
}

// --- 自定义图片上传函数 ---
const customUploadImage = async (file, insertFn) => {
    console.log('开始上传图片:', file)

    // 创建 FormData
    const formData = new FormData()
    formData.append('file', file)

    // try {
    //     // 使用 fetch 上传
    //     const response = await fetch(`${BASE_URL}/upload`, {
    //         method: 'POST',
    //         body: formData
    //     })

    //     const result = await response.json()
    //     console.log('上传结果:', result)

    //     if (result.code === 200 && result.data) {
    //         // 构建图片 URL（根据你的后端返回结构调整）
    //         let imageUrl = ''
    //         if (result.data.url) {
    //             // 如果是相对路径，拼接完整 URL
    //             if (result.data.url.startsWith('/')) {
    //                 imageUrl = `${BASE_URL}${result.data.url}`
    //             } else if (result.data.url.startsWith('http')) {
    //                 imageUrl = result.data.url
    //             } else {
    //                 imageUrl = `${BASE_URL}/uploads/${result.data.url}`
    //             }
    //         } else if (result.data.filename) {
    //             imageUrl = `${BASE_URL}/uploads/${result.data.filename}`
    //         } else {
    //             // 如果后端直接返回 URL
    //             imageUrl = result.url || result.data
    //         }

    //         // 插入图片到编辑器
    //         insertFn(imageUrl, file.name, imageUrl)
    //         ElMessage.success('图片上传成功')
    //     } else {
    //         ElMessage.error(result.message || '图片上传失败')
    //     }
    // } catch (error) {
    //     console.error('图片上传错误:', error)
    //     ElMessage.error('图片上传失败，请检查网络连接')
    // }
}

// --- 编辑器配置 ---
const editorConfig = computed(() => ({
    placeholder: props.placeholder,
    MENU_CONF: {
        // 图片上传配置
        uploadImage: {
            // 使用自定义上传函数
            customUpload: customUploadImage,

            // 文件大小限制（10MB）
            maxFileSize: 10 * 1024 * 1024,

            // 允许的文件类型
            allowedFileTypes: ['image/*'],

            // 最大文件数量
            maxNumberOfFiles: 10,

            // 显示进度条
            showProgress: true,

            // 超时时间（30秒）
            timeout: 30 * 1000,

            // 自定义插入图片（处理后端返回的标准格式）
            customInsert: (res, insertFn) => {
                console.log('customInsert:', res)
                if (res.code === 200 && res.data) {
                    const url = res.data.url || res.data
                    insertFn(url, '', '')
                }
            }
        },

        // 视频上传配置（可选）
        // uploadVideo: {
        //     server: `${BASE_URL}/upload`,
        //     fieldName: 'file',
        //     maxFileSize: 50 * 1024 * 1024, // 50MB
        //     allowedFileTypes: ['video/*'],
        //     timeout: 60 * 1000
        // },

        // 链接配置
        insertLink: {
            checkLink: (text, url) => {
                if (!url) return false
                // 简单的 URL 验证
                return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')
            }
        }
    }
}))

// --- 编辑器事件处理 ---
const handleCreated = (editor) => {
    editorRef.value = editor
    console.log('编辑器创建成功', editor)

    // 可选：设置编辑器焦点
    // editor.focus()
}

const handleChange = (editor) => {
    // 实时同步内容
    const html = editor.getHtml()
    emit('update:content', html)
    emit('update:modelValue', html)
}

const handleDestroyed = () => {
    console.log('编辑器已销毁')
}

// --- 暴露方法给父组件 ---
defineExpose({
    // 获取编辑器实例
    getEditor: () => editorRef.value,

    // 清空内容
    clearContent: () => {
        if (editorRef.value) {
            editorRef.value.clear()
        }
    },

    // 设置内容
    setContent: (html) => {
        if (editorRef.value) {
            editorRef.value.setHtml(html)
        }
    },

    // 插入图片
    insertImage: (url, alt = '', href = '') => {
        if (editorRef.value) {
            editorRef.value.insertImage(url, alt, href)
        }
    },

    // 插入文本
    insertText: (text) => {
        if (editorRef.value) {
            editorRef.value.insertText(text)
        }
    },

    // 获取纯文本
    getText: () => {
        if (editorRef.value) {
            return editorRef.value.getText()
        }
        return ''
    }
})

// --- 组件卸载时销毁编辑器 ---
onBeforeUnmount(() => {
    if (editorRef.value) {
        editorRef.value.destroy()
        editorRef.value = null
    }
})
</script>

<style scoped lang="less">
.rich-editor-container {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #fff;
    transition: border-color 0.2s;

    &:hover {
        border-color: #c0c4cc;
    }

    &:focus-within {
        border-color: #409eff;
        box-shadow: 0 0 0 1px #409eff inset;
    }

    .toolbar {
        border-bottom: 1px solid #dcdfe6;
        background-color: #fafafa;

        // 自定义工具栏样式
        :deep(.w-e-bar) {
            background-color: #fafafa;
            border-bottom: none;
            padding: 4px 8px;
        }

        :deep(.w-e-bar-item) {
            padding: 0 4px;
        }

        :deep(.w-e-bar .w-e-bar-item button) {
            color: #606266;

            &:hover {
                color: #409eff;
                background-color: #ecf5ff;
            }
        }
    }

    .editor-body {
        flex: 1;

        :deep(.w-e-text-container) {
            background-color: #fff;

            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #c1c1c1;
                border-radius: 3px;

                &:hover {
                    background-color: #a8a8a8;
                }
            }

            &::-webkit-scrollbar-track {
                background-color: #f1f1f1;
            }
        }

        :deep(.w-e-text-placeholder) {
            color: #c0c4cc;
            font-style: normal;
        }

        :deep(.w-e-text-container [data-slate-editor]) {
            padding: 16px;
            min-height: 300px;
            font-size: 14px;
            line-height: 1.6;
            color: #2c3e50;
        }

        // 图片样式
        :deep(img) {
            max-width: 100%;
            cursor: pointer;
            border-radius: 4px;
            transition: transform 0.2s;

            &:hover {
                transform: scale(1.02);
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            }
        }

        // 代码块样式
        :deep(pre) {
            background-color: #f5f7fa;
            border-radius: 4px;
            padding: 12px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }

        // 表格样式
        :deep(table) {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;

            td,
            th {
                border: 1px solid #dcdfe6;
                padding: 8px 12px;
            }

            th {
                background-color: #f5f7fa;
                font-weight: 600;
            }
        }

        // 引用样式
        :deep(blockquote) {
            border-left: 4px solid #409eff;
            margin: 10px 0;
            padding: 8px 16px;
            background-color: #f5f7fa;
            color: #606266;
        }

        // 标题样式
        :deep(h1) {
            font-size: 28px;
            margin: 20px 0 16px;
            font-weight: 600;
        }

        :deep(h2) {
            font-size: 24px;
            margin: 18px 0 14px;
            font-weight: 600;
        }

        :deep(h3) {
            font-size: 20px;
            margin: 16px 0 12px;
            font-weight: 600;
        }

        // 列表样式
        :deep(ul),
        :deep(ol) {
            padding-left: 24px;
            margin: 8px 0;
        }

        :deep(li) {
            margin: 4px 0;
        }

        // 链接样式
        :deep(a) {
            color: #409eff;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}

// 全屏样式
:global(.w-e-full-screen-container) {
    z-index: 9999;
}
</style>