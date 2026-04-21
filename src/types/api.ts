// 通用 API 响应结构
export interface ApiResponse<T = any> {
  code: number // 200 成功，201 登录失败，300 验证失败等
  message: string
  data: T
}

// 登录成功后返回的用户信息（对应 serve.js 中的 userinfo）
export interface LoginUserInfo {
  id?: number
  name: string
  username: string
  password?: string // 实际返回中可能包含，但前端不应依赖
  token: string
  [key: string]: any // 如果有其他字段（如 avatar、role 等）
}
// 定义文章数据类型
export interface ArticleForm {
  title: string
  categoryId: number
  coverImage: string
  content: string // 富文本 HTML 内容
  summary: string // 文章摘要
  status: 'published' | 'draft' // 状态：已发布 或 草稿
  tags: string[]
}

// 登录接口的响应数据类型（成功时）
export type LoginResponse = ApiResponse<LoginUserInfo>

// 注册接口的响应数据（data 为空对象）
export type RegisterResponse = ApiResponse<Record<string, never>>

// 检测账号是否注册的响应数据
export type IsRegisterResponse = ApiResponse<Record<string, never>>
