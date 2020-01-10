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
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clearHistory"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="item in historyList" :key="item">
          <a class="word_btn">{{ item }}</a>
          <van-icon @click="delHistory(item)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const KEY = 'heima-toutiao-91-search'
export default {
  data () {
    return {
      q: '',
      historyList: [] // 历史记录
    }
  },
  methods: {
    // 清空搜索历史
    clearHistory () {
      this.historyList = []
      localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    onSearch (text) {
      if (!text) return
      // this.historyList.push(text) // 有重复的问题
      // localStorage.setItem(KEY, JSON.stringify(this.historyList))
      // 数组去重
      let set = new Set(this.historyList)
      set.add(text)
      this.historyList = Array.from(set)
      localStorage.setItem(KEY, JSON.stringify(this.historyList))
      // set 对象转成 array
      // 搜索时触发  PC按下enter时 触发
      // 移动端 按下 虚拟键盘 search 时
      this.$router.push('/search/result')
    },
    // 删除历史记录
    delHistory (text) {
      let index = this.historyList.findIndex(item => item === text)
      this.historyList.splice(index, 1) // 删除某个历史记录
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(KEY) || '{}')
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
