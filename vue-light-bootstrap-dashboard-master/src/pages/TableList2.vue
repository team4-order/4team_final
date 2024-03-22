<template>
  <div class="order-list">
    <h2>Order List</h2>
    <ul>
      <li v-for="(order, index) in orders" :key="index">
        <p>주문 번호: {{ order['주문 번호'] }}</p>
        <p>주문 가격: {{ order['주문 가격'] }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: []
    };
  },
  mounted() {
    // API 엔드포인트 URL 생성
    const apiUrl = `http://localhost:8080/api/orders/customer/${this.$route.params.customerCode}`;
    
    // API에서 주문 목록을 가져와서 orders 배열에 할당
    axios.get(apiUrl)
      .then(response => {
        console.log('orders: ', response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>