<template>
    <view>
        <view class="p-16 flex items-center" @click="onToUserInfoPage">
            <u-image
                src="https://cdn.uviewui.com/uview/album/1.jpg"
                width="48px"
                height="48px"
                shape="circle"
            />
            <view class="flex-1 pl-16 flex flex-column justify-between">
                <view class="font-size-16 font-bold">为你存在</view>
                <view class="font-size-12">当前等级：2</view>
            </view>
            <view>
                <u-icon name="arrow-right"></u-icon>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    onShow () {
        const page = this.$mp.page
        if (typeof page.getTabBar === 'function' && page.getTabBar()) {
          page.getTabBar().setData({
            selected: 3
          })
        }
    },
    methods: {
        onToUserInfoPage () {
            wx.navigateTo({
                url: '/packageA/pages/user-profile/user-profile'
            })
        }
    }
}
</script>

<style>
</style>