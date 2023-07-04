<template>
    <view class="page">
        <custom-navbar :title="'查询页面'"></custom-navbar>

        <mescroll-body
            @init="mescrollInit"
            @down="downCallback"
            @up="upCallback"
            :up="upOption"
        >
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
         </mescroll-body>

        
        <!-- <view class="pb-10">
            <u-loadmore :status="loadStatus"></u-loadmore>
        </view>
        <u-empty v-if="!dataList.length"></u-empty> -->
    </view>
</template>

<script>
import {
    getOrderList
} from '@/api'
import {
    stringify
} from '@/utils/qs.js'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'

export default {
    mixins: [MescrollMixin],
    data () {
        return {
            params: {
                dataType: 'today',
                startDate: '',
                endDate: ''
            },
            tabList: [
                {
                    name: '今日',
                    value: 'today'
                },
                {
                    name: '昨日',
                    value: 'yesterday'
                },
                {
                    name: '本周',
                    value: 'currentWeek'
                },
                {
                    name: '本月',
                    value: 'currentMonth'
                }
            ],
            currentTabIndex: 0,
            loadStatus: '',
            pager: {
                currentPage: 1,
                pageSize: 20
            },
            dataList: [],
            upOption: {
                empty: {
                    tip: '暂无相关数据'
                }
            }
        }
    },
    onLoad () {
        // this.query()
    },
    // // 下拉刷新
    // onPullDownRefresh () {
    //     this.changeQuery()
    //     setTimeout(() => {
    //         uni.stopPullDownRefresh()
    //     }, 1500)
    // },
    // // 上拉加载更多
    // onReachBottom () {
    //     this.onBottom()
    // },
    methods: {
        upCallback (pageInfo) {
            getOrderList({
                page: pageInfo.num,
                size: pageInfo.size,
                ...this.params
            }).then(res => {
                wx.stopPullDownRefresh()
                const list = res.list || []
                const total = res.total || 0
                this.dataList = (
                    pageInfo.num === 1 ? [] : this.dataList
                ).concat(list)
                this.mescroll.endBySize(list.length, total)
            }).catch(err => {
                console.log('err', err)
                this.mescroll.endErr()
            })
        },
        query (index) {
            this.loadStatus = 'loading'
            getOrderList({
                page: this.pager.currentPage,
                size: this.pager.pageSize,
                ...this.params
            }).then(res => {
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
        // 请求查询参数改变时调用
        changeQuery () {
            this.pager.currentPage = 1
            this.query()
        },
        onBottom () {
            if (this.loadStatus === 'nomore') return
            this.pager.currentPage += 1
            this.query()
        },
        onTabChange (data) {
            this.currentTabIndex = data.index
            const currentItem = this.tabList[this.currentTabIndex]
            this.params.dataType = currentItem.value
            this.changeQuery()
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
        onRefresh (data) {
            this.params.dataType = data.dataType
            this.params.startDate = data.startDate
            this.params.endDate = data.endDate
            this.changeQuery()
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
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

.search-bar-funnel {}

.search-bar-image {
    width: 24px;
    height: 24px;
}
</style>