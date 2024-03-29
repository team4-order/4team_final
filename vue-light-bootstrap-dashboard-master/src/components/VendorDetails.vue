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


      <div class="card mt-4">
        <div class="card-header">
          <h4 class="card-title">창고 코드 변경</h4>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label for="storageCodeSelect">새로운 창고 코드 선택</label>
            <select id="storageCodeSelect" v-model="selectedStorageCode" class="form-control">
              <option v-for="code in storageCodes" :key="code" :value="code">{{ code }}</option>
            </select>
          </div>
          <button class="btn btn-primary" @click="updateStorageCode">창고 코드 업데이트</button>
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
      inputs: [],
      selectedStorageCode: '',
      storages: [] // 사용자가 보유한 창고 목록을 저장할 배열 추가
    };
  },
  mounted() {
    this.fetchVendorDetails();
    this.fetchVendorInputs();
    this.fetchStorages(); // 사용자가 보유한 창고 목록가져오기
  },
  methods: {


    updateStorageCode() {
      axios.put(`/api/vendors/updateStorageCode/${this.vendor.contactCode}?storageCode=${this.selectedStorageCode}`)
        .then(response => {
          alert('창고 코드가 성공적으로 업데이트되었습니다.');
          // 필요한 경우, 추가적인 처리를 여기에 추가합니다.
        })
        .catch(error => {
          console.error("창고 코드 업데이트에 실패했습니다.", error);
          alert('창고 코드 업데이트에 실패했습니다.');
        });
    },

    // fetchCStorages() {
    //   axios.get('/api/cstorage/list')
    //     .then(response => {
    //       this.storages = response.data;
    //     })
    //     .catch(error =>{
    //       console.error('창고 목록불러오는중 에러발생',error);
    //     });
    // },


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

