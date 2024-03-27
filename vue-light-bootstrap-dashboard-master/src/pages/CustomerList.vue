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
            <template #header>
              <h4 class="card-title">연락처 목록</h4>
              <p class="card-category">연락처의 상세 정보를 확인할 수 있습니다</p>
            </template>
            <!-- LTable 컴포넌트를 사용하여 테이블을 표시합니다. -->
            <l-table class="table-hover table-striped" :columns="contacts.columns" :data="contacts.filteredData">
              <template #default="{ row }">
                <tr>
                  <td>{{ row['연락처 코드'] }}</td>
                  <td>{{ row['연락처 이름'] }}</td>
                  <td>{{ row['연락처 주소'] }}</td>
                </tr>
              </template>
            </l-table>
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
      contacts: {
        // 컬럼 이름을 문자열 배열로 변경
        columns: ['연락처 코드', '연락처 이름', '연락처 주소'],
        data: [], // 연락처 데이터를 저장할 배열
        filteredData: [] // 검색 결과를 저장할 배열
      }
    }
  },
  mounted() {
    // 컴포넌트가 마운트되면 연락처 데이터를 가져옵니다.
    this.fetchContacts();
  },
  methods: {
    fetchContacts() {
      // contacts 객체 초기화
      this.contacts = {
        columns: ['연락처 코드', '연락처 이름', '연락처 주소'],
        data: [],
        filteredData: []
      };
      
      // Axios를 사용하여 Spring 서버로부터 연락처 데이터를 가져옵니다.
      axios.get('http://localhost:8080/api/contact/customers')
        .then(response => {
          // response.data를 contacts.data에 저장합니다.
          this.contacts.data = response.data.map(contact => {
            return {
              '연락처 코드': contact.contactCode,
              '연락처 이름': contact.contactName,
              '연락처 주소': contact.contactAddress
            };
          });
          // filteredData도 초기에는 모든 데이터를 포함하도록 설정합니다.
          this.contacts.filteredData = this.contacts.data;
          // 연락처 이름을 기준으로 정렬합니다.
          this.sortContacts('연락처 이름');
        })
        .catch(error => {
          console.error("연락처 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    filterContacts() {
      // 검색어가 입력되었을 때
      if(this.searchQuery) {
        // 검색어에 해당하는 연락처를 필터링하여 결과를 filteredData 배열에 저장합니다.
        this.contacts.filteredData = this.contacts.data.filter(contact =>
          contact['연락처 코드'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          contact['연락처 이름'].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          contact['연락처 주소'].toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        // 검색어가 없을 경우 모든 연락처를 표시합니다.
        this.contacts.filteredData = this.contacts.data;
      }
    },
    sortContacts(column) {
      // 데이터를 주어진 열(column)을 기준으로 정렬합니다.
      this.contacts.filteredData.sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      });
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
