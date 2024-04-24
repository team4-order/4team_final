<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">

          <div class="date-and-filter-bar">
            <div class="date-filter">
              <input type="date" v-model="startDate" @change="filterOrders" class="form-control">
              <input type="date" v-model="endDate" @change="filterOrders" class="form-control">

              <select v-model="selectedStatus" @change="filterByStatus" class="form-control">
                <option disabled value="">전체</option>
                <option v-for="status in statuses" :value="status" :key="status">
                  {{ status }}
                </option>
              </select>

            </div>
          </div>


          <card2>
            <h4 class="card-title">Order List</h4>
            <p class="card-category">주문 현황</p>
            <l-table2 class="table-hover table-striped" :columns="orders.columns" :data="orders.filteredData"
              @row-click="handleRowClick">
            </l-table2>
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
import LTable2 from 'src/components/Table1.vue';
import Card2 from 'src/components/Cards/Card2.vue';

export default {
  components: {
    LTable2,
    Card2
  },
  data() {
    return {
      mutableCId: '',
      currentPage: 1,
      itemsPerPage: 30,
      searchQuery: '',
      startDate: '',
      endDate: '',
      statuses: ['주문 완료', '주문 취소', '출고 준비 중', '배송 중', '배송 완료'],
      orders: {
        columns: ['주문 번호', '주문 일자', '주문 금액(원)', '주문 상태'],
        data: [],
        filteredData: []
      }
    };
  },
  mounted() {
    const storedId = sessionStorage.getItem("cuser");
    this.mutableCId = storedId;
    this.fetchOrderList();
  },
  methods: {
    filterOrders() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      let filtered = this.orders.data.filter(order => {
        const orderDate = new Date(order['주문 일자']);
        const startDate = this.startDate ? new Date(this.startDate) : new Date('1970-01-01');
        const endDate = this.endDate ? new Date(this.endDate) : new Date();
        return (!this.selectedStatus || order['주문 상태'] === this.selectedStatus) &&
          orderDate >= startDate && orderDate <= endDate;
      });
      this.orders.filteredData = filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    },
    filterByStatus() {
      this.currentPage = 1; // Reset to first page
      this.filterOrders();
    },
    changePage(page) {
      this.currentPage = page;
      this.filterOrders(); // Ensure this method updates the displayed items based on currentPage
    },
    fetchOrderList() {
      
      axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/orders/customer/${this.mutableCId}`)
        .then(response => {
          this.orders.data = response.data.map(order => {
            return {
              '주문 번호': order.orderNumber,
              '주문 금액(원)': order.orderPrice,
              '주문 일자': order.orderDate,
              '주문 상태': order.orderStatus,
              '정산 상태': order.adjustmentStatus,
              '판매처 코드': order.customerCode
            };
            window.location.reload();
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
      window.location.href = `http://easyoms.store/buyer/detail/${orderNumber}`;
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
