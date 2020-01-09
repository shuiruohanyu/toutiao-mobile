<template>
  <div>
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" />
    <van-cell-group>
      <van-field label="手机号" placeholder="请输入手机号"></van-field>
      <van-field label="验证码" placeholder="请输入验证码">
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type='info' block>登录</van-button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang='less' scoped>
.btn_box{
  padding: 10px;
}
</style>
