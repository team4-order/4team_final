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
              <p class="card-category">Here is a subtitle for this table</p>
              <button>Save Changes</button>
              <!-- <button @click="saveOrderChanges"></button> -->
            </template>
            <l-table class="table-hover table-striped"
                    :columns="orders.columns"
                    :data="orders.filteredData"
                    :editable="true" 
            >
            </l-table>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LTable from 'src/components/InputTable.vue';
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
        columns: ['주문 번호', '주문 금액', '주문 일자', '입력 필드'],
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
      axios.get(`http://localhost:8080/api/orders/customer`)
        .then(response => {
          this.orders.data = response.data.map(order => {
            return {
              '주문 번호': order.orderNumber,
              '주문 금액': order.orderPrice,
              '주문 일자': order.orderDate,
              '입력 필드': null // Initialize input field value
            };
          });
          this.orders.filteredData = this.orders.data;
        })
        .catch(error => {
          console.error("주문 목록을 가져오는 데 실패했습니다.", error);
        });
    }
  //   ,
  //   saveOrderChanges() {
  //   // 변경된 데이터만 필터링하거나 모든 주문 데이터를 전송할 수 있습니다.
  //   axios.post(`http://api/orders/update`, this.orders.data)
  //     .then(response => {
  //       alert("주문 정보가 성공적으로 업데이트되었습니다.");
  //     })
  //     .catch(error => {
  //       console.error("주문 정보 업데이트에 실패했습니다.", error);
  //     });
  // }
  }
};
</script>

<style>
/* 필요한 스타일 지정 */
</style>