<template>
  <div class="container">
    <van-tabs :lazy-render="false" v-model="activeIndex"  swipeable   @change="changeChannel"
>
      <van-tab v-for="channel in channels" :title="channel.name" :key="channel.id">
        <div ref="scroll-wrapper" class="scroll-wrapper" @scroll="remember" >
          <!-- 另外一个下拉刷新组件 -->
          <van-pull-refresh
            v-model="activeChannel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <van-list v-model="activeChannel.upLoading" :finished="activeChannel.finished" finished-text="没有更多了" @load="onLoad">
              <van-cell :to="'/article/'+ article.art_id.toString()" v-for="article in activeChannel.articles" :key="article.id">
                <div class="article_item">
                  <h3 class="van-ellipsis">{{ article.title }}</h3>
                  <div class="img_box" v-if="article.cover.type === 3">
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="article.cover.type === 1">
                    <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relTime }}</span>
                    <!-- 定义文章的id -->
                    <span v-if="user.token" class="close" @click.stop="openMoreAction(article.art_id.toString())">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
          <!-- 用来做阅读记忆的 -->
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 给组件传入文章id -->
    <more-action @on-report="removeArticle" @on-dislikes="removeArticle" :articleId="articleId"  v-model="showMoreAction"></more-action>
    <!-- 频道组件 -->
    <channel-edit v-model="showChannelEdit"></channel-edit>
  </div>
</template>

<script>
import { getMyChannels } from '@/api/channels'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import MoreAction from './componets/more-action'
import ChannelEdit from './componets/channel-edit'

export default {
  data () {
    return {
      refreshSuccessText: null, // 更新成功之后的文本
      channels: [], // 定义频道数据
      activeIndex: 0, // 默认激活第一个
      showMoreAction: false, // 默认不显示
      showChannelEdit: false, // 默认不显示频道
      articleId: null // 记录当前的文档id
    }
  },
  components: {
    MoreAction, ChannelEdit
  },
  methods: {
    // 因为子组件讨厌了文章 所以这里 要删除掉数据
    removeArticle () {
      // 获取到当前的索引
      let index = this.activeChannel.articles.findIndex(item => item.art_id.toString() === this.articleId)
      this.activeChannel.articles.splice(index, 1) // 移除该条数据
    },
    openMoreAction (artId) {
      this.showMoreAction = true // 打开遮罩层
      this.articleId = artId // 获取点击文章的id
    },
    // 上拉加载数据
    async onLoad () {
      // if (this.articles.length < 50) {
      //   setTimeout(() => {
      //     this.articles = [
      //       ...this.articles,
      //       ...Array.from(
      //         Array(10),
      //         (value, index) => index + 1 + this.articles.length
      //       )
      //     ]
      //     this.loading = false // 结束下拉
      //   }, 2000)
      // } else {
      //   this.finished = true // 加载完毕
      // }
      await this.$sleep() // 休眠300毫秒
      let data = await getArticles({ timestamp: this.activeChannel.timestamp, channel_id: this.activeChannel.id })
      this.activeChannel.articles.push(...data.results) // 数据加入到文章列表中
      this.activeChannel.upLoading = false // 结束下拉状态
      if (!data.pre_timestamp) {
        // 已经没有更多的历史数据了
        this.activeChannel.finished = true
      } else {
        this.activeChannel.timestamp = data.pre_timestamp // 保存下一页时间戳
      }
    },
    // 下拉刷新方法
    async  onRefresh () {
      await this.$sleep() // 休眠300毫秒
      // 下拉刷新实际要拉取最新的数据
      this.activeChannel.timestamp = Date.now() // 最新的数据要用最新的时间戳
      this.activeChannel.downLoading = false // 关掉 下拉状态
      let data = await getArticles({ channel_id: this.activeChannel.id, timestamp: this.activeChannel.timestamp })
      if (data.results.length) {
        this.activeChannel.articles = data.results // 直接覆盖原来的数据
        this.activeChannel.finished = false // 表示有下文
        this.refreshSuccessText = '更新成功'
        this.activeChannel.timestamp = data.pre_timestamp
      } else {
        // 如果没数据表示 表示没更新
        this.refreshSuccessText = '暂无更新'
      }
      // setTimeout(() => {
      //   // this.$notify({ type: 'primary', message: '更新数据成功' })
      //   // const data = [1, 2, 3, 4, 5]
      //   const data = []
      //   this.downLoading = false // 关掉下拉更新
      //   if (data.length) {
      //     this.articles = data
      //     this.finished = false
      //     this.refreshSuccessText = '更新成功'
      //     // 防止数据不够 重新加载一次数据
      //     this.onLoad()
      //   } else {
      //     this.refreshSuccessText = '暂无更新'
      //   }
      // }, 1000)
    },
    async getMyChannel () {
      this.channels = []
      // 数据结构 不满足 目前的结构体系 需要处理
      // 有多少个频道就应该有多少个数据
      let result = await getMyChannels()
      this.channels = result.channels.map(item => ({
        id: item.id, // 原来的频道id 和名称
        name: item.name,
        upLoading: false, // 是否正在加载下一页
        finished: false, // 是否已经完成加载
        articles: [], // 文章列表
        downLoading: false, // 是否下拉刷新 下拉触发  不能手动打开 但是可以手动关闭
        timestamp: Date.now(), // 默认给最新的时间
        scrollTop: 0 // 滚动条的位置
      }))
    },
    changeChannel () {
      if (this.activeChannel.articles.length) {
        // setTimeout(() => {
        // // 有数据时 切换到对应的滚动条位置
        //   const list = this.$refs['scroll-wrapper'] // 得到的是一个滚动容器列表
        //   if (list) {
        //     list[this.activeIndex].scrollTop = this.activeChannel.scrollTop // 当前的位置
        //   }
        // }, 0)
        this.$nextTick(() => {
          // 有数据时 切换到对应的滚动条位置
          const list = this.$refs['scroll-wrapper'] // 得到的是一个滚动容器列表
          if (list) {
            list[this.activeIndex].scrollTop = this.activeChannel.scrollTop // 当前的位置
          }
        })
      } else {
        this.activeChannel.upLoading = true
        // 主动加载数据
        this.onLoad() // 加载数据
      }
    },
    // 记忆阅读的位置
    remember (event) {
      this.activeChannel.scrollTop = event.target.scrollTop
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeIndex] // 获取当前激活的频道
    },
    ...mapState(['user'])
  },
  created () {
    this.getMyChannel() // 获取频道列表
  },
  activated () {
    // 把当前激活频道的位置滚回原来的位置
    const list = this.$refs['scroll-wrapper'] // 得到的是一个滚动容器列表
    if (list) {
      list[this.activeIndex].scrollTop = this.activeChannel.scrollTop // 当前的位置
    }
  },
  watch: {
    user () {
      //  登录之后 该user会发生变化  重置回推荐频道
      this.activeIndex = 0
      this.getMyChannel() // 获取我的频道
      this.onLoad() // 重新加载数据
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
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
