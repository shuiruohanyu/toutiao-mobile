<template>
  <div>
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" />
    <van-cell-group>
      <van-field @blur="checkMobile" :error-message="errorMessage.mobile" v-model="loginForm.mobile" label="手机号" placeholder="请输入手机号"></van-field>
      <van-field @blur="checkCode" :error-message="errorMessage.code" v-model="loginForm.code" label="验证码" placeholder="请输入验证码">
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button @click="login" type='info' block>登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      errorMessage: {
        mobile: '', // 手机号提示信息
        code: '' // 验证码提示信息
      }
    }
  },
  methods: {
    checkMobile () {
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false
      } else if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      this.errorMessage.mobile = ''
      return true
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      } else if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码格式不正确'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    // 调用登录方法
    login () {
      let Mobile = this.checkMobile() // 检查手机号
      let Code = this.checkCode() // 检查验证码
      if (Mobile && Code) {
        // 如果一切OK  调用登录接口换取token
        console.log('验证OK')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.btn_box{
  padding: 10px;
}
</style>
