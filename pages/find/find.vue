<template>
    <view>
        find
    </view>
</template>

<script>
export default {
    onShow () {
        const page = this.$mp.page
        if (typeof page.getTabBar === 'function' && page.getTabBar()) {
          page.getTabBar().setData({
            selected: 1
          })
        }
    }
}
</script>

<style>
</style>