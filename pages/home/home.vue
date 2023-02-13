<template>
    <view class="page">
        <z-nav-bar bgColor="#3badff" title="首页" backState="2000">
        </z-nav-bar>
        <u-cell
            v-for="(item, index) in pageList"
            :key="index"
            :title="item.title"
            isLink
            :url="item.url"
        >
        </u-cell>
    </view>
</template>

<script>
export default {
    data () {
        return {
            pageList: [
                { title: '表单', url: '/pages/form/form' },
                { title: '订单列表', url: '/pages/order/order' }
            ]
        }
    },
    onShow () {
        const page = this.$mp.page
        // const page = getCurrentPages()[0]
        if (typeof page.getTabBar === 'function' && page.getTabBar()) {
          page.getTabBar().setData({
            selected: 0
          })
        }
    },
    methods: {
        onClick () {
            uni.navigateTo({
                url: '/pages/form/form',
                success({ eventChannel }) {
                    eventChannel.emit('switch-form', {
                        foo: 'a',
                        bar: 'b'
                    })
                }
            })
        }
    }
}
</script>

<style>
page {
    height: 100%;
}
.page {
    height: 100%;
}
.button-wrapper {
    width: 60%;
    margin: 60px auto 0;
}
</style>