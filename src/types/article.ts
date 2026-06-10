// types/article.ts
export interface Article {
  id: number
  title: string
  subset_id: number
  label: string
  introduce: string
  content: string
  cover: string
  views: number
  state: number
  moment: string
}

// 接口返回基础结构
export interface BaseRes<T> {
  code: number
  message: string
  data: T
}
export interface Tag {
  id: number
  label_name?: string
  name?: string
}

export interface Group {
  id: number
  subset_name?: string
  name?: string
}

export interface GroupDetail {
  groupId: number
  groupName: string
  articleCount: number
  totalViews: number
  avgViews: number
  labels: string[]
  articles: Article[]
}

export interface TagDetail {
  tagId: string
  tagName: string
  articleCount: number
  totalViews: number
  avgViews: number
  groups: number[]
  articles: Article[]
}
