<template>
    <view>
        <view class="px-16 py-12 border-bottom">
            <view class="a-header-line">
                日期
            </view>
        </view>
        <view class="pt-16 pb-8 a-border-bottom-10">
            <view class="pl-16 pr-8">
                <view class="flex">
                    <view class="flex-1 mr-8 mb-8 card-item" @click="onShowDatePicker('startDate')">
                        {{ startDate || '开始日期' }}
                    </view>
                    <view class="flex-1 mr-8 mb-8 card-item" @click="onShowDatePicker('endDate')">
                        {{ endDate || '结束日期' }}
                    </view>
                </view>
                <view class="flex flex-wrap">
                    <view
                        v-for="(item, index) in shortcutDateList"
                        :key="index"
                        class="shortcut-item-outter"
                        @click="onShortItemClick(item)"
                    >
                        <view
                            class="shortcut-item card-item"
                            :class="{
                                active: activeShortcut === item.value
                            }"
                        >
                            {{ item.label }}
                        </view>
                    </view>
                </view>
            </view>
        </view>
        
        <view
            v-for="(groupItem, groupIndex) in groupList"
            :key="groupIndex"
            class="a-border-bottom-10"
        >
            <view class="px-16 py-12 border-bottom">
                <view class="a-header-line">
                    {{ groupItem.title }}
                </view>
            </view>
            <view class="pt-16 pb-8">
                <view class="px-16">
                    <view class="card-item" @click="onOpen(groupItem)">{{ groupItem.placeholder }}</view>
                </view>
                <view class="pt-10 pl-16 pr-8">
                    <view v-if="groupItem.checkedList.length" class="flex flex-wrap">
                        <view
                            v-for="(item, index) in groupItem.checkedList"
                            :key="index"
                            class="tag-item-outter"
                        >
                            <view class="tag-item">
                                <view class="tag-item-text">
                                    {{ item.name }}
                                </view>
                                <view class="p-6" @click="onDelete(groupItem, item)">
                                    <u-icon name="close-circle-fill" size="14" color="#3F87FF"></u-icon>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer-bar-placeholder"></view>
        <view class="footer-bar">
            <view class="footer-bar-btn cancel-btn" @click="onReset">重置</view>
            <view class="footer-bar-btn confirm-btn" @click="onConfirm">确定</view>
        </view>
        
        <u-datetime-picker
            ref="datePicker"
            v-model="currentDate"
            mode="date"
            :show="dateVisible"
            closeOnClickOverlay
            @close="dateVisible = false"
            @cancel="dateVisible = false"
            @confirm="onDatePickerConfirm"
        />
        <SelectListPopup
            ref="selectListPopup"
            @confirm="onSelectListPopupConfirm"
        />
    </view>
</template>

<script>
import dayjs from '@/utils/dayjs.min.js'
import { getShortcutDate } from './utils.js'
import SelectListPopup from './select-list-popup.vue'

const defaultGroupList = [
    {
        field: 'shop',
        title: '店铺',
        placeholder: '请选择店铺代码/名称',
        dataList: [],
        checkedList: []
    },
    {
        field: 'guider',
        title: '导购',
        placeholder: '请选择导购代码/名称',
        dataList: [],
        checkedList: []
    },
    {
        field: 'supplier',
        title: '供应商',
        placeholder: '请选择供应商代码/名称',
        dataList: [],
        checkedList: []
    }
]

export default {
    components: {
        SelectListPopup
    },
    data () {
        return {
            dateVisible: false,
            currentDate: Number(new Date()),
            startDate: '',
            endDate: '',
            dateProp: 'startDate', // startDate | endDate
            shortcutDateList: [
                { label: '今日', value: 'today' },
                { label: '昨日', value: 'yesterday' },
                { label: '本周', value: 'currentWeek' },
                { label: '本月', value: 'currentMonth' },
                { label: '近一周', value: 'latestWeek' },
                { label: '近一月', value: 'latestMonth' },
                { label: '近三月', value: 'latestThreeMonth' },
                { label: '近一年', value: 'latestYear' }
            ],
            activeShortcut: '',
            groupList: []
        }
    },
    onLoad (options) {
        this.initOptions(options)
    },
    onReady () {
        this.$refs.datePicker.setFormatter(this.formatter)
    },
    methods: {
        formatter (type, value) {
            if (type === 'year') {
                return `${value}年`
            }
            if (type === 'month') {
                return `${value}月`
            }
            if (type === 'day') {
                return `${value}日`
            }
            return value
        },
        initOptions (options) {
            // options = {
            //     fieldList: 'shop,guider,supplier',
            //     startDate: '',
            //     endDate: '',
            //     activeShortcut: '' // 会根据 activeShortcut 设置 startDate 和 endDate
            // }
            if (options.fieldList) {
                const fieldList = options.fieldList.split(',')
                this.groupList = defaultGroupList.filter(item => {
                    return fieldList.some(field => field === item.field)
                })
            }
            this.startDate = options.startDate || ''
            this.endDate = options.endDate || ''
            if (options.activeShortcut) {
                this.activeShortcut = options.activeShortcut
                const [startDate, endDate] = getShortcutDate(options.activeShortcut)
                this.startDate = startDate
                this.endDate = endDate
            }
            // localOptions 可以传回显参数, 优先级更高
            // localOptions 的 fieldList 可以传 checkedList, 页面根据 checkedList 回显已选项
            // localOptions = {
            //     fieldList: [
            //         { field: 'shop', checkedList: [] },
            //         { field: 'guider', checkedList: [] },
            //         { field: 'supplier', checkedList: [] }
            //     ],
            //     startDate: '',
            //     endDate: '',
            //     activeShortcut: '' // 会根据 activeShortcut 设置 startDate 和 endDate
            // }
            const localOptions = wx.getStorageSync('conditionOptionsData')
            if (localOptions) {
                if (localOptions.fieldList) {
                    defaultGroupList.forEach(group => {
                        const current = localOptions.fieldList.find(item => item.field === group.field)
                        if (current) {
                            this.groupList.push({
                                ...group,
                                checkedList: current.checkedList || []
                            })
                        }
                    })
                }
                this.startDate = localOptions.startDate || ''
                this.endDate = localOptions.endDate || ''
                if (localOptions.activeShortcut) {
                    this.activeShortcut = localOptions.activeShortcut
                    const [startDate, endDate] = getShortcutDate(localOptions.activeShortcut)
                    this.startDate = startDate
                    this.endDate = endDate
                }
            }
        },
        onShowDatePicker (prop) {
            if (prop === 'endDate' && !this.startDate) {
                wx.showModal({
                    content: '请先选择开始日期',
                    showCancel: false,
                    confirmText: '我知道了'
                })
                return
            }
            if (this[prop]) { // 已经选择过了，要回显
                this.$refs.datePicker.updateColumnValue(
                    new Date(this[prop]).getTime()
                )
            }
            this.dateProp = prop
            this.dateVisible = true
        },
        onDatePickerConfirm (event) {
            if (this.dateProp === 'endDate') {
                const start = new Date(this.startDate).getTime()
                const end = event.value
                if (start > end) {
                    wx.showModal({
                        content: '开始日期不能大于结束日期',
                        showCancel: false,
                        confirmText: '我知道了'
                    })
                    return
                }
            }
            this[this.dateProp] = dayjs(event.value).format('YYYY-MM-DD')
            this.activeShortcut = ''
            this.dateVisible = false
        },
        onShortItemClick (row) {
            const val = row.value
            this.activeShortcut = val
            const [startDate, endDate] = getShortcutDate(val)
            this.startDate = startDate
            this.endDate = endDate
        },
        onOpen (row) {
            this.$refs.selectListPopup.open(row)
        },
        onSelectListPopupConfirm (prop, data) {
            this.groupList = this.groupList.map(item => {
                if (item.field === prop) {
                    return {
                        ...item,
                        checkedList: data
                    }
                }
                return item
            })
        },
        onDelete (groupRow, row) {
            this.groupList = this.groupList.map(groupItem => {
                if (groupItem.field === groupRow.field) {
                    const checkedList = groupItem.checkedList.filter(item => item.code !== row.code)
                    return {
                        ...groupItem,
                        checkedList
                    }
                }
                return groupItem
            })
        },
        onReset () {
            this.currentDate = Number(new Date())
            this.startDate = ''
            this.endDate = ''
            this.dateProp = 'startDate'
            this.activeShortcut = ''
            this.groupList = this.groupList.map(group => {
                return {
                    ...group,
                    checkedList: []
                }
            })
        },
        onConfirm () {
            const pages = getCurrentPages()
            const beforePage = pages[pages.length - 2] // 前一个页面
            const that = beforePage.$vm
            if (that && that.onRefresh) {
                that.onRefresh({
                    startDate: this.startDate,
                    endDate: this.endDate,
                    activeShortcut: this.activeShortcut,
                    groupList: this.groupList
                })
            }
            wx.navigateBack()
        }
    }
}
</script>

<style lang="scss" scoped>
.card-item {
    padding: 9px 0;
    border-radius: 2px;
    border: 1px solid #d8d8d8;
    text-align: center;
    font-size: 12px;
    color: $uni-text-color-grey;
}
.shortcut-item-outter {
    box-sizing: border-box;
    flex: 0 0 25%;
    padding-right: 8px;
    padding-bottom: 8px;
}
.shortcut-item {
    color: $uni-text-color;
    &.active {
        background: rgba(63, 135, 255, 0.1);
        border-color: #3F87FF;
        color: #3F87FF;
    }
}
.tag-item-outter {
    box-sizing: border-box;
    flex: 0 0 33.33%;
    padding-right: 8px;
    padding-bottom: 8px;
}
.tag-item {
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 8px;
    padding-right: 2px;
    border-radius: 2px;
    background: #EBF3FF;
    color: #3F87FF;
}
.tag-item-text {
    font-size: 12px;
    // white-space: nowrap;
    // text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
.footer-bar-placeholder {
    height: 56px;
    padding-bottom: env(safe-area-inset-bottom);
}
.footer-bar {
    z-index: 99;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    height: 56px;
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
}
.footer-bar-btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}
.cancel-btn {
    color: #929BA7;
    background-color: #F3F3F3;
}
.confirm-btn {
    color: #FFFFFF;
    background-color: #3F87FF;
}
</style>