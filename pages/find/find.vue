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
        const page = this.$mp.page
        if (typeof page.getTabBar === 'function' && page.getTabBar()) {
          page.getTabBar().setData({
            selected: 1
          })
        }
    },
    methods: {
        onSearch (value) {
            console.log('value', value)
        }
    }
}
</script>

<style>
</style>