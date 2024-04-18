<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          
            <template slot="header">
              <h4 class="card-title">주문 등록</h4>
              <p class="card-category">apply</p>
              <button @click="submitOrder" class="btn btn-info btn-fill float-right">submit</button>
              <!-- <button @click="saveOrderChanges"></button> -->
            </template>

            <select v-model="selectedStorageCode">
      <option disabled value="">Please select one</option>
      <option v-for="code in storageCodes" :key="code" :value="code">{{ code }}</option>
    </select>

            <input type="text" v-model="searchQuery" placeholder="상품명 검색" class="form-control"/>
            <l-table class="table-hover table-striped"
         :columns="goodsList.columns"
         :data="goodsList.data"
         :search-query="searchQuery"
         :editable="true"
         @update-total="updateTotalAmount"
         @add-row="makeRowPermanent">
</l-table>

            



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
        columns: ['상품명', '상품 등급', '주문 가능 수량', '가격(BOX)', '주문 수량', '금액(원)', '  '],
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
        this.goodsList.data = response.data.map(goods => ({
          ...goods,
          visible: false, // Initially, rows are not visible
          '상품 코드': goods.goodsCode,
          '상품명': goods.goodsName,
          '상품 등급': goods.goodsGrade,
          '주문 가능 수량': goods.totalQuantity,
          '가격(BOX)': Math.ceil(goods.inputPrice * (100 + goods.marginRate) / 100),
          '주문 수량': 0,
          '금액(원)' : 0
        }));
      })
      .catch(error => {
        console.error(`There was an error fetching the goods list for storageCode ${storageCode}:`, error);
      });
  },
  makeRowPermanent(goodsCode) {
    const item = this.goodsList.data.find(item => item['상품 코드'] === goodsCode);
    if (item) item.visible = true;
  },
    submitOrder() {
      if (this.totalAmount <= 0) {
    window.alert("총 금액이 0원입니다. 주문을 등록할 수 없습니다.");
    return;
  }
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

        const nonZeroItems = this.goodsList.data.filter(item => item['주문 수량'] > 0);

        nonZeroItems.forEach(item => {
        const orderProductData = {
          orderNumber: createdOrderNumber,
          goodsCode: item['상품 코드'],
          goodsGrade: item['상품 등급'],
          orderQuantity: item['주문 수량'],
          orderPrice: item['금액(원)'] 
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