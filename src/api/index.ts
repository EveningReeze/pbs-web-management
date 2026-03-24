import service from '@/utils/axios'
import type {
  LoginResponse,
  RegisterResponse,
  IsRegisterResponse,
  LoginForm,
  RegisterForm
} from '@/types'

// 检测账号是否注册接口
export const isRegisterApi = (): Promise<IsRegisterResponse> => service.post('/isRegister')

// 注册账号
export const registerApi = (data: RegisterForm): Promise<RegisterResponse> =>
  service.post('/register', data)

// 登录
export const loginApi = (data: LoginForm): Promise<LoginResponse> => service.post('/login', data)
