<template>
  <div class="card">
    <div class="card-header" v-if="title || subTitle">
      <h4 class="card-title" v-if="title">{{ title }}</h4>
      <p>수량 단위: box</p>
      <p class="card-category" v-if="subTitle">{{ subTitle }}</p>
    </div>
    <div class="card-body">
      <div :id="chartId" class="ct-chart"></div>
    </div>
    <div class="card-footer">
      <div class="legend">
        <!-- 범례에 각 등급과 총 수량 표시 -->
        <span v-for="(total, index) in chartData.totals" :key="index" class="legend-item">
        <i class="fa fa-circle" :style="{ color: chartData.colors[index] }"></i>
        {{ chartData.labels[index] }} 등급
      </span>
      </div>
    </div>
  </div>
</template>

<script>
import Chartist from 'chartist';

export default {
  name: 'chart-card',
  props: {
    title: String,
    subTitle: String,
    chartType: {
      type: String,
      default: 'Pie'
    },
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({ showLabel: true })
    },
    responsiveOptions: {
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {
      chartId: `chart-${Math.random().toString(36).substr(2, 9)}`
    };
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      const options = {
        ...this.chartOptions,
        labelInterpolationFnc: (value, idx) => {
          const quantity = this.chartData.series[idx];
          // 각 등급과 퍼센트를 함께 표시
          const percentage = this.chartData.series.reduce((a, b) => a + b, 0);
          return `${quantity}(${Math.round(quantity / percentage * 100)}%)`;
        }
      };
      const selector = `#${this.chartId}`;
      new Chartist.Pie(selector, this.chartData, options, this.responsiveOptions);
    }
  },

};
</script>

<style scoped>
.legend-item {
  margin-right: 15px;
}
</style>
