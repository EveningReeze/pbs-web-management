// composables/useArticleData.ts
import { ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

import { getArticlesApi, getLabelApi, getSubsetApi } from '@/api/index'
import type { Article, Tag, Group, GroupDetail, TagDetail } from '@/types/article'

export function useArticleData() {
  const loading = ref(false)
  const tableLoading = ref(false)
  const articles = ref<Article[]>([])
  const labelTags = ref<Article[]>([])
  const tags = ref<Tag[]>([])
  const groups = ref<Group[]>([])
  const chartKey = ref(0)

  // ========== 高性能映射表（分组、标签分离，修复原逻辑错误） ==========
  /** 分组ID -> 分组名称 Map */
  const groupMap = computed(() => {
    const map = new Map<number, string>()
    tags.value.forEach((item) => {
      map.set(item.id, item.label_name)
    })
    return map
  })
  // 创建 Map 映射表，提高查询性能（O(1) 复杂度）
  const labelMap = computed(() => {
    const map = new Map<number, string>()
    labelTags.value.forEach((item) => {
      const tagName = item.label_name || item.name || ''
      map.set(Number(item.id), tagName)
    })
    return map
  })
  /** 标签ID -> 标签名称 Map（标签专用，O(1) 查询） */
  const tagMap = computed(() => {
    const map = new Map<number, string>()
    tags.value.forEach((item) => {
      const tagName = item.label_name || item.name || ''
      map.set(Number(item.id), tagName)
    })
    return map
  })

  // ========== 统计计算属性 ==========
  const totalArticles = computed(() => articles.value.length)
  const totalViews = computed(() =>
    articles.value.reduce((sum, item) => sum + (item?.views || 0), 0)
  )
  const groupCount = computed(() => groups.value.length)
  const tagCount = computed(() => tags.value.length)

  // ========== 工具方法 ==========
  /**
   * 获取单个标签名称
   * @param tagId 标签ID
   */
  const getTagName = (tagId: string | number): string => {
    const id = Number(tagId)
    if (isNaN(id) || id <= 0) return '未知标签'
    return labelMap.value.get(id) || `标签${id}`
  }

  /**
   * 根据ID字符串获取标签名称（支持单个/逗号分隔多标签，全容错）
   * @param id 标签ID字符串: "1" / "1,2,3" / null / undefined / ""
   */

  /**
   * 根据分组ID获取分组名称
   * @param groupId 分组ID
   */
  const getGroupName = (groupId: number | undefined): string => {
    if (groupId === undefined || isNaN(groupId) || groupId < 0) return '未知分组'
    return groupMap.value.get(groupId) || `分组${groupId}`
  }

  /**
   * 根据标签ID获取标签样式类型（Element Plus 标签主题）
   * @param labelId 标签ID
   */
  const getLabelTagType = (labelId: string): string => {
    if (!labelId) return 'info'
    const colors = ['primary', 'success', 'warning', 'danger', 'info']
    const index = parseInt(labelId) % colors.length
    return colors[index]
  }

  /**
   * 格式化日期为 年月日 格式
   * @param date 日期字符串
   */
  const formatDate = (date: string): string => {
    if (!date) return '未知日期'
    return new Date(date).toLocaleDateString('zh-CN')
  }

  /**
   * 格式化大数字（万单位简写）
   * @param num 原始数字
   */
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w'
    }
    return num?.toString() || '0'
  }

  // ========== 数据处理：分组统计 ==========
  const processGroupData = (): GroupDetail[] => {
    const groupDetailMap = new Map<
      number,
      { groupId: number; articles: Article[]; labels: Set<string> }
    >()

    articles.value.forEach((article) => {
      if (article?.subset_id !== undefined) {
        if (!groupDetailMap.has(article.subset_id)) {
          groupDetailMap.set(article.subset_id, {
            groupId: article.subset_id,
            articles: [],
            labels: new Set()
          })
        }
        const group = groupDetailMap.get(article.subset_id)!
        group.articles.push(article)
        if (article?.label) {
          group.labels.add(article.label)
        }
      }
    })

    return Array.from(groupDetailMap.values())
      .map((group) => {
        const total = group.articles.reduce((sum, a) => sum + (a?.views || 0), 0)
        return {
          groupId: group.groupId,
          groupName: getGroupName(group.groupId),
          articleCount: group.articles.length,
          totalViews: total,
          avgViews: group.articles.length > 0 ? total / group.articles.length : 0,
          labels: Array.from(group.labels),
          articles: group.articles
        }
      })
      .sort((a, b) => b.totalViews - a.totalViews)
  }

  // ========== 数据处理：标签统计 ==========
  const processTagData = (): TagDetail[] => {
    const tagDetailMap = new Map<
      string,
      { tagId: string; articles: Article[]; groups: Set<number> }
    >()

    articles.value.forEach((article) => {
      if (article?.label) {
        if (!tagDetailMap.has(article.label)) {
          tagDetailMap.set(article.label, {
            tagId: article.label,
            articles: [],
            groups: new Set()
          })
        }
        const tag = tagDetailMap.get(article.label)!
        tag.articles.push(article)
        if (article?.subset_id !== undefined) {
          tag.groups.add(article.subset_id)
        }
      }
    })

    return Array.from(tagDetailMap.values())
      .map((tag) => {
        const total = tag.articles.reduce((sum, a) => sum + (a?.views || 0), 0)
        return {
          tagId: tag.tagId,
          tagName: getTagName(tag.tagId),
          articleCount: tag.articles.length,
          totalViews: total,
          avgViews: tag.articles.length > 0 ? total / tag.articles.length : 0,
          groups: Array.from(tag.groups),
          articles: tag.articles
        }
      })
      .sort((a, b) => b.totalViews - a.totalViews)
  }

  // ========== 图表统计数据 ==========
  const getChartStats = () => {
    // 分组文章数量统计
    const groupStats = new Map<number, number>()
    articles.value.forEach((article) => {
      if (article?.subset_id !== undefined) {
        groupStats.set(article.subset_id, (groupStats.get(article.subset_id) || 0) + 1)
      }
    })

    // 标签文章数量统计
    const labelStats = new Map<string, number>()
    articles.value.forEach((article) => {
      if (article?.label) {
        const labelName = getTagName(article.label)
        labelStats.set(labelName, (labelStats.get(labelName) || 0) + 1)
      }
    })

    // 文章浏览量TOP10
    const viewsRanking = [...articles.value]
      .filter((a) => a?.views !== undefined)
      .sort((a, b) => (b?.views || 0) - (a?.views || 0))
      .slice(0, 10)
      .map((article) => ({ name: article?.title || '无标题', value: article?.views || 0 }))

    // 分组浏览量统计
    const groupViews = new Map<number, { total: number; count: number }>()
    articles.value.forEach((article) => {
      if (article?.subset_id !== undefined) {
        const stats = groupViews.get(article.subset_id) || { total: 0, count: 0 }
        stats.total += article?.views || 0
        stats.count += 1
        groupViews.set(article.subset_id, stats)
      }
    })

    // 标签浏览量统计
    const labelViews = new Map<string, { total: number; count: number }>()
    articles.value.forEach((article) => {
      if (article?.label) {
        const stats = labelViews.get(article.label) || { total: 0, count: 0 }
        stats.total += article?.views || 0
        stats.count += 1
        labelViews.set(article.label, stats)
      }
    })

    // 按月时间趋势
    const monthMap = new Map<string, number>()
    articles.value.forEach((article) => {
      if (article?.moment) {
        const month = article.moment.split('T')[0].substring(0, 7)
        monthMap.set(month, (monthMap.get(month) || 0) + 1)
      }
    })

    return {
      groupStats: Array.from(groupStats.entries()).map(([id, count]) => ({
        name: getGroupName(id),
        value: count
      })),
      labelStats: Array.from(labelStats.entries()).map(([name, value]) => ({ name, value })),
      viewsRanking,
      groupViews: {
        names: Array.from(groupViews.keys()).map((id) => getGroupName(id)),
        totals: Array.from(groupViews.values()).map((v) => v.total),
        avgs: Array.from(groupViews.values()).map((v) => Math.round(v.total / v.count))
      },
      labelViews: {
        names: Array.from(labelViews.keys()).map((id) => getTagName(id)),
        totals: Array.from(labelViews.values()).map((v) => v.total),
        avgs: Array.from(labelViews.values()).map((v) => Math.round(v.total / v.count))
      },
      timeline: {
        months: Array.from(monthMap.keys()).sort(),
        counts: Array.from(monthMap.values())
      }
    }
  }

  // ========== 数据请求 & 刷新 ==========
  const fetchData = async () => {
    loading.value = true
    tableLoading.value = true
    try {
      const [articlesRes, labelsRes, subsetsRes] = await Promise.all([
        getArticlesApi({}),
        getLabelApi(),
        getSubsetApi()
      ])

      if (articlesRes?.code === 200) {
        articles.value = articlesRes.data?.result || []
      }
      if (labelsRes?.code === 200) {
        tags.value = labelsRes.data || []
        console.log(tags.value, '11111')
      }
      if (subsetsRes?.code === 200) {
        groups.value = subsetsRes.data || []
      }

      chartKey.value++
      return true
    } catch (error) {
      console.error('获取数据失败:', error)
      ElMessage.error('数据加载失败')
      return false
    } finally {
      loading.value = false
      tableLoading.value = false
    }
  }
  // 获取标签列表
  const fetchLabelList = async () => {
    try {
      const res = await getLabelApi()
      if (res.data && Array.isArray(res.data)) {
        // 将后端返回的标签数据转换为 TagItem 格式

        labelTags.value = res.data
      }
    } catch (error) {
      console.error('获取标签列表失败:', error)
    }
  }
  const refreshData = () => fetchData()
  // const getLabelNameById = async (id: string | undefined | null): Promise<string> => {
  //   console.log(labelTags.value)

  //   // 处理空值情况
  //   if (!id || id === 'undefined' || id === 'null') {
  //     return '未分类'
  //   }

  //   // 统一转换为字符串处理
  //   const idStr = String(id)

  //   // 处理单个 ID
  //   if (!idStr.includes(',')) {
  //     const numId = parseInt(idStr)
  //     let str = '#' + labelMap.value.get(numId)
  //     // 修复：确保 labelMap 的 key 是 number 类型
  //     return str || '未分类'
  //   }

  //   // 处理多个 ID（例如："2,4" 或 "2, 4"）
  //   const ids = idStr.split(',').map((i) => parseInt(i.trim()))
  //   const names = ids
  //     .map((numId) => labelMap.value.get(numId))
  //     .filter((name): name is string => !!name)
  //     .map((name) => `#${name}`)

  //   return names.length > 0 ? names.join(' ') : '未分类'
  // }

  // ========== 组件卸载清空数据 ==========
  const cleanup = () => {
    articles.value = []
    tags.value = []
    groups.value = []
  }

  onUnmounted(cleanup)

  // ========== 向外暴露 ==========
  return {
    // 状态
    loading,
    tableLoading,
    articles,
    tags,
    groups,
    chartKey,

    // 计算属性
    totalArticles,
    totalViews,
    groupCount,
    tagCount,

    // 工具方法
    getTagName,
    getGroupName,
    getLabelTagType,
    formatDate,
    formatNumber,

    // 数据处理
    processGroupData,
    processTagData,
    getChartStats,

    // 请求方法
    fetchLabelList,
    fetchData,
    refreshData,
    cleanup
  }
}
