<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">

           

            <div class="date-and-filter-bar">
              <div class="date-filter">
                <input type="date" v-model="startDate" @change="filterOrders" class="form-control">
                <input type="date" v-model="endDate" @change="filterOrders" class="form-control">

                <select v-model="selectedCustomerCode" class="form-control">
                  <option disabled value="">모든 고객</option>
                  <option v-for="customer in customers" :key="customer.contactCode" :value="customer.contactCode">
                    {{ customer.contactName }}
                  </option>
                </select>
              </div>
            </div>
          <card2>
 <template slot="header">
              <h4 class="card-title">Order List</h4>
              <p class="card-category">Here is a subtitle for this table</p>
            </template>

            <l-table3 class="table-hover table-striped" :columns="orders.columns" :data="orders.filteredData"
              @row-click="handleRowClick">
            </l-table3>
            <div class="pagination-controls">
              <button class="btn btn-info btn-fill" @click="changePage(1)" :disabled="currentPage === 1">
                << </button>
                  <button class="btn btn-info btn-fill" @click="changePage(currentPage - 1)"
                    :disabled="currentPage <= 1">
                    < </button>

                      <span v-for="number in pageNumbers" :key="number" class="page-number" @click="changePage(number)"
                        :class="{ 'active': currentPage === number }">
                        {{ number }}
                      </span>

                      <button class="btn btn-info btn-fill" @click="changePage(currentPage + 1)"
                        :disabled="currentPage >= totalPages">></button>
                      <button class="btn btn-info btn-fill" @click="changePage(totalPages)"
                        :disabled="currentPage === totalPages">>></button>
            </div>
          </card2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LTable3 from 'src/components/BusinessTable.vue';
import Card2 from 'src/components/Cards/Card2.vue';

export default {
  components: {
    LTable3,
    Card2
  },
  data() {
    return {
      mutableBusinessId: '',
      currentPage: 1,
      itemsPerPage: 30,
      searchQuery: '',
      startDate: '',
      endDate: '',
      selectedCustomerCode: '',
      customers: [],
      orders: {
        columns: ['주문 번호', '고객명', '주문 금액(원)', '주문 일자', '주문 상태'],
        data: [],
        filteredData: []
      }
    };
  },
  mounted() {
    const storedId = localStorage.getItem("code") || sessionStorage.getItem("user");
    this.mutableBusinessId = storedId;
    this.fetchOrderList();
    this.fetchCustomerList();
  },
  methods: {
    fetchCustomerList() {
      const businessId = this.$route.params.businessId;
      axios.get(`http://localhost:8080/api/contact/busId/${this.mutableBusinessId}`)
        .then(response => {
          this.customers = response.data.map(customer => ({
            contactName: customer.contactName,
            contactCode: customer.contactCode
          }));
        })
        .catch(error => {
          console.error("고객 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    filterOrders() {
      // 선택된 고객 코드에 해당하는 주문들만 필터링
      const filteredByCustomer = this.orders.data.filter(order => {
        console.log(this.selectedCustomerCode);
        return this.selectedCustomerCode === '' || order['판매처 코드'] === this.selectedCustomerCode;
      });

      // 이미 고객 코드로 필터링된 주문들을 대상으로 날짜에 따라 추가 필터링
      const filteredByDateAndCustomer = filteredByCustomer.filter(order => {
        const orderDate = new Date(order['주문 일자']);
        const startDate = this.startDate ? new Date(this.startDate) : new Date('1970-01-01');
        const endDate = this.endDate ? new Date(this.endDate) : new Date();
        return orderDate >= startDate && orderDate <= endDate;
      });

      // 페이지네이션을 고려하여 최종적으로 표시될 데이터 계산
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      // 최종적으로 필터링된 데이터를 filteredData에 할당
      this.orders.filteredData = filteredByDateAndCustomer.slice(startIndex, endIndex);

      // 필터링 결과가 있을 때만 현재 페이지를 재설정
      if (this.orders.filteredData.length > 0) {
        this.currentPage = 1;
      } else {
        // 필터링된 데이터가 없다면, 사용자에게 표시될 데이터가 없음을 알림
        console.log("No orders found for the selected customer within the specified date range.");
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.filterOrders();
    },
    fetchOrderList() {
      //const businessId = this.$route.params.businessId;
      axios.get(`http://localhost:8080/api/orders/busId/${this.mutableBusinessId}`)
        .then(response => {
          this.orders.data = response.data.map(order => {
            return {
              '주문 번호': order.orderNumber,
              '고객명': order.customerName,
              '주문 금액(원)': order.orderPrice,
              '주문 일자': order.orderDate,
              '주문 상태': order.orderStatus,
              '판매처 코드': order.customerCode
            };
          })
            .sort((a, b) => new Date(b['주문 일자']) - new Date(a['주문 일자']));
          this.filterOrders();

        })
        .catch(error => {
          console.error("주문 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    handleRowClick(row) {
      const orderNumber = row['주문 번호'];
      // 주문 상세 페이지 URL로 이동
      window.location.href = `http://localhost:8081/orders/detail/${orderNumber}`;
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.orders.data.length / this.itemsPerPage);
    },
    pageNumbers() {
      let numbers = [];
      for (let i = 1; i <= this.totalPages; i++) {
        numbers.push(i);
      }
      return numbers;
    }
  }
};
</script>


<style>
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

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  padding: 5px 10px;
  font-size: 0.9rem;
  margin: 0 5px;
}

.page-number {
  margin: 0 10px;
  cursor: pointer;
  font-size: 0.9rem;
}

.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>