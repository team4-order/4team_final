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
                  상품 이름: {{ inventory.goodsName }}, <!-- '상품 이름'을 'inventory.goodsName'으로 수정 -->
                  재고 입고일: {{ inventory.firstStockDate }},
                  상품 코드: {{ inventory.goodsCode }},
                  등급: {{ inventory.goodsGrade }},
                  수량: {{ inventory.inventoryQuantity }},
                  판매 가격: {{ inventory.salesPrice }}
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
.search-options {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
