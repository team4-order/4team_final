<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card class="strpied-tabled-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">주문 등록</h4>
              <p class="card-category">apply</p>
              <button @click="submitOrder" class="btn btn-info btn-fill float-right">submit</button>
              <!-- <button @click="saveOrderChanges"></button> -->
            </template>

            <base-dropdown :initial-title="dropdownTitle" ref="dropdown">
              <template v-slot:default>
                <a v-for="code in storageCodes" :key="code" class="dropdown-item" @click="selectStorageCode(code)">
                  {{ code }}
                </a>
              </template>
            </base-dropdown>
            <l-table class="table-hover table-striped" :columns="goodsList.columns" :data="goodsList.data"
              :editable="true">
            </l-table>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LTable from 'src/components/InputTable.vue';
import Card from 'src/components/Cards/Card.vue';
import BaseDropdown from 'src/components/OrderBaseDropdown.vue';

export default {
  components: {
    LTable,
    Card,
    BaseDropdown
  },
  data() {
    return {
      searchQuery: '',
      storageCodes: [],
      selectedStorageCode: '',
      goodsList: {
        columns: ['상품 코드', '상품 등급', '주문 가능 수량', '입력 필드'],
        data: [],
        filteredData: []
      },
      dropdownTitle: 'Select Storage Code'
    };
  },
  watch: {
    selectedStorageCode(newVal) {
      if (newVal !== '') {
        this.fetchGoodsList(newVal);
      }
    }
  },
  mounted() {
    this.fetchOrderList();
  },
  methods: {
    selectStorageCode(code) {
      this.selectedStorageCode = code;
      this.dropdownTitle = code; // 드롭다운 타이틀 업데이트
      this.fetchGoodsList(code);
      this.closeDropdown(); // 드롭다운 닫기
    },
    closeDropdown() {
      if (this.$refs.dropdown) {
        this.$refs.dropdown.closeDropDown();
      }
    },
    fetchOrderList() {
      const customerCode = this.$route.params.customerCode;
      axios.get(`http://localhost:8080/api/storage/${customerCode}`)
        .then(response => {
          this.storageCodes = response.data.map(item => item.storageCode);
        })
        .catch(error => {
          console.error("There was an error fetching the order list:", error);
        });
    },
    fetchGoodsList(storageCode) {
      axios.get(`http://localhost:8080/api/total/storage/${storageCode}`)
        .then(response => {
          this.goodsList.data = response.data.map(goods => {
            return {
              '상품 코드': goods.goodsCode,
              '상품 등급': goods.goodsGrade,
              '주문 가능 수량': goods.totalQuantity,
              '입력 필드': 0
            };
          }); // API 응답으로 받은 제품 리스트를 저장
        })
        .catch(error => {
          console.error(`There was an error fetching the goods list for storageCode ${storageCode}:`, error);
        });
    },
    submitOrder() {
      //const customerCode = this.$route.params.customerCode;
    const orderData = {
      customerCode: "CON001", // 이 값은 사용자 선택 또는 다른 로직을 통해 설정되어야 합니다.
      storageCode: this.selectedStorageCode,
      orderPrice: 0, // 예시 값, 실제로는 사용자 입력 또는 계산을 통해 결정될 수 있습니다.
      adjustmentStatus: "미정산" // 기본값 설정 예시, 백엔드에서도 설정할 수 있습니다.
    };
    axios.post('/api/orders/post', orderData)
      .then(response => {
        console.log('Order created!', response.data);
        // 주문 생성 후 필요한 작업 수행, 예: 사용자에게 성공 메시지 표시
        const createdOrderNumber = response.data.orderNumber;
      
      // 두 번째 POST 요청 - 다른 테이블에 데이터 추가
      // 이때, 첫 번째 요청으로부터 받은 orderNumber를 사용합니다.
      const orderProduct = {
        orderNumber: createdOrderNumber,
        // 다른 필요한 데이터 필드...
      };
      return axios.post('/api/order/detail/post', orderProduct); // 두 번째 요청 실행
    })
    .then(response => {
      // 두 번째 요청의 응답 처리
      console.log('Data added to another table with the order number', response.data);
    })
      .catch(error => {
        console.error('Error creating order:', error);
        // 오류 처리, 예: 사용자에게 오류 메시지 표시
      });
  }

  }
};
</script>

<style scoped>
.dropdown .dropdown-toggle {
  cursor: pointer;
}
</style>