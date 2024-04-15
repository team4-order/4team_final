<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4">
          <chart-card :chart-data="pieChart.data" chart-type="Pie">
            <template v-slot:header>
              <h4 class="card-title">Email Statistics</h4>
              <p class="card-category">Last Campaign Performance</p>
            </template>
            <template v-slot:footer>
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Open
                <i class="fa fa-circle text-danger"></i> Bounce
                <i class="fa fa-circle text-warning"></i> Unsubscribe
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-clock-o"></i> Campaign sent 2 days ago
              </div>
            </template>
          </chart-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartCard from 'src/components/Cards/ChartCard.vue'

export default {
  components: {
    ChartCard
  },
  data() {
    return {
      pieChart: {
        data: {
          // labels: ['Open', 'Bounce', 'Unsubscribe'],
          series: [80, 10, 50]
        }
      },
    }
  }
}
</script>

<style>
/* You can add style if you need */
</style>
