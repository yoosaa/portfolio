<template>
  <section id="skill-section" class="skill-section section animate">
    <div class="inner"
      v-if="isDisplayChartArea"
    >
      <NoiseTitle
        titleText="FrontEnd"
      />
      <div class="section-body skill">
        <Chart
          :chartData="chartData.frontend"
        />
      </div>

      <NoiseTitle
        titleText="BackEnd"
      />
      <div class="section-body skill">
        <Chart
          :chartData="chartData.backend"
        />
      </div>

      <NoiseTitle
        titleText="Tools"
      />
      <div class="section-body skill">
        <Chart
          :chartData="chartData.devtools"
        />
      </div>

      <NoiseTitle
        titleText="Actual Results"
      />
      <div class="font-opensans fz-30 mb-15 font-center results">
        <Cards />
      </div>

    </div>
    <p class="skill-section-error"
      v-else
    >データの取得に失敗しました</p>
  </section>
</template>

<script>
import Chart from '@/components/BarChart.vue'
import Cards from '@/components/RecordCards.vue'
import NoiseTitle from '@/components/NoiseTitle.vue'
import { ref, computed } from 'vue'
import axios from 'axios'

export default {
  components: {
    Chart,
    Cards,
    NoiseTitle
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
