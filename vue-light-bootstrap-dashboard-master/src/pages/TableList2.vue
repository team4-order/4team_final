<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card class="strpied-tabled-with-hover"
                body-classes="table-full-width table-responsive"
          >
            <template slot="header">
              <h4 class="card-title">주문 등록</h4>
              <p class="card-category">apply</p>
              <button class="btn btn-info btn-fill float-right">submit</button>
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
        columns: ['상품 코드', '상품 등급', '주문 가능 수량', '입력 필드'],
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
      const customerCode = this.$route.params.customerCode;
      // axios.get(`http://localhost:8080/api/total/${customerCode}`)
      //   .then(response => {
      //     this.order1s.data = response.data.map(order1 => {
      //       return {
      //         '창고 번호': order1.storageCode,
      //         '상품 코드': order1.goodsCode,
      //         '상품 등급': order1.goodsGrade,
      //         '주문 가능 수량': order1.totalQuantity,
      //         '입력 필드': 0
      //       };
      //     });
      //     this.order1s.filteredData = this.order1s.data;
      //   })
      //   .catch(error => {
      //     console.error("주문 목록을 가져오는 데 실패했습니다.", error);
      //   });
      axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/total/summary/${customerCode}`)
        .then(response => {
          this.orders.data = response.data.map(order => {
            return {
              '상품 코드': order.goodsCode,
              '상품 등급': order.goodsGrade,
              '주문 가능 수량': order.totalQuantity,
              '입력 필드': 0
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