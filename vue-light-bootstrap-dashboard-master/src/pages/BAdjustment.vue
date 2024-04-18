<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <!-- 정산 상태 선택과 리셋 버튼 -->
          <div class="date-and-filter-bar">
            <div class="date-filter">
              <input type="date" v-model="startDate" @change="filterByDate" class="form-control">
              <input type="date" v-model="endDate" @change="filterByDate" class="form-control">
              <select v-model="selectedStatus" @change="filterByStatus" class="form-control">
                <option value="">전체</option>
                <option v-for="status in statuses" :value="status">{{ status }}</option>
              </select>
              <button @click="resetFilter" class="btn btn-secondary">Reset</button>
            </div>
          </div>
           <!-- 금액 표시 부분을 여기로 이동 -->
           <div class="adjustment-summary">
            <p class="all" v-if="showTotalUnadjustedAmount">미정산된 금액: {{ totalUnadjustedAmount1 }}원</p>
            <p class="all" v-if="showTotalAdjustedAmount">요청된 정산 금액: {{ totalUnadjustedAmount }}원</p>
            <p class="all">주문된 총 금액: {{ totalOrderedAmount }}원</p>
            <button v-if="showAdjustButton" @click="adjustmentAction" class="btn btn-primary">정산하기</button>
          </div>
          <!-- 카드 컴포넌트로 정산 목록을 표시 -->
          <card class="striped-tabled-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">{{ selectedStatus }} 정산 목록</h4>
              <p class="card-category">거래처의 정산 상태를 확인하는 페이지</p>
            </template>
            <!-- 테이블 컴포넌트로 데이터 표시 -->
            <div class="adjustment">
              <l-table v-if="filteredData.length > 0" class="table-hover table-striped" :columns="Cadjustments.columns" :data="filteredData">
                <template slot="columns">
                  <th>
                    <base-checkbox :value="allSelected" @input="selectAll"/>
                  </th>
                  <th v-for="column in Cadjustments.columns">{{ column }}</th>
                </template>
                <template slot-scope="{ row }">
                  <td>
                    <base-checkbox type="checkbox" v-model="row.selected"/>
                  </td>
                  <td v-for="column in Cadjustments.columns">{{ row[column] }}</td>
                </template>
              </l-table>
              <p class="all" v-else>해당 기간에 선택한 정산 상태의 데이터가 없습니다.</p>
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
      selectedStatus: '', // 선택된 정산 상태
      statuses: [], // 정산 상태 카테고리
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().substr(0, 10), // 시작일 - 현재 달의 첫 번째 날짜로 설정
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().substr(0, 10), // 종료일 - 현재 달의 마지막 날짜로 설정
      Cadjustments: {
        columns: ['주문번호', '주문일자', '금액', '정산상태', '배송일자'], // 테이블 컬럼
        data: [], // 전체 데이터
      },
      filteredData: [], // 필터링된 데이터
      allSelected: false // 전체 선택 여부
    }
  },
  mounted() {
    this.fetchBAdjustments(); // 컴포넌트 마운트 시 데이터 로드
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
            '배송일자': Badjustment.deliveryDate
          }));
          this.statuses = [...new Set(this.Cadjustments.data.map(item => item.정산상태))]; // 중복 제거하여 상태 설정
          this.filterByDate(); // 날짜로 데이터 필터링
        })
        .catch(error => {
          console.error("정산 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    filterByDate() {
      const filteredByDate = this.Cadjustments.data.filter(item => {
        const orderDate = new Date(item['주문일자']);
        const startDate = this.startDate ? new Date(this.startDate) : null;
        const endDate = this.endDate ? new Date(this.endDate) : null;
        return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
      });
      this.filterDataByStatus(filteredByDate); // 날짜로 필터링된 데이터를 다시 상태로 필터링
    },
    filterByStatus() {
      this.filterDataByStatus(this.Cadjustments.data); // 상태로 필터링
    },
    filterDataByStatus(data) {
      if (this.selectedStatus) {
        const filteredDataByStatus = data.filter(item => item['정산상태'] === this.selectedStatus);
        const filteredDataByDate = filteredDataByStatus.filter(item => {
          const orderDate = new Date(item['주문일자']);
          return (!this.startDate || orderDate >= new Date(this.startDate)) && (!this.endDate || orderDate <= new Date(this.endDate));
        });
        this.filteredData = filteredDataByDate;
      } else {
        const filteredDataByDate = data.filter(item => {
          const orderDate = new Date(item['주문일자']);
          return (!this.startDate || orderDate >= new Date(this.startDate)) && (!this.endDate || orderDate <= new Date(this.endDate));
        });
        this.filteredData = filteredDataByDate;
      }
    },
    resetFilter() {
      this.selectedStatus = ''; // 선택된 정산 상태 초기화
      this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().substr(0, 10); // 시작일 - 현재 달의 첫 번째 날짜로 설정
      this.endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().substr(0, 10); // 종료일 - 현재 달의 마지막 날짜로 설정
      this.filterByDate(); // 필터 초기화
    },
    showAdjustButton() {
      return this.filteredData.some(order => order.정산상태 === '미정산');
    },
    adjustmentAction() {
      const selectedOrders = this.filteredData.filter(order => order.selected);
      const invalidCompletedOrders = selectedOrders.filter(order => order.정산상태 === '정산 완료');
      const invalidUnadjustedOrders = selectedOrders.filter(order => order.정산상태 === '미정산');
      const invalidCancelOrders = selectedOrders.filter(order => order.정산상태 === '주문 취소');
      const invalidUnsettledOrders = selectedOrders.filter(order => order.정산상태 === '정산 요청');

      if (invalidCompletedOrders.length > 0) {
        alert('정산 완료건이 선택되어 있습니다.\n정산 요청건만 선택해주세요.');
        this.filteredData.forEach(item => item.selected = false);
        this.allSelected = false; // Also reset the 'selectAll' checkbox

        return;
      }

      if (invalidUnadjustedOrders.length > 0) {
        alert('미정산건이 선택되어 있습니다. \n정산 요청건만 선택해주세요.');
        this.filteredData.forEach(item => item.selected = false);
        this.allSelected = false; // Also reset the 'selectAll' checkbox
        return;
      }

      if(invalidCancelOrders.length > 0) {
        alert('주문취소건이 선택되어 있습니다. \n정산 요청건만 선택해주세요.');
        this.filteredData.forEach(item => item.selected = false);
        this.allSelected = false;
        return;
      }

      if(selectedOrders.length === 0) {
        alert('선택된 요청 건이 없습니다.\n다시 확인해주세요.');
        return;
      }

      alert('정산이 완료되었습니다.');

      const promises = selectedOrders.map(order => {
        order.정산상태 = '정산 완료';
        // API를 통해 서버에 상태 업데이트 요청을 보냅니다.
        return axios.put(`http://localhost:8080/api/orders/adjustment/${order.주문번호}`, { adjustmentStatus: '정산 완료' });
      });

      // 모든 요청이 완료될 때까지 기다립니다.
      Promise.all(promises)
        .then(responses => {
          // 모든 요청이 성공적으로 완료되었을 때 실행됩니다.
          console.log('정산 완료: ', responses);
          //선택된 체크박스 제거
          this.filteredData.forEach(item => item.selected = false); // Reset the selection state of all rows

          this.Cadjustments.data.forEach(item => item.selected = false);
          this.allSelected = false; // Also reset the 'selectAll' checkbox
        })
        .catch(error => {
          // 요청 중 오류가 발생했을 때 실행됩니다.
          console.error('정산 처리 중 오류 발생: ', error);
        });
    },

    getTotalUnadjustedAmount() {
      return this.filteredData.filter(order => order.정산상태 === '미정산').reduce((total, order) => total + order.금액, 0);
    },
    getTotalAdjustedAmount() {
      return this.filteredData.filter(order => order.정산상태 === '정산 요청').reduce((total, order) => total + order.금액, 0);
    },
    getTotalOrderedAmount() {
      return this.filteredData.reduce((total, order) => total + order.금액, 0);
    },
    selectAll(value) {
      this.allSelected = value;
      this.filteredData.forEach(row => {
        row.selected = this.allSelected;
      });
    }
  },
  computed: {
    showTotalUnadjustedAmount() {
      return this.filteredData.some(order => order.정산상태 === '미정산');
    },
    showTotalAdjustedAmount() {
      return this.filteredData.some(order => order.정산상태 === '정산 요청');
    },
    totalUnadjustedAmount1() {
      return this.getTotalUnadjustedAmount();
    },
    totalUnadjustedAmount() {
      return this.getTotalAdjustedAmount();
    },
    totalOrderedAmount() {
      return this.getTotalOrderedAmount();
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
