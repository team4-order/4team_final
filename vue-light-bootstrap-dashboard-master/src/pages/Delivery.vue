<template>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <card class="strpied-tabled-with-hover"
                  body-classes="table-full-width table-responsive"
            >
              <template slot="header">
                <h4 class="card-title">Striped Table with Hover</h4>
                <p class="card-category">Here is a subtitle for this table</p>
              </template>
              <l-table class="table-hover table-striped"
                       :columns="table1.columns"
                       :data="table1.data">
              </l-table>
            </card>
          </div>
  
          <div class="col-12">
            <card class="card-plain">
              <template slot="header">
                <h4 class="card-title">Table on Plain Background</h4>
                <p class="card-category">Here is a subtitle for this table</p>
              </template>
              <div class="table-responsive">
                <l-table class="table-hover"
                         :columns="table2.columns"
                         :data="table2.data">
                </l-table>
              </div>
            </card>
          </div>
          
          <div class="col-12">
            <card class="card-plain">
              <template slot="header">
                <h4 class="card-title">Table on Plain Background</h4>
                <p class="card-category">Here is a subtitle for this table</p>
              </template>
              <div class="table-responsive">
                <l-table class="table-hover table-striped"
                         :rows="Deliveries.rows"
                         :data="Deliveries.filteredData"
                         @row-click="handleRowClick"></l-table>
              </div>
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
import Delivery from './Delivery'
  
  export default {
    components: {
      LTable,
      Card
    },
    data() {
      return {
        selectedContactName: '', // 추가: 선택된 연락처 이름
        Deliveries: {
          rows: ['창고 이름', '창고 연락처', '창고 주소'],
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
        axios.get('http://localhost:8080/api/contact/storages')
          .then(response => {
            this.Deliveries.data = response.data.map(Delivery => ({
              '창고 이름': Delivery.contactName,
              '창고 연락처': Delivery.customerPhone,
              '창고 주소': Delivery.contactAddress
            }));
            this.Deliveries.filteredData = this.Deliveries.data;
            this.sortContacts('거래처 이름'); // 메서드 이름 수정
            // 연락처 이름 데이터를 중복 없이 추출하여 저장
            this.Deliveries.contactNames = [...new Set(this.Deliveries.data.map(Bcontact => Bcontact['거래처 이름']))];
          })
          .catch(error => {
            console.error("거래처 목록을 가져오는 데 실패했습니다.", error);
          });
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
        const customerCode = row['거래처 코드']; // 선택한 행의 거래처 코드
        // BAdjustment 화면으로 네비게이션하고 해당 거래처의 데이터를 표시
        window.location.href = `http://localhost:8081/#/bcustomer_list/b_adjustment/${customerCode}`;
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
  