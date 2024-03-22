<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <!-- 검색 옵션과 검색 바 -->
          <div class="search-options">
            <select v-model="selectedSearchOption" class="form-control">
              <option value="">전체</option>
              <option value="재고 입고일">재고 입고일</option>
              <option value="상품 코드">상품 코드</option>
              <option value="등급">등급</option>
              <option value="수량">수량</option>
              <option value="창고 코드">창고 코드</option>
            </select>
            <input v-model="searchQuery" type="text" placeholder="재고 검색..." @input="filterInventories" class="form-control" />
          </div>

          <!-- 재고 목록 표시 -->
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">창고별 재고 목록</h4>
              <p class="card-category">창고별 재고입니다......</p>
            </div>
            <div class="card-body">
              <ul class="list-group">
                <li v-for="inventory in inventories.filteredData" :key="inventory['상품 코드']" class="list-group-item">
                  재고 입고일: {{ inventory['재고 입고일'] }},
                  상품 코드: {{ inventory['상품 코드'] }},
                  등급: {{ inventory['등급'] }},
                  수량: {{ inventory['수량'] }},
                  판매 가격: {{ inventory['판매 가격'] }},
                  창고 코드: {{ inventory['창고 코드'] }} <!-- 창고 코드 표시 -->
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
      },
      storageCode: '',
    };
  },
  mounted() {
    this.storageCode = this.$route.query.storageCode;
    this.fetchInventories();
  },
  methods: {
    fetchInventories() {
      const url = `http://localhost:8080/api/inventories/${this.storageCode}`;
      axios.get(url)
        .then(response => {
          this.inventories.data = response.data.map(item => ({
            '재고 입고일': item.firstStockDate,
            '상품 코드': item.goodsCode,
            '등급': item.goodsGrade,
            '수량': item.inventoryQuantity,
            '판매 가격': item.salesPrice,
            '창고 코드': item.storageCode, // 백엔드에서 제공하는 창고 코드 사용
          }));
          this.inventories.filteredData = this.inventories.data;
        })
        .catch(error => console.error("재고 목록을 가져오는 데 실패했습니다.", error));
    },
    filterInventories() {
      // 필터링 로직 유지
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
