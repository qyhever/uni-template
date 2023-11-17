<template>
    <view>
        <z-nav-bar bgColor="#3badff" title="发现" backState="2000">
        </z-nav-bar>
        <view class="p-10">
            <u-search
                v-model="keyword"
                shape="square"
                :animation="false"
                @search="onSearch"
                @custom="onSearch"
            >
            </u-search>
        </view>
        <view>
            <u-button @click="onToQueryPage">查询页面</u-button>
        </view>
    </view>
</template>

<script>
export default {
    data () {
        return {
            keyword: ''
        }
    },
    onShow () {
        console.log(getApp().globalData.tabbarList)
        // const page = this.$mp.page
        // if (typeof page.getTabBar === 'function' && page.getTabBar()) {
        //   page.getTabBar().setData({
        //     selected: 1
        //   })
        // }
    },
    methods: {
        onSearch (value) {
            console.log('value', value)
        },
        onToQueryPage () {
            wx.navigateTo({
                url: '/packageA/pages/query-condition/query-condition'
            })
        }
    }
}
</script>

<style>
</style>