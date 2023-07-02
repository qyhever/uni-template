<template>
  <view class="page">
      <custom-navbar :title="'查询页面'"></custom-navbar>
    <view class="search-bar flex items-center pr-10">
        <view class="flex-1">
            <u-tabs
              ref="tabs"
              :list="tabList"
              :current="currentTabIndex"
              :scrollable="false"
              lineColor="#ffcd38"
              activeStyle="color: #ffcd38"
              @change="onTabChange"
            >
            </u-tabs>
        </view>
        <view class="search-bar-funnel flex p-6" @click="onToQueryPage">
            <image class="search-bar-image" src="@/static/images/funnel.png"></image>
        </view>
    </view>
    <scroll-view
      scroll-y
      enable-back-to-top
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      class="scroll-view"
      @scrolltolower="reachBottom"
      @refresherrefresh="onRefresherrefresh"
    >
      <template v-if="dataList.length">
        <view
          v-for="(item, index) in dataList"
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
          <u-loadmore :status="loadStatus"></u-loadmore>
        </view>
      </template>
      <template v-else>
        <u-empty></u-empty>
      </template>
    </scroll-view>
  </view>
</template>

<script>
import {
  getOrderList
} from '@/api'
import { stringify } from '@/utils/qs.js'

export default {
  data() {
    return {
        params: {
            dataType: 'today',
            startDate: '',
            endDate: ''
        },
      tabList: [
        { name: '今日', value: 'today' },
        { name: '昨日', value: 'yesterday' },
        { name: '本周', value: 'currentWeek' },
        { name: '本月', value: 'currentMonth' }
      ],
      currentTabIndex: 0,
        loadStatus: '',
        refresherTriggered: false,
        pager: {
            currentPage: 1,
            pageSize: 20
        },
        dataList: []
    }
  },
  onLoad () {
    this.query()
  },
  methods: {
    query (index) {
      this.loadStatus = 'loading'
      getOrderList({
        page: this.pager.currentPage,
        size: this.pager.pageSize,
        ...this.params
      }).then(res => {
        this.refresherTriggered = false
        const list = res.list || []
        const total = res.total || 0
        this.dataList = (
          this.pager.currentPage === 1 ? [] : this.dataList
        ).concat(list)
        const hasMore = this.pager.currentPage * this.pager.pageSize > total
        this.loadStatus = hasMore ? 'nomore' : 'loadmore'
      }).catch(err => {
        console.log('err', err)
      })
    },
    onTabChange (data) {
      this.currentTabIndex = data.index
      const currentItem = this.tabList[this.currentTabIndex]
      this.params.dataType = currentItem.value
      this.onRefresherrefresh()
    },
    onToQueryPage () {
        const queryObj = {
            fieldList: 'shop,guider',
            activeShortcut: this.params.dataType,
            startDate: this.params.startDate,
            endDate: this.params.endDate
        }
        wx.navigateTo({
            url: '/packageA/pages/query-condition/query-condition?' + stringify(queryObj)
        })
    },
    onRefresherrefresh () {
      if (this.loadStatus === 'loading') {
        return
      }
      this.pager.currentPage = 1
      this.refresherTriggered = true
      this.query()
    },
    reachBottom () {
      if (this.loadStatus === 'nomore') {
        return
      }
      this.pager.currentPage += 1
      this.query()
    },
    onRefresh (data) {
        this.params.dataType = data.dataType
        this.params.startDate = data.startDate
        this.params.endDate = data.endDate
        this.onRefresherrefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
}
.scroll-view {
    position: fixed;
    top: 132px;
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
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
.search-bar-funnel {
    
}
.search-bar-image {
    width: 24px;
    height: 24px;
}
</style>