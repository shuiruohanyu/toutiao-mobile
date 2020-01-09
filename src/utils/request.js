import axios from 'axios'
import JSONBig from 'json-bigint' // 用来转化数据
import store from '@/store' // 用户存储数据
// 创建一个新的axios实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
  transformResponse: [data => {
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
  }]
})
// 请求拦截器
instance.interceptors.request.use(config => {
  if (store.state.user.token) { config.headers.Authorization = `Bearer ${store.state.user.token}` }
  return config
}, err => Promise.reject(err))
// 响应拦截器
instance.interceptors.response.use(response => {
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, error => {
  return Promise.reject(error)
})
export default instance
