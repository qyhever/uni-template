<template>
  <view class="fab-button">
    <view
      v-for="(item, index) in sortList"
      :key="index"
      class="fab-menu-item"
      :animation="animationList[index]"
      @click="onItemClick(item)"
    >
      <text>
        {{item.label}}
      </text>
      <uni-icons :type="item.sort === 'asc' ? 'arrow-up' : 'arrow-down'" color="#333" size="16"></uni-icons>
    </view>
    <view class="fab-menu-item fab-button-main" @click="onMainClick">
      <view class="h-fluid flex justify-center items-center">
        <uni-icons v-if="expand" type="closeempty" color="#fff" size="25"></uni-icons>
        <template v-else>
          <text>
            {{ selectedItem.label }}
          </text>
          <uni-icons :type="selectedItem.sort === 'asc' ? 'arrow-up' : 'arrow-down'" color="#fff" size="16"></uni-icons>
        </template>
      </view>
    </view>
    <!-- <image src="/static/images/setting.png" class="fab-menu-item" :animation="animationA" @click="onClick"></image>
    <image src="/static/images/location.png" class="fab-menu-item" :animation="animationB" @click="onClick"></image>
    <image src="/static/images/info.png" class="fab-menu-item" :animation="animationC" @click="onClick"></image>
    <image src="/static/images/menu.png" class="fab-menu-item fab-button-main" :animation="animationMain" @click="onMainClick"></image> -->
  </view>
</template>

<script>
export default {
  model: {
    prop: 'selectedItem',
    event: 'input'
  },
  props: {
    sortList: {
      type: Array,
      default: () => [
        {
          label: '数量',
          value: 'count',
          sort: 'asc'
        },
        {
          label: '数量',
          value: 'count',
          sort: 'desc'
        },
        {
          label: '代码',
          value: 'code',
          sort: 'desc'
        }
      ]
    },
    selectedItem: {
      type: Object,
      default: () => ({
        label: '代码',
        value: 'code',
        sort: 'asc'
      })
    }
  },
  data () {
    return {
      expand: false,
      animationMain: {},
      animationA: {},
      animationB: {},
      animationC: {}
    }
  },
  computed: {
    animationList () {
      return [this.animationA, this.animationB, this.animationC]
    },
  },
  methods: {
    onMainClick () {
      if (!this.expand) {
        this.handleExpand()
      } else {
        this.handleCollapse()
      }
      this.expand = !this.expand
    },
    onItemClick (item) {
      this.$emit('input', item)
      this.$emit('change', item)
      this.onMainClick()
    },
    handleExpand () {
      this.animationMain = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      }).rotateZ(180).step()

      this.animationA = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      }).translate(-28, -56).rotateZ(360).opacity(1).step()

      this.animationB = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      }).translate(-66, 0).rotateZ(360).opacity(1).step()

      this.animationC = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      }).translate(-28, 56).rotateZ(360).opacity(1).step()
    },
    handleCollapse () {
      this.animationMain = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      }).rotateZ(0).step()

      this.animationA = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      }).translate(0, 0).rotateZ(0).opacity(0).step()

      this.animationB = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      }).translate(0, 0).rotateZ(0).opacity(0).step()

      this.animationC = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      }).translate(0, 0).rotateZ(0).opacity(0).step()
    }
  }
}
</script>

<style lang="scss">
.fab-button {
  z-index: 100;
  position: fixed;
  bottom: 75px;
  right: 35px;
  height: 56px;
  width: 56px;
  border-radius: 50%;
}
.fab-menu-item {
  position: absolute;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  width: 56px;
  border-radius: 50%;
  font-size: 12px;
  background-color: #8fbcec;
  color: #333;
}
.fab-button-main {
  z-index: 200;
  opacity: 1;
  background-color: $uni-color-primary;
  color: #fff;
}
</style>