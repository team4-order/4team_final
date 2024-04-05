<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <input type="text" v-model="searchQuery" placeholder="과일 검색..." class="form-control">
          <br><br>
        </div>
        <!-- 과일 차트를 생성합니다 -->
        <div class="col-md-4" v-for="(chartData, fruitName) in filteredFruitsChartData" :key="fruitName">
          <chart-card :chart-data="chartData.data" chart-type="Pie" :title="fruitName">
          <template v-slot:footer>
            <h4 color="red">{{ fruitName }}</h4>

              <!-- 범례 표시 -->
              <div class="legend">
                <i class="fa fa-circle text-info"></i> A 등급
                <i class="fa fa-circle text-danger"></i> B 등급
                <i class="fa fa-circle text-warning"></i> C 등급
                <i class="fa fa-circle text-secondary"></i> 폐기
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-clock-o"></i> 실시간
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
      searchQuery: '', // 검색어를 저장할 데이터 속성
    }
  },


  computed: {


    filteredFruitsChartData() {
      if (!this.searchQuery) {
        return this.fruitsChartData; // 검색어가 없다면 모든 데이터 반환
      }

      const searchQueryLowerCase = this.searchQuery.toLowerCase();
      const filteredData = {};
      Object.entries(this.fruitsChartData).forEach(([fruitName, data]) => {
        if (fruitName.toLowerCase().includes(searchQueryLowerCase)) {
          filteredData[fruitName] = data; // 검색어가 포함된 과일만 필터링
        }
      });

      return filteredData;
    },




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
