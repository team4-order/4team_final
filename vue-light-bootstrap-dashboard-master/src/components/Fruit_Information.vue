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
<!--              <div class="legend">-->
<!--                <i class="fa fa-circle text-info"></i> A 등급-->
<!--                <i class="fa fa-circle text-danger"></i> B 등급-->
<!--                <i class="fa fa-circle text-warning"></i> C 등급-->
<!--              </div>-->
            </template>
          </chart-card>
        </div>

      </div>
    </div>
  </div>
</template>



<script>
import ChartCard from '@/components/Cards/ChartCard1.vue'
import axios from 'axios';

export default {
  components: {
    ChartCard
  },
  data() {
    return {
      inventories: [],
      searchQuery: '',
      loading: false,
      businessId: localStorage.getItem('user') || sessionStorage.getItem('user'), // 세션에서 비즈니스 ID를 로딩하고 데이터 프로퍼티에 저장
    };
  },
  computed: {
    filteredFruitsChartData() {
      if (!this.searchQuery) {
        return this.fruitsChartData;
      }
      const searchQueryLowerCase = this.searchQuery.toLowerCase();
      return Object.fromEntries(
        Object.entries(this.fruitsChartData)
          .filter(([fruitName]) => fruitName.toLowerCase().includes(searchQueryLowerCase))
      );
    },
    fruitsChartData() {
      // "폐기" 등급을 제외한 등급 배열
      const grades = ['A', 'B', 'C'];
      const gradeColors = {
        'A': '#26c4e1',
        'B': '#d72020',
        'C': '#e7a46d',
        // '폐기' 등급은 제외
      };

      const fruitsData = {};
      this.inventories.forEach(inventory => {
        const { goodsName, goodsGrade, inventoryQuantity } = inventory;

        // "폐기" 등급이면 아래 로직을 수행하지 않음
        if (goodsGrade === '폐기') return;

        if (!fruitsData[goodsName]) {
          fruitsData[goodsName] = {
            data: {
              labels: grades,
              series: Array(grades.length).fill(0),
              colors: grades.map(grade => gradeColors[grade]),
              totals: Array(grades.length).fill(0), // 각 등급별 총 수량
            }
          };
        }

        const index = grades.indexOf(goodsGrade);
        if (index !== -1) {
          fruitsData[goodsName].data.series[index] += parseInt(inventoryQuantity, 10);
          fruitsData[goodsName].data.totals[index] += parseInt(inventoryQuantity, 10);
        }
      });

      return fruitsData;
    }



  },
  methods: {
    fetchInventories() {
      if (!this.businessId) {
        console.error("Business ID is not provided.");
        return;
      }
      this.loading = true;
      axios.get(`http://localhost:8080/api/inventories/business/${this.businessId}`)
        .then(response => {
          this.inventories = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error("Failed to fetch inventories for business ID.", error);
          this.loading = false;
        });
    },
  },
  mounted() {
    this.fetchInventories();
  },
}
</script>

