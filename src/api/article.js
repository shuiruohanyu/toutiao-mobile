import request from '@/utils/request'

export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles', // 这里写全路径是因为  和别的接口口的前缀不一致
    params: { ...params, with_top: 1 } // 因为 with_top功能没实现 但是必须传递所以在这里写死
  })
}

// 对文章不感兴趣
export function disListArticle (data) {
  return request({
    url: '/article/dislikes',
    data,
    method: 'post'
  })
}
