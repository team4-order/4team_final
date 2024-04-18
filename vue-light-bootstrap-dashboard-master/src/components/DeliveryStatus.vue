<template>
  <div>
    <h1>배송 현황</h1>
    <table>
      <thead>
      <tr>
        <th>배송 번호</th>
        <th>배송 주소</th>
        <th>도착 예정일</th>
        <th>주문 번호</th>
        <th>상품 코드</th>
        <th>상품 이름</th>
        <th>거래처 이름</th>
        <th>배송 상태</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="delivery in deliveries" :key="delivery.deliveryNumber">
        <td>{{ delivery.deliveryNumber }}</td>
        <td>{{ delivery.deliveryAddress }}</td>
        <td>{{ delivery.deliveryArrive }}</td>
        <td>{{ delivery.orderNumber }}</td>
        <td>{{ delivery.goodsCode }}</td>
        <td>{{ delivery.goodsName }}</td>
        <td>{{ delivery.contactName }}</td>
        <td>{{ getDeliveryStatus(delivery) }}</td>

      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DeliveryPage',
  data() {
    return {
      deliveries: []
    };
  },
  mounted() {
    this.fetchDeliveries();
  },
  methods: {
    fetchDeliveries() {
      axios.get('http://localhost:8080/api/deliveries/details')
        .then(response => {
          this.deliveries = response.data;
        })
        .catch(error => console.error("There was an error fetching the deliveries:", error));
    },

    getDeliveryStatus(delivery) {
      const now = new Date();
      const deliveryArrive = new Date(delivery.deliveryArrive);
      const deliveryDate = new Date(delivery.deliveryDate);

      if (now > deliveryArrive) {
        return '배송 완료';
      } else if (now < deliveryDate) {
        return '배송 준비중';
      } else {
        return '배송 중';
      }
    }
  }
}
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
