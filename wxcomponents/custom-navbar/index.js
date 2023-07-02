const systemInfo = wx.getSystemInfoSync() // 获取系统信息
// console.log('systemInfo: ', systemInfo)

const rect = wx.getMenuButtonBoundingClientRect() // 胶囊按钮位置信息
// console.log('rect: ', rect)

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: '#fff'
    },
    color: {
      type: String,
      value: '#000'
    },
    back: {
      type: Boolean,
      value: true
    },
    // back为true的时候，返回的页面深度
    delta: {
      type: Number,
      value: 1
    },
    loading: {
      type: Boolean,
      value: false
    },
    home: {
      type: Boolean,
      value: false
    },
    border: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ios: !!(systemInfo.system.toLowerCase().search('ios') + 1),
    statusBarHeight: systemInfo.statusBarHeight,
    navWidth: `width:${rect.left}px`,
    navPaddingRight: `padding-right:${systemInfo.windowWidth - rect.left}px`,
    leftWidth: `width:${systemInfo.windowWidth - rect.left}px`, // 胶囊左距离屏幕右侧距离
    capsuleWidth: 0,
    capsuleHeight: 0
  },
  methods: {
    back () {
        wx.navigateBack()
      // const data = this.data
      // if (data.delta) {
      //   wx.navigateBack({
      //     delta: data.delta
      //   })
      // }
      // this.triggerEvent('back', { delta: data.delta }, {})
  }
  }
})
