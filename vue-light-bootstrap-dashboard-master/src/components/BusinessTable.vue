<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column">{{ column }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index" @click="handleRowClick(item)">
        <td v-for="column in columns" :key="column">
          {{ itemValue(item, column) }}
        </td>
        <td v-if="itemValue(item, '주문 상태').toLowerCase() === '주문 완료'">
          <button class="btn btn-info btn-fill" @click="handleBtnClick(item)">배송 신청</button>
        </td>
        <td v-else></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'l-table3',
  props: {
    columns: Array,
    data: Array
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== undefined;
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
    handleRowClick(item) {
      this.$emit('row-click', item); // Emitting the row-click event with the clicked item as payload
    },
    handleBtnClick(item) {
      // 배송 신청 버튼을 클릭할 때 주문 번호를 가져와서 URL을 구성하여 페이지를 이동합니다.
      const orderNumber = item['주문 번호'];
      // 주문 상세 페이지 URL로 이동하면서 query 파라미터로 주문 번호를 전달합니다.
      this.$router.push({
        path: `/admin/maps/${orderNumber}`
      });
    }
  }
};
</script>
