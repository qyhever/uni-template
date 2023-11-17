<template>
    <view>
        <view
            v-for="(item, index) in 36"
            :key="index"
            class="p-10"
        >
            {{ item }}
        </view>
        <view class="tab-bar-placeholder"></view>
    </view>
</template>

<script>
export default {
    onShow () {
        // const page = this.$mp.page
        // if (typeof page.getTabBar === 'function' && page.getTabBar()) {
        //   page.getTabBar().setData({
        //     selected: 2
        //   })
        // }
    }
}
</script>

<style>
</style>