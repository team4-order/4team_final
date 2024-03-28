<template>
  <div class="inventory-page">
    <div class="inventory-header">
      <div class="header-content">
        <p class="inventory-subtitle">전체 재고 현황</p>
      </div>
      <section class="inventory-card total-inventory-card">
        <h2 class="section-title">제품별 총 재고</h2>
        <div class="table-responsive">
          <table class="table-hover table-striped">
            <thead>
            <tr>
              <th>제품 이름</th>
              <th>재고량</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(total, productName, index) in paginatedTotalInventory" :key="index">
              <td>{{ productName }}</td>
              <td>{{ total }}개</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination-controls">
          <button @click="prevPage('total')">이전</button>
          <button @click="nextPage('total')">다음</button>
        </div>
      </section>
    </div>

    <div class="inventory-content">
      <div class="inventory-sections">
        <section class="inventory-card grade-inventory-card" v-for="(grade, index) in grades" :key="index">
          <h2 class="section-title">{{ grade }} 등급 재고</h2>
          <div class="table-responsive">
            <table class="table-hover table-striped">
              <thead>
              <tr>
                <th>제품 이름</th>
                <th>수량</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(quantity, productName, index) in paginatedGradesInventory[grade]" :key="index">
                <td>{{ productName }}</td>
                <td>{{ quantity }}개</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="pagination-controls">
            <button @click="prevPage(grade)">이전</button>
            <button @click="nextPage(grade)">다음</button>
          </div>
        </section>

        <div class="inventory-table-section">
          <div class="card detailed-inventory-card">
            <div class="card-header">
              <h4 class="card-title">재고 상세 목록</h4>
            </div>
            <div class="table-responsive">
              <table class="table inventory-table">
                <thead class="thead-dark">
                <tr>
                  <th>상품 이름</th>
                  <th>상품 코드</th>
                  <th>등급</th>
                  <th>수량</th>
                  <th>판매 가격</th>
                  <th>창고 코드</th>
                  <th>재고 입고일</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="inventory in paginatedInventories" :key="inventory.goodsCode">
                  <td>{{ inventory.goodsName }}</td>
                  <td>{{ inventory.goodsCode }}</td>
                  <td>{{ inventory.goodsGrade }}</td>
                  <td>{{ inventory.inventoryQuantity }}</td>
                  <td>{{ inventory.salesPrice }}</td>
                  <td>{{ inventory.storageCode }}</td>
                  <td>{{ new Date(inventory.firstStockDate).toLocaleDateString() }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination-controls">
              <button @click="prevPage('details')">이전</button>
              <button @click="nextPage('details')">다음</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      inventories: [],
      grades: ['A', 'B', 'C', '폐기'],
      currentPage: {
        total: 1,
        details: 1,
        A: 1,
        B: 1,
        C: 1,
        폐기: 1,
      },
      itemsPerPage: 10, // Adjust according to your need
    };
  },
  computed: {
    totalInventoryByProduct() {
      const totals = {};
      this.inventories.forEach(item => {
        if (!totals[item.goodsName]) {
          totals[item.goodsName] = 0;
        }
        totals[item.goodsName] += parseInt(item.inventoryQuantity, 10);
      });
      return totals;
    },
    paginatedTotalInventory() {
      const start = (this.currentPage.total - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return Object.entries(this.totalInventoryByProduct)
        .slice(start, end)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    },
    aggregatedInventories() {
      const result = {};
      this.grades.forEach(grade => {
        result[grade] = this.inventories
          .filter(inventory => inventory.goodsGrade === grade)
          .reduce((acc, curr) => {
            if (acc[curr.goodsName]) {
              acc[curr.goodsName] += parseInt(curr.inventoryQuantity, 10);
            } else {
              acc[curr.goodsName] = parseInt(curr.inventoryQuantity, 10);
            }
            return acc;
          }, {});
      });
      return result;
    },
    paginatedGradesInventory() {
      const pagination = {};
      for (const grade of this.grades) {
        const start = (this.currentPage[grade] - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        pagination[grade] = Object.entries(this.aggregatedInventories[grade])
          .slice(start, end)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      }
      return pagination;
    },
    paginatedInventories() {
      const start = (this.currentPage.details - 1) * this.itemsPerPage;
      return this.inventories.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    fetchInventories() {
      axios.get('/api/inventories').then(response => {
        this.inventories = response.data;
      }).catch(error => {
        console.error("재고 목록을 가져오는 데 실패했습니다.", error);
      });
    },
    nextPage(section) {
      this.currentPage[section]++;
    },
    prevPage(section) {
      if (this.currentPage[section] > 1) {
        this.currentPage[section]--;
      }
    },
  },
  mounted() {
    this.fetchInventories();
  },
};
</script>

<style>
/* 전체 페이지와 헤더 스타일 조정 */
.inventory-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.inventory-header, .inventory-content, .inventory-sections, .inventory-table-section {
  margin-bottom: 20px;
}

/* 섹션 카드 스타일 */
.inventory-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 10px; /* 패딩 줄임 */
  display: flex;
  flex-direction: column;
  font-size: 0.8rem; /* 글자 크기 줄임 */
}

/* 스크롤 적용 부분 조정 */
.scrollable-content {
  overflow-y: auto;
  max-height: 150px; /* 섹션 높이 줄임 */
}

/* 테이블 섹션 스타일 유지 */
.detailed-inventory-card {
  min-height: 400px; /* 상세 목록 높이 조정 */
}

/* 페이지네이션 컨트롤 스타일 */
.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: auto;
}

.pagination-controls button {
  margin: 0 5px;
  padding: 5px 10px;
  background: #f0f0f0;
  border: 1px solid #d0d0d0;
  cursor: pointer;
}

/* 섹션 가로 배열 */
.inventory-sections {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.total-inventory-card, .grade-inventory-card {
  width: calc(20% - 10px); /* 각 카드의 너비 조정 */
  margin-bottom: 20px; /* 마진으로 카드 사이 간격 조정 */
}

/* 상세 재고 목록 박스 스타일 조정 */
.inventory-table-section {
  width: auto;
  height: 1000px;
}

/// 헤더 영역 스타일 조정
.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.header-content {
  flex: 1;
}

/* 제품별 총 재고 목록 스타일 조정 */
.total-inventory-card {
  width: 600px; /* 너비 자동 조정 */
  flex: 1;
  margin-left: 20px; /* 헤더와의 간격 조정 */
  padding: 10px;
  font-size: 0.9rem; /* 글자 크기 추가 조정 */
  max-height: 400px; /* 높이 조정 */
}
</style>

