<template>
  <table class="table">
    <thead>
      <slot name="columns">
        <tr>
          <th v-for="column in columns" :key="column">{{ column }}</th>
        </tr>
      </slot>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index" @click="handleRowClick(item)">
        <slot :row="item">
          <td v-for="column in columns" :key="column" v-if="hasValue(item, column)">{{ itemValue(item, column) }}</td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'l-table',
  props: {
    columns: Array,
    data: Array
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== 'undefined';
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

<style>
</style>