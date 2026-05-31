import { ref, computed } from 'vue'

// ====================== 标签类型（独立） ======================
export interface LabelItem {
  id: number
  label_name: string
  moment: string
}

// ====================== 分组类型（独立，绝不混用） ======================
export interface SubsetItem {
  id: number
  subset_name: string
  classify: number
  moment: string
}

// ====================== 通用 Hook（无联合类型，纯泛型） ======================
export function useDataList<T>(initialData: T[] = []) {
  const dataList = ref<T[]>(initialData)

  // 时间格式化
  const formatTime = (isoStr: string) => {
    const date = new Date(isoStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 带格式化时间的列表（自动推断类型）
  const formattedList = computed(() => {
    return dataList.value.map((item) => ({
      ...item,
      formatTime: 'moment' in (item as any) ? formatTime((item as any).moment) : ''
    }))
  })

  // 设置数据
  const setData = (list: T[]) => {
    dataList.value = list
  }

  // 根据ID查找
  const findById = (id: number) => {
    return dataList.value.find((item: any) => item.id === id)
  }

  // 模糊搜索（自动适配 label_name / subset_name）
  const search = (keyword: string) => {
    if (!keyword) return dataList.value
    return dataList.value.filter((item: any) => {
      const name = item.label_name || item.subset_name || ''
      return name.toLowerCase().includes(keyword.toLowerCase())
    })
  }

  // 添加
  const add = (item: Omit<T, 'id'>) => {
    const maxId = dataList.value.length ? Math.max(...dataList.value.map((i: any) => i.id)) : 0
    dataList.value.push({ id: maxId + 1, ...item } as unknown as T)
  }

  // 删除
  const remove = (id: number) => {
    dataList.value = dataList.value.filter((item: any) => item.id !== id)
  }

  return {
    dataList,
    formattedList,
    formatTime,
    setData,
    findById,
    search,
    add,
    remove
  }
}
