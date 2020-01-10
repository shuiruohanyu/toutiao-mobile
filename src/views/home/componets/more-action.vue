<template>
  <van-popup :value="value" @input="$emit('input',$event)">
      <van-cell-group v-if="!isReport">
          <van-cell @click="disLike">不感兴趣</van-cell>
          <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
          <van-cell>拉黑作者</van-cell>
      </van-cell-group>
       <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell>侵权</van-cell>
      <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disListArticle } from '@/api/article'
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
      isReport: false
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
