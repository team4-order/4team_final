<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <!-- 날짜 선택과 리셋 버튼 -->
          <div class="date-and-filter-bar">
            <div class="date-filter">
              <select v-model="selectedMonth" @change="filterByMonth" class="form-control">
                <option value="">전체</option>
                <option v-for="month in months" :value="month">{{ month }}</option>
              </select>
              <button @click="resetFilter" class="btn btn-secondary">Reset</button>
            </div>
          </div>
          <!-- 카드 컴포넌트로 정산 목록을 표시 -->
          <card class="striped-tabled-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">{{ selectedMonth }}정산 목록</h4>
              <p class="card-category">거래처의 정산 상태를 확인하는 페이지</p>
            </template>
            <!-- 테이블 컴포넌트로 데이터 표시 -->
            <div class="adjustment">
              <l-table class="table-hover table-striped" :columns="Cadjustments.columns" :data="Cadjustments.filteredData"></l-table>
              <p class="all" v-if="showTotalUnadjustedAmount">미정산된 총 금액: {{ totalUnadjustedAmount }}원 </p>
              <button v-if="showAdjustButton" @click="adjustmentAction" class="btn btn-primary">정산하기</button>
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

export default {
  components: {
    LTable,
    Card
  },
  data() {
    return {
      selectedMonth: '', // 선택된 월
      months: [], // 날짜 카테고리
      Cadjustments: {
        columns: ['주문번호', '주문일자', '금액', '정산상태', '배송일자'], // 테이블 컬럼
        data: [], // 전체 데이터
        filteredData: [] // 필터링된 데이터
      }
    }
  },
  mounted() {
    this.fetchBAdjustments(); // 컴포넌트 마운트 시 데이터 로드
    this.selectedMonth = this.getCurrentMonth(); // 현재 월 선택
  },
  methods: {
    fetchBAdjustments() {
      // API를 통해 주문 데이터 가져오기
      axios.get(`http://localhost:8080/api/orders/customer/${this.$route.params.customerCode}`)
        .then(response => {
          // API 응답을 데이터로 변환하여 저장
          this.Cadjustments.data = response.data.map(Badjustment => ({
            '주문번호': Badjustment.orderNumber,
            '주문일자': Badjustment.orderDate,
            '금액': Badjustment.orderPrice,
            '정산상태': Badjustment.adjustmentStatus,
            '판매처 코드': Badjustment.customerCode
          }));
          this.createMonthCategories(); // 월별 카테고리 생성
          this.filterByMonth(); // 초기 필터링을 위한 호출
        })
        .catch(error => {
          console.error("정산 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    getCurrentMonth() {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript의 월은 0부터 시작하므로 +1 해줍니다.
      return `0${currentMonth}월`;
    },
    createMonthCategories() {
      // 데이터에서 월 추출하여 중복 제거 후 정렬
      const months = [...new Set(this.Cadjustments.data.map(item => item['주문일자'].split('-')[1]))].sort();
      this.months = months.map(month => `${month}월`);
    },
    filterByMonth() {
      if (this.selectedMonth) {
        const selectedMonthNumber = parseInt(this.selectedMonth.slice(0, -1)); // '월' 제거 후 숫자만 추출
        const filteredData = this.Cadjustments.data.filter(item => {
          const itemMonth = parseInt(item['주문일자'].split('-')[1]);
          return itemMonth === selectedMonthNumber;
        });
        this.Cadjustments.filteredData = filteredData;
      } else {
        this.Cadjustments.filteredData = this.Cadjustments.data; // 전체 선택 시 모든 데이터 표시
      }
    },
    resetFilter() {
      this.selectedMonth = ''; // 선택된 월 초기화
      this.Cadjustments.filteredData = this.Cadjustments.data; // 필터링된 데이터 초기화
    },
    getUnadjustedOrders() {
      return this.Cadjustments.filteredData.filter(order => order.정산상태 === '미정산');
    },
    showAdjustButton() {
      return this.getUnadjustedOrders().length > 0;
    },
    adjustmentAction() {
      const unadjustedOrders = this.getUnadjustedOrders();
      const promises = unadjustedOrders.map(order => {
        order.정산상태 = '정산 완료';
        // API를 통해 서버에 상태 업데이트 요청을 보냅니다.
        return axios.put(`http://localhost:8080/api/orders/adjustment/${order.주문번호}`, { adjustmentStatus: '정산 완료' });
      });

      // 모든 요청이 완료될 때까지 기다립니다.
      Promise.all(promises)
        .then(responses => {
          // 모든 요청이 성공적으로 완료되었을 때 실행됩니다.
          console.log('정산 완료: ', responses);
        })
        .catch(error => {
          // 요청 중 오류가 발생했을 때 실행됩니다.
          console.error('정산 처리 중 오류 발생: ', error);
        });
    },
    getTotalUnadjustedAmount() {
      const unadjustedOrders = this.getUnadjustedOrders();
      return unadjustedOrders.reduce((total, order) => total + order.금액, 0);
    }
  },
  computed: {
    showTotalUnadjustedAmount() {
      return this.getUnadjustedOrders().length > 0;
    },
    totalUnadjustedAmount() {
      return this.getTotalUnadjustedAmount();
    }
  }
}
</script>

<style scoped>
.date-and-filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.date-filter {
  display: flex;
}
.date-filter select {
  margin-right: 10px;
}
.adjustment {
  margin-top: 10px;
}
.adjustment button {
  margin-top: 5px;
  margin-left: 92%;
}
.all {
  font-size: larger;
  font-style: inherit;
  text-align: center;
  margin-top: 25px;
}

</style>
