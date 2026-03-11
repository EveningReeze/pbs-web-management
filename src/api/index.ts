import service from '@/utils/axios'

// 测试接口
export const isRegisterApi = () => service.post('/isRegister')
