<template>
  <van-action-sheet
    :round="false"
    :value="value"
    @input="$emit('input',$event)"
    title="频道编辑"
    @closed="editing = false"
  >
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(channel,i) in channels" :key="channel.id">
          <span @click="enterChannel(i)" class="f12" :class="{red: i === activeIndex}">{{ channel.name }}</span>
          <van-icon v-if="i!==0" v-show="editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!--可选频道  -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="channel in optionalChannels" :key="channel.id">
          <span class="f12">{{channel.name }}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getChannels } from '@/api/channels'
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
      editing: false,
      allChannels: []
    }
  },
  computed: {
    //   可选频道 =  全部频道 - 当前自己的频道
    optionalChannels () {
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  methods: {
    async getChannels () {
      let data = await getChannels()
      this.allChannels = data.channels
    },
    // 进入我的频道
    enterChannel (index) {
      // 关闭
      this.$emit('input', false) // 触发一个关闭事件
      // 还要告诉父组件 => 切换到对应的索引下
      //   this.$emit('update', index) // 给父组件 传值
      this.$emit('update:activeIndex', index)
    }
  },
  created () {
    this.getChannels() // 获取所有可选频道
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
  .tit {
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
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12 {
    font-size: 12px;
    color: #555;
  }
  .red {
    color: red;
  }
}
</style>
