<template>
  <div class="card">
    <div class="card-header" v-if="$slots.header || title || subTitle">
      <slot name="header">
        <h4 class="card-title" v-if="title">{{ title }}</h4>
        <p class="card-category" v-if="subTitle">{{ subTitle }}</p>
      </slot>
    </div>
    <div class="card-body">
      <div :id="chartId" class="ct-chart"></div>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chart-card',
  props: {
    chartType: {
      type: String,
      default: 'Line' // 기본 차트 타입
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    },
    chartData: {
      type: Object,
      default: () => ({ series: [] })
    },
    responsiveOptions: [Object, Array]
  },
  data () {
    return {
      chartId: 'no-id',
      $Chartist: null,
      chart: null
    }
  },
  methods: {
    initChart () {
      const chartIdQuery = `#${this.chartId}`;
      // 원형 차트에 대해 레이블을 숨기는 옵션을 기본값으로 추가
      const defaultPieOptions = this.chartType === 'Pie' ? { showLabel: false } : {};
      const finalOptions = Object.assign({}, defaultPieOptions, this.chartOptions);
      this.chart = this.$Chartist[this.chartType](chartIdQuery, this.chartData, finalOptions, this.responsiveOptions);
      this.$emit('initialized', this.chart);
    },



    updateChartId () {
      const currentTime = new Date().getTime().toString();
      const randomInt = Math.floor(Math.random() * (parseInt(currentTime, 10) - 0 + 1)) + 0;
      this.chartId = `div_${randomInt}`;
    },
  },
  async mounted () {
    this.updateChartId();
    const Chartist = await import('chartist');
    this.$Chartist = Chartist.default || Chartist;
    this.initChart();
  }
}
</script>
