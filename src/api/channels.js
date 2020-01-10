import request from '@/utils/request'
import store from '@/store'
const CHANNELS_KEY = 'hm-toutiao-91-channel'
/**
 * 获取我的频道数据
 * **/
export function getMyChannels () {
  return new Promise(async function (resolve, reject) {
    if (store.state.user.token) {
      // 在登录情况下
      let data = await request({
        url: 'user/channels'
      }) // 获取数据
      resolve(data)
    } else {
      // 没有登录下
      const cacheChannel = localStorage.getItem(CHANNELS_KEY)
      if (cacheChannel) {
        // 有缓存的情况下
        resolve({ channels: JSON.parse(cacheChannel) })
      } else {
        // 没缓存的情况下
        let data = await request({
          url: 'user/channels'
        }) // 获取数据
        localStorage.setItem(CHANNELS_KEY, JSON.stringify(data.channels))
        resolve(data)
      }
    }
  })
}
// 删除频道API
export function delChannel (id) {
  return new Promise(async function (resolve, reject) {
    try {
      if (store.state.user.token) {
        // 有登录的情况下直接调用删除接口
        await request({
          url: '/user/channels/' + id,
          method: 'delete'
        })
        resolve() // 成功
      } else {
        // 没登录  删除的时候本地肯定已经有了
        let str = localStorage.getItem(CHANNELS_KEY) // 获取本地的频道数据
        let result = JSON.parse(str)
        localStorage.setItem(CHANNELS_KEY, JSON.stringify(result.filter(item => item.id !== id)))
        resolve()
      }
    } catch (error) {
      reject(error)
    }
  })
}
// 获取所有频道

export function getChannels () {
  return request({
    url: '/channels' // 获取所有频道
  })
}
