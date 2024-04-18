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
              <option v-for="storage in storages" :key="storage.contactCode" :value="storage.contactCode">
                {{ storage.contactName }} ({{ storage.contactCode }})
              </option>
            </select>
          </div>
          <button class="btn btn-primary" @click="updateStorageCode">창고 코드 업데이트</button>
        </div>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-header">
        <h4 class="card-title">기간별 입고내역 조회</h4>
      </div>
      <div class="card-body">
        <!-- 기간 선택 -->
        <div class="mb-3">
          <label for="periodSelect" class="form-label">기간 선택</label>
          <select id="periodSelect" v-model="selectedPeriod" @change="filterInputsByPeriod" class="form-select">
            <option value="">기간을 선택해주세요.</option>
            <option value="week">지난 1주</option>
            <option value="month">지난 1달</option>
          </select>
        </div>

        <!-- 기간별 입고내역 테이블 -->
        <div class="table-responsive" v-if="periodInputs.length > 0">
          <table class="table">
            <thead class="thead-sticky">
            <tr>
              <th>상품 이름</th>
              <th>상품 등급</th>
              <th>총 수량(box)</th>
              <br>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(summary, index) in periodInputsSummary" :key="index">
              <td>{{ summary.goodsName }}</td>
              <td>{{ summary.goodsGrade }}</td>
              <td>{{ summary.totalQuantity }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>기간을 선택해주세요.</p>
        </div>
      </div>
    </div>



    <!-- 공급처 입고내역 섹션 -->
    <div class="card mt-4">
      <div class="card-header">
        <h4 class="card-title">공급처 입고내역</h4>
        <p style="color: #bb0502">각 헤더클릭시 정렬됩니다.</p>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="thead-sticky">
            <tr>
              <th @click="sortInputs('inputId')">입고내역 ID</th>
              <th @click="sortInputs('goodsMaster.goodsName')">상품이름</th>
              <th @click="sortInputs('goodsGrade')">상품등급</th>
              <th @click="sortInputs('inputQuantity')">상품수량(box)</th>
              <th @click="sortInputs('inputDay')">입고 일자</th>
              <br>
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
      storages: [] ,// 사용자가 보유한 창고 목록을 저장할 배열 추가
      sortKey: '',
      sortOrder: 'asc', // 'desc'로 변경 가능
      selectedPeriod: '',
      periodInputs: [], // 선택한 기간의 입고내역을 저장

    };
  },
  mounted() {
    this.fetchVendorDetails();
    this.fetchVendorInputs();
    this.fetchStorages(); // 사용자가 보유한 창고 목록가져오기
  },


  computed: {
    periodInputsSummary() {
      const summary = {};

      this.periodInputs.forEach(input => {
        const key = `${input.goodsName}-${input.goodsGrade}`;
        if (!summary[key]) {
          summary[key] = {
            goodsName: input.goodsName,
            goodsGrade: input.goodsGrade,
            totalQuantity: 0
          };
        }
        summary[key].totalQuantity += parseInt(input.inputQuantity, 10);
      });

      return Object.values(summary);
    }
  },

  watch: {
    selectedPeriod() {
      this.filterInputsByPeriod();
    }
  },


  methods: {




    filterInputsByPeriod() {

      const endDate = new Date();
      const startDate = new Date();

      if (this.selectedPeriod === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (this.selectedPeriod === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      }

      this.periodInputs = this.inputs.filter(input => {
        const inputDate = new Date(input.inputDay);
        return inputDate >= startDate && inputDate <= endDate;
      }).map(input => ({
        ...input,
        goodsName: input.goodsMaster.goodsName // 상품 이름을 periodInputs에 추가합니다.
      }));
    },



    sortInputs(key) {
      if (this.sortKey === key) {
        // 이미 해당 키로 정렬 중이면, 정렬 순서를 바꿉니다.
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        // 새로운 키로 정렬할 때는 기본적으로 오름차순으로 설정합니다.
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
      this.inputs.sort((a, b) => {
        let modifier = this.sortOrder === 'asc' ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });
    },


    fetchStorages() {
      const businessId = localStorage.getItem('user') || sessionStorage.getItem('user');  // 비즈니스 ID를 세션에서 직접 가져옴
      axios.get(`http://localhost:8080/api/warehouses/${businessId}`)
        .then(response => {
          this.storages = response.data;  // 응답 데이터를 storages 배열에 저장
        })
        .catch(error => {
          console.error("창고 목록을 가져오는 데 실패했습니다.", error);
        });
    },


    updateStorageCode() {
      axios.put(`http://localhost:8080/api/vendors/updateStorageCode/${this.vendor.contactCode}?storageCode=${this.selectedStorageCode}`)
        .then(response => {
          alert('창고 코드가 성공적으로 업데이트되었습니다.');
          window.location.reload(); //창 새로고침
        })
        .catch(error => {
          console.error("창고 코드 업데이트에 실패했습니다.", error);
          alert('창고 코드 업데이트에 실패했습니다.');
        });
    },



    fetchVendorDetails() {
      axios.get(`http://localhost:8080/api/vendors/read/${this.$route.params.contactCode}`)
        .then(response => {
          this.vendor = response.data;
        })
        .catch(error => console.error("공급처 정보를 가져오는 데 실패했습니다.", error));
    },
    fetchVendorInputs() {
      axios.get(`http://localhost:8080/api/inputs/vendor/${this.$route.params.contactCode}`)
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

.thead-sticky th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  z-index: 1;
}

/* 테이블 높이 고정 및 스크롤 추가 */
.table-responsive {
  height: 250px;
  overflow-y: auto; /* 세로 스크롤 활성화 */
}
</style>

