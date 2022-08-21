<template>
  <div id="chart"
    ref="chartArea"
  ></div>
</template>

<script>
import Highcharts from 'highcharts'
import { ref, watch } from 'vue'

export default {
  props: {
    chartData: {
      type: Object,
      require: true
    }
  },
  setup (props) {
    const chartArea = ref({})
    const initChart = (targetElm, data) => {
      Highcharts.chart(targetElm, {
        chart: {
          type: 'bar',
          height: (9 / 16 * 50) + '%',
          backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        xAxis: {
          categories: data.name,
          labels: {
            align: 'right',
            style: { 'font-size': '14px' }
          }
        },
        yAxis: {
          min: 0,
          max: 6,
          minRange: 0.5,
          labels: {
            style: { 'font-size': '10px' }
          },
          title: {
            text: 'years',
            align: 'middle',
            style: { 'font-size': '14px' }
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          enabled: false
        },
        series: [{
          data: data.series
        }]
      })
    }

    watch(() => props.chartData, () => {
      initChart(chartArea.value, props.chartData)
    })

    return { chartArea }
  }
}
</script>

<style lang="scss">
.highcharts {
  &-title {
    display: none;
  }
}
</style>
