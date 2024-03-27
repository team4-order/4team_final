<template>
  <div class="cstorage-page container mt-4">
    <h2 class="mb-4">거래처 관리5</h2>

    <!-- 거래처와 창고 목록 표시 -->
    <div v-if="cStorages.length > 0" class="mb-5">
      <h3>거래처와 창고 목록</h3>
      <div class="card">
        <div class="card-body">
          <ul class="list-unstyled">
            <li v-for="item in cStorages" :key="item.customerCode" class="mb-2">
              거래처 코드: {{ item.customerCode }}, 창고 코드: {{ item.storageCode }}
              <!-- 삭제 버튼을 여기로 이동 -->
              <button class="btn btn-danger btn-sm" @click="deleteCStorage(item.customerCode, item.storageCode)">창고코드 삭제</button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 거래처 선택 -->
    <div class="form-group">
      <label for="selectedCustomerCode">거래처 선택</label>
      <select id="selectedCustomerCode" v-model="selectedCustomerCode" class="form-control">
        <option disabled value="">거래처를 선택해주세요</option>
        <option v-for="item in uniqueCustomers" :value="item.customerCode" :key="item.customerCode">
          {{ item.customerCode }}
        </option>
      </select>
    </div>

    <!-- 창고 코드 추가 폼 -->
    <div class="form-group">
      <label for="storageCode">창고코드 입력</label>
      <input type="text" id="storageCode" v-model="newStorageCode" class="form-control">
    </div>
    <button @click="addCStorage" class="btn btn-success">창고코드 추가</button>
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
      newStorageCode: '' // 입력된 새 창고 코드
    };
  },
  created() {
    this.fetchCStorages();
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
              // 선택된 거래처 코드로 해당 거래처 정보 찾기 (예시: 첫 번째 매칭되는 거래처 정보 사용)
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

<style scoped>
.container {
  max-width: 600px;
}
</style>
