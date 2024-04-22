<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <!-- 정산 상태 선택과 리셋 버튼 -->
          <div class="date-and-filter-bar">
            <div class="date-filter">
              <!-- 날짜 범위 선택 -->
              <input type="date" v-model="startDate" class="form-control">
              <input type="date" v-model="endDate" class="form-control">
              <!-- 정산 상태 선택 -->
              <select v-model="selectedStatus" @change="filterByStatus" class="form-control">
                <option value="">전체</option>
                <option v-for="status in statuses" :value="status">{{ status }}</option>
              </select>
              <!-- 리셋 버튼 -->
              <button @click="resetFilter" class="btn btn-secondary">Reset</button>
            </div>
          </div>
          <div class="adjustment-summary">
              <p class="all" v-if="showTotalUnadjustedAmount">정산 요청 금액: {{ totalUnadjustedAmount }} </p>
              <p class="all" v-if="showTotalUnadjustedAmount1">미정산된 금액: {{ totalUnadjustedAmount1 }} </p>
              <p class="all">주문된 총 금액: {{ totalOrderedAmount }}</p>
              <button v-if="showAdjustButton" @click="adjustmentAction" class="btn btn-primary">정산 요청</button>
          </div>
          <!-- 카드 컴포넌트로 정산 목록을 표시 -->
          <card class="striped-tabled-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">{{ selectedStatus }} 정산 목록</h4>
              <p class="card-category">거래처의 정산 상태를 확인하는 페이지</p>
            </template>
            <!-- 테이블 컴포넌트로 데이터 표시 -->
            <div class="adjustment">
              <l-table class="table-hover table-striped" :columns="Cadjustments.columns" :data="Cadjustments.filteredData">
                <template slot="columns">
                  <th>
                    <!-- Bind the select all checkbox to allSelected -->
                    <base-checkbox v-model="allSelected" @change="selectAll($event)"/>
                  </th>
                  <th v-for="column in Cadjustments.columns">{{ column }}</th>
                </template>
                <template slot-scope="{ row }">
                  <td>
                    <base-checkbox v-model="row.selected"></base-checkbox>
                  </td>
                  <td v-for="(column, index) in Cadjustments.columns" :key="index">
                    <!-- '금액' 필드에만 포맷팅 적용 -->
                    <span v-if="column === '금액'">{{ formatCurrency(row[column]) }}</span>
                    <span v-else>{{ row[column] }}</span>
                  </td>
                </template>
              </l-table>
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
import BaseCheckbox from 'src/components/Inputs/BaseCheckbox.vue' // 가정: BaseCheckbox 컴포넌트 경로
import axios from 'axios'

export default {
  components: {
    LTable,
    Card
  },
  data() {
    return {
      mutableCId: '',
      selectedStatus: '', // 선택된 정산 상태
      statuses: [], // 정산 상태 카테고리
      allSelected: false, // 추가: 모든 항목이 선택되었는지 여부를 나타냄
      Cadjustments: {
        columns: ['주문번호', '주문일자', '금액', '정산상태'], // 테이블 컬럼
        data: [], // 전체 데이터
        filteredData: [] // 필터링된 데이터
      },
      startDate: '', // 시작 날짜
      endDate: '' // 종료 날짜
    }
  },
  mounted() {
    const storedId = sessionStorage.getItem("cuser");
    this.mutableCId = storedId;
    this.fetchBAdjustments(); // 컴포넌트 마운트 시 데이터 로드
    this.selectedStatus = ''; // 초기에는 모든 정산 상태를 표시하기 위해 빈 상태로 설정
  },
  methods: {
    fetchBAdjustments() {
      // API를 통해 주문 데이터 가져오기
      axios.get(`http://localhost:8080/api/orders/customer/${this.mutableCId}`)
        .then(response => {
          // API 응답을 데이터로 변환하여 저장
          this.Cadjustments.data = response.data.map(Badjustment => ({
            '주문번호': Badjustment.orderNumber,
            '주문일자': Badjustment.orderDate,
            '금액': Badjustment.orderPrice,
            '정산상태': Badjustment.adjustmentStatus,
            '배송일자': Badjustment.deliveryDate,
            '판매처 코드': Badjustment.customerCode
          }));
          this.createStatusCategories(); // 정산 상태 카테고리 생성
          this.setDefaultDateRange(); // 시작일과 종료일을 현재 달로 설정
          this.filterByStatus(); // 초기 필터링을 위한 호출
        })
        .catch(error => {
          console.error("정산 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    formatCurrency(amount) {
      return amount.toLocaleString() + '원';
    },
    createStatusCategories() {
      // 데이터에서 정산 상태 추출하여 중복 제거 후 정렬
      const statuses = [...new Set(this.Cadjustments.data.map(item => item['정산상태']))].sort();
      this.statuses = statuses;
    },
    setDefaultDateRange() {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      this.startDate = firstDayOfMonth.toISOString().substr(0, 10); // 현재 달의 첫 번째 날짜로 설정
      this.endDate = lastDayOfMonth.toISOString().substr(0, 10); // 현재 달의 마지막 날짜로 설정
    },
    filterByStatus() {
      let filteredData = this.Cadjustments.data;
      if (this.selectedStatus) {
        filteredData = filteredData.filter(item => item['정산상태'] === this.selectedStatus);
      }
      this.filterByDateRange(filteredData); // 날짜 범위에 따라 데이터 필터링
    },
    filterByDateRange(data) {
      let filteredData = data;
      if (this.startDate && this.endDate) {
        filteredData = filteredData.filter(item => {
          const orderDate = new Date(item['주문일자']);
          return orderDate >= new Date(this.startDate) && orderDate <= new Date(this.endDate);
        });
      }
      this.Cadjustments.filteredData = filteredData;
    },
    selectAll(checked) {
      // Set the selection status of all checkboxes to the value of 'checked'
      this.Cadjustments.filteredData.forEach(row => {
        row.selected = checked;
      });
    },
    resetFilter() {
      this.selectedStatus = ''; // 선택된 정산 상태 초기화
      this.setDefaultDateRange(); // 시작일과 종료일을 현재 달로 설정
      this.filterByStatus(); // 필터링된 데이터 초기화
    },
    getUnadjustedOrders() {
      return this.Cadjustments.filteredData.filter(order => order.정산상태 === '미정산' && order.selected);
    },
    showAdjustButton() {
      return this.getUnadjustedOrders().length > 0;
    },
    adjustmentAction() {
      const selectedOrders = this.Cadjustments.filteredData.filter(order => order.selected);
      const invalidCompletedOrders = selectedOrders.filter(order => order.정산상태 === '정산 완료');
      const invalidUnadjustedOrders = selectedOrders.filter(order => order.정산상태 === '정산 요청');
      const invalidCancelOrders = selectedOrders.filter(order => order.정산상태 === '주문 취소'); // 주문 취소 상태 필터링
      const invalidUnsettledOrders = selectedOrders.filter(order => order.정산상태 === '미정산');

      if (invalidCompletedOrders.length > 0) {
        alert('정산 완료건이 선택되어 있습니다. \n미정산건만 선택해주세요.');
        this.Cadjustments.data.forEach(item => item.selected = false);
        this.allSelected = false; // Also reset the 'selectAll' checkbox);
        return;
      }

      if (invalidUnadjustedOrders.length > 0) {
        alert('정산 요청건이 선택되어 있습니다. \n미정산건만 선택해주세요.');
        this.Cadjustments.data.forEach(item => item.selected = false);
        this.allSelected = false; // Also reset the 'selectAll' checkbox);
        return;
      }

      if (invalidCancelOrders.length > 0) {
        alert('주문 취소건이 선택되어 있습니다. \n미정산건만 선택해주세요.'); // 주문 취소 상태 경고
        this.Cadjustments.data.forEach(item => item.selected = false);
        this.allSelected = false; // Also reset the 'selectAll' checkbox);
        return;
      }
      
      if(selectedOrders.length === 0) {
        alert('선택된 요청 건이 없습니다.\n다시 확인해주세요.');
        return;
      }

      alert('정산 요청 완료');

      const promises = selectedOrders.map(order => {
        order.정산상태 = '정산 요청';
        // API를 통해 서버에 상태 업데이트 요청을 보냅니다.
        return axios.put(`http://localhost:8080/api/orders/adjustment/${order.주문번호}`, { adjustmentStatus: '정산 요청' });
      });

      // 모든 요청이 완료될 때까지 기다립니다.
      Promise.all(promises)
        .then(responses => {
          // 모든 요청이 성공적으로 완료되었을 때 실행됩니다.
          console.log('정산 요청 완료: ', responses);
          // 페이지 새로고침
          // window.location.reload();
          //선택된 체크박스 제거
          this.Cadjustments.data.forEach(item => item.selected = false);
          this.allSelected = false; // Also reset the 'selectAll' checkbox
        })
        .catch(error => {
          // 요청 중 오류가 발생했을 때 실행됩니다.
          console.error('정산 요청 처리 중 오류 발생: ', error);
        });
    },
    getTotalUnadjustedAmount() {
      const unadjustedOrders = this.getUnadjustedOrders();
      return unadjustedOrders.filteredData.filter(order => order.정산상태 === '정산 요청').reduce((total, order) => total + order.금액, 0);
    },
    getTotalOrderedAmount() {
      return this.Cadjustments.filteredData.reduce((total, order) => total + order.금액, 0);
    },
    getTotalUnadjustedAmount1(){
      return this.Cadjustments.filteredData.filter(order => order.정산상태 === '미정산').reduce((total, order) => total + order.금액, 0);
    },
  },
  computed: {
    showTotalUnadjustedAmount() {
      return this.getUnadjustedOrders().length > 0;
    },
    totalUnadjustedAmount() {
      const total = this.getTotalUnadjustedAmount();
      return this.formatCurrency(total);
    },
    showTotalUnadjustedAmount1() {
      return this.Cadjustments.filteredData.some(order => order.정산상태 === '미정산');
    },
    totalUnadjustedAmount1() {
      const total = this.getTotalUnadjustedAmount1();
      return this.formatCurrency(total);
    },
    totalOrderedAmount() {
      const total = this.getTotalOrderedAmount();
      return this.formatCurrency(total);
    }
  },
  watch: {
    // 'allSelected' data property changes
    allSelected: {
      handler(newVal) {
        // Set the selection status of all checkboxes based on 'allSelected'
        this.Cadjustments.filteredData.forEach(row => {
          row.selected = newVal;
        });
      },
      // Immediately execute the handler when the component is mounted
      immediate: true,
    },
  },
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
.date-filter input {
  margin-right: 10px;
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
.adjustment-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.adjustment-summary .all {
  margin: 0 10px;
  font-size: larger;
  text-align: center;
}
.adjustment-summary button {
  margin-left: auto; /* 버튼을 오른쪽으로 정렬 */
}
</style>