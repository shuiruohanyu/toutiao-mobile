import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime) // 扩展dayjs功能
function sleep () {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), 300)
  })
}
// 转化时间到相对时间
function relTime (date) {
  return dayjs().locale('zh-cn').from(date)
}
export default {
  install (Vue) {
    Vue.prototype.$sleep = sleep
    Vue.filter('relTime', relTime)
  }
}
