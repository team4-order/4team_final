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

            <input type="text" v-model="searchQuery" placeholder="상품명 검색" class="form-control"/>
            <l-table class="table-hover table-striped" :columns="goodsList.columns" :data="filteredData"
            :editable="true"
            @update-total="updateTotalAmount">
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
        columns: ['상품명', '상품 등급', '주문 가능 수량', '가격', '입력 필드', '금액'],
        data: [],
        filteredData: []
      },
      dropdownTitle: 'Select Storage Code',
      totalAmount: 0
    };
  },
  computed: {
    // 검색된 데이터를 계산된 속성으로 필터링
    filteredData() {
      return this.goodsList.data.filter(goods => {
        return goods['상품명'].toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    totalAmount() {
    return this.goodsList.data.reduce((acc, goods) => {
      return acc + (goods['가격'] * goods['입력 필드'].value);
    }, 0);
  }
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
    updateTotalAmount(amount) {
    this.totalAmount = amount;
  },
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
              '상품명': goods.goodsName,
              '상품 등급': goods.goodsGrade,
              '주문 가능 수량': goods.totalQuantity,
              '가격': Math.ceil(goods.inputPrice * (100 + goods.marginRate) / 100),
              '입력 필드': 0,
              '금액' : 0
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
      customerCode: "CON001", 
      storageCode: this.selectedStorageCode,
      orderPrice: this.totalAmount, 
      adjustmentStatus: "미정산"
    };
    axios.post('/api/orders/post', orderData)
      .then(response => {
        console.log('Order created!', response.data);
        const createdOrderNumber = response.data.orderNumber;
        console.log(createdOrderNumber);

        const nonZeroItems = this.goodsList.data.filter(item => item['입력 필드'] > 0);

        nonZeroItems.forEach(item => {
        const orderProductData = {
          orderNumber: createdOrderNumber,
          goodsCode: item['상품 코드'],
          goodsGrade: item['상품 등급'],
          orderQuantity: item['입력 필드'],
          orderPrice: item['금액'] 
        };
        axios.post('/api/order/detail/post', orderProductData)
          .then(res => {
            console.log('Item added with the order number', res.data);
          })
          .catch(err => {
            console.error('Error posting item:', err);
          });
      });
    })
    .catch(error => {
      console.error('Error creating order:', error);
    });
  }

  }
};
</script>

<style scoped>
.dropdown .dropdown-toggle {
  cursor: pointer;
}
.total-amount h4 {
  margin-top: 20px;
  font-weight: bold;
}

.table tbody tr:last-child td {
  font-weight: bold;
}
</style>