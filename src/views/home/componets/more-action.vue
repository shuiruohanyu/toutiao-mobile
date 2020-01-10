<template>
  <van-popup :value="value" @input="$emit('input',$event)">
      <van-cell-group v-if="!isReport">
          <van-cell @click="disLike">不感兴趣</van-cell>
          <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
          <van-cell>拉黑作者</van-cell>
      </van-cell-group>
       <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell @click="reportArticle(item.value)" v-for="item in reports" :key="item.value">{{ item.label }}</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disListArticle, reportArticle } from '@/api/article'
import { reports } from '@/api/constant'
export default {
  props: {
    value: {
      default: false,
      type: Boolean
    },
    articleId: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      isReport: false, reports
    }
  },
  methods: {
    async disLike () {
      try {
        await disListArticle({ target: this.articleId })
        //  如果一切顺利
        this.$notify({
          type: 'success',
          message: '操作成功'
        })
        this.$emit('input', false) // 触发自定义事件 input
        // 还要告诉 父组件 我讨厌了某个文章 让父组件把某个文章给移除掉  要用父子传值
        this.$emit('on-dislikes')
      } catch (error) {
        this.$notify({
          type: 'danger',
          message: '操作失败'
        })
      }
    },
    // 举报文章
    async reportArticle (type) {
      try {
        await reportArticle({ target: this.articleId, type })
        this.$notify({
          type: 'success',
          message: '操作成功'
        })
        this.$emit('input', false) // 触发自定义事件 input  关闭窗口
        this.$emit('on-report') // 告诉父组件 我讨厌了那个文章 移除掉
      } catch (error) {
        this.$notify({ type: 'danger', message: '操作失败' })
      }
    }
  }
}
</script>
<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
