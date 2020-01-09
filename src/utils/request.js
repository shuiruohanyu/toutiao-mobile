import axios from 'axios'

// 创建一个新的axios实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/'
})
export default instance
