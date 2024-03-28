<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column">{{ column }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td v-for="column in columns" :key="column">
          <template v-if="column === '입력 필드'">
            <!-- 입력 필드인 경우 input 태그를 렌더링합니다. -->
            <input type="number" v-model="item[column]" />
          </template>
          <template v-else>
            <!-- 그 외의 경우는 일반 텍스트를 렌더링합니다. -->
            {{ item[column] }}
          </template>
        </td>
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
  }
};
</script>