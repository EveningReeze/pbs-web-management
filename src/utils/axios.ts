import { BASE_URL, TIME_OUT } from './env'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getStatusMessage } from '@/utils/status'
const service = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT
})
/// 添加请求拦截器
service.interceptors.request.use(
  // 在发送请求之前做些什么
  (config) => {
    return config
  },
  // 对请求错误做些什么
  (error) => {
    ElMessage({ type: 'warning', message: error.message })
    return Promise.reject()
  }
)

// 添加响应拦截器
// 在拦截器中使用
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    } else {
      const message = getStatusMessage(response.status)
      ElMessage({ type: 'error', message })
      return Promise.reject(response.status)
    }
  },
  (error) => {
    const message = getStatusMessage(error.response?.status || 'NETWORK_ERROR')
    ElMessage({ type: 'error', message })
    return Promise.reject(error)
  }
)

export default service
