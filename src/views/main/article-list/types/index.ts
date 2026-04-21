import type { TagProps } from 'element-plus'

export interface TagItem {
  type: TagProps['type']
  label: string
  active?: boolean
  value?: string | number
  id?: string | number
}

export interface ArticleItem {
  id: number
  title: string
  cover: string
  introduce: string
  label: string
  moment: string
  views: number
  state: number
  classify: number
}

export interface CreatePopconfirmProps {
  title: string
  placeholder?: string
  maxlength?: number
}
