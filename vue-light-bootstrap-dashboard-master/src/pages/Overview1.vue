<template>
  <div class="content">
    <div class="container-fluid">
      <Card>
        <h5>주간 데이터</h5>
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
        <div class="col-md-6">
          <chart-card :chart-data="barChartData" :chart-options="barChart.options"
            :responsive-options="barChart.responsiveOptions" chart-type="Bar" ref="customerOrdersChart">

            <template slot="header">
              <h4 class="card-title">고객별 주문 현황</h4>
              <p class="card-category"></p>
              <select v-model="selectedCustomerCode" class="form-control">
                <option disabled value="">고객명</option>
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

        <div class="col-md-4">
          <chart-card :chart-data="pieChart.data" chart-type="Pie">
            <template slot="header">
              <h4 class="card-title">Email Statistics</h4>
              <p class="card-category">Last Campaign Performance</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Open
                <i class="fa fa-circle text-danger"></i> Bounce
                <i class="fa fa-circle text-warning"></i> Unsubscribe
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-clock-o"></i> Campaign sent 2 days ago
              </div>
            </template>
          </chart-card>
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

export default {
  components: {
    LTable,
    ChartCard,
    StatsCard,
    Card
  },
  data() {
    return {
      isDataLoaded: false,
      customers: [],
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
          labels: ['40%', '20%', '40%'],
          series: [40, 20, 40]
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
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
    selectedCustomerCode(newCode, oldCode) {
      if (newCode && newCode !== oldCode) {
        this.fetchCustomerOrders(newCode);
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
  });
  },
  methods: {
    fetchCustomerOrders(customerCode) {
      axios.get(`http://localhost:8080/api/orders/chart3/${customerCode}`)
        .then(response => {
          const labels = response.data.map(item => `${item.year.toString().slice(-2)}-${item.month.toString().padStart(2, '0')}`);
          const series = response.data.map(item => item.count);
          this.updateCustomerOrdersChart(labels, series);
        })
        .catch(error => console.error('Error fetching customer orders:', error));
    },
    updateCustomerOrdersChart(labels, series) {
      this.barChartData = { labels: labels, series: [series] }; // Update the whole object to ensure reactivity
      this.isDataLoaded = true; // This will trigger any v-if in your template that depends on the chart data
      this.$nextTick(() => {
        if (this.$refs.customerOrdersChart) {
          this.$refs.customerOrdersChart.update();  // Assuming your chart component exposes an `update` method
        }
      });
    },
    fetchCustomerList() {
      const businessId = this.$route.params.businessId;
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
        const businessId = this.$route.params.businessId;
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
      const businessId = this.$route.params.businessId;
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
      const businessId = this.$route.params.businessId;
      axios.get(`http://localhost:8080/api/orders/req/${businessId}`)
        .then(response => {
          this.tableData.data = response.data.map(item => ({
            '고객명': item.contactName,
            '고객코드': item.contactCode
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
<style></style>
