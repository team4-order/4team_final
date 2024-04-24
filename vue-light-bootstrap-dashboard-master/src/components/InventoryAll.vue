<template>
  <div class="inventory-page">
<!--    <div v-if="showLoadingPopup" class="loading-popup">-->
<!--      <h1>Loading...</h1>-->
<!--    </div>-->
    <!-- NAV 영역: 총 재고 요약 -->
    <div class="nav-section">
      <h2 class="section-title">제품별 총 재고</h2>
      <button @click="navigateToFruitInfo" class="btn btn-secondary mb-3 float-right">과일별 재고량</button>
      <div class="table-responsive">
        <table class="inventory-table">
          <thead class="thead-sticky">
          <tr>
            <th>제품 이름</th>
            <th>총 재고량(box)</th>
            <th>출고예정 재고량(box)</th>
            <th>가용 재고량(box)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(total, productName) in totalInventoryByProduct" :key="productName">
            <td>{{ productName }}</td>
            <td>{{ total.totalQuantity }}</td>
            <td>{{ total.orderedQuantity }}</td>
            <td>{{ total.availableQuantity }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 영역: 등급별 재고 목록 -->
    <div class="search-area">
      <select v-model="searchCategory" class="form-control d-inline-block w-auto">
        <option value="goodsName">상품 이름</option>
        <option value="goodsCode">상품 코드</option>
        <option value="goodsGrade">등급</option>
        <option value="inventoryQuantity">수량(box)</option>
        <option value="salesPrice">판매 가격</option>
        <option value="storageCode">창고 코드</option>
        <option value="firstStockDate">재고 입고일</option>
      </select>
      &nbsp
      <input type="text" v-model="searchQuery" placeholder="검색..." class="form-control d-inline-block w-auto">
      <button @click="performSearch" class="btn btn-primary">조회</button>
    </div>
    <div class="section-area" >
      <div class="inventory-section" v-for="(grade, index) in grades" :key="index">
        <h2 class="section-title">{{ grade }} 등급 과일</h2>
        <div class="table-responsive">
          <table class="inventory-table">
            <thead class="thead-sticky">
            <tr>
              <th>제품 이름</th>
              <th>수량(box)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(quantity, productName, index) in aggregatedInventories[grade]" :key="index">
              <td>{{ productName }}</td>
              <td>{{ quantity }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- FOOTER 영역: 재고 상세 목록 -->
    <div class="footer-section">
      <h4 class="card-title">과일 상세 목록</h4>

      <div class="table-responsive">
        <table class="inventory-table">
          <thead class="thead-sticky">
          <tr>
            <th>상품 이름</th>
            <th>상품 코드</th>
            <th>등급</th>
            <th>수량(box)</th>
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
      businessId: '', // 비즈니스 ID를 저장하는 변수 추가
      totalInventoryByProduct: {},
      loading: false,
      // showLoadingPopup: true, // 로딩 팝업 표시 상태
    };
  },
  computed: {
    totalInventoryByProduct() {
      const totals = {};
      this.filteredInventories.forEach(item => {
        if (!totals[item.goodsName]) {
          totals[item.goodsName] = { totalQuantity: 0, orderedQuantity: 0 };
        }
        totals[item.goodsName].totalQuantity += parseInt(item.inventoryQuantity, 10);
        totals[item.goodsName].orderedQuantity += this.findOrderedQuantity(item.goodsName);
      });
      return totals;
    },
    aggregatedInventories() {
      const result = {};
      this.grades.forEach(grade => {
        result[grade] = this.filteredInventories
          .filter(inventory => inventory.goodsGrade === grade)
          .reduce((acc, curr) => {
            if (!acc[curr.goodsName]) {
              acc[curr.goodsName] = 0;
            }
            acc[curr.goodsName] += parseInt(curr.inventoryQuantity);
            return acc;
          }, {});
      });
      return result;
    },
  },
  methods: {
    navigateToFruitInfo() {
      this.$router.push({ path: '/admin/fruit' });
    },

    fetchOrderedSummaries() {
      axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/inventories/summaries/${this.businessId}`)
        .then(response => {
          this.orderedSummaries = response.data;
          this.updateInventoryDisplay();
        })
        .catch(error => console.error("Failed to fetch ordered product summaries:", error));
    },

    updateInventoryDisplay() {
      const inventoryMap = {};
      // 재고 데이터가 있어야 이 코드가 제대로 작동합니다.
      this.inventories.forEach(inventory => {
        const { goodsName, inventoryQuantity } = inventory;
        if (!inventoryMap[goodsName]) {
          inventoryMap[goodsName] = {
            totalQuantity: parseInt(inventoryQuantity, 10),
            orderedQuantity: 0,
            availableQuantity: 0
          };
        } else {
          inventoryMap[goodsName].totalQuantity += parseInt(inventoryQuantity, 10);
        }
      });

      this.orderedSummaries.forEach(summary => {
        const product = this.inventories.find(inv => inv.goodsCode === summary.goodsCode);
        if (product && inventoryMap[product.goodsName]) {
          inventoryMap[product.goodsName].orderedQuantity += parseInt(summary.orderedQuantity, 10); // summary.orderedQuantity를 사용하여 변경
        }
      });

      Object.keys(inventoryMap).forEach(key => {
        const item = inventoryMap[key];
        item.availableQuantity = item.totalQuantity - item.orderedQuantity;
      });

      this.totalInventoryByProduct = inventoryMap;
    },




    calculateTotals(inventories, summaries) {
      const totals = {};
      inventories.forEach(inventory => {
        if (!totals[inventory.goodsName]) {
          totals[inventory.goodsName] = { totalQuantity: parseInt(inventory.inventoryQuantity, 10), orderedQuantity: 0 };
        }

        const summary = summaries.find(s => s.goodsCode === inventory.goodsCode);
        if (summary) {
          totals[inventory.goodsName].orderedQuantity += parseInt(summary.totalQuantity, 10);
        }
      });
      return totals;
    },

    findOrderedQuantity(goodsName) {
      const product = this.inventories.find(item => item.goodsName === goodsName);
      if (!product) return 0;
      const summary = this.orderedSummaries.find(summary => summary.goodsCode === product.goodsCode);
      return summary ? parseInt(summary.orderedQuantity, 10) : 0;
    },


    fetchInventories() {
      this.loading = true;
      axios.get(`http://ec2-13-209-231-193.ap-northeast-2.compute.amazonaws.com:8080/api/inventories/business/${this.businessId}`)
        .then(response => {
          this.inventories = response.data;
          this.fetchOrderedSummaries();
          this.loading = false;
        })
        .catch(error => {
          console.error("Failed to fetch inventories for business ID.", error);
          this.loading = false;
        });
    },

    performSearch() {
      if (this.searchCategory && this.searchQuery) {
        this.filteredInventories = this.inventories.filter(inventory => {
          const value = inventory[this.searchCategory] ? inventory[this.searchCategory].toLowerCase() : '';
          return value.includes(this.searchQuery.toLowerCase());
        });
      } else {
        this.filteredInventories = this.inventories; // 검색어가 없을 때 전체 인벤토리를 표시
      }
    },
  },
  mounted() {
    this.showLoadingPopup = true;
    setTimeout(() => {
      this.showLoadingPopup = false;
    }, 2500); // 5초 후 로딩 팝업 숨기기

    this.fetchInventories();
    this.businessId = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (this.businessId) {
      this.fetchInventories();
    } else {
      console.error("Business ID is not provided.");
    }
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



.loading-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  font-size: 24px;
}

.loading-popup h1 {
  margin: 0;
  padding: 20px;
  background: #333;
  border-radius: 10px;
}

.btn-primary {
  margin: 15px;
}
</style>
