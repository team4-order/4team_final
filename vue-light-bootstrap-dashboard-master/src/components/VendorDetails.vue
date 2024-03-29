<template>
  <div class="vendor-details container mt-5">
    <!-- 공급처 상세정보 섹션 -->
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">공급처 상세정보</h4>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <tbody>
            <tr>
              <th scope="row">공급처 이름</th>
              <td>{{ vendor.contactName }}</td>
            </tr>
            <tr>
              <th scope="row">공급처 코드</th>
              <td>{{ vendor.contactCode }}</td>
            </tr>
            <tr>
              <th scope="row">공급처 주소</th>
              <td>{{ vendor.contactAddress }}</td>
            </tr>
            <tr>
              <th scope="row">창고 코드</th>
              <td>{{ vendor.storageCode }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 공급처 입고내역 섹션 -->
    <div class="card mt-4">
      <div class="card-header">
        <h4 class="card-title">공급처 입고내역</h4>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
            <tr>
              <th>입고내역 ID</th>
              <th>상품이름</th>
              <th>상품등급</th>
              <th>상품수량</th>
              <th>입고 일자</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="input in inputs" :key="input.inputId">
              <td>{{ input.inputId }}</td>
              <td>{{ input.goodsMaster.goodsName }}</td>
              <td>{{ input.goodsGrade }}</td>
              <td>{{ input.inputQuantity }}</td>
              <td>{{ input.inputDay }}</td>
            </tr>
            </tbody>
          </table>
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
      vendor: {},
      inputs: []
    };
  },
  mounted() {
    this.fetchVendorDetails();
    this.fetchVendorInputs();
  },
  methods: {
    fetchVendorDetails() {
      axios.get(`/api/vendors/read/${this.$route.params.contactCode}`)
        .then(response => {
          this.vendor = response.data;
        })
        .catch(error => console.error("공급처 정보를 가져오는 데 실패했습니다.", error));
    },
    fetchVendorInputs() {
      axios.get(`/api/inputs/vendor/${this.$route.params.contactCode}`)
        .then(response => {
          this.inputs = response.data;
        })
        .catch(error => console.error("공급처 입고 내역을 가져오는 데 실패했습니다.", error));
    }
  }
}
</script>

<style scoped>
/* 사용자 정의 스타일 및 추가적인 스타일링 */
.card-header h4 {
  color: #333;
}

/* 테이블 스타일링 */
.table th, .table td {
  padding: 0.75rem;
  vertical-align: middle;
  border-top: 1px solid #dee2e6;
}

/* 테이블 헤더 스타일링 */
.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

/* 기타 스타일링 요소 추가 가능 */
</style>

