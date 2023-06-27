<template>
    <view>
        <view class="px-16 py-12 border-bottom">
            <view class="a-header-line">
                日期
            </view>
        </view>
        <view class="py-16">
            <view class="pl-16 pr-8">
                <view class="flex">
                    <view class="flex-1 tag-item" @click="onShowDatePicker('startDate')">
                        {{ startDate || '开始日期' }}
                    </view>
                    <view class="flex-1 tag-item" @click="onShowDatePicker('endDate')">
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
                            class="shortcut-item"
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
    </view>
</template>

<script>
import dayjs from '@/utils/dayjs.min.js'
import { getShortcutDate } from './utils.js'

export default {
    data () {
        return {
            dateVisible: false,
            currentDate: Number(new Date()),
            startDate: '',
            endDate: '',
            dateProp: 'startDate', // startDate | endDate
            shortcutDateList: [
                { label: '今日', value: 'today' },
                { label: '昨天', value: 'yesterday' },
                { label: '本周', value: 'currentWeek' },
                { label: '本月', value: 'currentMonth' },
                { label: '近一周', value: 'latestWeek' },
                { label: '近一月', value: 'latestMonth' },
                { label: '近三月', value: 'latestThreeMonth' },
                { label: '近一年', value: 'latestYear' }
            ],
            activeShortcut: ''
        }
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
        }
    }
}
</script>

<style lang="scss">
.tag-item {
    margin-right: 8px;
    margin-bottom: 8px;
    padding: 9px 0;
    border-radius: 2px;
    border: 1px solid #d8d8d8;
    text-align: center;
    color: $uni-text-color-grey;
    font-size: 12px;
}
.shortcut-item-outter {
    box-sizing: border-box;
    flex: 0 0 25%;
    padding-right: 8px;
    padding-bottom: 8px;
}
.shortcut-item {
    padding: 9px 0;
    border-radius: 2px;
    border: 1px solid #d8d8d8;
    text-align: center;
    font-size: 12px;
    &.active {
        background: rgba(63, 135, 255, 0.1);
        border-color: #3F87FF;
        color: #3F87FF;
    }
}
</style>