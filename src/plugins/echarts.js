/*
 * @Author: DaiYu
 * @Date: 2022-10-07 14:55:48
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-10-07 15:15:58
 * @FilePath: \main\src\plugins\echarts.js
 */
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart,EffectScatterChart,PieChart,BarChart,MapChart,FunnelChart  } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  GeoComponent,
  TimelineComponent,
  VisualMapComponent,
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
  LineChart,
  GeoComponent,
  TimelineComponent,
  EffectScatterChart,
  PieChart,
  BarChart,
  MapChart,
  FunnelChart
]);

export default echarts
