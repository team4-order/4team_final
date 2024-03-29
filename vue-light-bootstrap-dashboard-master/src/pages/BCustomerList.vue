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
              <p class="card-category">거래처 목록을 확인하는 페이지</p>
            </template>
            <!-- LTable 컴포넌트를 사용하여 테이블을 표시합니다. -->
            <l-table class="table-hover table-striped" 
            :columns="Bcontacts.columns" 
            :data="Bcontacts.filteredData"
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
        columns: ['연락처 코드', '연락처 이름', '연락처 주소', '전화번호', '이메일 주소'],
        data: [], // 연락처 데이터를 저장할 배열
        filteredData: [], // 검색 결과를 저장할 배열
        contactNames: [] // 연락처 이름을 저장할 배열
      }
    }
  },
  mounted() {
    this.fetchBContacts();
  },
  methods: {
    fetchBContacts() {
      axios.get('http://localhost:8080/api/contact/customers')
        .then(response => {
          this.Bcontacts.data = response.data.map(Bcontact => ({
            '연락처 코드': Bcontact.contactCode,
            '연락처 이름': Bcontact.contactName,
            '연락처 주소': Bcontact.contactAddress
          }));
          this.Bcontacts.filteredData = this.Bcontacts.data;
          this.sortContacts('연락처 이름'); // 메서드 이름 수정
          // 연락처 이름 데이터를 중복 없이 추출하여 저장
          this.Bcontacts.contactNames = [...new Set(this.Bcontacts.data.map(Bcontact => Bcontact['연락처 이름']))];
        })
        .catch(error => {
          console.error("연락처 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    filterContacts() {
      if (this.searchQuery) {
        this.Bcontacts.filteredData = this.Bcontacts.data.filter(Bcontact =>
          Bcontact['연락처 코드'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          Bcontact['연락처 이름'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          Bcontact['연락처 주소'].toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.Bcontacts.filteredData = this.Bcontacts.data;
      }
    },
    sortContacts(column) {
      // 주어진 열을 기준으로 연락처 목록 정렬
      this.Bcontacts.filteredData.sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      });
    },
    handleRowClick(row) {
      // 클릭된 행에서 연락처 코드를 추출합니다. 데이터 구조에 맞게 속성 이름을 확인하세요.
      const contactCode = row['연락처 코드'];
      // Vue Router를 사용하여 프로그래매틱 네비게이션을 합니다.
      this.$router.push({ name: 'B Adjustment List', params: { contactCode: contactCode } });
      // window.location.href = 'http://localhost:8080/#/admin'
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
