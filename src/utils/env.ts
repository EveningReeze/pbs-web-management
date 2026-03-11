// console.Log(import.meta.env.MODE)
console.log(import.meta.env.DEV) // 是否开发环境
console.log(import.meta.env.PROD) // 是否生产环境
console.log(import.meta.env.SSR) // 是否是服务器端渲染(server side render)

let BASE_URL = ''
const TIME_OUT = 1000
if (import.meta.env.PROD) {
  BASE_URL = 'http://codercba.prod:8000'
} else {
  BASE_URL = 'http://192.168.1.2:3000'
}

export { BASE_URL, TIME_OUT }
