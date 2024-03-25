<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">창고별 재고 목록 test</h4>
              <p class="card-category">창고별 재고를 확인하세요.</p>
            </div>
            <div class="card-body">
              <ul class="list-group">
                <li v-for="inventory in inventories" :key="inventory.goodsCode" class="list-group-item">
                  재고 입고일: {{ inventory['재고 입고일'] }},
                  상품 코드: {{ inventory['상품 코드'] }},
                  등급: {{ inventory['등급'] }},
                  수량: {{ inventory['수량'] }},
                  판매 가격: {{ inventory['판매 가격'] }}
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
      inventories: [],
    };
  },
  mounted() {
    this.fetchInventories();
  },
  methods: {
    fetchInventories() {
      // URL에서 storageCode 파라미터를 읽어옵니다.
      const storageCode = this.$route.params.storageCode; // 경로 파라미터로 변경됨
      axios.get(`/api/inventories/read/${storageCode}`) // 경로를 수정하여 요청합니다.
        .then(response => {
          // 응답 데이터를 사용하여 inventories 배열을 업데이트합니다.
          this.inventories = response.data.map(inventory => ({
            '재고 입고일': inventory.firstStockDate,
            '상품 코드': inventory.goodsCode,
            '등급': inventory.goodsGrade,
            '수량': inventory.inventoryQuantity,
            '판매 가격': inventory.salesPrice,
          }));
        })
        .catch(error => {
          console.error("Error loading inventories", error);
        });
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
