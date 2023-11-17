<template>
    <view>
        <view
            v-for="(item, index) in 36"
            :key="index"
            class="p-10"
        >
            {{ item }}
        </view>
        <u-tabbar
        	:value="tabbarValue"
        	@change="name => tabbarValue = name"
        	:fixed="true"
        	:placeholder="true"
        	:safeAreaInsetBottom="true"
        >
        	<u-tabbar-item text="首页" icon="home" ></u-tabbar-item>
        	<u-tabbar-item text="放映厅" icon="photo" ></u-tabbar-item>
        	<u-tabbar-item text="直播" icon="play-right" ></u-tabbar-item>
        	<u-tabbar-item text="我的" icon="account" ></u-tabbar-item>
        </u-tabbar>
    </view>
</template>

<script>
export default {
    data () {
        return {
            tabbarValue: 0
        }
    }
}
</script>

<style>
</style>