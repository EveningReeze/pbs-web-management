import service from '@/utils/axios'
import type {
  LoginResponse,
  RegisterResponse,
  IsRegisterResponse,
  LoginForm,
  RegisterForm,
  ApiResponse
} from '@/types'

// 检测账号是否注册接口
export const isRegisterApi = (): Promise<IsRegisterResponse> => service.post('/isRegister')

// 注册账号
export const registerApi = (data: RegisterForm): Promise<RegisterResponse> =>
  service.post('/register', data)

// 登录
export const loginApi = (data: LoginForm): Promise<LoginResponse> => service.post('/login', data)

// 新建分组
export const addSubsetApi = (data: object): Promise<ApiResponse> => service.post('/addSubset', data)
// 获取分组
export const getSubsetApi = (): Promise<ApiResponse> => service.get('/subset')
// 修改分组
// export const updateSubsetApi = (data: object) => service.post('/updateSubset', data)
// 分组删除
export const deleteSubsetApi = (data: object): Promise<ApiResponse> =>
  service.post('/deleteSubset', data)

// 获取标签
export const getLabelApi = () => service.post('/label')
// 新建标签
export const addLabelApi = (data: object): Promise<ApiResponse> => service.post('/addLabel', data)
// 删除标签
export const deleteLabelApi = (data: object): Promise<ApiResponse> =>
  service.post('/deleteLabel', data)
// 修改标签
// export const updateLaelApi = (data: object) => service.post('/updateLabel', data)

// 上传文件
export const uploadApi = (data: object): Promise<ApiResponse> => service.post('/uploadApi', data)

// 新建文章
export const createArticleApi = (data: object): Promise<ApiResponse> =>
  service.post('/createArticle', data)
// 获取文章
export const getArticlesApi = (data: object): Promise<ApiResponse> => service.post('/article', data)
// 更新文章
export const updateArticleApi = (data: object): Promise<ApiResponse> =>
  service.post('/updateArticle', data)
// 获取文章详情
export const gainArticleApi = (data: object): Promise<ApiResponse> =>
  service.post('/gainArticle', data)
// 删除文章
export const deleteArticleApi = (data: object): Promise<ApiResponse> =>
  service.post('/deleteArticle', data)
