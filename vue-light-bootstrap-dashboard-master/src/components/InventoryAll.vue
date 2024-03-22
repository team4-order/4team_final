<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header ">
              <h4 class="card-title">총 재고 목록</h4>
              <p class="card-category">ui수정 예정입니다..</p>
            </div>
            <div class="card-body">
              <div class="toolbar">
                <!-- 여기에 검색 옵션 -->
                <div class="form-group">
                  <select v-model="selectedSearchOption" class="form-control">
                    <option value="">전체</option>
                    <option value="재고 입고일">재고 입고일</option>
                    <option value="상품 코드">상품 코드</option>
                    <option value="등급">등급</option>
                    <option value="수량">수량</option>
                    <option value="창고 코드">창고 코드</option>
                  </select>
                </div>
                <div class="input-group no-border">
                  <input v-model="searchQuery" type="text" value="" class="form-control" placeholder="재고 검색...">
                  <button type="submit" class="btn btn-white btn-round btn-just-icon">
                    <i class="material-icons">search</i>
                    <div class="ripple-container"></div>
                  </button>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                  <tr>
                    <th>재고 입고일</th>
                    <th>상품 코드</th>
                    <th>등급</th>
                    <th>수량</th>
                    <th>판매 가격</th>
                    <th>창고 코드</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="inventory in inventories.filteredData" :key="inventory['상품 코드']">
                    <td>{{ inventory['재고 입고일'] }}</td>
                    <td>{{ inventory['상품 코드'] }}</td>
                    <td>{{ inventory['등급'] }}</td>
                    <td>{{ inventory['수량'] }}</td>
                    <td>{{ inventory['판매 가격'] }}</td>
                    <td>{{ inventory['창고 코드'] }}</td>
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
      searchQuery: '',
      selectedSearchOption: '',
      inventories: {
        columns: ['재고 입고일', '상품 코드', '등급', '수량', '판매 가격', '창고 코드'],
        data: [],
        filteredData: [],
      }
    };
  },
  mounted() {
    this.fetchInventories();
  },
  methods: {
    fetchInventories() {
      axios.get('http://localhost:8080/api/inventories')
        .then(response => {
          this.inventories.data = response.data.map(item => ({
            '재고 입고일': item.firstStockDate,
            '상품 코드': item.goodsCode,
            '등급': item.goodsGrade,
            '수량': item.inventoryQuantity,
            '판매 가격': item.salesPrice,
            '창고 코드': item.storage.contactCode,
          }));
          this.inventories.filteredData = this.inventories.data;
        })
        .catch(error => {
          console.error("재고 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    filterInventories() {
      // 필터링 로직
    },
  },
};
</script>

<style scoped>
.search-options {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
