// import { BASE_URL, TIME_OUT } from './env'
// import axios from 'axios'
// import { ElMessage } from 'element-plus'
// import { getStatusMessage } from '@/utils/status'
// const service = axios.create({
//   baseURL: BASE_URL,
//   timeout: TIME_OUT
// })
// /// 添加请求拦截器
// service.interceptors.request.use(
//   // 在发送请求之前做些什么
//   (config) => {
//     return config
//   },
//   // 对请求错误做些什么
//   (error) => {
//     ElMessage({ type: 'warning', message: error.message })
//     return Promise.reject()
//   }
// )

// // 添加响应拦截器
// // 在拦截器中使用
// service.interceptors.response.use(
//   (response) => {
//     if (response.status === 200) {
//       return response.data
//     } else {
//       const message = getStatusMessage(response.status)
//       ElMessage({ type: 'error', message })
//       return Promise.reject(response.status)
//     }
//   },
//   (error) => {
//     const message = getStatusMessage(error.response?.status || 'NETWORK_ERROR')
//     ElMessage({ type: 'error', message })
//     return Promise.reject(error)
//   }
// )

// export default service

import { BASE_URL, TIME_OUT } from './env'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getStatusMessage } from '@/utils/status'
import { sessionCache } from '@/utils/cache'
import { LOGIN_TOKEN } from '@/global/constants'
import { isWhiteList } from '@/global/whitelist'

const service = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 获取 token
    const token = sessionCache.getCache(LOGIN_TOKEN)

    // 判断当前接口是否在白名单中
    const isInWhiteList = isWhiteList(config.url || '')

    // 如果不在白名单中，则需要验证 token
    if (!isInWhiteList) {
      if (token) {
        // 将 token 添加到请求头
        config.headers.Authorization = `Bearer ${token}`
        // 或者使用自定义 header
        // config.headers['X-Token'] = token
      } else {
        // token 不存在，提示并跳转登录页（可选）
        ElMessage({ type: 'warning', message: `接口 ${config.url} 需要 token 但未提供` })
        // 可以选择拦截请求并跳转登录
        // ElMessage.warning('请先登录')
        // router.push('/login')
        // return Promise.reject(new Error('请先登录'))
      }
    }

    return config
  },
  (error) => {
    ElMessage({ type: 'warning', message: error.message })
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      // 可以根据后端返回的 code 进行统一处理
      const data = response.data

      // 如果后端返回的 code 表示 token 过期
      if (data.code === 401) {
        // 清除本地 token
        sessionCache.removeCache(LOGIN_TOKEN)
        ElMessage.error('登录已过期，请重新登录')
        // 跳转到登录页
        // router.push('/login')
        return Promise.reject(new Error('登录已过期'))
      }

      return data
    } else {
      const message = getStatusMessage(response.status)
      ElMessage({ type: 'error', message })
      return Promise.reject(response.status)
    }
  },
  (error) => {
    // 处理 401 未授权
    if (error.response?.status === 401) {
      sessionCache.removeCache(LOGIN_TOKEN)
      ElMessage.error('登录已过期，请重新登录')
      // router.push('/login')
    }

    const message = getStatusMessage(error.response?.status || 'NETWORK_ERROR')
    ElMessage({ type: 'error', message })
    return Promise.reject(error)
  }
)

export default service
