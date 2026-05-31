// echarts-setup.ts
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers' // 只导入你需要的渲染器
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  FunnelChart,
  SankeyChart,
  GraphChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  DatasetComponent
} from 'echarts/components'

// 注册已导入且需要使用的组件
use([
  CanvasRenderer, // Canvas 渲染器（与 SVGRenderer 二选一，Canvas 性能更好）
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  DatasetComponent,
  BarChart,
  LineChart,
  PieChart,
  // 如果暂时不需要以下图表，可以注释掉，后续需要时再取消注释
  ScatterChart,
  RadarChart,
  GaugeChart,
  FunnelChart,
  SankeyChart,
  GraphChart
])
