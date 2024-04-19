<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card2>
            <template slot="header">
              <h4 class="card-title">주문 등록</h4>
              <p class="card-category">apply</p>
              <button @click="submitOrder" class="btn btn-info btn-fill float-right">submit</button>
              <!-- <button @click="saveOrderChanges"></button> -->
            </template>

            <select v-model="selectedStorageCode" class="form-control">
              <option disabled value="">창고 선택</option>
              <option v-for="code in storageCodes" :value="code" :key="code">
                {{ code }}
              </option>
            </select>

            <input type="text" v-model="searchQuery" placeholder="상품명 검색" class="form-control" />
            <l-table1 class="table-hover table-striped" :columns="goodsList.columns" :data="goodsList.data"
              :search-query="searchQuery" :editable="true" @update-total="updateTotalAmount"
              @add-row="makeRowPermanent">
            </l-table1>



</card2>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LTable1 from 'src/components/InputTable.vue';
import Card2 from 'src/components/Cards/Card2.vue';
import BaseDropdown from 'src/components/OrderBaseDropdown.vue';

export default {
  components: {
    LTable1,
    Card2,
    BaseDropdown
  },
  data() {
    return {
      searchQuery: '',
      storageCodes: [],
      selectedStorageCode: '',
      goodsList: {
        columns: ['상품명', '상품 등급', '주문 가능 수량', '가격(BOX)', '주문 수량', '금액(원)'],
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
        return acc + (goods['가격(BOX)'] * goods['주문 수량'].value);
      }, 0);
    }
  },
  watch: {
    selectedStorageCode(newVal) {
      if (newVal !== '') {
        this.fetchGoodsList(newVal);
      }
    },
    searchQuery() {
    this.updateVisibilityAndOrder();
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
          this.goodsList.data = response.data.map((goods, index) => ({
            ...goods,
            visible: false,
            originalIndex: index,
            '상품 코드': goods.goodsCode,
            '상품명': goods.goodsName,
            '상품 등급': goods.goodsGrade,
            '주문 가능 수량': goods.totalQuantity,
            '가격(BOX)': Math.ceil(goods.inputPrice * (100 + goods.marginRate) / 100),
            '주문 수량': 0,
            '금액(원)': 0
          }));
          this.updateVisibilityAndOrder();
        })
        .catch(error => {
          console.error(`There was an error fetching the goods list for storageCode ${storageCode}:`, error);
        });
    },
    makeRowPermanent(goodsCode, goodsGrade) {
  // 먼저 상품 코드에 해당하는 항목을 찾습니다.
  const itemIndex = this.goodsList.data.findIndex(item => 
    item['상품 코드'] === goodsCode && item['상품 등급'] === goodsGrade
  );
  if (itemIndex > -1) {
    const item = this.goodsList.data[itemIndex];
    console.log(item);
    if (!item.visible) { // 항목이 현재 보이지 않는 상태일 때만 처리
      item.visible = true; // 항목을 보이게 설정
      this.goodsList.data.splice(itemIndex, 1); // 원래 위치에서 항목 제거
      this.goodsList.data.unshift(item); // 배열의 시작 부분에 항목 추가
    }
  }
},
submitOrder() {
  if (this.totalAmount <= 0) {
    window.alert("총 금액이 0원입니다. 주문을 등록할 수 없습니다.");
    return;
  }
  const orderData = {
    customerCode: "CON001",
    storageCode: this.selectedStorageCode,
    orderPrice: this.totalAmount,
    adjustmentStatus: "미정산",
    orderStatus: "주문 완료"
  };
  axios.post('http://localhost:8080/api/orders/post', orderData)
    .then(response => {
      console.log('Order created!', response.data);
      const createdOrderNumber = response.data.orderNumber;
      console.log(createdOrderNumber);

      const nonZeroItems = this.goodsList.data.filter(item => item['주문 수량'] > 0);
      const orderDetailsPromises = nonZeroItems.map(item => {
        const orderProductData = {
          orderNumber: createdOrderNumber,
          goodsCode: item['상품 코드'],
          goodsGrade: item['상품 등급'],
          orderQuantity: item['주문 수량'],
          orderPrice: item['금액(원)']
        };
        return axios.post('http://localhost:8080/api/order/detail/post', orderProductData);
      });

      // Wait for all order detail posts to be successful
      Promise.all(orderDetailsPromises)
        .then(results => {
          window.alert("주문이 완료되었습니다.");
          const customerCode = this.$route.params.customerCode; // Make sure customerCode is correctly sourced
          this.$router.push(`/status/${customerCode}`); // Redirect after successful order
        })
        .catch(err => {
          console.error('Error posting order details:', err);
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