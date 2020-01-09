import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    // 更新用户信息
    updateUser (state, payLoad) {
      state.user = payLoad.user
      auth.setUser(payLoad.user) // 设置数据到缓存
    },
    // 删除掉用户信息
    delUser (state) {
      state.user = {}
      auth.delUser() // 删除存储信息
    }
  },
  getters: {},
  actions: {}
})
