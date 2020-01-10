<template>
  <van-action-sheet :round="false" :value="value" @input="$emit('input',$event)" title="频道编辑" @closed="editing = false">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(channel,i) in channels" :key="channel.id">
          <span class="f12" :class="{red: i === activeIndex}">{{ channel.name }}</span>
          <van-icon  v-if="i!==0" v-show="editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
export default {
  props: {
    value: {
      default: false,
      type: Boolean
    },
    channels: {
      default: () => [], // 默认值
      type: Array
    },
    // 激活频道索引
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editing: false
    }
  }
}
</script>

<style lang='less' scoped>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit{
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12{
      font-size:12px;
      color: #555;
  }
  .red{
    color: red;
  }
}
</style>