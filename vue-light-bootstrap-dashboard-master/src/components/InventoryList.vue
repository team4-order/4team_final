<template>

  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">창고별 재고 목록</h4>
<!--              <p class="card-category">창고별 재고목록 입니다-->

            </div>
            <div class="card-body">
              <div class="mb-3">
                <input v-model="searchQuery" type="text" placeholder="상품 검색..." class="form-control">
              </div>

              <th @click="sort('goodsName')">이름 {{ sortKey === 'goodsName' ? sortOrder === 'ascending' ? '↑' : '↓' : '' }}</th>
              <th> | </th>
              <th @click="sort('firstStockDate')">입고일 {{ sortKey === 'firstStockDate' ? sortOrder === 'ascending' ? '↑' : '↓' : '' }}</th>
              <th> | </th>
              <th @click="sort('inventoryQuantity')">수량 {{ sortKey === 'inventoryQuantity' ? sortOrder === 'ascending' ? '↑' : '↓' : '' }}</th>


              <div class="table-responsive mt-4">
                <h4 class="mt-4">총 재고 목록</h4>
                <table class="table table-bordered">
                  <thead>
                  <tr>
                    <th>상품 이름</th>
                    <th>등급</th>
                    <th>총 수량</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(value, key) in groupedInventories" :key="key">
                    <td>{{ value.goodsName }}</td>
                    <td>{{ value.goodsGrade }}</td>
                    <td>{{ value.totalQuantity }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>


              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th>상품 코드</th>
                    <th>상품 이름</th>
                    <th>등급</th>
                    <th>수량</th>
                    <th>재고 입고일</th>
                    <th>판매 가격</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="inventory in filteredInventories" :key="inventory.goodsCode">
                    <td>{{ inventory.goodsCode }}</td>
                    <td>{{ inventory.goodsName }}</td>
                    <td>{{ inventory.goodsGrade }}</td>
                    <td>{{ inventory.inventoryQuantity }}</td>
                    <td>{{ inventory.firstStockDate }}</td>
                    <td>{{ inventory.salesPrice }}</td>
                  </tr>
                  </tbody>
                </table>
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

export default {
  data() {
    return {
      inventories: [],
      searchQuery: '',
      sortKey: '', // 정렬 기준 필드
      sortOrder: 'ascending', // 정렬 순서
    };
  },

  computed: {

    groupedInventories() {
      let grouping = this.filteredInventories.reduce((acc, inventory) => {
        let key = inventory.goodsName + '-' + inventory.goodsGrade;
        if (!acc[key]) {
          acc[key] = { goodsName: inventory.goodsName, goodsGrade: inventory.goodsGrade, totalQuantity: 0 };
        }
        acc[key].totalQuantity += parseInt(inventory.inventoryQuantity);
        return acc;
      }, {});

      // 객체를 배열로 변환하여 반환
      return Object.values(grouping);
    },


    filteredInventories() {
      // 검색 쿼리에 따라 inventories 배열을 필터링
      return this.inventories.filter(inventory =>
        inventory.goodsName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },

  mounted() {
    this.fetchInventories();
  },
  methods: {

    sort(sortKey) {
      if (this.sortKey === sortKey) {
        // 이미 선택된 컬럼에 대해 정렬되어 있다면 순서를 토글
        this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
      } else {
        // 새로운 컬럼에 대해 정렬
        this.sortKey = sortKey;
        this.sortOrder = 'ascending';
      }

      this.inventories.sort((a, b) => {
        let valueA = sortKey === 'inventoryQuantity' ? parseInt(a[sortKey]) : a[sortKey].toLowerCase();
        let valueB = sortKey === 'inventoryQuantity' ? parseInt(b[sortKey]) : b[sortKey].toLowerCase();

        if (this.sortOrder === 'ascending') {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
      });
    },

    fetchInventories() {
      const storageCode = this.$route.params.storageCode;
      axios.get(`/api/inventories/read/${storageCode}`)
        .then(response => {
          // 응답 데이터를 사용하여 inventories 배열을 업데이트합니다.
          this.inventories = response.data; // 직접 할당으로 변경
        })
        .catch(error => {
          console.error("Error loading inventories", error);
        });
    },
  },
};
</script>

<style scoped>
.card-header {
  background-color: #007bff;
  color: white;
}

.card-title {
  font-weight: bold;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, .05);
}

.table th {
  background-color: #007bff;
  color: white;
}

.search-options input {
  max-width: 300px;
}
</style>
