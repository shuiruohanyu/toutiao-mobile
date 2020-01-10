import request from '@/utils/request'
/**
 * 获取我的频道数据
 * **/
export function getMyChannels () {
  return request({
    url: 'user/channels'
  }) // 获取数据
}
// 获取所有频道

export function getChannels () {
  return request({
    url: '/channels' // 获取所有频道
  })
}
