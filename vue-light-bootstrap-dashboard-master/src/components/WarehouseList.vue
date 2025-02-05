<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
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
                  @click="fetchInventoryData(warehouse['창고 코드'])"
                >
                  <div>
                    <span class="text-primary">{{ warehouse['창고 코드'] }}</span> -
                    {{ warehouse['창고 이름'] }},
                    {{ warehouse['창고 주소'] }}
                  </div>
                  <button class="btn btn-primary btn-sm" @click.stop="navigateToInventory(warehouse['창고 코드'])">이동</button>
                </li>
              </ul>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <!-- 창고가 선택되었을 때만 그래프 표시 -->
              <div v-if="selectedWarehouseName">
                <chart-card
                  :key="chartKey"
                  :chart-data="barChart.data"
                  :chart-options="barChart.options"
                  :chart-responsive-options="barChart.responsiveOptions"
                  chart-type="Bar"
                />
              </div>

              <!-- 선택된 창고가 없을 때 안내 메시지 표시 -->
              <div v-else class="text-center">
                <h5 class="text-muted">창고 선택 시 창고별 재고 수량 그래프가 나옵니다.</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import ChartCard from 'src/components/Cards/ChartCard2.vue';

export default {
  components: {
    ChartCard,
  },
  data() {
    return {
      searchQuery: '',
      businessId: '', // 사용자의 비즈니스 ID를 저장하는 변수
      warehouses: {
        data: [],
        filteredData: [],
      },
      selectedWarehouseName: '', // 선택된 창고 이름
      barChart: {
        data: {
          labels: [],
          series: [[]],
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false,
          },
          height: '245px',
        },
        responsiveOptions: [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc(value) {
                return value[0];
              },
            },
          }],
        ],
        chartKey: Date.now(), // 차트 키 초기화
      },
    };
  },

  mounted() {
    // 'user' 키에서 비즈니스 ID를 로드합니다.
    this.businessId = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!this.businessId) {
      console.error("Business ID is not provided.");
      // 여기서 사용자에게 알림을 주거나 다른 페이지로 리디렉션 할 수 있습니다.
      return;
    }
    this.fetchWarehouses();
  },
  methods: {
    fetchWarehouses() {
      axios.get(`http://localhost:8080/api/warehouses/${this.businessId}`)
        .then(response => {
          this.warehouses.data = response.data.map(warehouse => ({
            '창고 코드': warehouse.contactCode,
            '창고 이름': warehouse.contactName,
            '창고 주소': warehouse.contactAddress,
          }));
          this.warehouses.filteredData = this.warehouses.data;
        })
        .catch(error => console.error("Failed to fetch warehouses.", error));
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
    async fetchInventoryData(storageCode) {
      try {
        const response = await axios.get(`http://localhost:8080/api/inventories/read/${storageCode}`);
        const inventoryData = response.data;
        let productQuantities = {};

        inventoryData.forEach(item => {
          const productName = item.goodsName;
          const quantity = Number(item.inventoryQuantity);
          if (!productQuantities[productName]) {
            productQuantities[productName] = 0;
          }
          productQuantities[productName] += quantity;
        });

        const newChartData = {
          labels: Object.keys(productQuantities),
          series: [Object.values(productQuantities)]
        };

        this.barChart.data = newChartData;
        const selectedWarehouse = this.warehouses.data.find(wh => wh['창고 코드'] === storageCode);
        this.selectedWarehouseName = selectedWarehouse ? selectedWarehouse['창고 이름'] : '';

        this.chartKey = Date.now(); // 차트 컴포넌트 강제 업데이트
      } catch (error) {
        console.error("Error fetching inventory data for warehouse", error);
      }
    }
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
.btn-sm {
  margin-left: auto; /* '이동' 버튼을 오른쪽 정렬합니다. */
}
</style>
