<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column">{{ column }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in filteredAndVisibleData" :key="index">
        <td v-for="column in columns" :key="column">
          <template v-if="column === '주문 수량'">
            <!-- 입력 필드인 경우 input 태그를 렌더링합니다. -->
            <input type="number" v-model="item[column]" @input="updateAmount(item)" />
          </template>
          <template v-else>
            <!-- 그 외의 경우는 일반 텍스트를 렌더링합니다. -->
            {{ item[column] }}
          </template>
        </td>
        <td>
          <!-- "+" 버튼은 행이 비활성화 상태일 때만 표시 -->
          <button class="btn btn-info btn-fill" v-if="!item.visible" @click="handleAddRowClick(item)">+</button>
          <!-- "-" 버튼은 행이 활성화(고정) 상태일 때만 표시 -->
          <button class="btn btn-warning btn-fill" v-else @click="handleRemoveRowClick(item)">-</button>
        </td>
      </tr>
      <tr>
        <td :colspan="columns.length">총액 : {{ totalAmount }} 원</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'l-table',
  props: {
    columns: Array,
    data: Array,
    searchQuery: String,
  },
  computed: {
    filteredAndVisibleData() {
      const searchLower = this.searchQuery.toLowerCase();

      return this.data.filter(item => 
        item.visible || item['상품명'].toLowerCase().includes(searchLower)
      );
    },
    filteredData() {
      return this.data.filter(item => 
        item.visible || item['상품명'].toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    visibleData() {
      return this.data.filter(item => item.visible || item['상품명'].toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    totalAmount() {
      return this.data.reduce((acc, item) => acc + (item['가격(BOX)'] * item['주문 수량']), 0);
    }
  },
  watch: {
    // 'data' 배열의 각 항목을 감시합니다. deep: true 옵션으로 객체 내부까지 감시합니다.
    'data': {
    handler: function(newData) {
      newData.forEach((item) => {
        if (item['주문 수량'] <= 0) {
          item['주문 수량'] = 0; // Prevent negative quantities
          this.handleRemoveRowClick(item);
        } else if (item['주문 수량'] > item['주문 가능 수량']) {
          item['주문 수량'] = item['주문 가능 수량']; // Limit to max available quantity
        }
        item['금액(원)'] = item['가격(BOX)'] * item['주문 수량'];
      });
      this.goodsList.data = [...newData];
    },
    deep: true,
    immediate: true // Execute watcher immediately on component mount
  }
  },
  methods: {
    updateAmount(item) {
      // 입력 필드 값에 따라 금액 계산
      item['금액(원)'] = item['가격(BOX)'] * item['주문 수량'];

      // 계산된 총합을 상위 컴포넌트로 전달
      this.$emit('update-total', this.data.reduce((total, currentItem) => total + currentItem['금액(원)'], 0));
    },
    handleAddRowClick(item) {
      if (item['주문 수량'] <= 0) {
        // If the order quantity is 0 or less, show an alert and don't emit the add-row event
        window.alert("주문 수량이 0입니다. 다시 입력해 주세요.");
        return; // Stop the method here
      }
      // If the order quantity is greater than 0, make the row permanently visible
      this.$emit('add-row', item['상품 코드']);
    },
    handleRemoveRowClick(item) {
      // 수량을 0으로 설정하고, 행을 비활성화
      item['주문 수량'] = 0;
      item.visible = false;
      // 금액을 업데이트하고, 총합을 재계산하여 상위 컴포넌트에 전달
      this.updateAmount(item);
    }
  }
};
</script>