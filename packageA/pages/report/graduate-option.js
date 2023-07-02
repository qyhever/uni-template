import { keepTwoDecimal } from '@/utils/index.js'

function formatterValue (value) {
    // value大于1000时除以1000并拼接k，小于1000按原格式显示
    if (value >= 1000) {
        return keepTwoDecimal(value / 1000) + 'k'
    }
    return value
}

function formatterBarSeriesData (data) {
    const maxValue = Math.max(...data)
    return data.map(value => {
        const item = {
            value,
            label: {
                position: 'inside',
                color: '#fff'
            }
        }
        if (value < maxValue / 5) {
            return Object.assign(item, {
                label: {
                    position: 'right',
                    color: '#333'
                }
            })
        }
        return item
    })
}

export function getOption (dataSource, options = {}) {
    const {
        seriesName = '人数',
        valueUnit = '万'
    } = options
    const yAxisData = []
    const seriesData = []
    dataSource.forEach(item => {
        yAxisData.push(item.label)
        seriesData.push(item.value)
    })
    return {
        grid: {
            top: '2%',
            left: '2%',
            right: '7%',
            bottom: '0px',
            containLabel: true
        },
        color: '#3F87FF',
        tooltip: {
            trigger: 'axis',
            textStyle: {
                fontSize: 12
            },
            confine: true,
            valueFormatter (value) {
                return value + valueUnit
            }
        },
        xAxis: {
            type: 'value',
            data: yAxisData,
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: yAxisData,
            splitLine: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0, // 强制显示所有标签
                formatter (value) {
                    return value + ''
                },
                color: '#333',
                fontSize: 10
            }
        },
        series: [{
            type: 'bar',
            name: seriesName,
            barWidth: 30,
            data: formatterBarSeriesData(seriesData),
            label: {
                show: true,
                formatter ({value}) {
                    return formatterValue(value) + valueUnit
                }
            }
        }]
    }
}
