function sleep () {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), 300)
  })
}
export default {
  install (Vue) {
    Vue.prototype.$sleep = sleep
  }
}
