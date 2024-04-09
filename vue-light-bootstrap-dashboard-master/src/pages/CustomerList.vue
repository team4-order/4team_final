<template>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="search-bar">
              <input v-model="searchQuery" type="text" placeholder="거래처 명을 검색하시오." @input="filterWarehouses" class="form-control" />
            </div>
            <card class="striped-tabled-with-hover"
                  body-classes="table-full-width table-responsive">
              <template #header>
                <h4 class="card-title">거래처 등록 & 정산현황</h4>
                <p class="card-category">판매 거래처를 상세하게 확인 가능합니다.</p>
              </template>
              <l-table class="table-hover table-striped"
                       :columns="adjustment.columns"
                       :data="adjustment.filteredData">
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
        Adjustment: {
          columns: ['거래처 코드', '거래처 명', '정산 현황'],
          data: [],
          filteredData: []
        }
      }
    },
    mounted() {
      this.fetchAd();
    },
    methods: {
      fetchadjustments() {
        axios.get('http://localhost:8080/api/adjustment')
          .then(response => {
            this.warehouses.data = response.data.map(warehouse => {
              return {
                '판매처 코드': adjustment.contactCode,
                '판매처 이름': adjustment.contactName
              };
            });
            // 처음에는 모든 데이터를 필터링된 데이터로 설정
            this.adjustment.filteredData = this.adjustment.data;  
          })
          .catch(error => {
            console.error("판매거래처 정보를 가지고 오지 못했습니다.", error);
          });
      },
      filterWarehouses() {
        if(this.searchQuery) {
          this.adjustment.filteredData = this.adjustment.data.filter(adjustment =>
            warehouse['판매처 코드'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            warehouse['판매처 이름'].toLowerCase().includes(this.searchQuery.toLowerCase())
            // warehouse['창고 주소'].toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        } else {
          this.adjustment.filteredData = this.adjustment.data;
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
  