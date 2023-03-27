<template>
  <view class="h-fluid fab-page">
    fab
    <a-fab-button v-model="sortItem" :sortList="sortList" @change="onChange"></a-fab-button>
    <uni-fab :content="[{iconPath: '/static/images/info.png', text: '数量'},{iconPath: '/static/images/setting.png', text: '代码'}]"></uni-fab>
  </view>
</template>

<script>
export default {
  data () {
    return {
      sortList: [
        {
          label: '数量',
          value: 'count',
          sort: 'asc'
        },
        {
          label: '数量',
          value: 'count',
          sort: 'desc'
        },
        {
          label: '代码',
          value: 'code',
          sort: 'desc'
        }
      ],
      sortItem: {
        label: '代码',
        value: 'code',
        sort: 'desc'
      }
    }
  },
  methods: {
    onChange (row) {
      console.log('onChange', row)
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
}
.fab-page {
  background-color: #eee;
}
</style>