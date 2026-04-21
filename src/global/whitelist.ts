// constants/index.ts 或创建新的文件 constants/whitelist.ts

// 不需要 token 的接口白名单
export const WHITE_LIST_URLS = [
  '/login', // 登录接口
  '/register', // 注册接口
  '/sendCode', // 发送验证码
  '/refreshToken' // 刷新token接口（可选）
]

// 或者使用正则匹配
export const WHITE_LIST_PATTERNS = [
  /^\/public\/.*/, // 匹配所有 /public/ 开头的接口
  /^\/health/ // 健康检查接口
]

// 检查是否需要 token
export const isWhiteList = (url: string): boolean => {
  // 精确匹配
  if (WHITE_LIST_URLS.includes(url)) {
    return true
  }
  // 正则匹配
  return WHITE_LIST_PATTERNS.some((pattern) => pattern.test(url))
}
