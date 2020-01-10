<template>
  <div class="container">
    <van-tabs swipeable>
      <van-tab v-for="index in 8" :title="'标签 ' + index" :key="index">
        <div class="scroll-wrapper">
          <!-- 另外一个下拉刷新组件 -->
          <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
              <van-cell v-for="(item,i) in articles" :key="i">{{ '标签' + index + '---' + item}}</van-cell>
            </van-list>
          </van-pull-refresh>
          <!-- 用来做阅读记忆的 -->
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false, // 是否正在加载下一页
      finished: false, // 是否已经完成加载
      articles: [], // 文章列表
      downLoading: false, // 是否下拉刷新 下拉触发  不能手动打开 但是可以手动关闭
      refreshSuccessText: null // 更新成功之后的文本
    }
  },
  methods: {
    // 加载数据
    onLoad () {
      if (this.articles.length < 50) {
        setTimeout(() => {
          this.articles = [
            ...this.articles,
            ...Array.from(
              Array(10),
              (value, index) => index + 1 + this.articles.length
            )
          ]
          this.loading = false // 结束下拉
        }, 2000)
      } else {
        this.finished = true // 加载完毕
      }
    },
    // 刷新方法
    onRefresh () {
      setTimeout(() => {
        // this.$notify({ type: 'primary', message: '更新数据成功' })
        // const data = [1, 2, 3, 4, 5]
        const data = []
        this.downLoading = false // 关掉下拉更新
        if (data.length) {
          this.articles = data
          this.finished = false
          this.refreshSuccessText = '更新成功'
          // 防止数据不够 重新加载一次数据
          this.onLoad()
        } else {
          this.refreshSuccessText = '暂无更新'
        }
      }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
