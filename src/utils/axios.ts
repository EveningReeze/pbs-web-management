import { BASE_URL, TIME_OUT } from './env'
import axios from 'axios'
import { ElMessage } from 'element-plus'
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
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    } else {
      ElMessage({ type: 'warning', message: 'error' })
      Promise.reject()
    }
  },
  (error) => {
    ElMessage({ type: 'warning', message: error.message })
    return Promise.reject()
  }
)

export default service
