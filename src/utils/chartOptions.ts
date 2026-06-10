// utils/chartOptions.ts
import type { EChartsOption } from 'echarts'

export const createGroupBarChart = (): EChartsOption => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '12%', right: '8%', bottom: '8%', top: '8%', containLabel: true },
  xAxis: { type: 'category', name: '分组名称', axisLabel: { rotate: 30, interval: 0 } },
  yAxis: { type: 'value', name: '文章数量 (篇)' },
  series: [
    {
      type: 'bar',
      name: '文章数量',
      data: [],
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#5470c6' },
            { offset: 1, color: '#91cc75' }
          ]
        }
      },
      label: { show: true, position: 'top', formatter: '{c} 篇' }
    }
  ]
})

export const createLabelPieChart = (): EChartsOption => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} 篇 ({d}%)' },
  legend: { orient: 'vertical', left: 'left', top: 'center' },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: []
    }
  ]
})

export const createViewsBarChart = (): EChartsOption => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '18%', right: '8%', bottom: '8%', top: '8%', containLabel: true },
  xAxis: { type: 'value', name: '浏览量 (次)' },
  yAxis: {
    type: 'category',
    name: '文章标题',
    axisLabel: {
      formatter: (value: string) => (value?.length > 12 ? value.slice(0, 12) + '...' : value)
    }
  },
  series: [
    {
      type: 'bar',
      name: '浏览量',
      data: [],
      itemStyle: { borderRadius: [0, 8, 8, 0], color: '#fac858' },
      label: { show: true, position: 'right', formatter: '{c} 次' }
    }
  ]
})

export const createGroupViewsChart = (): EChartsOption => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['总浏览量', '平均浏览量'], bottom: 0 },
  xAxis: { type: 'category', name: '分组名称', axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: '浏览量 (次)' },
  series: [
    {
      type: 'bar',
      name: '总浏览量',
      data: [],
      itemStyle: { borderRadius: [8, 8, 0, 0], color: '#5470c6' },
      label: { show: true, position: 'top', formatter: '{c} 次' }
    },
    {
      type: 'line',
      name: '平均浏览量',
      data: [],
      smooth: true,
      lineStyle: { width: 3, color: '#fac858' },
      symbol: 'circle',
      symbolSize: 8,
      label: { show: true, position: 'top', formatter: '{c} 次' }
    }
  ]
})

export const createLabelViewsChart = (): EChartsOption => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['总浏览量', '平均浏览量'], bottom: 0 },
  xAxis: { type: 'category', name: '标签名称', axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: '浏览量 (次)' },
  series: [
    {
      type: 'bar',
      name: '总浏览量',
      data: [],
      itemStyle: { borderRadius: [8, 8, 0, 0], color: '#91cc75' },
      label: { show: true, position: 'top', formatter: '{c} 次' }
    },
    {
      type: 'line',
      name: '平均浏览量',
      data: [],
      smooth: true,
      lineStyle: { width: 3, color: '#ee6666' },
      symbol: 'circle',
      symbolSize: 8,
      label: { show: true, position: 'top', formatter: '{c} 次' }
    }
  ]
})

export const createTimelineChart = (): EChartsOption => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '10%', right: '8%', bottom: '8%', top: '8%' },
  xAxis: { type: 'category', name: '发布时间', data: [] },
  yAxis: { type: 'value', name: '文章数量 (篇)' },
  series: [
    {
      type: 'line',
      name: '发布数量',
      data: [],
      smooth: true,
      lineStyle: { width: 3, color: '#5470c6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(84, 112, 198, 0.6)' },
            { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
          ]
        }
      },
      symbol: 'circle',
      symbolSize: 8,
      label: { show: true, position: 'top', formatter: '{c} 篇' }
    }
  ]
})
