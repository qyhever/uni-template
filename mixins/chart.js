import * as echarts from '@/packageSecond/_components/ec-canvas/echarts.min.js'
import {
	getOption
} from '@/packageSecond/_utils/top10-bar-option'
export default {
	data() {
		return {
			barChartHeight: 0
		}
	},
	methods: {
		renderChart(props) {
			const {
				renderCallback
			} = props
			setTimeout(() => {
				// const ecComponent = this.selectComponent('#' + this.canvasId)
                const ecComponent = this.$refs.chart
				if (!ecComponent) {
					console.warn('请检查当前页面是否已注册ec-canvas组件 或 ec-canvas 组件是否已绑定 ref="chart"')
					return
				}
				ecComponent.init((canvas, width, height, dpr) => {
					const chart = echarts.init(canvas, null, {
						width: width,
						height: height,
						devicePixelRatio: dpr
					})
					chart.setOption(
						getOption(props)
					)
					renderCallback && renderCallback(chart)
					return chart
				})
			}, 20)
		}
	}
}
