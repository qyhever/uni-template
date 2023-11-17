import echarts from '@/wxcomponents/ec-canvas/echarts.min.js'

// 四舍五入保留n位小数，整数返回整数
export function keepDecimal (num, n = 2) {
    const len = Math.pow(10, n)
    return Math.round(num * len) / len
}

// 四舍五入保留1位小数，整数返回整数
export function keepOneDecimal (num) {
    // Math.round(2.444 * 10) / 10 -> 2.4
    return Math.round(num * 10) / 10
}

// 四舍五入保留2位小数，整数返回整数
export function keepTwoDecimal (num) {
    // Math.round(2.444 * 100) / 100 -> 2.44
    return Math.round(num * 100) / 100
}

export function calcBarChartHeight (len) {
    // 柱子高度30，图标其它高度80
    return len * 30 + 80
}

export function initChart (ecComponent, option) {
    ecComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
        })
        chart.setOption(option)
        return chart
    })
}

export function compareVersion (v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}
