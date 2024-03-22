<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="search-bar">
            <input v-model="searchQuery" type="text" placeholder="창고 검색..." @input="filterWarehouses" class="form-control" />
          </div>
          <card class="striped-tabled-with-hover"
                body-classes="table-full-width table-responsive">
            <template #header>
              <h4 class="card-title">창고 목록</h4>
              <p class="card-category">창고의 상세 정보를 확인할 수 있습니다</p>
            </template>
            <l-table class="table-hover table-striped"
                     :columns="warehouses.columns"
                     :data="warehouses.filteredData">
            </l-table>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LTable from 'src/components/Table.vue'
import Card from 'src/components/Cards/Card.vue'
import axios from 'axios'

export default {
  components: {
    LTable,
    Card
  },
  data() {
    return {
      searchQuery: '',
      warehouses: {
        columns: ['창고 코드', '창고 이름', '창고 주소'],
        data: [],
        filteredData: []
      }
    }
  },
  mounted() {
    this.fetchWarehouses();
  },
  methods: {
    fetchWarehouses() {
      axios.get('http://localhost:8080/api/warehouses')
        .then(response => {
          this.warehouses.data = response.data.map(warehouse => {
            return {
              '창고 코드': warehouse.contactCode,
              '창고 이름': warehouse.contactName,
              '창고 주소': warehouse.contactAddress
            };
          });
          // 처음에는 모든 데이터를 필터링된 데이터로 설정
          this.warehouses.filteredData = this.warehouses.data;
        })
        .catch(error => {
          console.error("창고 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    filterWarehouses() {
      if(this.searchQuery) {
        this.warehouses.filteredData = this.warehouses.data.filter(warehouse =>
          warehouse['창고 코드'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          warehouse['창고 이름'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          warehouse['창고 주소'].toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.warehouses.filteredData = this.warehouses.data;
      }
    }
  }
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}

.table-hover.table-striped {
  cursor: pointer;
}
</style>

