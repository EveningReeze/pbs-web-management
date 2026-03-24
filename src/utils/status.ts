// 只返回消息，不负责弹窗
export const getStatusMessage = (status: number | string): string => {
  const messages: Record<number | string, string> = {
    300: 'token验证失败,请重新登录',
    303: 'token已过期,请重新登录',
    400: '请求错误(400)',
    401: '未授权，请重新登录(401)',
    403: '拒绝访问(403)',
    404: '请求出错(404)',
    408: '请求超时(408)',
    500: '服务器错误(500)',
    501: '服务未实现(501)',
    502: '网络错误(502)',
    503: '服务不可用(503)',
    504: '网络超时(504)',
    505: 'HTTP版本不受支持(505)'
  }

  return messages[status] || `连接出错(${status})!`
}
