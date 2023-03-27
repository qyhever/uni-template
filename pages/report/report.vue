<template>
    <view class="pt-20">
        <view class="pl-12 pb-18 font-bold font-size-16">
            近一周销售额
        </view>
        <view class="mb-20" style="height: 280px">
            <ec-canvas id="sales" :ec="{lazyLoad: true}" />
        </view>
        <view class="pl-12 pb-18 font-bold font-size-16">
            全国考研报名人数
        </view>
        <view :style="{height: graduateHeight + 'px'}">
            <ec-canvas id="graduate" :ec="{lazyLoad: true}" />
        </view>
    </view>
</template>

<script>
import { initChart, calcBarChartHeight } from '@/utils/index.js'
import { getOption as getSalesOption } from './sales-option.js'
import { getOption as getGraduateOption } from './graduate-option.js'

export default {
    data () {
        return {
            graduateHeight: 0
        }
    },
    onReady () {
        this.renderSalesChart()
        this.renderGraduateChart()
    },
    methods: {
        renderSalesChart () {
            const ecComponent = this.selectComponent('#sales')
            const dataSource = [
                { value: 121, label: '星期一' },
                { value: 16, label: '星期二' },
                { value: 60, label: '星期三' },
                { value: 2259, label: '星期四' },
                { value: 378, label: '星期五' },
                { value: 50, label: '星期六' },
                { value: 80, label: '星期日' }
            ]
            initChart(ecComponent, getSalesOption(dataSource))
        },
        renderGraduateChart () {
            const ecComponent = this.selectComponent('#graduate')
            const dataSource = [
                { value: 39.2, label: '2000' },
                { value: 46, label: '2001' },
                { value: 62.4, label: '2002' },
                { value: 79.7, label: '2003' },
                { value: 94.5, label: '2004' },
                { value: 117.2, label: '2005' },
                { value: 127.12, label: '2006' },
                { value: 128.2, label: '2007' },
                { value: 120, label: '2008' },
                { value: 124.6, label: '2009' },
                { value: 140.6, label: '2010' },
                { value: 151.1, label: '2011' },
                { value: 165.6, label: '2012' },
                { value: 176, label: '2013' },
                { value: 172, label: '2014' },
                { value: 164.9, label: '2015' },
                { value: 177, label: '2016' },
                { value: 201, label: '2017' },
                { value: 238, label: '2018' },
                { value: 290, label: '2019' },
                { value: 341, label: '2020' },
                { value: 377, label: '2021' },
                { value: 457, label: '2022' },
                { value: 474, label: '2023' }
            ].reverse()
            this.graduateHeight = calcBarChartHeight(dataSource.length)
            setTimeout(() => {
                initChart(ecComponent, getGraduateOption(dataSource))
            })
        }
    }
}
</script>

<style>
</style>