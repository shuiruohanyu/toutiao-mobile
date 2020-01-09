import axios from 'axios'
import JSONBig from 'json-bigint' // 用来转化数据
import store from '@/store' // 用户存储数据
import router from '@/router' // 路由实例
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
}, async error => {
  if (error.response && error.response.status === 401) {
    // 2. 401出现（失效，本地不存在，未登录）
    const user = store.state.user
    // 获取最新的地址
    const login = { path: '/login', query: { redirect: router.currentRoute.path } }
    if (!user.token || !user.refresh_token) {
      // 去登录 既没有token 也没有 refresh_token
      router.push(login)
      return false
    }
    try {
      //  用refresh_token换取新的token
      // 3. (axios实例)发送刷新token的请求  异步操作
      // instance 在头部携带是 token 已经给你配置完毕
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 获取用户token成功  将token信息合并 并且提交mutations
      store.commit('updateUser', { user: { ...store.state.user, token: data.token } })
      // 现在 已经拿到最新的token vuex中已经是最新的了 可以继续发送错误的请求了
      return instance(error.config)
    } catch (error) {
      // 如果刷新token失败  说明都失效了 那就回到登录页 回登录页之前 先清空用户的存储信息
      store.commit('delUser') // 删除用户信息
      router.push(login)
    }
  }
  return Promise.reject(error)
})
export default instance
