<template>
  <div class="content">
    <div class="container-fluid">

      <!-- <div>
        <div class="row">
          <input type="test" v-model="question" placeholder="AI 비서에게 질문해 보세요.">
          <button class="btn btn-default btn-fill float-right" @click="askQuestion">Ask</button>
        </div>
        <p>Answer: {{ answer }}</p>
    </div>
     -->

      <div v-if="messages.length > 0" class="chat-window">
        <div class="btn-div" v-if="messages.length > 3">
          <button class="iconBtn" @click="toggleOldMessages">
            <img class="iconBtnUp" :src="currentIcon" alt="Toggle Details" />
          </button>
        </div>
        <div class="messages">
          <div v-for="msg in visibleMessages" :key="msg.id" class="message"
            :class="{ 'user-msg': msg.type === 'user', 'ai-msg': msg.type === 'ai' }">
            <div class="message-content">{{ msg.text }}</div>
          </div>
        </div>
      </div>
      <div class="input-area">
        <input type="text" v-model="newMessage" @keyup.enter="sendQuestion" placeholder="AI에게 질문해 보세요."
          class="input-field">
        <button class="btn btn-primary" @click="sendQuestion">Send</button>
      </div>



      <Card>
        <h5>주간 데이터 <i class="fa-solid fa-ellipsis"></i> </h5>
        <div class="row">

          <div class="col-xl-3 col-md-6">
            <stats-card>
              <div slot="header" class="icon-success">
                <i class="nc-icon nc-money-coins text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">매출</p>
                <h4 class="card-title">{{ weeklySales }} 원</h4>
              </div>
              <div slot="footer">
                <i class="fa fa-calendar-o"></i> for a week
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-6">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-cart-simple text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">출고 준비 중</p>
                <h4 class="card-title">{{ weeklyReadyOrders }} 건</h4>
              </div>
              <div slot="footer">
                <i class="fa fa-refresh"></i>Updated now
              </div>
            </stats-card>
          </div>



          <div class="col-xl-3 col-md-6">
            <stats-card>
              <div slot="header" class="icon-danger">
                <i class="nc-icon nc-vector text-danger"></i>
              </div>
              <div slot="content">
                <p class="card-category">배송 중</p>
                <h4 class="card-title">{{ weeklydeliveryOrders }} 건</h4>
              </div>
              <div slot="footer">
                <i class="fa fa-clock-o"></i>Last day
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-6">
            <stats-card>
              <div slot="header" class="icon-info">
                <i class="nc-icon nc-favourite-28 text-primary"></i>
              </div>
              <div slot="content">
                <p class="card-category">배송 완료</p>
                <h4 class="card-title">{{ weeklyCompletedOrders }} 건</h4>
              </div>
              <div slot="footer">
                <i class="fa fa-refresh"></i>Updated now
              </div>
            </stats-card>
          </div>

        </div>
      </Card>

      <div class="row">
        <div class="col-md-8" v-if="isDataLoaded">
          <chart-card ref="salesChart" :chart-data="lineChart.data" :chart-options="lineChart.options"
            :responsive-options="lineChart.responsiveOptions">

            <template slot="header">
              <h4 class="card-title">매출 현황</h4>
              <p class="card-category">(단위: 만 원)</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> 총 매출
              </div>
              <hr>
              <!-- <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div> -->
            </template>
          </chart-card>
        </div>

        <div class="col-md-3">
          <card>
            <template slot="header">
              <h5 class="title">정산 요청 리스트</h5>
              <p class="category"></p>
            </template>
            <l-table :data="tableData.data" :columns="tableData.columns">
            </l-table>
            <div class="footer">
              <hr>
              <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </div>
          </card>

        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <chart-card :chart-data="barChartData" :chart-options="barChart.options"
            :responsive-options="barChart.responsiveOptions" chart-type="Bar" ref="customerOrdersChart">

            <template slot="header">
              <h4 class="card-title">고객별 주문 현황</h4>
              <p class="card-category"></p>
              <select v-model="selectedCustomerCode" class="form-control">
                <option disabled value="" selected>고객명</option>
                <option v-for="customer in customers" :key="customer.contactCode" :value="customer.contactCode">
                  {{ customer.contactName }}
                </option>
              </select>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> 주문 수
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-check"></i> Data information certified
              </div>
            </template>
          </chart-card>
        </div>

        <div class="col-md-4" v-if="selectedCustomerCode !== ''">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">정산 현황</h4>
              <p class="card-category">Last Campaign Performance</p>
            </div>
            <div class="card-body">
              <!-- Conditional rendering based on whether there are orders -->
              <chart-card v-if="!showNoOrdersMessage" ref="settlementChart" :chart-data="pieChart.data"
                chart-type="Pie">
                <template slot="footer">
                  <div class="legend">
                    <i class="fa fa-circle text-info"></i> 정산 완료
                    <i class="fa fa-circle text-danger"></i> 미정산
                    <i class="fa fa-circle text-warning"></i> 정산 요청
                  </div>
                  <hr>
                  <div class="stats">
                    <i class="fa fa-clock-o"></i> Campaign sent 2 days ago
                  </div>
                </template>
              </chart-card>
              <div v-else class="text-center">
                <h5>이번달 주문이 없습니다.</h5>
              </div>
            </div>
            <div class="card-footer">
              <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import ChartCard from 'src/components/Cards/ChartCard.vue'
import StatsCard from 'src/components/Cards/StatsCard.vue'
import LTable from 'src/components/Table.vue'
import Card from '../components/Cards/Card.vue'
import iconUp from 'src/assets/img/iconUp.png'
import iconDown from 'src/assets/img/iconDown.png'


export default {
  components: {
    LTable,
    ChartCard,
    StatsCard,
    Card
  },
  data() {
    return {
      iconUpSrc: iconUp,
      iconDownSrc: iconDown,
      currentIcon: iconUp,
      newMessage: '',
      messages: [],
      nextMessageId: 0,
      showOldMessages: false,
      question: '',
      answer: '',
      showNoOrdersMessage: false,
      isDataLoaded: false,
      customers: [],
      //selectedCustomerCode: null,
      selectedCustomerCode: '',
      barChartData: { labels: [], series: [] },
      weeklyReadyOrders: 0,
      weeklydeliveryOrders: 0,
      weeklyCompletedOrders: 0,
      weeklySales: 0,
      editTooltip: 'Edit Task',
      deleteTooltip: 'Remove',
      pieChart: {
        data: {
          labels: [],
          series: []
        }
      },
      lineChart: {
        data: {
          labels: [],
          series: []
        },
        options: {
          scales: {
            xAxes: [{
              ticks: {
                fontSize: 10, // Smaller font size
                fontColor: '#333', // Adjust color for better visibility
                fontStyle: 'bold' // Makes text bold
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: "단위: 만 원",
                fontStyle: 'bold'
              }
            }]
          },
          layout: {
            padding: {
              left: 20,  // Increase left padding to ensure y-axis labels are visible
              right: 20,
              top: 10,
              bottom: 10  // Adjust right padding if necessary
            }
          },
          showArea: false,
          height: '245px',
          axisX: {
            showGrid: false
          },
          lineSmooth: true,
          showLine: true,
          showPoint: true,
          fullWidth: true,
          chartPadding: {
            right: 50,
            left: 10  // Make sure to adjust this value to prevent y-axis label clipping
          }
        },
        responsiveOptions: [
          ['screen and (max-width: 640px)', {
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ]
      },
      barChart: {
        data: {
          labels: [],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
            [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
          ]
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: '245px'
        },
        responsiveOptions: [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc(value) {
                return value[0]
              }
            }
          }]
        ]
      },
      tableData: {
        columns: ['고객명', '정산 요청 금액'],
        data: []
      }
    }
  },
  watch: {
    selectedCustomerCode(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.fetchCustomerOrders(newValue);
        this.fetchCustomerSettlementData(newValue);
      }
    }
  },
  mounted() {
    this.fetchOrderList();
    this.fetchAdjustmentReqList();
    this.fetchMonthlySalesData();
    this.fetchCustomerList();
    this.$nextTick(() => {
      if (this.$refs.customerOrdersChart && this.$refs.customerOrdersChart.update) {
        this.$refs.customerOrdersChart.update();
      }
      if (this.$refs.settlementChart) {
        this.$refs.settlementChart.update();
      }
    });
  },
  computed: {
    visibleMessages() {
      return this.showOldMessages ? this.messages : this.messages.slice(-3);
    }
  },
  methods: {
    sendQuestion() {
      if (this.newMessage.trim() !== '') {
        this.messages.push({
          id: this.nextMessageId++,
          type: 'user',
          text: this.newMessage
        });
        // API 호출을 위해 현재 메시지 내용을 전달합니다.
        this.callAI(this.newMessage);
        this.newMessage = ''; // 입력 필드 초기화
      }
    },
    async callAI(message) {
      try {
        const response = await axios.post('http://localhost:8080/api/ask', { prompt: message });
        this.messages.push({
          id: this.nextMessageId++,
          type: 'ai',
          text: response.data
        });
      } catch (error) {
        console.error('Error asking question:', error);
        this.messages.push({
          id: this.nextMessageId++,
          type: 'ai',
          text: 'Failed to get an answer.'
        });
      }
    },
    toggleOldMessages() {
      this.showOldMessages = !this.showOldMessages;
      this.currentIcon = this.showOldMessages ? this.iconDownSrc : this.iconUpSrc;
    },
    async askQuestion() {
      try {
        const response = await axios.post('http://localhost:8080/api/ask', { prompt: this.question });
        this.answer = response.data;
      } catch (error) {
        console.error('Error asking question:', error);
        this.answer = 'Failed to get an answer.';
      }
    },
    fetchCustomerOrders(customerCode) {
      axios.get(`http://localhost:8080/api/orders/chart3/${customerCode}`)
        .then(response => {
          const labels = response.data.map(item => `${item.year.toString().slice(-2)}/${item.month.toString().padStart(2, '0')}`);
          const counts = response.data.map(item => item.count);  // Extract counts
          this.updateCustomerOrdersChart(labels, counts);
        })
        .catch(error => console.error('Error fetching customer orders:', error));
    },

    updateCustomerOrdersChart(labels, counts) {
      // Assuming the chart expects an array of series, and each series is an array of values.
      this.barChartData = {
        labels: labels,
        series: [counts]  // Encapsulate counts in an array if your chart expects a series array.
      };
      // Force reactivity if necessary
      this.isDataLoaded = true;
      this.$forceUpdate(); // Optionally force Vue to re-render this component
      this.$nextTick(() => {
        if (this.$refs.customerOrdersChart) {
          this.$refs.customerOrdersChart.update();  // Make sure the chart updates
        }
      });
    },
    fetchCustomerSettlementData(customerCode) {
      axios.get(`http://localhost:8080/api/orders/${customerCode}/count`)
        .then(response => {
          this.updatePieChartData(response.data);
        })
        .catch(error => {
          console.error('Error fetching settlement data:', error);
        });
    },
    updatePieChartData(data) {
      const total = data['정산 완료'] + data['미정산'] + data['정산 요청'];
      if (total === 0) {
        this.showNoOrdersMessage = true;
        this.pieChart.data.labels = [];
        this.pieChart.data.series = [];
      } else {
        this.showNoOrdersMessage = false;
        const percentages = [
          { value: (data['정산 완료'] / total * 100).toFixed(2), label: '정산 완료' },
          { value: (data['미정산'] / total * 100).toFixed(2), label: '미정산' },
          { value: (data['정산 요청'] / total * 100).toFixed(2), label: '정산 요청' }
        ];

        this.pieChart.data = {
          labels: percentages.map(item => `${item.value}%`),
          series: percentages.map(item => parseFloat(item.value))
        };
      }

      this.$nextTick(() => {
        if (this.$refs.settlementChart && !this.showNoOrdersMessage) {
          this.$refs.settlementChart.update();
        }
      });
    },

    fetchCustomerList() {
      const Google = localStorage.getItem("code");
      const Standard = sessionStorage.getItem("user");
      const businessId = '';
      if (Google.length) {
        businessId = Google;
      } else {
        businessId = Standard;
      }

      axios.get(`http://localhost:8080/api/orders/chart2/${businessId}`)
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
    async fetchMonthlySalesData() {
      try {
        const Google = localStorage.getItem("code");
        const Standard = sessionStorage.getItem("user");
        const businessId = '';
        if (Google.length) {
          businessId = Google;
        } else {
          businessId = Standard;
        }
        const response = await axios.get(`http://localhost:8080/api/orders/chart1/${businessId}`);
        const months = response.data.map(item => `${item.year.toString().slice(-2)}/${item.month.toString().padStart(2, '0')}`);
        const sales = response.data.map(item => item.price);
        this.updateSalesChart(months, sales);
      } catch (error) {
        console.error("Failed to fetch monthly sales data:", error);
      }
    },
    updateSalesChart(months, sales) {
      const minPrice = Math.min(...sales);
      const maxPrice = Math.max(...sales);

      // Scale the max price a bit higher for better visualization
      const maxChartValue = maxPrice + (maxPrice - minPrice) * 0.1;

      // Update the chart data
      this.lineChart.data.labels = months;
      this.lineChart.data.series = [sales];
      this.isDataLoaded = true;
      // Ensure the chart updates or redraws if necessary
      if (this.$refs.salesChart && this.$refs.salesChart.update) {
        this.$refs.salesChart.update();  // Call update if it is a function provided by the chart lib
      }

      this.lineChart.options.axisY = {
        low: minPrice,
        high: maxChartValue,
        onlyInteger: true,
        scaleMinSpace: 20
      };

      this.lineChart.options.scales.yAxes[0].scaleLabel.labelString = "단위: 만 원";

      this.isDataLoaded = true;
      this.$refs.salesChart.update();


    },
    fetchOrderList() {
      const Google = localStorage.getItem("code");
      const Standard = sessionStorage.getItem("user");
      const businessId = '';
      if (Google.length) {
        businessId = Google;
      } else {
        businessId = Standard;
      }
      axios.get(`http://localhost:8080/api/orders/id/${businessId}`)
        .then(response => {
          const data = response.data;
          const startOfWeek = new Date();
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1));
          startOfWeek.setHours(0, 0, 0, 0);

          let totalSales = 0;
          let completedOrders = 0;
          let deliveryOrders = 0;
          let readyOrders = 0;

          data.forEach(order => {
            const orderDate = new Date(order.orderDate);
            if (orderDate >= startOfWeek) {
              switch (order.orderStatus) {
                case '배송 완료':
                  completedOrders++;
                  totalSales += order.orderPrice; // 주문 상태가 '배송 완료'인 경우에 매출액을 더합니다.
                  break;
                case '배송 중':
                  deliveryOrders++;
                  break;
                case '출고 준비 중':
                  readyOrders++;
                  break;
              }
            }
          });

          this.weeklyCompletedOrders = completedOrders;
          this.weeklyReadyOrders = readyOrders;
          this.weeklydeliveryOrders = deliveryOrders;
          this.weeklySales = totalSales;
        })
        .catch(error => {
          console.error("Failed to fetch orders:", error);
        });
    },
    fetchAdjustmentReqList() {
      const Google = localStorage.getItem("code");
      const Standard = sessionStorage.getItem("user");
      const businessId = '';
      if (Google.length) {
        businessId = Google;
      } else {
        businessId = Standard;
      }
      axios.get(`http://localhost:8080/api/orders/request/${businessId}`)
        .then(response => {
          this.tableData.data = response.data.map(item => ({
            '고객명': item.contactName,
            '고객코드': item.contactCode,
            '정산 요청 금액': item.price
          }));
        })
        .catch(error => {
          console.error("Failed to fetch adjustment requests:", error);
        });
    }
    // continue with other methods...
  }
}
</script>
<style scoped>
.chat-window {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  padding: 10px;
  height: auto;
  overflow-y: auto;
}

.btn-div {
  display: flex;
  justify-content: center;
  max-height: 10px;
}

/* .btn-secondary {
  background-color: transparent;
  border: none;
  color: #333;
  display: inline-block;
  padding: 8px;
  cursor: pointer;
} */

.btn-secondary:hover {
  background-color: #bbb;
  /* 마우스 오버 시 배경색 변경 */
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: auto;
  margin-top: 30px;
  align-items: flex-start;
}

.message {
  align-self: flex-start;
  margin-bottom: 5px;
  /*min-height: 40px;  최소 높이 설정 */
  align-items: center;
  /* 세로 중앙 정렬 */
  padding: 10px 20px 10px 20px;
  /*내부 패딩 설정 */
  border-radius: 15px;
  /* 테두리 둥글게 설정 */
  background-color: white;
  /* 메시지 배경색 설정 */
  display: inline-block;
}

.user-msg {
  align-self: flex-end;
  text-align: right;
  /*color: blue;
  background-color: #e0ecff; /* 사용자 메시지 배경색 */

}

.ai-msg {
  justify-content: flex-start;
  text-align: left;
  /*color: green;
  background-color: #e7ffe7; /* AI 메시지 배경색 */
}

.input-area {
  display: flex;
  margin-top: 10px;
  margin-bottom: 20px;
}

.input-field {
  flex-grow: 1;
  margin-right: 5px;
}

input {
  border-color: #c2c0c0;
  border-radius: 16px;
  border-width: 1px;
  padding: 6px 0px 6px 10px;
  margin-right: 10%;
  margin-left: 10%;
  width: 70%;
  float: left;
}

.btn-div {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* 추가: 버튼을 컨테이너의 맨 위로 정렬 */
  margin-top: -20px;
  /* 조정: 필요한 경우 마진을 조정하여 버튼의 위치를 더 상단으로 조정 */
  padding-top: 0;
  /* 조정: 패딩을 줄여 버튼과 상단 경계 사이의 공간을 줄임 */
  width: 100%;
  /* 확실히 버튼이 가로로 전체 너비를 차지하지 않도록 설정 */

}

.iconBtn {
  background-color: transparent;
  height: 10%;
}

.iconBtnUp {
  height: 20px;
}
</style>
