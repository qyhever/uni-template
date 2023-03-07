<template>
    <view>
        <view style="height: 280px">
            <ec-canvas id="chart" :ec="{lazyLoad: true}"></ec-canvas>
        </view>
    </view>
</template>

<script>
import echarts from '@/wxcomponents/ec-canvas/echarts.min.js'

function getOption (props) {
    const {
        yAxisData = [],
        seriesData = [],
        seriesName = '数量',
        tooltipSuffix = '件'
    } = props
    return {
        grid: {
            containLabel: true
        },
        color: '#3F87FF',
        tooltip: {
            trigger: 'axis',
            textStyle: {
                fontSize: 12
            },
            confine: true
        },
        xAxis: {
            type: 'category',
            data: yAxisData
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 10,
                splitLine: {
                    show: false
                },
                show: true,
                interval: 0,
                splitArea: {
                    show: false
                },
                formatter: function(params) {
                    var newParamsName = "";
                    var paramsNameNumber = params.length;
                    var provideNumber = 4; //一行显示几个字
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                    if (paramsNameNumber > provideNumber) {
                        newParamsName = params.slice(0, provideNumber) + '...'
        
                    } else {
                        newParamsName = params;
                    }
                    return newParamsName
                }
            }
        },
        series: [{
            type: 'bar',
            name: seriesName,
            // barWidth: chartData.length > 4 ? 'auto' : 30,
            barWidth: 30,
            data: [121, 16, 60, 2259, 378, 50],
            tooltip: {
                valueFormatter: function(value) {
                    return value + tooltipSuffix;
                }
            },
            //显示数值
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'insideRight', //在上方显示
                        // formatter (value, index) {
                        //     // value大于1000时除以1000并拼接k，小于1000按原格式显示
                        //     if (value >= 1000) {
                        //         value = value / 1000 + 'k'
                        //     }
                        //     return value
                        // }
                    },
                },
            },
        }]
    }
}
export default {
    onReady () {
            const ecComponent = this.selectComponent('#chart')
            console.log('ecComponent', ecComponent)
            ecComponent.init((canvas, width, height, dpr) => {
            	const chart = echarts.init(canvas, null, {
            		width: width,
            		height: height,
            		devicePixelRatio: dpr
            	})
            	chart.setOption(
            		getOption({
                        yAxisData: ['1', '2', '3', '4', '5', '6']
                    })
            	)
            	return chart
            })
    }
}
</script>

<style>
</style>