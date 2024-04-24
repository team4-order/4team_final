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
    <!-- 데이터가 준비되었는지 확인하고 map 컴포넌트 렌더링 -->
    <!-- <map v-if="dataReady" :warehouse-address="warehouseAddress" :customer-address="customerAddress"></map> -->
  </div>
</template>

<script>
import Card from 'src/components/Cards/Card.vue';
import Map from 'src/pages/Maps.vue';
import axios from 'axios';

export default {
  components: {
    Card,
    Map
  },
  data() {
    return {
      mutableBusinessId: '',
      warehouseName: '',
      warehousePhone: '',
      warehouseAddress: '',
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      dataReady: false // 데이터 준비 완료 상태
    };
  },
  mounted() {
    const storedId = localStorage.getItem("code") || sessionStorage.getItem("user");
    this.mutableBusinessId = storedId;
    this.fetchData();
  },
  methods: {
    async fetchData() {

      try {
        const response = await axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/orders/id/${this.mutableBusinessId}/${this.$route.params.orderNumber}`);
        const storageContact = response.data.storageContact;
        const customerContact = response.data.customerContact;
        
        if (storageContact && customerContact) {
          this.warehouseName = storageContact.contactName;
          this.warehousePhone = storageContact.customerPhone;
          this.warehouseAddress = storageContact.contactAddress;
          this.customerName = customerContact.contactName;
          this.customerPhone = customerContact.customerPhone;
          this.customerAddress = customerContact.contactAddress;

          // 데이터가 올바르게 할당되었는지 콘솔에 로그 출력
          // console.log('Warehouse Address:', this.warehouseAddress);
          // console.log('Customer Address:', this.customerAddress);

          this.dataReady = true; // 데이터 로딩 완료
        } else {
          console.error("데이터를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("데이터를 가져오는 데 실패했습니다.", error);
      }
    }
  }
};
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}

.table-hover.table-striped {
  cursor: pointer;
}

.card-plain {
  margin-top: -14px;
}
</style>