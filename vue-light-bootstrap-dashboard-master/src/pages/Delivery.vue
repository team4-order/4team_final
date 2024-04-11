<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <!-- 출고되는 창고 주소 -->
                <div class="col-6">
                    <card class="card-plain">
                        <template slot="header">
                            <h4 class="card-title">출고지</h4>
                            <p class="card-category">{{ warehouseName }}</p>
                        </template>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <tbody>
                                    <tr>
                                        <th scope="row">창고 이름</th>
                                        <td>{{ warehouseName }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">창고 연락처</th>
                                        <td>{{ warehousePhone }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">창고 주소</th>
                                        <td>{{ warehouseAddress }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </card>
                </div>
                <!-- 도착하는 판매처 주소 -->
                <div class="col-6">
                    <card class="card-plain">
                        <template slot="header">
                            <h4 class="card-title">도착지</h4>
                            <p class="card-category">{{ customerName }}</p>
                        </template>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <tbody>
                                    <tr>
                                        <th scope="row">고객 이름</th>
                                        <td>{{ customerName }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">고객 연락처</th>
                                        <td>{{ customerPhone }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">고객 주소</th>
                                        <td>{{ customerAddress }}</td>
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
            warehouseName: '', // 출고되는 창고 이름을 저장할 변수
            warehousePhone: '', // 출고되는 창고 연락처를 저장할 변수
            warehouseAddress: '', // 출고되는 창고 주소를 저장할 변수
            customerName: '', // 도착하는 판매처 이름을 저장할 변수
            customerPhone: '', // 도착하는 판매처 연락처를 저장할 변수
            customerAddress: '', // 도착하는 판매처 주소를 저장할 변수
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const orderNumber = '2'; // 주문 번호를 설정

            try {
                const response = await axios.get(`http://localhost:8080/api/orders/id/BUS002/${orderNumber}`);
                const storageContact = response.data.storageContact;
                const customerContact = response.data.customerContact;
                
                if (storageContact && customerContact) {
                    this.warehouseName = storageContact.contactName;
                    this.warehousePhone = storageContact.customerPhone;
                    this.warehouseAddress = storageContact.contactAddress;
                    this.customerName = customerContact.contactName;
                    this.customerPhone = customerContact.customerPhone;
                    this.customerAddress = customerContact.contactAddress;
                } else {
                    console.error("데이터를 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("데이터를 가져오는 데 실패했습니다.", error);
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