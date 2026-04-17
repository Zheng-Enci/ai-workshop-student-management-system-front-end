import { BarChart, LineChart, HeatmapChart } from 'echarts/charts'
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	VisualMapComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'


echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	VisualMapComponent,
	BarChart,
	LineChart,
	HeatmapChart,
	CanvasRenderer
])
