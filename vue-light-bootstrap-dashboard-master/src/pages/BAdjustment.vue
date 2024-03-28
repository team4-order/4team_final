<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <!-- 검색과 필터링 바 -->
          <div class="search-and-filter-bar">
            <input v-model="searchQuery" type="text" placeholder="정산 검색..." @input="filterAdjustments" class="form-control search-bar" />
          </div>
          <!-- 날짜 선택과 리셋 버튼 -->
          <div class="date-and-filter-bar">
            <div class="date-filter">
              <input type="date" v-model="startDate" @change="filterAdjustments" class="form-control" />
              <input type="date" v-model="endDate" @change="filterAdjustments" class="form-control" />
              <button @click="resetDates" class="btn btn-secondary">reset</button> <!-- 날짜 리셋 버튼 -->
            </div>
          </div>
          <!-- 카드 컴포넌트로 정산 목록을 표시 -->
          <card class="striped-tabled-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">정산 목록</h4>
              <p class="card-category">거래처의 정산 상태를 확인하는 페이지</p>
            </template>
            <!-- 테이블 컴포넌트로 데이터 표시 -->
            <l-table class="table-hover table-striped" 
              :columns="Badjustments.columns" 
              :data="Badjustments.filteredData"></l-table>
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
      searchQuery: '', // 검색어
      startDate: '', // 시작일
      endDate: '', // 종료일
      Badjustments: {
        columns: ['주문번호', '주문일자', '금액', '정산상태'], // 테이블 컬럼
        data: [], // 전체 데이터
        filteredData: [] // 필터링된 데이터
      }
    }
  },
  mounted() {
    this.fetchBAdjustments(); // 컴포넌트 마운트 시 데이터 로드
  },
  methods: {
    fetchBAdjustments() {
      // API를 통해 주문 데이터 가져오기
      axios.get(`http://localhost:8080/api/orders/customer/${this.$route.params.contactCode}`)
        .then(response => {
          // API 응답을 데이터로 변환하여 저장
          this.Badjustments.data = response.data.map(Badjustment => ({
            '주문번호': Badjustment.orderNumber,
            '주문일자': Badjustment.orderDate,
            '금액': Badjustment.orderPrice,
            '정산상태': Badjustment.adjustmentStatus
          }));
          this.filterBAdjustments(); // 초기 필터링을 위한 호출
        })
        .catch(error => {
          console.error("정산 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    filterBAdjustments() {
      let filtered = [...this.Badjustments.data]; // 원본 데이터를 변경하지 않고 새로운 배열 생성

      // 검색어에 따른 필터링
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(Badjustment => {
          return Badjustment['주문번호'].toString().includes(query) ||
                 Badjustment['주문일자'].toLowerCase().includes(query) ||
                 Badjustment['금액'].toString().toLowerCase().includes(query) ||
                 Badjustment['정산상태'].toLowerCase().includes(query);
        });
      }

      // 날짜 범위에 따른 필터링
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        filtered = filtered.filter(Badjustment => {
          const orderDate = new Date(Badjustment['주문일자']);
          return orderDate >= start && orderDate <= end;
        });
      }

      // 필터링된 데이터 저장
      this.Badjustments.filteredData = filtered;
    },
    resetDates() {
      // 날짜 리셋
      this.startDate = '';
      this.endDate = '';
      this.filterBAdjustments(); // 데이터를 다시 필터링
    }
  }
}
</script>

<style scoped>
.search-and-filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-bar {
  flex-grow: 1;
  margin-right: 20px;
}
.date-filter {
  display: flex;
}
.date-filter input {
  margin-right: 10px;
}
.table-hover.table-striped {
  cursor: pointer;
}
</style>
