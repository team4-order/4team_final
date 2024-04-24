<template>
  <div class="content">
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
           <card2>
              <template slot="header">
                <h4 class="card-title">Order Detail List</h4>
                <p v-if="firstOrderNumber" class="card-category">{{ firstOrderNumber }} 번 주문</p>
                <p class="card-category">주문 상태: {{ orderStatus }} </p>
                <p v-if="adjustmentStatus !== '주문 취소'" class="card-category">정산 상태: {{ adjustmentStatus }} </p>
              </template>
            
              <l-table2 class="table-hover table-striped"
                :columns="orderDetails.columns"
                :data="orderDetails.filteredData">
              </l-table2>
            </card2>

          </div>
        </div>
      </div>
    </div>

  </template>

<script>
import axios from 'axios';
import LTable2 from 'src/components/Table1.vue'
import Card2 from 'src/components/Cards/Card2.vue'

export default {
components: {
    LTable2,
    Card2
  },
data() {
  return {
    searchQuery: '',
    firstOrderNumber: '',
    orderStatus: '',
    adjustmentStatus: '',
    orderDetails: {
      columns: ['상품명', '상품 등급', '가격(box)', '주문 수량', '금액(원)'],
      data: [],
      filteredData: []
    }
  };
},
mounted() {
  this.fetchOrderDetailList();
  this.fetchOrderStatus();
},
methods: {
  // API 엔드포인트 URL 생성
  //const apiUrl = ;
  fetchOrderStatus() {
    // Fetch the order's overall status separately
    const orderNumber = this.$route.params.orderNumber;
    axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/orders/${orderNumber}`)
      .then(response => {
        if (response.data) {
          this.orderStatus = response.data.orderStatus;
          this.adjustmentStatus = response.data.adjustmentStatus; // Set the order status
          //console.log(response.data.orderStatus);
        }
      })
      .catch(error => {
        console.error("주문 상태를 가져오는 데 실패했습니다.", error);
      });
  },
//   cancelOrder() {
//     if (this.adjustmentStatus !== '미정산') {
//   alert('미정산 주문만 취소할 수 있습니다.');
//   return;
// } else {
//   const orderNumber = this.$route.params.orderNumber;
//   axios.put(`http://localhost:8080/api/orders/${orderNumber}/cancel`)
//     .then(_response => {
//       alert('주문이 취소되었습니다.');
//       window.location.reload();
//     })
//   }
// },
  fetchOrderDetailList(){
  // API에서 주문 목록을 가져와서 orders 배열에 할당
  const orderNumber = this.$route.params.orderNumber;
    // Use the orderNumber variable to fetch data
    axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/order/detail/${orderNumber}`)
  .then(response => {

    if (response.data.length > 0) {
      this.firstOrderNumber = response.data[0].orderNumber; // 첫 번째 주문 번호 저장
    }
        this.orderDetails.data = response.data.map(orderDetail => {
          return {
            ...orderDetail,
            '주문 번호': orderDetail.orderNumber,
            '상품명': orderDetail.goodsName,
            '가격(box)': orderDetail.orderPrice * 1,
            '주문 수량': orderDetail.orderQuantity,
            '상품 코드': orderDetail.goodsCode,
            '상품 등급': orderDetail.goodsGrade,
            '금액(원)':  orderDetail.orderQuantity * orderDetail.orderPrice
          };
        });
        this.orderDetails.filteredData = this.orderDetails.data;
        console.log(this.orderDetails.data);
      })
      .catch(error => {
        console.error("주문 상세 목록을 가져오는 데 실패했습니다.", error);
      });
  }
}
};
</script>

<style>

</style>