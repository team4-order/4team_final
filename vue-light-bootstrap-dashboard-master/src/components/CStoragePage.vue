<template>
  <div class="container mt-4">
    <!-- 거래처 관리 제목 -->
    <div class="row">
      <div class="col">
        <h2 class="mb-4">거래처 관리</h2>
      </div>
    </div>

    <!-- 거래처 목록과 창고 코드 추가 폼 -->
    <div class="row mb-4">
      <div class="col-lg-8">
        <!-- 거래처 목록 테이블 -->
        <div class="card custom-card">
          <div class="card-header">
            <h3 class="card-title">거래처 목록</h3>
          </div>
          <div class="card-body">
            <div v-if="uniqueCustomers.length > 0" class="table-responsive">
              <table class="table table-hover">
                <thead class="thead-light">
                <tr>
                  <th scope="col">거래처 이름</th>
                  <th scope="col">거래처 코드</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="contact in uniqueCustomers" :key="contact.contactCode">
                  <td>{{ contact.contactName }}</td>
                  <td>{{ contact.contactCode }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p class="text-muted">거래처 정보가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <!-- 창고 코드 추가 폼 -->
        <div class="card custom-card mb-5">
          <div class="card-header">
            <h3 class="card-title">창고 코드 추가</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="addCStorage">
              <div class="form-group">
                <label for="customerCodeInput">거래처 코드 입력</label>
                <input type="text" id="customerCodeInput" v-model="selectedCustomerCode" class="form-control" placeholder="거래처 코드" required>
              </div>
              <div class="form-group">
                <label for="storageCode">창고코드 입력</label>
                <input type="text" id="storageCode" v-model="newStorageCode" class="form-control" placeholder="창고 코드" required>
              </div>
              <button type="submit" class="btn btn-primary float-right">추가하기</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- 거래처별 할당된 창고 코드 목록 -->
    <div class="row">
      <div class="col">
        <div class="card custom-card">
          <div class="card-header">
            <h3 class="card-title">거래처별 할당된 창고 코드</h3>
          </div>
          <div class="card-body p-0">
            <ul class="list-group list-group-flush">
              <li v-for="storage in cStorages" :key="storage.customerCode" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <span>거래처 코드: {{ storage.customerCode }}, 창고 코드: {{ storage.storageCode }}</span>
                  <button class="btn btn-danger btn-sm" @click="deleteCStorage(storage.customerCode, storage.storageCode)">삭제</button>
                </div>
              </li>
            </ul>
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
      cStorages: [], // 서버에서 받아온 거래처와 창고 코드 목록
      uniqueCustomers: [], // 중복 제거된 거래처 코드 목록
      selectedCustomerCode: '', // 선택된 거래처 코드
      newStorageCode: '', // 입력된 새 창고 코드
    };
  },
  created() {
    this.fetchCStorages();
    this.fetchContacts();
  },
  methods: {

    deleteCStorage(customerCode, storageCode) {
      if (!confirm(`'${storageCode}' 창고 코드를 삭제하시겠습니까?`)) {
        return;
      }

      axios.delete(`/api/cstorage1/delete/${customerCode}/${storageCode}`)
        .then(() => {
          alert('창고 코드가 성공적으로 삭제되었습니다.');
          this.fetchCStorages(); // 목록 새로고침
        })
        .catch(error => {
          console.error('창고 코드 삭제 중 오류가 발생했습니다:', error);
          alert('창고 코드 삭제 중 오류가 발생했습니다.');
        });
    },


    fetchContacts() {
      axios.get('/api/cstorage1/contacts')
        .then(response => {
          this.uniqueCustomers = response.data;
        })
        .catch(error => console.error('Error fetching contacts:', error));
    },
    fetchCStorages() {
      axios.get('/api/cstorage1/list')
        .then(response => {
          this.cStorages = response.data;
        })
        .catch(error => console.error('Error fetching storages:', error));
    },
    addCStorage() {
      const newCStorage = {
        customerCode: this.selectedCustomerCode,
        storageCode: this.newStorageCode,
      };
      axios.post('/api/cstorage1/addOrUpdate', newCStorage)
        .then(() => {
          alert('창고 코드가 성공적으로 추가되었습니다.');
          this.fetchCStorages();
          this.newStorageCode = '';
          this.selectedCustomerCode = '';
        })
        .catch(error => {
          console.error('Error adding storage code:', error);
          alert('창고 코드 추가에 실패하였습니다.');
        });
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.custom-card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.table-hover tbody tr:hover {
  color: #495057;
  background-color: rgba(0, 0, 0, 0.075);
}

.table thead th {
  border-bottom: 2px solid #dee2e6;
}

.table-hover tbody tr:hover td {
  background-color: rgba(0, 0, 0, 0.075);
}

.thead-light{
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}
</style>
