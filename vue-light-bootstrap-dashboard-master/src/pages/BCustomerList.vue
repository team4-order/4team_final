<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="search-bar">
            <input v-model="searchQuery" type="text" placeholder="거래처 이름, 정산현황으로 검색하세요" @input="filterContacts" class="form-control" />
          </div>
          <!-- Card 컴포넌트로 연락처 목록을 표시합니다. -->
          <card class="striped-tabled-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">거래처 목록</h4>
              <p class="card-category">거래처 목록을 확인하는 페이지</p>
            </template>
            <!-- LTable 컴포넌트를 사용하여 테이블을 표시합니다. -->
            <l-table class="table-hover table-striped" 
                     :columns="Bcontacts.columns" 
                     :data="BcontactsWithSettlementStatus"
                     @row-click="handleRowClick"></l-table>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LTable from 'src/components/Table.vue'
import Card from 'src/components/Cards/Card.vue'
import axios from 'axios'

export default {
  components: {
    LTable,
    Card
  },
  data() {
    return {
      searchQuery: '',
      selectedContactName: '', // 추가: 선택된 연락처 이름
      Bcontacts: {
        columns: ['거래처 이름', '주소', '정산현황'],
        data: [], // 연락처 데이터를 저장할 배열
        filteredData: [], // 검색 결과를 저장할 배열
        contactNames: [] // 거래처 이름을 저장할 배열
      }
    }
  },
  mounted() {
    this.fetchBContacts();
  },
  methods: {
    async fetchBContacts() {
      try {
        const response = await axios.get('http://localhost:8080/api/contact/customers/BUS002');
        for (const contact of response.data) {
          const settlementStatus = await this.isPendingSettlement(contact.contactCode);
          this.Bcontacts.data.push({
            '거래처 코드': contact.contactCode,
            '거래처 이름': contact.contactName,
            '주소': contact.contactAddress,
            '정산현황': settlementStatus ? '정산 예정' : '완료'
          });
        }
        this.Bcontacts.filteredData = this.Bcontacts.data;
        this.sortContacts('거래처 이름');
        this.Bcontacts.contactNames = [...new Set(this.Bcontacts.data.map(contact => contact['거래처 이름']))];
      } catch (error) {
        console.error("거래처 목록을 가져오는 데 실패했습니다.", error);
      }
    },
    async isPendingSettlement(customerCode) {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/pendingsettlement/${customerCode}`);
        return response.data;
      } catch (error) {
        console.error("정산 상태를 확인하는 데 실패했습니다.", error);
        throw error;
      }
    },
    filterContacts() {
      if (this.searchQuery) {
        this.Bcontacts.filteredData = this.Bcontacts.data.filter(contact =>
          contact['거래처 이름'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          contact['주소'].toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.Bcontacts.filteredData = this.Bcontacts.data;
      }
    },
    sortContacts(column) {
      this.Bcontacts.filteredData.sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      });
    },
    handleRowClick(row) {
      const customerCode = row['거래처 코드'];
      window.location.href = `http://localhost:8081/#/bcustomer_list/b_adjustment/${customerCode}`;
    }
  },
  computed: {
    BcontactsWithSettlementStatus() {
      return this.Bcontacts.filteredData;
    }
  }
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}

.table-hover.table-striped {
  cursor: pointer;
}
</style>
