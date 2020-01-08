<template>
  <div class="container">
    <van-nav-bar
      v-if="path!=='/user'"
      fixed
      title="黑马头条"
      right-text="搜索"
    />
     <!-- 二级路由容器 -->
     <div class='my-wrapper' :class="{ noTop: path === '/user' }"
>
       <router-view ></router-view>
     </div>
     <van-tabbar  route>
        <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
       <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
       <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
     </van-tabbar>
  </div>

</template>

<script>
export default {
  computed: {
    path () {
      return this.$route.path
    }
  }
}
</script>

<style lang='less' scoped>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
