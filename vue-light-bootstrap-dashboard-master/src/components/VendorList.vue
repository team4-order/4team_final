<template>
  <div class="content">
    <div class="container-fluid">
      <div class="input-group no-border">
        <input type="text" v-model="searchQuery" @input="filterVendors" class="form-control" placeholder="공급처 검색...">
        <div class="input-group-append">
          <div class="input-group-text">
            <i class="nc-icon nc-zoom-split"></i>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">공급처 목록</h4>
          <p class="card-category">목록에서 공급처를 선택하면 상세 정보 페이지로 이동합니다.</p>
        </div>
        <div class="card-body">
          <ul class="list-group">
            <li v-for="vendor in filteredVendors" :key="vendor.contactCode" class="list-group-item d-flex justify-content-between align-items-center">
              <div>{{ vendor.contactName }}</div>
              <button class="btn btn-primary btn-sm" @click="navigateToVendor(vendor.contactCode)">상세 보기</button>
            </li>
          </ul>
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
      vendors: [], // 전체 공급처 목록
      filteredVendors: [] // 검색 결과 목록
    };
  },
  mounted() {
    this.fetchVendors();
  },
  methods: {
    fetchVendors() {
      axios.get('http://localhost:8080/api/vendors')
        .then(response => {
          // API 응답에서 contact_delimiter가 "V"인 항목만 필터링
          const vendors = response.data.filter(vendor => vendor.contactDelimiter === 'V');
          this.vendors = vendors;
          this.filteredVendors = vendors;
        })
        .catch(error => console.error("공급처 목록을 가져오는 데 실패했습니다.", error));
    },
    filterVendors() {
      // 검색 쿼리에 따라 필터링된 공급처 목록을 업데이트
      this.filteredVendors = this.searchQuery ?
        this.vendors.filter(vendor =>
          vendor.contactName.toLowerCase().includes(this.searchQuery.toLowerCase())
        ) :
        this.vendors;
    },
    navigateToVendor(contactCode) {
      // 공급처 상세 정보 페이지로 이동하는 로직 구현
      this.$router.push({ name: 'VendorDetails', params: { contactCode: contactCode } });
    }
  }
}
</script>

<style scoped>

.btn-sm {
  margin-left: auto; /* '이동' 버튼을 오른쪽 정렬합니다. */
}

</style>
