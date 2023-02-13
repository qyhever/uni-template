<template>
  <view>
    <view class="u-tabs-box">
      <u-tabs
        ref="tabs"
        :list="tabList"
        :current="currentTabIndex"
        :scrollable="false"
        @change="onTabChange"
      >
      </u-tabs>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabList: [
        { name: '待付款' },
        { name: '待发货' },
        { name: '待收货' },
        { name: '待评价' }
      ],
      currentTabIndex: 1,
      currentSwiperIndex: 0
    }
  },
  onShow() {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' && page.getTabBar()) {
      page.getTabBar().setData({
        selected: 1
      })
    }
  },
  methods: {
    onTabChange (index) {
      this.currentSwiperIndex = index
    }
  }
}
</script>

<style>
</style>