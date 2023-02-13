Component({
  data: {
    selected: 0,
    color: "#ccc",
    selectedColor: "#3c3c3c",
    list: [
        {
      pagePath: "/pages/home/home",
      iconPath: "/static/images/tabbar/home.png",
      selectedIconPath: "/static/images/tabbar/home-active.png",
      text: "首页"
    },
    {
      pagePath: "/pages/find/find",
      iconPath: "/static/images/tabbar/find.png",
      selectedIconPath: "/static/images/tabbar/find-active.png",
      text: "分类"
    }, {
      pagePath: "/pages/cart/cart",
      iconPath: "/static/images/tabbar/cart.png",
      selectedIconPath: "/static/images/tabbar/cart-active.png",
      text: "购物车"
    }, {
      pagePath: "/pages/my/my",
      iconPath: "/static/images/tabbar/my.png",
      selectedIconPath: "/static/images/tabbar/my-active.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const {index, path} = e.currentTarget.dataset
      wx.switchTab({url: path})
      this.setData({
        selected: index
      })
    }
  }
})