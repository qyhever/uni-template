<template>
    <view>
        my
    </view>
</template>

<script>
export default {
    onShow () {
        const page = this.$mp.page
        if (typeof page.getTabBar === 'function' && page.getTabBar()) {
          page.getTabBar().setData({
            selected: 4
          })
        }
    }
}
</script>

<style>
</style>