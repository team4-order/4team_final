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
  },
  watch: {
    // 'data' 배열의 각 항목을 감시합니다. deep: true 옵션으로 객체 내부까지 감시합니다.
    'data': {
      handler: function (newData) {
        newData.forEach((item) => {
          if (item['입력 필드'] < 0) {
            item['입력 필드'] = 0; // 값이 0보다 작으면 0으로 설정
          } else if (item['입력 필드'] > item['주문 가능 수량']) {
            item['입력 필드'] = item['주문 가능 수량']; // 입력 값이 주문 가능 수량을 초과하면 주문 가능 수량으로 설정
          }
        });
      },
      deep: true,
      immediate: true // 컴포넌트가 마운트될 때 감시자가 즉시 실행되도록 설정
    }
  }
};
</script>