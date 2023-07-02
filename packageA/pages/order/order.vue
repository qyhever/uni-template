<template>
  <view class="wrap">
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
    <swiper
      class="swiper-box"
      :current="currentSwiperIndex"
      :duration="280"
      easing-function="easeInOutCubic"
      @transition="onTransition"
      @animationfinish="onAnimationfinish"
    >
      <swiper-item
        v-for="(groupItem, groupIndex) in orderGroupList"
        :key="groupIndex"
        class="swiper-item"
      >
        <scroll-view
          scroll-y
          enable-back-to-top
          refresher-enabled
          :refresher-triggered="refresherTriggered"
          style="height: 100%;width: 100%;"
          @scrolltolower="reachBottom"
          @refresherrefresh="onRefresherrefresh"
        >
          <template v-if="groupItem.length">
            <view
              v-for="(item, index) in groupItem"
              :key="index"
              class="order-item"
            >
              <text class="order-item-id">{{item.id}}</text>
              <view class="order-item-image">
                <u--image :src="item.picUrl" :width="40" :height="40"></u--image>
              </view>
              <text class="order-item-name">{{item.name}}</text>
            </view>
            <view class="pb-10">
              <u-loadmore :status="tabList[index].status"></u-loadmore>
            </view>
          </template>
          <template v-else>
            <u-empty></u-empty>
          </template>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import {
  getOrderList
} from '@/api'
const PAGE_SIZE = 10
export default {
  data() {
    return {
      tabList: [
        {
          name: '待付款',
          value: 'paying',
          status: 'loadmore',
          currentPage: 1
        },
        {
          name: '待发货',
          value: 'sending',
          status: 'loadmore',
          currentPage: 1
        },
        {
          name: '待收货',
          value: 'receiving',
          status: 'loadmore',
          currentPage: 1
        },
        {
          name: '待评价',
          value: 'commenting',
          status: 'loadmore',
          currentPage: 1
        }
      ],
      orderGroupList: Array(4).fill([]),
      currentTabIndex: 0,
      currentSwiperIndex: 0,
      refresherTriggered: false
    }
  },
  onLoad () {
    this.queryOrderList(0)
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
    queryOrderList (index) {
      const currentTab = this.tabList[index]
      currentTab.status = 'loading'
      getOrderList({
        page: currentTab.currentPage,
        size: PAGE_SIZE,
        type: currentTab.value
      }).then(res => {
        this.refresherTriggered = false
        const list = res.list || []
        const total = res.total || 0
        let orders = this.orderGroupList[index]
        orders = (
          currentTab.currentPage === 1 ? [] : orders
        ).concat(list)
        this.orderGroupList.splice(index, 1, orders)
        if (currentTab.currentPage * PAGE_SIZE > total) {
          this.tabList[this.currentTabIndex].status = 'nomore'
        } else {
          this.tabList[this.currentTabIndex].status = 'loadmore'
        }

      }).catch(err => {
        console.log('err', err)
      })
    },
    onTabChange (data) {
      this.currentSwiperIndex = data.index
      this.currentTabIndex = data.index
      const orders = this.orderGroupList[this.currentTabIndex]
      if (orders.length === 0) {
        this.queryOrderList(this.currentTabIndex)
      }
    },
    // 切换过程中一直触发
    onTransition (event) {},
    // 切换完毕触发
    onAnimationfinish (event) {
      const current = event.detail.current
      this.currentTabIndex = current
      const orders = this.orderGroupList[this.currentTabIndex]
      if (orders.length === 0) {
        this.queryOrderList(this.currentTabIndex)
      }
    },
    onRefresherrefresh () {
      const currentTab = this.tabList[this.currentTabIndex]
      if (currentTab.status === 'loading') {
        return
      }
      currentTab.currentPage = 1
      this.refresherTriggered = true
      this.queryOrderList(this.currentTabIndex)
    },
    reachBottom () {
      console.log('reachBottom')
      const currentTab = this.tabList[this.currentTabIndex]
      if (currentTab.status === 'nomore') {
        return
      }
      currentTab.currentPage += 1
      this.queryOrderList(this.currentTabIndex)
    }
  }
}
</script>

<style lang="less">
page {
  height: 100%;
}
.wrap {
	display: flex;
	flex-direction: column;
  height: 100%;
}
.swiper-box {
  flex: 1;
}
.swiper-item {
	height: 100%;
}
.order-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
}
.order-item-id {
  margin-right: 12px;
  font-weight: 700;
}
.order-item-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
  overflow: hidden;
}
.order-item-name {
  flex: 0 0 15em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #3c3c3c;
}
</style>