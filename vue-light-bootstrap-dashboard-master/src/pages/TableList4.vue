<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card class="strpied-tabled-with-hover"
                body-classes="table-full-width table-responsive"
          >
            <template slot="header">
              <h4 class="card-title">Order List</h4>
              <p class="card-category">주문 현황</p>
            </template>
            <l-table class="table-hover table-striped"
                    :columns="orders.columns"
                    :data="orders.filteredData"
                    @row-click="handleRowClick">
            </l-table>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LTable from 'src/components/Table.vue';
import Card from 'src/components/Cards/Card.vue';

export default {
  components: {
    LTable,
    Card
  },
  data() {
    return {
      searchQuery: '',
      orders: {
        columns: ['주문 번호', '주문 금액', '주문 일자', '판매처 코드'],
        data: [],
        filteredData: []
      }
    };
  },
  mounted() {
    this.fetchOrderList();
  },
  methods: {
    fetchOrderList() {
      axios.get(`http://localhost:8080/api/orders/customer/${this.$route.params.customerCode}`)
        .then(response => {
          this.orders.data = response.data.map(order => {
            return {
              '주문 번호': order.orderNumber,
              '주문 금액': order.orderPrice,
              '주문 일자': order.orderDate,
              '판매처 코드': order.customerCode
            };
          });
          this.orders.filteredData = this.orders.data;
        })
        .catch(error => {
          console.error("주문 목록을 가져오는 데 실패했습니다.", error);
        });
    },
    handleRowClick(row) {
      const orderNumber = row['주문 번호'];
      // 주문 상세 페이지 URL로 이동
      window.location.href = `http://localhost:8080/#/buyer/detail/${orderNumber}`;
    }
  }
};
</script>

<style>
/* 필요한 스타일 지정 */
</style>