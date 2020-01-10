<template>
  <div class="container">
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <van-list v-model="upLoading" :finished="finished" @load="onLoad">
      <van-cell-group>
        <van-cell v-for="item in artciles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ item.title }}</h3>
            <div class="img_box" v-if="item.cover.type=== 3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box"  v-if="item.cover.type=== 1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <span>{{ item.pubdate | relTime }}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticles } from '@/api/article'
export default {
  data () {
    return {
      upLoading: false,
      finished: false,
      artciles: [],
      params: {
        q: this.$route.query.q,
        page: 1
      }
    }
  },
  methods: {
  // 下拉加载 会主动触发一次
    async onLoad () {
      let data = await searchArticles(this.params)
      this.artciles.push(...data.results)
      this.upLoading = false // 关掉加载进度
      if (data.results.length) {
      // 有必要继续
        this.params.page++
      } else {
        this.finished = true // 结束了
      }
    }
  }

}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
