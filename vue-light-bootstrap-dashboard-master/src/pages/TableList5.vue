  <template>
    <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
              <card class="strpied-tabled-with-hover"
                    body-classes="table-full-width table-responsive"
              >
                <template slot="header">
                  <h4 class="card-title">Order Detail List</h4>
                  <p v-if="firstOrderNumber" class="card-category">{{ firstOrderNumber }} 번 주문</p>
                  <p class="card-category">주문 상태: {{ orderStatus }} </p>
                  <p v-if="adjustmentStatus !== '주문 취소'" class="card-category">정산 상태: {{ adjustmentStatus }} </p>
                </template>

                <button v-if="orderStatus !== '주문 취소'" class="btn btn-info btn-fill float-right" @click="cancelOrder">주문 취소</button>
                <l-table class="table-hover table-striped"
                  :columns="orderDetails.columns"
                  :data="orderDetails.filteredData">
                </l-table>
              </card>

            </div>
          </div>
        </div>
      </div>

    </template>

<script>
import axios from 'axios';
import LTable from 'src/components/Table.vue'
import Card from 'src/components/Cards/Card.vue'

export default {
  components: {
      LTable,
      Card
    },
  data() {
    return {
      searchQuery: '',
      firstOrderNumber: '',
      orderStatus: '',
      adjustmentStatus: '',
      orderDetails: {
        columns: ['상품명', '상품 등급', '가격(BOX)', '주문 수량', '금액(원)'],
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
      axios.get(`http://localhost:8080/api/orders/${orderNumber}`)
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
    },cancelOrder() {
      if (this.adjustmentStatus !== '미정산') {
    alert('미정산 주문만 취소할 수 있습니다.');
    return;
  } else {
    const orderNumber = this.$route.params.orderNumber;
    axios.put(`http://localhost:8080/api/orders/${orderNumber}/cancel`)
      .then(_response => {
        alert('주문이 취소되었습니다.');
        window.location.reload();
      })
    }
  },
    fetchOrderDetailList(){
    // API에서 주문 목록을 가져와서 orders 배열에 할당
    const orderNumber = this.$route.params.orderNumber;
      // Use the orderNumber variable to fetch data
      axios.get(`http://localhost:8080/api/order/detail/${orderNumber}`)
    .then(response => {

      if (response.data.length > 0) {
        this.firstOrderNumber = response.data[0].orderNumber; // 첫 번째 주문 번호 저장
      }
          this.orderDetails.data = response.data.map(orderDetail => {
            return {
              ...orderDetail,
              '주문 번호': orderDetail.orderNumber,
              '상품명': orderDetail.goodsName,
              '가격(BOX)': orderDetail.orderPrice * 1,
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