<template>
    <u-popup
        :show="visible"
        closeOnClickOverlay
        mode="right"
        @close="close"
    >
        <view style="width: 80vw;height: 100%;" class="relative">
            <view class="px-16 py-12 border-bottom">
                <view class="a-header-line">
                    {{ title }}
                </view>
            </view>
            <view class="py-12 pl-12 pr-6 border-bottom">
                <u-search
                    v-model="keyword"
                    showAction
                    shape="square"
                    actionText="搜索"
                    @search="onSearch"
                />
            </view>
            <view class="custom-tabs">
                <u-tabs
                    :list="tabList"
                    :scrollable="false"
                    lineWidth="36"
                    itemStyle="height: 48px;font-size: 14px"
                    @click="onTabClick"
                />
            </view>
            <view class="scroll-view-container">
                <scroll-view
                    v-show="currentTab === 0"
                    scroll-y
                    enable-back-to-top
                    refresher-enabled
                    style="width: 100%;height: 100%;"
                    :refresher-triggered="refresherTriggered"
                    @scrolltolower="reachBottom"
                    @refresherrefresh="onRefresherrefresh"
                >
                    <template v-if="dataList.length">
                        <view
                            v-for="(item, index) in dataList"
                            :key="index"
                            class="px-10"
                        >
                            <view
                                class="select-item flex justify-between items-center py-10 border-bottom"
                                @click="onDataItemClick(item)"
                            >
                                <view>
                                    {{ item.name }}
                                </view>
                                <view
                                    v-show="checkedList.some(v => v.code === item.code)"
                                    class="p-6"
                                >
                                    <u-icon
                                        name="checkmark-circle-fill"
                                        size="14"
                                        color="#3F87FF"
                                    />
                                </view>
                            </view>
                        </view>
                        <view v-show="loadStatus === 'nomore'" class="flex justify-center py-10 text-color-regular">
                            没有更多数据
                        </view>
                    </template>
                    <view v-else class="pt-30">
                        <u-empty></u-empty>
                    </view>
                </scroll-view>
                <scroll-view
                    v-show="currentTab === 1"
                    scroll-y
                    enable-back-to-top
                    style="width: 100%;height: 100%;"
                >
                    <template v-if="checkedList.length">
                        <view
                            v-for="(item, index) in checkedList"
                            :key="index"
                            class="px-10"
                        >
                            <view
                                class="select-item flex justify-between items-center py-10 border-bottom"
                            >
                                <view>
                                    {{ item.name }}
                                </view>
                                <view class="p-6" @click="onDelete(item)">
                                    <u-icon
                                        name="close-circle-fill"
                                        size="14"
                                        color="#3F87FF"
                                    />
                                </view>
                            </view>
                        </view>
                    </template>
                    <view v-else class="pt-30">
                        <u-empty></u-empty>
                    </view>
                </scroll-view>
            </view>
            <view class="footer-bar">
                <view class="footer-bar-btn cancel-btn" @click="close">取消</view>
                <view class="footer-bar-btn confirm-btn" @click="onConfirm">确定</view>
            </view>
        </view>
    </u-popup>
</template>

<script>
import {
    getQueryContiditionData
} from '@/api/index.js'

export default {
    options: { styleIsolation: 'shared' },
    data () {
        return {
            visible: false,
            field: '',
            title: '',
            placeholder: '',
            tabList: [
                { name: '搜索结果' },
                { name: '已选择' },
            ],
            currentTab: 0,
            keyword: '',
            loadStatus: '',
            refresherTriggered: false,
            pager: {
                currentPage: 1,
                pageSize: 20
            },
            dataList: [],
            checkedList: []
        }
    },
    methods: {
        open (row) {
            this.field = row.field
            this.title = row.title
            this.placeholder = row.placeholder
            this.checkedList = row.checkedList
            this.fetchData()
            this.visible = true
        },
        close () {
            this.visible = false
            this.currentTab = 0
            this.keyword = ''
            this.loadStatus = ''
            this.pager.currentPage = 1
            this.dataList = []
            this.checkedList = []
        },
        onTabClick ({ index }) {
            this.currentTab = index
        },
        async fetchData () {
            try {
                this.loadStatus = 'loading'
                const res = await getQueryContiditionData({
                    page: this.pager.currentPage,
                    size: this.pager.pageSize,
                    keyword: this.keyword,
                    type: this.field
                })
                this.refresherTriggered = false
                const list = res.list || []
                const total = res.total || 0
                this.dataList = (
                  this.pager.currentPage === 1 ? [] : this.dataList
                ).concat(list)
                const hasMore = this.pager.currentPage * this.pager.pageSize > total
                this.loadStatus = hasMore ? 'nomore' : 'loadmore'
            } catch (err) {
                console.log('err', err)
            }
        },
        onRefresherrefresh () {
          if (this.loadStatus === 'loading') {
            return
          }
          this.pager.currentPage = 1
          this.refresherTriggered = true
          this.fetchData()
        },
        reachBottom () {
          if (this.loadStatus === 'nomore') {
            return
          }
          this.pager.currentPage += 1
          this.fetchData()
        },
        onSearch () {
            this.onRefresherrefresh()
        },
        onDataItemClick (row) {
            const isExist = this.checkedList.some(item => item.code === row.code)
            if (isExist) {
                this.checkedList = this.checkedList.filter(item => item.code !== row.code)
            } else {
                this.checkedList.push(row)
            }
        },
        onDelete (row) {
            this.checkedList = this.checkedList.filter(item => item.code !== row.code)
        },
        onConfirm () {
            this.$emit('confirm', this.field, this.checkedList)
            this.close()
        }
    }
}
</script>

<style lang="scss" scoped>
.custom-tabs {
    /deep/ .u-tabs__wrapper__nav:after {
        content: "";
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: #d8d8d8;
    }
}
.scroll-view-container {
    z-index: 99;
    position: absolute;
    top: 152px;
    left: 0;
    right: 0;
    bottom: 56px;
}
.footer-bar {
    z-index: 99;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    height: 56px;
}
.footer-bar-btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}
.cancel-btn {
    color: #929BA7;
    background-color: #F3F3F3;
}
.confirm-btn {
    color: #FFFFFF;
    background-color: #3F87FF;
}
.select-item {
    box-sizing: border-box;
    height: 48px;
}
</style>