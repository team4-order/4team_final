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
            <input type="number" v-model="item[column]" @input="handleInput(item)" @blur="validateQuantity(item)"
              @focus="normalizeInput(item)" />
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
  name: 'l-table1',
  props: {
    columns: Array,
    data: {
      type: Array,
      default: () => []
    },
    searchQuery: String,
  },
  computed: {
    filteredAndVisibleData() {
      const searchLower = this.searchQuery.toLowerCase();
      return this.data
        .filter(item => item.visible || item['상품명'].toLowerCase().includes(searchLower))
        .sort((a, b) => {
          if (a.permanentlyVisible && !b.permanentlyVisible) return -1;
          if (!a.permanentlyVisible && b.permanentlyVisible) return 1;
          return a.originalIndex - b.originalIndex;
        });
    },
    totalAmount() {
      return this.data.reduce((acc, item) => acc + (item['가격(BOX)'] * item['주문 수량']), 0);
    }
  },
  methods: {
    handleInput(item) {
      // Immediately update the amount when user types
      this.updateAmount(item);
    },
    validateQuantity(item) {
    if (item['주문 수량'] === '' || item['주문 수량'] < 0) {
      item['주문 수량'] = 0;
    } else if (item['주문 수량'] > item['주문 가능 수량']) {
      item['주문 수량'] = item['주문 가능 수량'];
    }
    item['금액(원)'] = item['가격(BOX)'] * item['주문 수량'];
    this.updateAmount(item);
  },
    normalizeInput(item) {
      // Remove leading zeros by converting the input value to a number and back to string
      item['금액(원)'] = (item['주문 수량'] || 0) * item['가격(BOX)'];
    this.$emit('update-total', this.totalAmount);
      },
    updateVisibilityAndOrder() {
      this.data.forEach(item => {
        // Ensure visibility based on search and permanent visibility status
        item.visible = this.searchQuery ? item['상품명'].toLowerCase().includes(this.searchQuery.toLowerCase()) : item.permanentlyVisible;
      });

      // Force update to make sure Vue reacts to changes
      this.data = [...this.data];
    },
    handleAddRowClick(item) {
      if (item['주문 수량'] <= 0) {
        window.alert("주문 수량이 0입니다. 다시 입력해 주세요.");
        return;
      }
      item.permanentlyVisible = true;  // Mark the item as permanently visible
      item.visible = true;
      this.updateVisibilityAndOrder();
    },
    handleRemoveRowClick(item) {
      item.permanentlyVisible = false;  // Reset permanent visibility
      item.visible = false;
      item['주문 수량'] = 0;
      item['금액(원)'] = 0;
      this.updateAmount(item);
      this.updateVisibilityAndOrder();  // This will reorder the items
    },
    updateAmount(item) {
      item['금액(원)'] = item['가격(BOX)'] * item['주문 수량'];
      this.$emit('update-total', this.totalAmount);
    }
  },
  mounted() {
    this.data.forEach((item, index) => {
      item.originalIndex = index;  // Store the original index
      item.visible = false;        // Initially set all items to not visible
      item.permanentlyVisible = false;  // Initially set not permanently visible
      item['주문 수량'] = item['주문 수량'] || 0;
    });
    this.updateVisibilityAndOrder();
  }
};
</script>