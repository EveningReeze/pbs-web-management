<template>
    <div class="article-container">
        <div style="margin: 5px;">
            <h3>{{ isEditMode ? '编辑文章' : '发布文章' }}</h3>
        </div>

        <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="100px">
            <div class="form-layout">
                <!-- 左侧表单区域 -->
                <div class="form-left">
                    <!-- 文章标题 -->
                    <el-form-item label="文章标题" prop="title">
                        <el-input style="width: 100%" v-model="form.title" placeholder="请输入标题" maxlength="50"
                            show-word-limit />
                    </el-form-item>

                    <!-- 文章分组 -->
                    <el-form-item label="文章分组" prop="subsetGroup">
                        <el-radio-group v-model="form.subsetGroup" size="small">
                            <el-radio-button :value="item.id" v-for="item in categoryTags" :key="item.id">
                                {{ item.subset_name }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <!-- 文章标签 -->
                    <el-form-item label="文章标签" prop="labelGroup">
                        <el-checkbox-group v-model="form.labelGroup" size="small">
                            <el-checkbox-button v-for="item in labelTags" :key="item.id" :value="item.id">
                                {{ item.label_name }}
                            </el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>

                    <!-- 文章简介 -->
                    <el-form-item label="文章简介" prop="introduce">
                        <el-input v-model="form.introduce" placeholder="请输入简介" type="textarea"
                            :autosize="{ minRows: 2, maxRows: 6 }" />
                    </el-form-item>
                </div>

                <!-- 右侧封面上传区域 -->
                <div class="form-right">
                    <el-form-item prop="imageUrl">
                        <div class="upload-wrapper">
                            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
                                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                <div class="avatar-container" v-if="form.imageUrl">
                                    <img :src="form.imageUrl" class="avatar" />
                                    <div class="avatar-overlay">
                                        <el-icon class="delete-icon" @click.stop="handleDeleteImage">
                                            <Delete />
                                        </el-icon>
                                    </div>
                                </div>
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                            <div class="upload-tip">建议尺寸：178x178像素，支持JPG/PNG格式，大小不超过2MB</div>
                        </div>
                    </el-form-item>
                </div>
            </div>

            <!-- 文章内容 -->
            <el-form-item label="文章内容" prop="content">
                <RichEditor v-model="form.content" :height="'500px'" placeholder="请在这里编辑文章内容..." />
            </el-form-item>

            <!-- 操作按钮 -->
            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    {{ isEditMode ? '更新' : '发布' }}
                </el-button>
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { BASE_URL } from '@/utils/env'
import { createArticleApi, gainArticleApi, updateArticleApi, getSubsetApi, getLabelApi } from '@/api/index'
import RichEditor from '@/components/Editor/index.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// --- 类型定义 ---
interface TagItem {
    id: number
    subset_name?: string
    label_name?: string
    classify?: number
    moment: string
}

interface ArticleForm {
    title: string
    introduce: string
    content: string
    imageUrl: string
    subsetGroup: number
    labelGroup: number[]
    serverFileName?: string
    fileId?: number
}

// --- 响应式数据 ---
const ruleFormRef = ref<FormInstance>()
const url = `${BASE_URL}/upload`
const uploadUrl = ref(url)

const categoryTags = ref<TagItem[]>([])
const labelTags = ref<TagItem[]>([])

// 编辑模式标识
const isEditMode = ref(false)
const articleId = ref<string>('')

const form = reactive<ArticleForm>({
    title: '',
    introduce: "",
    content: '',
    imageUrl: '',
    subsetGroup: 0,
    labelGroup: [],
    serverFileName: '',
    fileId: 0
})



// --- 生命周期 ---
onMounted(() => {
    fetchSubsetList()
    fetchLabelList()
})

// 组件卸载前清理内存 URL
onBeforeUnmount(() => {
    if (form.imageUrl && form.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(form.imageUrl)
    }
})

// --- API 请求 ---
const fetchSubsetList = async () => {
    try {
        const res = await getSubsetApi()
        categoryTags.value = res.data || []
    } catch (error) {
        console.error('获取分组列表失败:', error)
        ElMessage.error('分组加载失败')
    }
}

const fetchLabelList = async () => {
    try {
        const res = await getLabelApi()
        labelTags.value = res.data || []
    } catch (error) {
        console.error('获取标签列表失败:', error)
        ElMessage.error('标签加载失败')
    }
}

// 获取文章详情（编辑模式）
const fetchArticleDetail = async (id: string) => {
    try {
        console.log(id);

        const res = await gainArticleApi({ id })
        console.log(res.code, res.data);

        if (res.code === 200 && res.data) {
            const article = res.data[0]

            // 回显表单数据
            form.title = article.title || ''
            form.introduce = article.introduce || ''
            form.content = article.content || ''
            form.subsetGroup = article.subset_id || 0
            form.labelGroup = article.label.split(',') || []
            if (article.label) {
                if (typeof article.label === 'string') {
                    // 如果是字符串 "3,2"，转换为数组 [3, 2]
                    form.labelGroup = article.label.split(',').map(Number).filter((id: any) => id !== 0)
                } else if (Array.isArray(article.label)) {
                    // 如果已经是数组，直接使用
                    form.labelGroup = article.label
                } else {
                    form.labelGroup = []
                }
            } else {
                form.labelGroup = []
            }
            // 回显封面图片
            if (article.cover) {
                // 判断是否是完整URL还是相对路径
                if (article.cover.startsWith('http')) {
                    form.imageUrl = article.cover
                } else {
                    form.imageUrl = `${BASE_URL}/uploads/${article.cover}`
                }
                form.serverFileName = article.cover
                form.fileId = article.file_id || 0
            }
        } else {
            ElMessage.error(res.message || '获取文章详情失败')
        }
    } catch (error) {
        console.error('获取文章详情失败:', error)
        ElMessage.error('获取文章详情失败')
    }
}

// --- 上传处理 ---
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, file) => {
    console.log('上传响应:', response)
    console.log('上传文件:', file)

    if (response && response.code === 200 && response.data) {
        form.serverFileName = response.data.url
        form.fileId = response.data.id

        if (response.data.accessUrl) {
            form.imageUrl = response.data.accessUrl
        } else {
            const url = URL.createObjectURL(file.raw!)
            form.imageUrl = url
        }
    } else {
        const url = URL.createObjectURL(file.raw!)
        form.imageUrl = url
    }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    console.log('上传URL:', uploadUrl.value)

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(rawFile.type)) {
        ElMessage.error('图片必须是 JPG/JPEG/PNG 格式!')
        return false
    }
    if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过 2MB!')
        return false
    }
    return true
}

// --- 删除图片功能 ---
const handleDeleteImage = async () => {
    ElMessageBox.confirm(
        '确定要删除这张图片吗？删除后将无法恢复。',
        '删除确认',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'el-button--danger'
        }
    ).then(async () => {
        if (form.serverFileName || form.fileId) {
            try {
                const deleteUrl = `${BASE_URL}/delete-file`
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fileName: form.serverFileName,
                        fileId: form.fileId
                    })
                })

                if (response.ok) {
                    const result = await response.json()
                    if (result.code === 200) {
                        ElMessage.success('服务器图片已删除')
                    } else {
                        ElMessage.warning(result.message || '服务器删除失败')
                    }
                } else {
                    console.error('删除请求失败:', response.status)
                    ElMessage.warning('服务器删除失败，但本地图片已清除')
                }
            } catch (error) {
                console.error('删除图片失败:', error)
                ElMessage.warning('服务器连接失败，但本地图片已清除')
            }
        }

        if (form.imageUrl && form.imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(form.imageUrl)
        }

        form.imageUrl = ''
        form.serverFileName = ''
        form.fileId = 0

        ElMessage.success('图片已删除')

    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// --- 表单验证与提交 ---
const validateContent = (_rule: any, value: string, callback: Function) => {
    if (!value) return callback(new Error('内容不能为空'))
    const text = value.replace(/<[^>]+>/g, '').trim()
    if (!text) return callback(new Error('请填写具体的文章内容'))
    callback()
}

const rules = reactive<FormRules<ArticleForm>>({
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    imageUrl: [{ required: true, message: '请上传封面', trigger: 'change' }],
    introduce: [{ required: true, message: '请输入文章简介', trigger: 'blur' }],
    subsetGroup: [{ required: true, message: '请选择分组', trigger: 'change' }],
    labelGroup: [{ type: 'array', required: true, message: '请选择标签', trigger: 'change' }],
    content: [{ validator: validateContent, trigger: 'blur' }]
})

// 重置表单字段（不重置路由监听）
const resetFormFields = () => {
    form.title = ''
    form.introduce = ''
    form.content = ''
    form.imageUrl = ''
    form.subsetGroup = 0
    form.labelGroup = []
    form.serverFileName = ''
    form.fileId = 0

    if (ruleFormRef.value) {
        ruleFormRef.value.clearValidate()
    }
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        await formEl.validate()

        const submitData = {
            title: form.title,
            introduce: form.introduce,
            content: form.content,
            cover: form.serverFileName || form.imageUrl,
            subset_id: form.subsetGroup,
            label: form.labelGroup,
            classify: 0,
            state: 0,
            moment: new Date()
        }

        console.log('✅ 提交数据:', submitData)

        let res
        if (isEditMode.value) {
            // 编辑模式：调用更新接口
            console.log(articleId.value, submitData);

            res = await updateArticleApi({ id: articleId.value, value: submitData })
            if (res.code === 200) {
                ElMessage.success('文章更新成功！')
                router.push("/main/article-list")
            } else {
                ElMessage.error(res.message || '更新失败')
            }
        } else {
            // 新增模式：调用创建接口
            res = await createArticleApi(submitData)
            if (res.code === 200) {
                ElMessage.success('文章发布成功！')
                resetForm(ruleFormRef.value)
                router.push("/main/article-list")
            } else {
                ElMessage.error(res.message || '发布失败')
            }
        }

    } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('请检查表单填写')
    }
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()

    if (form.imageUrl && form.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(form.imageUrl)
    }

    form.imageUrl = ''
    form.serverFileName = ''
    form.fileId = 0
}

// --- 监听路由参数变化 ---
watch(
    () => route.params.id,
    async (newId) => {
        if (newId && newId !== 'new') {
            isEditMode.value = true
            articleId.value = newId as string
            await fetchArticleDetail(newId as string)
        } else {
            isEditMode.value = false
            articleId.value = ''
            resetFormFields()
        }
    },
    { immediate: true }
)
</script>

<style scoped>
/* 修复滚动条问题的关键样式 */
.article-container {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    padding: 20px;
    box-sizing: border-box;
}

/* 表单布局 - 解决横排滚动 */
.form-layout {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 20px;
}

.form-left {
    flex: 1;
    min-width: 300px;
    max-width: 600px;
}

.form-right {
    flex-shrink: 0;
    width: 200px;
}

/* 响应式布局 */
@media (max-width: 768px) {
    .form-layout {
        flex-direction: column;
        gap: 20px;
    }

    .form-left {
        max-width: 100%;
    }

    .form-right {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .article-container {
        padding: 15px;
    }
}

/* 表单样式优化 */
:deep(.el-form) {
    width: 100%;
}

:deep(.el-form-item) {
    margin-bottom: 20px;
    width: 100%;
}

:deep(.el-form-item__content) {
    width: calc(100% - 100px);
}

:deep(.el-input),
:deep(.el-textarea) {
    width: 100%;
}

:deep(.el-radio-group),
:deep(.el-checkbox-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

/* 封面样式 */
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
    border-radius: 4px;
}

.el-checkbox-button {
    margin: 0;
    border-radius: 12px;
}

/* 悬停删除样式 */
.upload-wrapper {
    display: inline-block;
    text-align: center;
}

.upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
    text-align: center;
    max-width: 178px;
}

.avatar-container {
    position: relative;
    width: 178px;
    height: 178px;
}

.avatar {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: 4px;
}

.avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 4px;
}

.avatar-container:hover .avatar-overlay {
    opacity: 1;
}

.delete-icon {
    font-size: 32px;
    color: white;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.delete-icon:hover {
    transform: scale(1.15);
    color: #f56c6c;
}

/* 富文本编辑器容器 */
:deep(.rich-editor-container) {
    width: 100%;
    overflow: hidden;
}
</style>

<style>
/* 全局样式 - 修复页面滚动问题 */
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    line-height: 178px;
}

/* 修复全局滚动条问题 */
html,
body {
    overflow-x: hidden;
    margin: 0;
    padding: 0;
}

#app {
    overflow-x: hidden;
}
</style>