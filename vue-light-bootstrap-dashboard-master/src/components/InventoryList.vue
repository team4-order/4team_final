<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <!-- 총 재고 목록 카드 -->
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h4 class="card-title">총 재고 목록</h4>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-4">
                  <select v-model="totalInventorySearchCriteria" class="form-control">
                    <option value="name">이름</option>
                    <option value="quantity">수량</option>
                    <option value="grade">등급</option>
                  </select>
                </div>
                <div class="col-md-8">
                  <input v-model="totalInventorySearchQuery" type="text" placeholder="검색..." class="form-control">
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                  <tr>
                    <th>상품 이름</th>
                    <th>등급</th>
                    <th>총 수량</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(inventory, index) in filteredGroupedInventories" :key="index">
                    <td>{{ inventory.goodsName }}</td>
                    <td>{{ inventory.goodsGrade }}</td>
                    <td>{{ inventory.totalQuantity }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 개별 재고 목록 카드 -->
          <div class="card mt-4">
            <div class="card-header bg-success text-white">
              <h4 class="card-title">재고 목록</h4>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-4">
                  <select v-model="inventorySearchCriteria" class="form-control">
                    <option value="name">이름</option>
                    <option value="quantity">수량</option>
                    <option value="grade">등급</option>
                  </select>
                </div>
                <div class="col-md-8">
                  <input v-model="inventorySearchQuery" type="text" placeholder="검색..." class="form-control">
                </div>
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
      totalInventorySearchQuery: '',
      totalInventorySearchCriteria: 'name',
      inventorySearchQuery: '',
      inventorySearchCriteria: 'name',
    };
  },
  computed: {
    filteredGroupedInventories() {
      return this.groupedInventories.filter(inventory => {
        switch (this.totalInventorySearchCriteria) {
          case 'name':
            return inventory.goodsName.toLowerCase().includes(this.totalInventorySearchQuery.toLowerCase());
          case 'quantity':
            return inventory.totalQuantity >= parseInt(this.totalInventorySearchQuery, 10) || this.totalInventorySearchQuery === '';
          case 'grade':
            return inventory.goodsGrade.toLowerCase().includes(this.totalInventorySearchQuery.toLowerCase());
          default:
            return true;
        }
      });
    },
    filteredInventories() {
      return this.inventories.filter(inventory => {
        switch (this.inventorySearchCriteria) {
          case 'name':
            return inventory.goodsName.toLowerCase().includes(this.inventorySearchQuery.toLowerCase());
          case 'quantity':
            return inventory.inventoryQuantity >= parseInt(this.inventorySearchQuery, 10) || this.inventorySearchQuery === '';
          case 'grade':
            return inventory.goodsGrade.toLowerCase().includes(this.inventorySearchQuery.toLowerCase());
          default:
            return true;
        }
      });
    },
    groupedInventories() {
      const groups = this.inventories.reduce((acc, inventory) => {
        const key = `${inventory.goodsName}-${inventory.goodsGrade}`;
        if (!acc[key]) {
          acc[key] = { ...inventory, totalQuantity: 0 };
        }
        acc[key].totalQuantity += parseInt(inventory.inventoryQuantity, 10);
        return acc;
      }, {});
      return Object.values(groups);
    },
  },
  mounted() {
    this.fetchInventories();
  },
  methods: {
    fetchInventories() {
      const storageCode = this.$route.params.storageCode;
      axios.get(`/api/inventories/read/${storageCode}`)
        .then(response => {
          this.inventories = response.data;
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
  font-weight: bold;
}
.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, .05);
}
</style>
