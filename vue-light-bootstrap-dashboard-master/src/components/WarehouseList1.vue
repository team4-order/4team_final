<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <!-- 검색 바 -->
          <div class="input-group no-border">
            <input
              type="text"
              v-model="searchQuery"
              @input="filterWarehouses"
              class="form-control"
              placeholder="창고 검색..."
            >
            <div class="input-group-append">
              <div class="input-group-text">
                <i class="nc-icon nc-zoom-split"></i>
              </div>
            </div>
          </div>

          <!-- 카드를 사용하여 창고 목록 표시 -->
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">창고 목록</h4>
              <p class="card-category">창고 옆의 버튼을 클릭 시 해당 창고의 재고 페이지로 이동합니다.</p>
            </div>
            <div class="card-body">
              <ul class="list-group">
                <li
                  v-for="warehouse in warehouses.filteredData"
                  :key="warehouse['창고 코드']"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span class="text-primary">{{ warehouse['창고 코드'] }}</span> -
                    {{ warehouse['창고 이름'] }},
                    {{ warehouse['창고 주소'] }}
                  </div>
                  <button class="btn btn-primary btn-sm" @click="navigateToInventory(warehouse['창고 코드'])">이동</button>
                </li>
              </ul>
            </div>
          </div>

          <!-- 새로운 박스 추가: '2014 Sales' 차트 -->
          <div class="card">
            <div class="card-body">
              <chart-card
                :chart-data="barChart.data"
                :chart-options="barChart.options"
                :chart-responsive-options="barChart.responsiveOptions"
                chart-type="Bar">
                <template v-slot:header>
                  <h4 class="card-title">2014 Sales</h4>
                  <p class="card-category">All products including Taxes</p>
                </template>
                <template v-slot:footer>
                  <div class="legend">
                    <i class="fa fa-circle text-info"></i> Tesla Model S
                    <i class="fa fa-circle text-danger"></i> BMW 5 Series
                  </div>
                  <hr>
                  <div class="stats">
                    <i class="fa fa-check"></i> Data information certified
                  </div>
                </template>
              </chart-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ChartCard from 'src/components/Cards/ChartCard.vue'

export default {
  components: {
    ChartCard,
  },
  data() {
    return {
      searchQuery: '',
      warehouses: {
        data: [],
        filteredData: [],
      },
      barChart: {
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
            [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
          ]
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: '245px'
        },
        responsiveOptions: [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc(value) {
                return value[0];
              }
            }
          }]
        ]
      },
    };
  },
  mounted() {
    this.fetchWarehouses();
  },
  methods: {
    fetchWarehouses() {
      axios.get('http://localhost:8080/api/warehouses')
        .then(response => {
          this.warehouses.data = response.data.map(warehouse => ({
            '창고 코드': warehouse.contactCode,
            '창고 이름': warehouse.contactName,
            '창고 주소': warehouse.contactAddress,
          }));
          this.warehouses.filteredData = this.warehouses.data;
        })
        .catch(error => console.error("창고 목록을 가져오는 데 실패했습니다.", error));
    },
    filterWarehouses() {
      this.warehouses.filteredData = this.searchQuery ?
        this.warehouses.data.filter(warehouse =>
          warehouse['창고 코드'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          warehouse['창고 이름'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          warehouse['창고 주소'].toLowerCase().includes(this.searchQuery.toLowerCase())
        ) :
        this.warehouses.data;
    },
    navigateToInventory(storageCode) {
      this.$router.push({ path: `/admin/inventory/${storageCode}` });
    },
  },
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}
.table-hover.table-striped {
  cursor: pointer;
}
/* 여기에 추가적으로 필요한 스타일을 정의할 수 있습니다. */
.btn-sm {
  margin-left: auto; /* '이동' 버튼을 오른쪽 정렬합니다. */
}
</style>
