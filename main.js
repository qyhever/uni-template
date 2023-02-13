import App from './App'

// wx.loadFontFace({
//   global: true,
//   family: 'iconfont',
//   source: 'url("https://qiniu.qyhever.com/iconfont.ttf")',
//   success: console.log,
//   fail: console.log
// })

import Vue from 'vue'
import ZNavBar from 'uni_modules/z-nav-bar/components/z-nav-bar/z-nav-bar.vue'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

Vue.component('ZNavBar', ZNavBar)

// uni.$u.setConfig({
// 	config: {
// 		unit: 'px'
// 	},
// 	props: {
// 		input: {
// 			size: 14
// 		}
// 	}
// })

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()