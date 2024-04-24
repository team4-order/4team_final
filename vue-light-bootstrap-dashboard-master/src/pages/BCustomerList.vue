<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="search-bar">
            <input v-model="searchQuery" type="text" placeholder="거래처 이름 검색하세요" @input="filterContacts" class="form-control" />
          </div>
          
          <!-- Card 컴포넌트로 연락처 목록을 표시합니다. -->
          <card2>
            <template slot="header">
              <!-- 카테고리 선택을 위한 드롭다운 추가 -->
              <div class="search-category float-right">
                <select v-model="selectedStatus" class="form-control">
                  <option value="">전체</option>
                  <option value="완료">완료</option>
                  <option value="정산 예정">정산 예정</option>
                </select>
              </div>
              <h4 class="card-title">거래처 목록</h4>
              <p class="card-category">거래처 목록을 확인하는 페이지</p>
            </template>
            <!-- LTable 컴포넌트를 사용하여 테이블을 표시합니다. -->
            <l-table class="table-hover table-striped" 
                     :columns="Bcontacts.columns" 
                     :data="paginatedData"
                     @row-click="handleRowClick">
            </l-table>
            <div class="pagination-controls">
              <button class="btn btn-info btn-fill" @click="changePage(1)" :disabled="currentPage === 1">
                &lt;&lt;
              </button>
              <button class="btn btn-info btn-fill" @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">
                &lt;
              </button>

              <span v-for="number in pageNumbers" :key="number" class="page-number" @click="changePage(number)"
                    :class="{ 'active': currentPage === number }">
                {{ number }}
              </span>

              <button class="btn btn-info btn-fill" @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">
                &gt;
              </button>
              <button class="btn btn-info btn-fill" @click="changePage(totalPages)" :disabled="currentPage === totalPages">
                &gt;&gt;
              </button>
            </div>
          </card2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LTable from 'src/components/Table.vue'
import Card2 from 'src/components/Cards/Card2.vue'
import axios from 'axios'

export default {
  components: {
    LTable,
    Card2
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      mutableBusinessId: '',
      searchQuery: '',
      selectedStatus: '', // 선택된 정산 상태
      Bcontacts: {
        columns: ['거래처 이름', '주소', '이번달 미정산', '이번달 정산 요청', '이번달 정산 완료', '정산 상태'],
        data: [], // 연락처 데이터를 저장할 배열
        filteredData: [], // 검색 결과를 저장할 배열
        contactNames: [] // 거래처 이름을 저장할 배열
      }
    }
  },
  mounted() {
    const storedId = localStorage.getItem("code") || sessionStorage.getItem("user");
    this.mutableBusinessId = storedId;
    this.fetchBContacts();
  },
  watch: {
    selectedStatus() {
      this.filterContacts();
    }
  },
  methods: {
    async fetchBContacts() {
      try {
        const response = await axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/contact/customers/${this.mutableBusinessId}`);
        for (const contact of response.data) {
          const settlementStatus = await this.isPendingSettlement(contact.contactCode);
          const adjustmentStatusCount = await this.adjustmentcount(contact.contactCode);
          this.Bcontacts.data.push({
            '거래처 코드': contact.contactCode,
            '거래처 이름': contact.contactName,
            '주소': contact.contactAddress,
            // '이번 달 정산 현황': '', // 정산 상태 데이터를 나중에 가져와서 채웁니다.
            '이번달 미정산': `${adjustmentStatusCount['미정산']}건`,
            '이번달 정산 요청': `${adjustmentStatusCount['정산 요청']}건`,
            '이번달 정산 완료': `${adjustmentStatusCount['정산 완료']}건`,
            '정산 상태': settlementStatus ? '정산 예정' : '완료', // 정산 상태에 따라 '정산 예정' 또는 '완료'를 표시
          });
        }
        this.Bcontacts.filteredData = this.Bcontacts.data;
      } catch (error) {
        console.error("거래처 목록을 가져오는 데 실패했습니다.", error);
      }
    },
    async isPendingSettlement(customerCode) {
      try {
        const response = await axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/orders/pendingsettlement/${customerCode}`);
        return response.data;
      } catch (error) {
        console.error("정산 상태를 확인하는 데 실패했습니다.", error);
        throw error;
      }
    },
    async adjustmentcount(customerCode) {
      try {
        const response = await axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/orders/${customerCode}/count`);
        return response.data; // 가져온 데이터를 반환
      } catch (error) {
        console.error("정산 상태별 데이터 갯수 가져오는데 실패했습니다.", error);
        throw error;
      }
    },
    filterContacts() {
      const query = this.searchQuery.toLowerCase();
      const status = this.selectedStatus.toLowerCase();
      this.Bcontacts.filteredData = this.Bcontacts.data.filter(contact =>
        (contact['거래처 이름'].toLowerCase().includes(query) || contact['정산 상태'].toLowerCase().includes(query)) &&
        (!status || contact['정산 상태'].toLowerCase().includes(status))
      );
    },
    handleRowClick(row) {
      const customerCode = row['거래처 코드'];
      window.location.href = `http://easyoms.store/bcustomer_list/b_adjustment/${customerCode}`;
    },
    changePage(pageNumber) {
      if (pageNumber < 1) {
        pageNumber = 1;
      } else if (pageNumber > this.totalPages) {
        pageNumber = this.totalPages;
      }
      this.currentPage = pageNumber;
    },
  },
  
  computed: {
    filteredContacts() {
      return this.Bcontacts.filteredData;
    },
    paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.Bcontacts.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.Bcontacts.filteredData.length / this.itemsPerPage);
    },
    pageNumbers() {
      let numbers = [];
      for (let i = 1; i <= this.totalPages; i++) {
        numbers.push(i);
      }
      return numbers;
    }
  }
}
</script>

<style scoped>
.thead-sticky th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  z-index: 1;
}
.search-bar {
  margin-bottom: 20px;
}
.search-category {
  margin-bottom: 20px;
  width: 10%;
  margin-right: 50px;
}
.table-hover.table-striped {
  cursor: pointer;
}
</style>