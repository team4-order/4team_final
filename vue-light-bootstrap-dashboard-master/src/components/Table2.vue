<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column">{{ column }}</th>
        <th>배송 완료 처리</th> <!-- Additional header for the buttons column -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index" @click="handleRowClick(item)">
        <td v-for="column in columns" :key="column">
          {{ itemValue(item, column) }}
        </td>
        <td v-if="itemValue(item, '배송 상태').toLowerCase() === '배송 중'">
          <button class="btn btn-info btn-fill" @click.stop="completeDelivery(item)">배송 완료</button>
        </td>
        <td v-else>&nbsp;</td> <!-- Use non-breaking space to ensure the cell is not collapsed -->
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from 'axios';

axios.defaults.withCredentials = true;
export default {
  name: 'l-table3',
  props: {
    columns: Array,
    data: Array
  },
  methods: {
    completeDelivery(item) {
      axios.post(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/deliveries/${item['주문 번호']}/complete`)
  .then(_response => {
    alert("배송 완료 처리 되었습니다.");
    item['배송 상태'] = '배송 완료'; // Update the UI
    this.$emit('delivery-updated'); // Notify parent components
  })
  .catch(error => {
    console.error("배송 완료 처리에 실패했습니다.", error);
    alert("배송 완료 처리에 실패했습니다.");
  });
  },
    hasValue(item, column) {
      return item[column.toLowerCase()] !== undefined; // 수정된 부분
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
    handleRowClick(item) {
      this.$emit('row-click', item);
    }
  }
};
</script>

<style>
.btn1{
  border-radius: 20px;
  background-color: aliceblue;
  border-color: aliceblue;
  border-style: 0px;
}
</style>
