<template>
  <div class="cstorage-page container mt-4">
    <h2 class="mb-4">거래처 관리</h2>

    <!-- 검색 유형 선택 필드 추가 -->
    <div class="mb-3 d-flex">
      <select class="form-select w-auto mr-2" v-model="searchType">
        <option value="customerCode">거래처 코드</option>
        <option value="storageCode">창고 코드</option>
      </select>
      <!-- 검색 쿼리 입력 필드 -->
      <input type="text" v-model="searchQuery" placeholder="검색" class="form-control">
    </div>

    <!-- 필터링된 목록을 표시 -->
    <div v-if="filteredCStorages.length > 0" class="card custom-card mb-5">
      <div class="card-header">
        <h3 class="card-title">거래처와 창고 목록</h3>
      </div>
      <div class="card-body p-0">
        <ul class="list-group list-group-flush">
          <li v-for="item in filteredCStorages" :key="item.customerCode" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <span>거래처 코드: {{ item.customerCode }}, 창고 코드: {{ item.storageCode }}</span>
              <button class="btn btn-danger btn-sm" @click="deleteCStorage(item.customerCode, item.storageCode)">삭제</button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="mb-4">
      <label for="selectedCustomerCode" class="form-label">거래처 선택</label>
      <select id="selectedCustomerCode" v-model="selectedCustomerCode" class="form-select">
        <option disabled value="">거래처를 선택해주세요</option>
        <option v-for="item in uniqueCustomers" :value="item.customerCode" :key="item.customerCode">
          {{ item.customerCode }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label for="storageCode" class="form-label">창고코드 입력</label>
      <input type="text" id="storageCode" v-model="newStorageCode" class="form-control">
    </div>
    <div class="text-end">
      <button @click="addCStorage" class="btn btn-primary">창고코드 추가</button>
    </div>
  </div>
</template>



<script>
import axios from 'axios';

export default {
  data() {
    return {
      cStorages: [], // 서버에서 받아온 거래처와 창고 코드 목록
      uniqueCustomers: [], // 중복 제거된 거래처 코드 목록
      selectedCustomerCode: '', // 선택된 거래처 코드
      newStorageCode: '', // 입력된 새 창고 코드
      searchQuery: '',
      searchType: 'customerCode', // 검색 유형 ('customerCode' 또는 'storageCode')
    };
  },
  created() {
    this.fetchCStorages();
  },

  computed: {
    // 필터링된 거래처와 창고 목록을 계산하는 computed 속성
    filteredCStorages() {
      if (this.searchQuery) {
        return this.cStorages.filter(item =>
          item[this.searchType].toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return this.cStorages;
    },
  },


  methods: {
    fetchCStorages() {
      axios.get('/api/cstorage/list')
        .then(response => {
          this.cStorages = response.data;
          // 중복 제거 로직 추가
          const customerCodes = new Set(this.cStorages.map(item => item.customerCode));
          this.uniqueCustomers = Array.from(customerCodes).map(code => {
            return {
              customerCode: code,
              ...this.cStorages.find(item => item.customerCode === code)
            };
          });
        })
        .catch(error => {
          console.error('거래처 목록을 불러오는 중 오류가 발생했습니다:', error);
        });
    },


    addCStorage() {
      if (!this.selectedCustomerCode || !this.newStorageCode) {
        alert('거래처와 새로운 창고 코드를 모두 입력해주세요.');
        return;
      }

      const newCStorage = {
        customerCode: this.selectedCustomerCode,
        storageCode: this.newStorageCode
      };

      axios.post('/api/cstorage/addOrUpdate', newCStorage)
        .then(() => {
          alert('새 창고 코드가 성공적으로 추가되었습니다.');
          this.fetchCStorages(); // 목록 새로고침
          this.newStorageCode = ''; // 입력 폼 리셋
        })
        .catch(error => {
          console.error('새 창고 코드 추가 중 오류가 발생했습니다:', error);
          alert('새 창고 코드 추가 중 오류가 발생했습니다.');
        });
    },

    deleteCStorage(customerCode, storageCode) {
      if (!confirm(`'${storageCode}' 창고 코드를 삭제하시겠습니까?`)) {
        return;
      }

      axios.delete(`/api/cstorage/delete/${customerCode}/${storageCode}`)
        .then(() => {
          alert('창고 코드가 성공적으로 삭제되었습니다.');
          this.fetchCStorages(); // 목록 새로고침
        })
        .catch(error => {
          console.error('창고 코드 삭제 중 오류가 발생했습니다:', error);
          alert('창고 코드 삭제 중 오류가 발생했습니다.');
        });
    }


  }
}
</script>

<style>
.container {
max-width: 800px;
}

.custom-card {
border-radius: 0.5rem;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-header {
background-color: #007bff;
color: white;
border-radius: 0.5rem 0.5rem 0 0;
}

.card-title {
margin-bottom: 0;
}

.list-group-item {
border: none;
border-bottom: 1px solid #f0f0f0;
}

.btn-sm {
padding: 0.25rem 0.5rem;
}

/* 폼 요소 스타일링 */
.form-label {
font-weight: bold;
}

.form-select, .form-control {
border-radius: 0.25rem;
}

/* 마지막 리스트 아이템의 하단 테두리 제거 */
.list-group-item:last-child {
border-bottom: none;
}

/* 버튼 스타일링 */
.btn-primary, .btn-danger {
  color: white; /* 버튼 내 글자색을 흰색으로 설정합니다. */
  border: none; /* 테두리 제거 */
  padding: 0.5rem 1rem; /* 상하 좌우 패딩 조정 */
}

.btn-primary {
  background-color: #0056b3;
}

.btn-primary:hover {
  background-color: #004494;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* 추가적으로, 버튼에 대한 호버 효과를 강조하기 위해 색상 변경 범위를 확대합니다. */
.btn:hover {
  filter: brightness(90%); /* 버튼 호버 시 색상을 약간 어둡게 조정 */
}

</style>
