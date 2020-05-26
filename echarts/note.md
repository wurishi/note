# 折线图 (Line)

## Basic Line Chart

[参考](https://echarts.apache.org/examples/zh/editor.html?c=line-simple)

![basic-line-chart](assets/basic-line-chart.png)

## Basic Area Chart

[参考](https://echarts.apache.org/examples/zh/editor.html?c=area-basic)

![basic-area-chart](assets/basic-area-chart.png)

新的知识点：

- boundaryGap : 默认值 true, 坐标轴两端是否留白。
- areaStyle : area 样式，设置一个{}，即可以让 chart 表现为 area chart 。

## Smoothed Line Chart

[参考](https://echarts.apache.org/examples/zh/editor.html?c=line-smooth)

![smoothed-line-chart](assets/smoothed-line-chart.png)

新的知识点：

- smooth : 设置为 true， 将变成平滑曲线。

## Stacked Area Chart

[参考](https://echarts.apache.org/examples/zh/editor.html?c=area-stack)

![stacked-area-chart](assets/stacked-area-chart.png)

新的知识点：

- label : 可以设置将数据直接显示在点上，其中 position 属性可以设置 label 的位置 (top, bottom, left, right)
- tooltip : 设置提示框组件.
- legend : 图例组件.
- toolbox : saveAsImage 可增加一个保存为图片的按钮.
- stack : 数据堆叠.

## Stacked Line Chart

[参考](https://echarts.apache.org/examples/zh/editor.html?c=line-stack)

![stacked-line-chart](assets/stacked-line-chart.png)

## Area Pieces

[参考](https://echarts.apache.org/examples/zh/editor.html?c=area-pieces)

![area-pieces](assets/area-pieces.png)

新的知识点：

- symbol : 设置为 'none' 将不显示线上的点.
- boundaryGap : [0,'30%'] 最大值将扩展30%.
- lineStyle : 自定义线的样式.
- markLine : 图表标线.
- visualMap : 数据映射.

## Rainfall

[参考](https://echarts.apache.org/examples/zh/editor.html?c=area-rainfall)

![rainfall](assets/rainfall.png)

新的知识点：

- subtext : 可定义副标题.
- yAxisIndex : yAxis 可以设置多个（一个数组），用 yAxisIndex 可以指定数据参照的坐标轴数组的下标.
- inverse : 是否反向坐标轴.
- toolbox.feature.dataZoom : 提供区域缩放功能按钮，yAxisIndex: 'none' 锁定 y 坐标轴不缩放.
- toolbox.feature.restore : 恢复功能按钮，将区域缩放操作重置.
- dataZoom : 区域组件. 添加 inside 项，可以让图表本身拖动时改变 dataZoom 区域.

## Large Scale Area Chart

[参考](https://echarts.apache.org/examples/zh/editor.html?c=area-simple)

![large-scale-area-chart](assets/large-scale-area-chart.png)

新的知识点：

- tooltip.position : 可以自定义 tooltip 出现的坐标.
- sampling : 当数据量大于像素点的是采样策略. 
- itemStyle : 定义样式.
- LinearGradient : 线性渐变.

## Confidence Band

[参考](https://echarts.apache.org/examples/zh/editor.html?c=confidence-band)

![confidence-band](assets/confidence-band.png)

新的知识点：

- showLoading / hideLoading : chart 显示 / 隐藏 loading 组件.
- formatter : 可自定义格式化要显示的数据.

## Dynamic Data + Time Axis

[参考](https://echarts.apache.org/examples/zh/editor.html?c=dynamic-data2)

![dynamic-data-time-axis](assets/dynamic-data-time-axis.png)

新的知识点：

- splitLine.show : 是否显示坐标轴的分隔线.
- setOption : 目测是增量设置 option 的.

## Rainfall and Water Flow

[参考](https://echarts.apache.org/examples/zh/editor.html?c=grid-multiple)

![rainfall-and-water-flow](assets/rainfall-and-water-flow.png)

新的知识点：

- gridIndex : 一个图例中可以有多个坐标(xAxis, yAxis都需要设置 gridIndex)，但 grid 也必须设置为数组 , 否则会报错.
- xAxisIndex / yAxisIndex : series 中的数据通过设置这二个属性，可以将自己显示的位置切换到其他定义的坐标系下.

end

