<template>
 <div class='container'  ref="myContainer" @scroll="remeber($event)">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">文章的标题</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{ article.aut_name }}</p>
          <p class="time">{{ article.pubdate | relTime }}</p>
        </div>
        <van-button round size="small" type="info">{{ article.is_followed ? '已关注' : '+ 关注' }}</van-button>
      </div>
      <div class="content" v-html="article.content">
      </div>
      <div class="zan">
        <van-button round size="small" :class="{active: article.attitude === 1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active: article.attitude === 0}" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
  </div></template>

<script>
import { getArticle } from '@/api/article'
export default {
  data () {
    return {
      article: {},
      scrollTop: 0
    }
  },
  computed: {
    articleId () {
      return this.$route.params.id
    }
  },
  methods: {
    remeber (event) {
      this.scrollTop = event.target.scrollTop // 记录滚动的位置
    },
    async getArticle () {
      let data = await getArticle({ id: this.articleId })
      this.article = data
    }
  },
  activated () {
    // 同一篇文章 同一个位置
    if (this.articleId && this.article.art_id && this.article.art_id.toString() === this.articleId) {
      this.$refs.myContainer.scrollTop = this.scrollTop // 滚回原来的位置
    } else {
      this.scrollTop = 0 // 重置回0
      this.getArticle() // 获取数据 重新获取
    }
  },
  created () {
    console.log(123)
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
