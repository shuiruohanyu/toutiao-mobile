import router from './router'
import store from './store'
router.beforeEach(function (to, form, next) {
  if (to.path.startsWith('/user') && !store.state.user.token) {
    //   没有token强制跳转到 登录页
    next({ path: '/login', query: { redirect: to.path } }) // 为什么要这么写 因为如果因为token权限不足 到登录页 之后还要回到之前要去的页面
  } else {
    next() // 继续走
  }
})
