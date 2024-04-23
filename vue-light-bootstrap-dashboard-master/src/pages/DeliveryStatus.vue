<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">

           

            <!-- <div class="date-and-filter-bar">
              <div class="date-filter">
                <input type="date" v-model="startDate" @change="filterOrders" class="form-control">
                <input type="date" v-model="endDate" @change="filterOrders" class="form-control">

                <select v-model="selectedCustomerCode" @change="filterByStatus" class="form-control">
  <option value="">모든 고객</option>
  <option v-for="customer in customers" :key="customer.contactCode" :value="customer.contactCode">
    {{ customer.contactName }}
  </option>
</select>
              </div>
            </div> -->
          <card2>
 <template slot="header">
              <h4 class="card-title">배송 현황</h4>
              <p class="card-category"></p>
            </template>

            <l-table3 class="table-hover table-striped" :columns="orders.columns" :data="orders.data" @row-click="handleRowClick">
              
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
import LTable3 from 'src/components/Table2.vue';
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
        columns: ['배송 번호', '주문 번호', '고객명', '배송지', '배송 신청일', '배송 도착일', '배송 상태'],
        data: []
      }
    };
  },
  mounted() {
    const storedId = localStorage.getItem("code") || sessionStorage.getItem("user");
    console.log(storedId);
    this.mutableBusinessId = storedId;
    this.fetchOrderList();
  },
  methods: {
    fetchOrderList() {
      //const businessId = this.$route.params.businessId;
      axios.get(`http://localhost:8080/api/deliveries/status/${this.mutableBusinessId}`)
        .then(response => {
          this.orders.data = response.data.map(order => {
            return {
              '배송 번호': order.deliveryNumber,
              '배송지': order.deliveryAddress,
              '배송 신청일': order.deliveryApply ? order.deliveryApply.split('.')[0].replace('T', ' ') : '-',
          '배송 도착일': order.deliveryArrive ? order.deliveryArrive.split('.')[0].replace('T', ' ') : '-',
              '주문 번호': order.orderNumber,
              '고객명': order.contactName,
              '배송 상태': order.orderStatus,
              '주문 번호': order.orderNumber
            };
          })
        })
        .catch(error => {
          console.error("배송 현황 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    handleRowClick(row) {
      const orderNumber = row['주문 번호'];
      window.location.href = `http://localhost:8081/admin/deliverydetail/${orderNumber}`;
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.orders.data.length / this.itemsPerPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.orders.data.slice(start, end);
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
.table th, .table td {
  vertical-align: middle; /* Align content vertically in the middle of the cell */
  text-align: left; /* Align text to the left */
  padding: 8px; /* Standard padding for all cells */
}

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