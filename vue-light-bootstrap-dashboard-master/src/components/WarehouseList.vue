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
              <p class="card-category">창고클릭시 창고의 재고페이로 이동합니다</p>
            </div>
            <div class="card-body">
              <ul class="list-group">
                <li
                  v-for="warehouse in warehouses.filteredData"
                  :key="warehouse['창고 코드']"
                  class="list-group-item"
                  @click="navigateToInventory(warehouse['창고 코드'])"
                >
                  <span class="text-primary">{{ warehouse['창고 코드'] }}</span> -
                  {{ warehouse['창고 이름'] }},
                  {{ warehouse['창고 주소'] }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 가정: LTable과 Card 컴포넌트는 더 이상 사용되지 않으므로 제거됨
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: '',
      warehouses: {
        data: [],
        filteredData: [],
      },
    };
  },
  mounted() {
    this.fetchWarehouses();
  },
  methods: {
    fetchWarehouses() {
      axios
        .get('http://localhost:8080/api/warehouses')
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
      this.$router.push({ path: `/admin/inventory`, query: { storageCode } });
    },
  },
};
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}
.table-hover.table-striped {
  cursor: pointer;
}

</style>
