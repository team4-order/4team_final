<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <card class="card-plain">
                        <template slot="header">
                            <h4 class="card-title">출고되는 창고 주소</h4>
                            <p class="card-category">{{ warehouseName }}</p> <!-- 창고 코드를 표시합니다 -->
                        </template>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <tbody>
                                    <tr v-for="(item, index) in Deliveries.data" :key="index">
                                        <th scope="row">{{ item.label }}</th>
                                        <td>{{ item.value }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </card>
                </div>

                <div class="col-12">
                  <card class="card-plain">
                    <template slot="header">
                      <h4 class="card-title">도착하는 판매처 주소</h4>
                      <p class="card-category">{{ customerName }}</p>
                    </template>
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <tbody>
                            <tr v-for="(item, index) in Customers.data" :key="index">
                                <th scope="row">{{ item.label }}</th>
                                <td>{{ item.value }}</td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                  </card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Card from 'src/components/Cards/Card.vue'
import axios from 'axios'

export default {
    components: {
        Card
    },
    data() {
        return {
            warehouseName: '', // 창고 코드를 저장할 변수
            customerName: '',
            Deliveries: {
                data: []
            },
            Customers:{
                data: []
            }
        }
    },
    mounted() {
        this.fetchSContacts();
        this.fetchContacts();
    },
    methods: {
        fetchSContacts() {
            const orderNumber = '2'; // 주문 번호를 설정합니다

            axios.get(`http://localhost:8080/api/orders/id/BUS002/${orderNumber}`)
                .then(response => {
                    // 응답 데이터에서 창고 정보를 가정하고 추출합니다
                    const storageContact = response.data.storageContact;
                    if (storageContact) {
                        // 창고 코드를 설정합니다
                        this.warehouseName = storageContact.contactName; // 실제 데이터에 맞게 키를 변경해야 할 수도 있습니다
                        // 연락처 정보를 설정합니다
                        this.Deliveries.data = [
                            { label: '창고 이름', value: storageContact.contactName },
                            { label: '창고 연락처', value: storageContact.customerPhone },
                            { label: '창고 주소', value: storageContact.contactAddress }
                        ];
                    } else {
                        console.error("창고 정보를 가져오는 데 실패했습니다.");
                    }
                })
                .catch(error => {
                    console.error("거래처 목록을 가져오는 데 실패했습니다.", error);
                });
        },
        fetchContacts() {
          const orderNumber = '2'; // 주문 번호를 설정합니다

          axios.get(`http://localhost:8080/api/orders/id/BUS002/${orderNumber}`)
              .then(response => {
                  // 응답 데이터에서 판매처 정보를 추출합니다
                  const customerContact = response.data.customerContact;
                  if (customerContact) {
                      this.customerName = customerContact.contactName;
                      // 판매처 정보를 설정합니다
                      this.Customers.data = [
                          { label: '고객 이름', value: customerContact.contactName },
                          { label: '고객 연락처', value: customerContact.customerPhone },
                          { label: '고객 주소', value: customerContact.contactAddress }
                      ];
                  } else {
                      console.error("판매처 정보를 가져오는 데 실패했습니다.");
                  }
              })
              .catch(error => {
                  console.error("판매처 목록을 가져오는 데 실패했습니다.", error);
              });
        }
    }
}
</script>

<style scoped>
.search-bar {
    margin-bottom: 20px;
}

.table-hover.table-striped {
    cursor: pointer;
}
</style>
