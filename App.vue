<script>
	export default {
        globalData: {
            tabbarList: []
        },
		onLaunch () {
            const config = wx.getExtConfigSync()
            console.log('config', Object.keys(config).length)
            wx.login()
                .then(res => console.log('res', res))
			// console.log('App Launch')
		},
		onShow () {
			// console.log('App Show')
		},
		onHide () {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
// @import "./wxcomponents/vant/common/index.wxss";
@import "@/uni_modules/uview-ui/index.scss";
@import "@/static/styles/reset.scss";
@import "@/static/styles/atom.scss";
@import "@/static/styles/common.scss";
</style>
