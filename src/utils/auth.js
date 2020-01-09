const userKey = 'heima-toutiao-91' // 用来存储数据
// 用来存储token方法
export function setUser (user) {
  window.localStorage.setItem(userKey, JSON.stringify(user))
}
// 获取用户数据
export function getUser () {
  return JSON.parse(window.localStorage.getItem(userKey) || '{}') // 如果为空则获取一个新对象
}
// 删除用户数据
export function delUser () {
  window.localStorage.removeItem(userKey) // 删除用户数据
}
