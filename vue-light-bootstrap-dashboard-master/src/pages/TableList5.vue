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
                  <p class="card-category">Here is a subtitle for this table</p>
                </template>
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
      orderDetails: {
        columns: ['주문 상품(코드)', '상품 등급', '주문 금액'],
        data: [],
        filteredData: []
      }
    };
  },
  mounted() {
    this.fetchOrderDetailList();
  },
  methods: {
    // API 엔드포인트 URL 생성
    //const apiUrl = ;
    fetchOrderDetailList(){
    // API에서 주문 목록을 가져와서 orders 배열에 할당
    const orderNumber = this.$route.params.orderNumber;
      // Use the orderNumber variable to fetch data
      axios.get(`http://localhost:8080/api/order/detail/${orderNumber}`)
    .then(response => {
          this.orderDetails.data = response.data.map(orderDetail => {
            return {
              '주문 번호': orderDetail.orderNumber,
              '주문 금액': orderDetail.orderPrice,
              '주문 상품(코드)': orderDetail.goodsCode,
              '상품 등급': orderDetail.goodsGrade
            };
          });
          this.orderDetails.filteredData = this.orderDetails.data;
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