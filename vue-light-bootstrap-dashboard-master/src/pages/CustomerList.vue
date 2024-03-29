<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="search-bar">
            <input v-model="searchQuery" type="text" placeholder="연락처 검색..." @input="filterContacts" class="form-control" />
          </div>
          <!-- Card 컴포넌트로 연락처 목록을 표시합니다. -->
          <card class="striped-tabled-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">거래처 목록</h4>
              <div class="text-center">
                <button type="submit" class="btn btn-info btn-fill float-right" @click="$router.push('/admin/input_customer')">
                  거래처 등록
                </button>
              </div>
              <p class="card-category">거래처 목록을 확인하는 페이지</p>
            </template>
            <!-- LTable 컴포넌트를 사용하여 테이블을 표시합니다. -->
            <l-table class="table-hover table-striped" 
            :columns="contacts.columns" 
            :data="contacts.filteredData"
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
      contacts: {
        columns: ['연락처 코드', '연락처 이름', '연락처 주소'],
        data: [], // 연락처 데이터를 저장할 배열
        filteredData: [], // 검색 결과를 저장할 배열
        contactNames: [] // 연락처 이름을 저장할 배열
      }
    }
  },
  mounted() {
    this.fetchContacts();
  },
  methods: {
    fetchContacts() {
      axios.get('http://localhost:8080/api/contact/customers')
        .then(response => {
          this.contacts.data = response.data.map(contact => ({
            '연락처 코드': contact.contactCode,
            '연락처 이름': contact.contactName,
            '연락처 주소': contact.contactAddress
          }));
          this.contacts.filteredData = this.contacts.data;
          this.sortContacts('연락처 이름'); // 연락처를 이름으로 정렬
          // 연락처 이름 데이터를 중복 없이 추출하여 저장
          this.contacts.contactNames = [...new Set(this.contacts.data.map(contact => contact['연락처 이름']))];
        })
        .catch(error => {
          console.error("연락처 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    filterContacts() {
      if (this.searchQuery) {
        this.contacts.filteredData = this.contacts.data.filter(contact =>
          contact['연락처 코드'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          contact['연락처 이름'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          contact['연락처 주소'].toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.contacts.filteredData = this.contacts.data;
      }
    },
    filterContactsBySelectedName() {
      // 선택된 연락처 이름에 따라 결과 필터링
      if (this.selectedContactName) {
        this.contacts.filteredData = this.contacts.data.filter(contact => contact['연락처 이름'] === this.selectedContactName);
      } else {
        this.contacts.filteredData = this.contacts.data;
      }
    },
    sortContacts(column) {
      // 주어진 열을 기준으로 연락처 목록 정렬
      this.contacts.filteredData.sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      });
    },
    // handleRowClick(row) {
    //   const contactCode = row['연락처 코드']; // 변수명을 orderNumber에서 contactCode로 변경
    //   // 주문 상세 페이지 URL로 이동
    //   window.location.href = `http://localhost:8080/#/admin/customer_list/c_adjustment/${contactCode}`;
    // }
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
