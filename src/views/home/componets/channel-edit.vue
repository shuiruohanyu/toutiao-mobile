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
          <van-icon @click="delChannel(i,channel.id)" v-if="i!==0" v-show="editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!--可选频道  -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="channel in optionalChannels" :key="channel.id">
          <span class="f12">{{channel.name }}</span>
          <van-icon @click="addChannel(channel)"  class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getChannels, delChannel } from '@/api/channels'
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
    // 添加频道数据
    addChannel (channel) {
      // 调用封装好的Api (支持两种方式)
      // 后端数据格式
      // 后端：对应频道是有排序的，｛频道1，序号 3｝｛频道2，序号 1｝
      // 后端：返回频道数据的时候，并没有返回序号，想往最后追加数据，需要知道最大序号。
      // 采用：是覆盖式修改，在传递频道数据的同时，在前端排好序提交数据给后端
      // 注意：后端需要的数据，不包含推荐，是默认频道 永远是第一。
      // 数据：[{id:'频道ID',seq:1},...]
      // 本地存储数据格式
      // 数据：{id:'频道ID',name:'频道名称'}
      // 需求：把两个数据合并在一起，在API中才能实现两个逻辑。
      // 数据：[{id:'频道ID',seq:1,name:'频道名称'},....最后一个本地需要的对象]
      const newChannels = this.channels.map((item, i) => ({
        id: item.id,
        name: item.name,
        seq: i
      }))
      newChannels.splice(0, 1) // 删除第一个
      newChannels.push({ ...channel, seq: newChannels.length + 1 })
    },
    // 删除频道
    async delChannel (index, id) {
      try {
        await delChannel(id)
        this.$notify({
          type: 'success',
          message: '操作成功'
        })
        // 3. 移除频道 （当前组件，父组件）
        // 当前组件上  channels  我的频道是数组移除其中一项
        // 当父组件传递的数据为简单数据类型的时候，不能修改，此时的修改是赋值，改变引用。
        // 当父组件传递的数据为复杂数据类型的时候，可以修改，在保证引用不被修改的情况，修改数据。
        // 当前组件，父组件  我的频道数据  在内存的指向是一样的
        // 4. 有情况：
        // 4.1 当激活的频道是最后一个频道，删除当前激活的频道， 当前激活的频道往前推一位
        // 4.2 当前你删除的频道是当前激活频道的前面的频道，当前激活的频道往前推一位
        // 告诉父组件删除 对应的频道
        if (index <= this.activeIndex) {
          this.$emit('update:activeIndex', this.activeIndex - 1)
        }
        this.channels.splice(index, 1)
      } catch (error) {
        this.$notify({
          type: 'success',
          message: '操作失败'
        })
      }
    },
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
