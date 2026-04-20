<template>
	<div class="ip-monitor-page-desktop-heatmap">
		<!-- IP热力图表格 -->
		<table class="ip-monitor-page-desktop-heatmap-table">
			<tr
				v-for="row in rowCount"
				:key="row"
			>
				<td
					v-for="col in colCount"
					:key="`${row}-${col}`"
					:class="heatmap.getCellClass(row, col)"
					:style="heatmap.getCellStyle(row, col)"
					@click="heatmap.handleCellClick(row, col)"
				>
					<div v-if="heatmap.fangIPs.includes(heatmap.getFullIP(row, col))">
						<span class="ip-monitor-page-desktop-heatmap-ip-number">{{ heatmap.getIPNumber(row, col) }}</span>
						<span class="ip-monitor-page-desktop-heatmap-count-number">
							{{ props.ipCounts[heatmap.getFullIP(row, col)] || 0 }}
						</span>
					</div>
					<span
						v-else
						class="ip-monitor-page-desktop-heatmap-ip-number"
					>
						{{ heatmap.getIPNumber(row, col) }}
					</span>
				</td>
			</tr>
		</table>

		<!-- 图例 -->
		<div
			v-if="heatmap.maxCount > 0"
			class="ip-monitor-page-desktop-heatmap-legend"
		>
			<!-- 热力图颜色说明 -->
			<div class="ip-monitor-page-desktop-heatmap-legend-item">
				<div
					class="ip-monitor-page-desktop-heatmap-legend-color ip-monitor-page-desktop-heatmap-legend-gradient"
				/>
				<span>1次-{{ heatmap.maxCount }}次（颜色越深次数越多）</span>
			</div>
			<!-- 坊内/非坊内说明 -->
			<div class="ip-monitor-page-desktop-heatmap-legend-item">
				<div
					class="ip-monitor-page-desktop-heatmap-legend-color ip-monitor-page-desktop-heatmap-legend-fang"
				/>
				<span>坊内IP（带数字表示有使用次数）</span>
			</div>
			<div class="ip-monitor-page-desktop-heatmap-legend-item">
				<div
					class="ip-monitor-page-desktop-heatmap-legend-color ip-monitor-page-desktop-heatmap-legend-non-fang"
				/>
				<span>非坊内IP（灰色背景，不可使用）</span>
			</div>
			<div class="ip-monitor-page-desktop-heatmap-legend-item">
				<div
					class="ip-monitor-page-desktop-heatmap-legend-color ip-monitor-page-desktop-heatmap-legend-available"
				/>
				<span>可分配IP（坊内但次数为0，无颜色背景）</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, onMounted, watch} from 'vue'
import {IPHeatmapDesktop} from './ts/IPHeatmapDesktop'

interface HeatmapProps {
	fangIPs: string[]
	ipCounts: Record<string, number>
	isDark: boolean
}

const props = defineProps<HeatmapProps>()

const heatmap = new IPHeatmapDesktop({
	fangIPs: props.fangIPs,
	ipCounts: props.ipCounts,
	isDark: props.isDark
})

const rowCount = computed(() => heatmap.rowCount)
const colCount = computed(() => heatmap.colCount)

watch(
	() => [props.fangIPs, props.ipCounts, props.isDark],
	() => {
		heatmap.updateProps({
			fangIPs: props.fangIPs,
			ipCounts: props.ipCounts,
			isDark: props.isDark
		})
	},
	{deep: true}
)
</script>

<style>
@import './css/IPHeatmapDesktop.css';
</style>
