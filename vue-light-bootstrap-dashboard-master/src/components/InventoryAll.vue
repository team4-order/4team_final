<template>
  <div class="inventory-page">
    <!-- NAV 영역: 총 재고 요약 -->
    <div class="nav-section">
      <h2 class="section-title">제품별 총 재고</h2>
      <div class="table-responsive">
        <table class="inventory-table">
          <thead>
          <tr>
            <th>제품 이름</th>
            <th>총 재고량</th>
            <th>출고예정 재고량</th>
            <th>가용 재고량</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(total, productName, index) in totalInventoryByProduct" :key="index">
            <td>{{ productName }}</td>
            <td>{{ total }}개</td>
            <td>{{ findOrderedQuantity(productName) }}개</td>
            <td>{{ total - findOrderedQuantity(productName) }}개</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 영역: 등급별 재고 목록 -->
    <div class="section-area">
      <div class="inventory-section" v-for="(grade, index) in grades" :key="index">
        <h2 class="section-title">{{ grade }} 등급 과일</h2>
        <div class="table-responsive">
          <table class="inventory-table">
            <thead>
            <tr>
              <th>제품 이름</th>
              <th>수량</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(quantity, productName, index) in aggregatedInventories[grade]" :key="index">
              <td>{{ productName }}</td>
              <td>{{ quantity }}개</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- FOOTER 영역: 재고 상세 목록 -->
    <div class="footer-section">
      <h4 class="card-title">과일 상세 목록</h4>
      <div class="search-area">
        <select v-model="searchCategory" class="form-control d-inline-block w-auto">
          <option value="goodsName">상품 이름</option>
          <option value="goodsCode">상품 코드</option>
          <option value="goodsGrade">등급</option>
          <option value="inventoryQuantity">수량</option>
          <option value="salesPrice">판매 가격</option>
          <option value="storageCode">창고 코드</option>
          <option value="firstStockDate">재고 입고일</option>
        </select>
        <input type="text" v-model="searchQuery" placeholder="검색..." class="form-control d-inline-block w-auto">
        <button @click="performSearch" class="btn btn-primary">조회</button>
      </div>
      <div class="table-responsive">
        <table class="inventory-table">
          <thead class="thead-sticky">
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
          <tr v-for="inventory in filteredInventories" :key="inventory.goodsCode">
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
      searchQuery: '',
      searchCategory: 'goodsName',
      filteredInventories: [],
      orderedSummaries: [],
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

    aggregatedInventories() {
      const result = {};
      this.grades.forEach(grade => {
        result[grade] = this.inventories
          .filter(inventory => inventory.goodsGrade === grade)
          .reduce((acc, curr) => {
            if (!acc[curr.goodsName]) {
              acc[curr.goodsName] = 0;
            }
            acc[curr.goodsName] += parseInt(curr.inventoryQuantity, 10);
            return acc;
          }, {});
      });
      return result;
    },
  },
  methods: {


    fetchOrderedSummaries() {
      // "출고 준비 중" 상태에 대한 주문 요약 정보만 가져옵니다.
      // 실제 API 엔드포인트 주소와 파라미터는 백엔드 구현에 따라 달라질 수 있습니다.
      axios.get('/api/inventories/summaries', { params: { orderStatus: '출고 준비 중' } })
        .then(response => {
          this.orderedSummaries = response.data;
        })
        .catch(error => console.error("주문된 제품 요약 정보를 가져오는데 실패했습니다:", error));
    },

    findOrderedQuantity(goodsName) {
      // 제품 이름으로 제품 코드 찾기
      const product = this.inventories.find(item => item.goodsName === goodsName);
      if (!product) return 0; // 제품을 찾지 못한 경우 0 반환
      // 찾은 제품 코드로 주문된 수량 찾기
      const summary = this.orderedSummaries.find(summary => summary.goodsCode === product.goodsCode);
      return summary ? summary.totalQuantity : 0;
    },




    fetchInventories() {
      axios.get('/api/inventories').then(response => {
        this.inventories = response.data;
        this.filteredInventories = response.data;
      }).catch(error => {
        console.error("재고 목록을 가져오는 데 실패했습니다.", error);
      });
    },


    performSearch() {
      if (this.searchCategory && this.searchQuery) {
        if (['inventoryQuantity', 'salesPrice'].includes(this.searchCategory)) {
          const searchNumber = Number(this.searchQuery);
          this.filteredInventories = this.inventories.filter(inventory => {
            const value = Number(inventory[this.searchCategory]);
            return !isNaN(searchNumber) && value === searchNumber;
          });
        } else {
          this.filteredInventories = this.inventories.filter(inventory => {
            const value = inventory[this.searchCategory] ? inventory[this.searchCategory].toString().toLowerCase() : '';
            return value.includes(this.searchQuery.toLowerCase());
          });
        }
      } else {
        this.filteredInventories = this.inventories;
      }
    }




  },
  mounted() {
    this.fetchInventories();
    this.fetchOrderedSummaries();
  },
};
</script>

<style>
/* 전체 페이지 스타일 */
.inventory-page {
  background-color: #FAFAFA;
  font-family: 'Roboto', sans-serif;
  padding: 20px;
}

/* NAV, SECTION, FOOTER 공통 스타일 */
.nav-section, .inventory-section, .footer-section {
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
}

/* 스크롤 가능한 테이블 컨테이너 스타일 */
.table-responsive {
  max-height: 400px; /* 목록이 이 높이를 초과하면 스크롤바 생성 */
  overflow-y: auto; /* 세로 방향 스크롤바 자동으로 생성되게 설정 */
  margin-bottom: 20px;
}

/* 테이블 스타일 */
.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-table th, .inventory-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #E0E0E0;
}

.thead-dark th {
  background-color: #4A4A4A;
  color: white;
}

/* 제목 스타일 */
.section-title {
  margin-bottom: 20px;
  color: #32325D;
  font-size: 18px;
  font-weight: 600;
}

/* 반응형 레이아웃 */
@media (min-width: 768px) {
  .section-area {
    display: flex;
    justify-content: space-between;
  }

  .inventory-section {
    flex-basis: 48%;
    margin-bottom: 20px;
  }
}

.thead-sticky th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  z-index: 1;
}
</style>
