<template>
  <div>
    <van-nav-bar title="搜索" left-arrow @click-left="$router.back()" />
    <van-search placeholder="请输入搜索关键词" shape="round" v-model.trim="q" @search="onSearch" />
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <p>
          <span>j</span>ava
        </p>
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else>
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell>
          <a class="word_btn">电脑</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      q: ''
    }
  },
  methods: {
    onSearch () {
      // 搜索时触发  PC按下enter时 触发
      // 移动端 按下 虚拟键盘 search 时
      this.$router.push('/search/result')
    }
  }
}
</script>
<style  lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
</style>
