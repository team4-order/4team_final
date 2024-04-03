<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <!-- 모든 과일에 대한 차트를 생성합니다 -->
        <div class="col-md-4" v-for="(chartData, fruitName) in fruitsChartData" :key="fruitName">
          <chart-card :chart-data="chartData.data" chart-type="Pie">
            <template v-slot:footer>
              <!-- 범례 표시 -->
              <div class="legend">
                <i class="fa fa-circle text-info"></i> A 등급
                <i class="fa fa-circle text-danger"></i> B 등급
                <i class="fa fa-circle text-warning"></i> C 등급
                <i class="fa fa-circle text-secondary"></i> 폐기
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-clock-o"></i> 최근 업데이트: 테스트
              </div>
            </template>
          </chart-card>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import ChartCard from '@/components/Cards/ChartCard.vue'
import axios from 'axios';

export default {
  components: {
    ChartCard
  },
  data() {
    return {
      inventories: [],
    }
  },


  computed: {
    fruitsChartData() {
      const gradeColors = {
        'A': '#4caf50',
        'B': '#ffeb3b',
        'C': '#f44336',
        '폐기': '#9e9e9e'
      };

      const grades = ['A', 'B', 'C', '폐기']; // 모든 가능한 등급을 정의합니다.

      const fruitsData = {};
      this.inventories.forEach(inventory => {
        // 과일 이름으로 데이터 구조 초기화
        if (!fruitsData[inventory.goodsName]) {
          fruitsData[inventory.goodsName] = { data: { labels: grades, series: Array(grades.length).fill(0), colors: grades.map(grade => gradeColors[grade]) } };
        }

        const gradeIndex = grades.indexOf(inventory.goodsGrade);
        if (gradeIndex !== -1 && inventory.inventoryQuantity > 0) {
          // 해당 등급의 재고량을 업데이트합니다.
          fruitsData[inventory.goodsName].data.series[gradeIndex] += parseInt(inventory.inventoryQuantity, 10);
        }
      });

      return fruitsData;
    }
  },






  methods: {
    fetchInventories() {
      axios.get('/api/inventories').then(response => {
        this.inventories = response.data;
      }).catch(error => {
        console.error("재고 목록을 가져오는 데 실패했습니다.", error);
      });
    },
  },
  mounted() {
    this.fetchInventories();
  },
}
</script>
