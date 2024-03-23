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
                </template>
                <l-table class="table-hover table-striped"
                  :columns="orders.columns"
                     :data="orders.filteredData">
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
      orders: {
        columns: ['주문 번호', '주문 금액'],
        data: [],
        filteredData: []
      }
    };
  },
  mounted() {
    this.fetchOrderList();
  },
  methods: {
    // API 엔드포인트 URL 생성
    //const apiUrl = ;
    fetchOrderList(){
    // API에서 주문 목록을 가져와서 orders 배열에 할당
    axios.get(`http://localhost:8080/api/orders/customer/${this.$route.params.customerCode}`)
    .then(response => {
          this.orders.data = response.data.map(order => {
            return {
              '주문 번호': order.orderNumber,
              '주문 금액': order.orderPrice
            };
          });
          this.orders.filteredData = this.orders.data;
        })
        .catch(error => {
          console.error("창고 목록을 가져오는 데 실패했습니다.", error);
        });
    }
  }
};
</script>

<style>

</style>