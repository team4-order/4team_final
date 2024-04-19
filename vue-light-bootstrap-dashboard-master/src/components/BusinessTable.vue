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
          <button class="btn btn-info btn-fill">배송 신청</button>
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
    }
  }
};
</script>
