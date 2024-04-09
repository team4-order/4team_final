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
            warehouseA: '',
            customerA: '',
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
        async fetchSContacts() {
            const orderNumber = '2'; // 주문 번호를 설정합니다

            try {
                const response = await axios.get(`http://localhost:8080/api/orders/id/BUS002/${orderNumber}`);
                const storageContact = response.data.storageContact;
                if (storageContact) {
                    this.warehouseName = storageContact.contactName;
                    this.warehouseA = storageContact.contactAddress;
                    this.Deliveries.data = [
                        { label: '창고 이름', value: storageContact.contactName },
                        { label: '창고 연락처', value: storageContact.customerPhone },
                        { label: '창고 주소', value: storageContact.contactAddress }
                    ];
                    this.fetchCoordinates(); // 올바르게 주소가 설정되었을 때 좌표를 가져옵니다.
                } else {
                    console.error("창고 정보를 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("거래처 목록을 가져오는 데 실패했습니다.", error);
            }
        },
        async fetchContacts() {
            const orderNumber = '2'; // 주문 번호를 설정합니다

            try {
                const response = await axios.get(`http://localhost:8080/api/orders/id/BUS002/${orderNumber}`);
                const customerContact = response.data.customerContact;
                if (customerContact) {
                    this.customerName = customerContact.contactName;
                    this.customerA = customerContact.contactAddress;
                    this.Customers.data = [
                        { label: '고객 이름', value: customerContact.contactName },
                        { label: '고객 연락처', value: customerContact.customerPhone },
                        { label: '고객 주소', value: customerContact.contactAddress }
                    ];
                } else {
                    console.error("판매처 정보를 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("판매처 목록을 가져오는 데 실패했습니다.", error);
            }
        },
        async fetchCoordinates() {
            const warehouseItem = warehouseA;
            const customerItem = this.customerA;
            console.log(this.warehouseItem);
            console.log(this.Deliveries.data)

            
            if (warehouseItem && customerItem) { // 주소 데이터가 올바르게 설정되었는지 확인합니다.
                const warehouseAddress = warehouseItem.value;
                const customerAddress = customerItem.value;

                const warehouseCoordinates = await this.getCoordinates(warehouseAddress);
                const customerCoordinates = await this.getCoordinates(customerAddress);

                this.$emit('coordinates-fetched', { warehouseCoordinates, customerCoordinates });
            } else {
                console.error('주소 데이터가 올바르게 설정되지 않았습니다.');
            }
        },
        async getCoordinates(address) {
            try {
                const response = await axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(address)}`, {
                    headers: {
                        Authorization: 'KakaoAK f74e4f598452c26325500e84e020e0fc',
                    },
                });
                return {
                    latitude: response.data.documents[0].y,
                    longitude: response.data.documents[0].x,
                };
            } catch (error) {
                console.error('Failed to fetch coordinates:', error);
                return null;
            }
        },
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