<template>
    <u-popup
        :show="show"
        closeOnClickOverlay
        closeable
        round="8"
        @close="close"
        @open="open"
    >
        <view :style="{height: containerHeight + 'px'}" class="a-region-container" @touchmove.stop.prevent="preventHandler">
            <view class="a-region-title">
                请选择所在地区
            </view>
            <scroll-view v-if="tabList.length" class="a-region-selected-area" scroll-x="true">
                <view class="a-region-selected-list">
                    <view
                        v-for="(item, index) in tabList"
                        :key="index"
                        class="a-region-selected-item"
                        :class="{
                            'a-region-selected-item-active': currentTabIndex === index
                        }"
                        @click="onTabItemClick(index)"
                    >
                        {{item.label}}
                    </view>
                </view>
            </scroll-view>
            <swiper
                :indicator-dots="false"
                :autoplay="false"
                :duration="280"
                class="a-region-swiper"
                :current="currentSwiperIndex"
                @change="onSwiperChange"
            >
                <swiper-item
                    v-for="(dataList, swiperIndex) in dataSource"
                    :key="swiperIndex"
                    class="a-region-swiper-item"
                >
                    <scroll-view scroll-y="true" class="a-region-scroll-data-list">
                        <view class="a-region-data-list">
                            <view
                                v-for="(item, index) in dataList"
                                :key="index"
                                class="a-region-data-item"
                                :class="{
                                    'a-region-data-item-active': selectedData[swiperIndex].id === item.id
                                }"
                                @click="onDataItemClick(item)"
                            >
                                <text>{{item.name}}</text>
                                <u-icon
                                    v-if="selectedData[swiperIndex].id === item.id"
                                    name="checkmark"
                                    color="#e1251b"
                                    size="18"
                                >
                                </u-icon>
                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>
    </u-popup>
</template>

<script>
import { getProvinceList, getCityList, getCountyList, getTownList } from '@/api/index'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            scrollIdList: [],
            tabList: [],
            currentTabIndex: 0,
            containerHeight: 350,
            currentSwiperIndex: 0,
            dataSource: [],
            selectedData: [],
            querying: false
        }
    },
    watch: {
        show: {
            handler(val) {
                if (val && !this.dataSource.length) {
                    
                }
            }
        },
        value: {
            handler (newVal) {
                if (newVal.length) {
                    this.tabList = newVal.slice()
                    this.selectedData = newVal.map(item => {
                        return {
                            name: item.label,
                            id: item.value
                        }
                    })
                      const reqs = [
                          getProvinceList,
                          getCityList,
                          getCountyList,
                          getTownList
                      ]
                    const pros = newVal.map((item, index) => {
                      if (this.dataSource.length && index === 0) {
                          return () => Promise.resolve()
                      }
                        return reqs[index]({ code: item.value })
                    })
                    Promise.all(pros) 
                        .then(res => {
                            res.forEach(item => {
                                if (item) {
                                    this.dataSource.push(item)
                                }
                            })
                            this.currentSwiperIndex = 3
                            this.currentTabIndex = 3
                        })
                }
            },
            deep: true
        }
    },
    // 在组件实例进入页面节点树时执行
    beforeMount () {
        this.containerHeight = wx.getSystemInfoSync().windowHeight * 0.8
    },
    created () {
        getProvinceList().then(res => {
            this.dataSource.push(res)
        }).catch(err => {
            console.log('err', err)
        })
    },
    methods: {
        preventHandler () {
            return true
        },
        open () {
            
        },
        close () {
            this.$emit('update:show', false)
        },
        onTabItemClick (index) {
            if (this.currentTabIndex === index) {
                return
            }
            this.currentTabIndex = index
            this.currentSwiperIndex = index
        },
        onDataItemClick (item) {
          this.selectedData = this.selectedData
            .slice(0, this.currentSwiperIndex)
            .concat(item)
          this.tabList = this.tabList
            .slice(0, this.currentSwiperIndex)
            .concat(
                [
                    { label: item.name, value: item.id },
                    this.selectedData.length === 4 ? null : ({ label: '请选择', value: '' })
                ].filter(Boolean)
            )
          if (this.selectedData.length === 4) {
            this.$emit('update:show', false)
            this.$emit('input', this.selectedData.map(item => {
                return {
                    label: item.name,
                    value: item.id
                }
            }))
          }
          this.currentTabIndex = this.tabList.length - 1
          const reqs = [
              getCityList,
              getCountyList,
              getTownList
          ]
          const req = reqs[this.currentSwiperIndex]
          if (!req) {
              return
          }
          this.querying = true
          req({
              code: item.id
          }).then(res => {
                this.querying = false
              if (this.currentSwiperIndex < this.dataSource.length - 1) {
                  this.dataSource = this.dataSource
                    .slice(0, this.currentSwiperIndex +1)
                    this.dataSource.push(res)
              } else {
                this.dataSource.push(res)
              }
              this.currentSwiperIndex += 1
          }).catch(err => {
              console.log('err', err)
          })
        },
        onSwiperChange (e) {
          if (this.currentTabIndex !== e.detail.current) {
              this.currentTabIndex = e.detail.current
          }
        },
        init() {
            // ...
        }
    }
};
</script>
<style lang="scss">
.a-region- {
    &container {
        display: flex;
        flex-direction: column;
        font-size: 14px;
    }
    &title {
        padding-left: 16px;
        flex-basis: 40px;
        display: flex;
        align-items: center;
        font-size: 16px;
    }
    &selected-area {
        flex-basis: 36px;
    }
    &selected-list {
        height: 100%;
        display: flex;
        align-items: center;
    }
    &selected-item {
        margin: 0 12px;
        white-space: nowrap
    }
    &selected-item-active {
        color: #e1251b;
    }
    &swiper {
        flex: 1;
    }
    &swiper-item {
        height: 100%;
        overflow: auto;
    }
    &scroll-data-list {
        height: 100%;
    }
    &data-list {
        
    }
    &data-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
    &data-item-active {
        
    }
}
</style>
