import { ref, reactive, toRefs, onMounted, watch } from 'vue'
import type { TagItem, ArticleItem } from '../types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
// import { addSubsetApi, getSubsetListApi, addLabelApi, getLabelListApi } from '@/api/subset' // 根据实际路径调整
import {
  addSubsetApi,
  addLabelApi,
  getSubsetApi,
  getLabelApi,
  deleteSubsetApi,
  deleteLabelApi,
  getArticlesApi
} from '@/api/index'
// --- 防抖定时器 ---
let debounceTimer: ReturnType<typeof setTimeout> | null = null

export const useArticleList = () => {
  const router = useRouter()
  const state = reactive({
    search: '',
    loading: false,
    articles: [] as ArticleItem[],
    total: 0
  })
  const dialogVisible = ref(false)
  // 分类标签配置（从后端获取）
  const categoryTags = ref<TagItem[]>([{ type: 'info', label: '全部', active: true, value: 'all' }])

  // 标签云配置（从后端获取）
  const labelTags = ref<TagItem[]>([{ type: 'info', label: '全部', active: true, value: 'all' }])
  watch(
    () => state.search,
    (newVal: string) => {
      // 1. 如果有正在进行的请求或定时器，取消它（防抖）
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      // 2. 如果输入为空，可以立即查询（显示全部）或不查询
      // 这里选择：如果清空了输入框，立即查询显示全部数据
      if (!newVal.trim()) {
        // 立即执行，不防抖
        fetchArticles()
        return
      }

      // 3. 如果有输入内容，设置防抖
      // 等待用户停止输入 500ms 后再执行查询
      debounceTimer = setTimeout(() => {
        fetchArticles()
      }, 500) // 500ms 防抖延迟
    }
  )
  // 新建分组/标签的值
  const groupingValue = ref('')
  const labelValue = ref('')

  // 获取分组列表
  const fetchSubsetList = async () => {
    try {
      const res = await getSubsetApi()
      if (res.data && Array.isArray(res.data)) {
        // 将后端返回的分组数据转换为 TagItem 格式
        const subsetTags: TagItem[] = [
          { type: 'info', label: '全部', active: true, value: 'all' },
          ...res.data.map((item: any) => ({
            type: 'info' as const,
            label: item.subset_name,
            active: false,
            value: item.id,
            moment: item.moment,
            id: item.id
          }))
        ]
        categoryTags.value = subsetTags
      }
    } catch (error) {
      console.error('获取分组列表失败:', error)
    }
  }

  // 获取标签列表
  const fetchLabelList = async () => {
    try {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }
      const res = await getLabelApi()
      if (res.data && Array.isArray(res.data)) {
        // 将后端返回的标签数据转换为 TagItem 格式
        const labelTagsData: TagItem[] = [
          { type: 'info', label: '全部', active: true, value: 'all' },
          ...res.data.map((item: any) => ({
            type: 'info' as const,
            label: item.label_name,
            active: false,
            value: item.id,
            moment: item.moment,
            id: item.id
          }))
        ]
        labelTags.value = labelTagsData
      }
    } catch (error) {
      console.error('获取标签列表失败:', error)
    }
  }

  // 获取文章列表
  const fetchArticles = async () => {
    state.loading = true
    try {
      const activeCategory = categoryTags.value.find((tag) => tag.active)
      const activeLabel = labelTags.value.find((tag) => tag.active)
      console.log(activeCategory, '=----activeCategory')
      console.log(activeLabel, '=----activeLabel')

      const params = {
        searchTerm: state.search, // 可选
        subsetId: activeCategory?.value === 'all' ? undefined : activeCategory?.value, // 可选
        label: activeLabel?.value === 'all' ? undefined : activeLabel?.label, // 可选
        introduce: '学习', // 可选
        labelId: activeLabel?.value === 'all' ? undefined : activeLabel?.value
      }
      const res = await getArticlesApi(params)
      state.articles = res.data?.result || []
      state.total = res.data?.total || 0
    } catch (error) {
      console.log(error)

      ElMessage.error('获取文章列表失败')
    } finally {
      state.loading = false
    }
  }

  // 分类标签点击
  const handleCategoryChange = (index: number, item: TagItem) => {
    console.log('分类切换:', item.label)
    fetchArticles()
  }

  // 标签点击
  const handleLabelChange = (index: number, item: TagItem) => {
    console.log('标签切换:', item.label)
    fetchArticles()
  }

  // 新建分组
  const handleCreateGroup = async (name: string) => {
    console.log(name)

    if (!name.trim()) {
      ElMessage.warning('请输入分组名称')
      return
    }
    let params = {
      moment: new Date(),
      subset_name: name,
      classify: 0
    }
    try {
      const res = await addSubsetApi(params)
      console.log(res)
      if (res.code === 200) {
        ElMessage.success(`分组 "${name}" 创建成功`)
        groupingValue.value = '' // 清空输入
        // 刷新分组列表
        await fetchSubsetList()
        // 可选：自动选中新创建的分组
        // 找到新创建的分组并选中
        const newTag = categoryTags.value.find((tag) => tag.label === name)
        if (newTag) {
          const newIndex = categoryTags.value.findIndex((tag) => tag.label === name)
          if (newIndex !== -1) {
            handleCategoryChange(newIndex, newTag)
          }
        }
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    } catch (error) {
      console.error('创建分组失败:', error)
      ElMessage.error('创建失败，请稍后重试')
    }
  }
  // 删除分组
  const handleDeleteGroup = async (id: number | string) => {
    try {
      await ElMessageBox.confirm('确定删除该分组吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })

      const res = await deleteSubsetApi({ subsetID: id })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await fetchSubsetList() // 刷新列表
        return true
      } else {
        ElMessage.error(res.message || '删除失败')
        return false
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除分组失败:', error)
        ElMessage.error('删除失败')
      }
    }
  }

  // 新建标签
  const handleCreateLabel = async (name: string) => {
    if (!name.trim()) {
      ElMessage.warning('请输入标签名称')
      return
    }
    let params = {
      label_name: name,
      moment: new Date()
    }
    try {
      const res = await addLabelApi(params)
      if (res.code === 200) {
        ElMessage.success(`标签 "${name}" 创建成功`)
        labelValue.value = '' // 清空输入
        // 刷新标签列表
        await fetchLabelList()
        // 可选：自动选中新创建的标签
        const newTag = labelTags.value.find((tag) => tag.label === name)
        if (newTag) {
          const newIndex = labelTags.value.findIndex((tag) => tag.label === name)
          if (newIndex !== -1) {
            handleLabelChange(newIndex, newTag)
          }
        }
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    } catch (error) {
      console.error('创建标签失败:', error)
      ElMessage.error('创建失败，请稍后重试')
    }
  }
  // 删除标签
  const handleDeleteLabel = async (id: number | string) => {
    try {
      await ElMessageBox.confirm('确定删除该标签吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })

      const res = await deleteLabelApi({ labelID: id })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await fetchLabelList() // 刷新列表
        return true
      } else {
        ElMessage.error(res.message || '删除失败')
        return false
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除标签失败:', error)
        ElMessage.error('删除失败')
      }
    }
  }

  // 查看文章
  const handleViewArticle = (article: ArticleItem) => {
    console.log(article)

    // 跳转到详情页
    // router.push({ name: 'ArticleDetail', params: { id: article.id } })
  }

  // 编辑文章
  const handleEditArticle = (article: ArticleItem) => {
    console.log(article)

    // 跳转到编辑页
    router.push({ name: 'article-form', params: { id: article.id } })
  }

  // 删除文章
  const handleDeleteArticle = async (article: ArticleItem) => {
    console.log(article)

    try {
      await ElMessageBox.confirm('确定删除该文章吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })

      //   const res = await deleteArticleApi(article.id)
      //   if (res.code === 200) {
      //     ElMessage.success('删除成功')
      //     fetchArticles() // 刷新列表
      //   } else {
      //     ElMessage.error(res.message || '删除失败')
      //   }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除文章失败:', error)
        ElMessage.error('删除失败')
      }
    }
  }
  // 搜索
  const handleSearch = () => {
    fetchArticles()
  }

  // 初始化
  const init = async () => {
    await Promise.all([fetchSubsetList(), fetchLabelList(), fetchArticles()])
  }

  // 组件挂载时初始化
  onMounted(() => {
    init()
  })

  return {
    ...toRefs(state),
    categoryTags,
    labelTags,
    groupingValue,
    labelValue,
    dialogVisible,
    fetchArticles,
    handleCategoryChange,
    handleLabelChange,
    handleCreateGroup,
    handleCreateLabel,
    handleViewArticle,
    handleEditArticle,
    handleDeleteArticle,
    handleSearch,
    handleDeleteGroup,
    handleDeleteLabel,
    init
  }
}
