<template>
    <u-popup
        :show="visible"
        closeOnClickOverlay
        duration="200"
        mode="right"
        @close="close"
        @open="open"
    >
        <view style="width: 300px">
            <view class="px-16 py-12 border-bottom">
                <view class="a-header-line">
                    店铺
                </view>
            </view>
            <view class="py-12 pl-12 pr-6 border-bottom">
                <u-search
                    showAction
                    shape="square"
                    actionText="搜索"
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
        </view>
    </u-popup>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            visible: false,
            tabList: [
                { name: '搜索结果' },
                { name: '已选择' },
            ],
            currentTab: 0
        }
    },
    methods: {
        open () {
            this.visible = true
        },
        close () {
            this.visible = false
        },
        onTabClick ({ index }) {
            this.currentTab = index
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
</style>