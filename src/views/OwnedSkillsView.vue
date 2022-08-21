<template>
  <section id="skill-section" class="skill-section section animate">
    <div class="inner"
      v-if="isDisplayChartArea"
    >
      <div class="font-opensans fz-30 mb-15 mt-48 font-center">
        <h3 class="noise" data-text="FrontEnd">FrontEnd</h3>
      </div>
      <div class="section-body skill">
        <Chart
          :chartData="chartData.frontend"
        />
      </div>

      <div class="font-opensans fz-30 mb-15 mt-48 font-center ">
        <h3 class="noise" data-text="BackEnd">BackEnd</h3>
      </div>
      <div class="section-body skill">
        <Chart
          :chartData="chartData.backend"
        />
      </div>

      <div class="font-opensans fz-30 mb-15 mt-48 font-center ">
        <h3 class="noise" data-text="Tools">Tools</h3>
      </div>
      <div class="section-body skill">
        <Chart
          :chartData="chartData.devtools"
        />
      </div>

      <div class="section-heading mt-48">
        <h2 class="heading-primary noise" data-text="Actual Results">Actual Results</h2>
      </div>

      <div class="font-opensans fz-30 mb-15 font-center results">
        <ul class="results-inner">
          <li class="results-lists">
            <a href="https://www.nhk.or.jp/senkyo/" class="results-lists__links" target="_blank">NHK選挙WEB</a>
          </li>
          <li class="results-lists">
            <a href="https://www3.nhk.or.jp/news/special/athlete-words/" class="results-lists__links" target="_blank">アスリート×ことば</a>
          </li>
        </ul>
      </div>

    </div>
    <p class="skill-section-error"
      v-else
    >データの取得に失敗しました</p>
  </section>
</template>

<script>
import Chart from '@/components/BarChart.vue'
import { ref, computed } from 'vue'
import axios from 'axios'

export default {
  components: {
    Chart
  },
  setup () {
    const chartData = ref({})
    axios('/data/skills.json')
      .then(res => {
        chartData.value = res.data
      })
      .catch(() => {
        chartData.value = {}
      })

    const isDisplayChartArea = computed(() => {
      if (Object.keys(chartData).length !== 0) return true
      else return false
    })

    return {
      chartData,
      isDisplayChartArea
    }
  }
}
</script>

<style lang="scss">
.skill-section{
  padding-bottom: 200px;
  &-error {
    text-align: center;
    font-size: 24px;
  }
}
</style>
