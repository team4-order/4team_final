<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">총 재고 목록222</h4>
              <p class="card-category">ui수정 예정입니다..</p>
            </div>
            <div class="card-body">
              <div class="toolbar">
                <div class="form-row align-items-center">
                  <div class="col-auto">
                    <select class="form-control">
                      <option value="">전체</option>
                      <option value="상품 코드">상품 코드</option>
                      <option value="등급">등급</option>
                      <option value="수량">수량</option>
                      <option value="창고 코드">창고 코드</option>
                      <option value="재고 입고일">재고 입고일</option>
                      <option value="재품 이름">재품 이름</option>
                    </select>
                  </div>
                  <div class="col-auto">
                    <input class="form-control" type="text" placeholder="재고 검색...">
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-white btn-round btn-just-icon" type="submit">
                      <em class="material-icons">search</em>
                    </button>
                  </div>
                </div>
              </div>



              <!-- 재고현황 박스 -->
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">상품별 총 재고 현황</h4>
                </div>
                <div class="card-body">
                  <div v-for="(quantity, productNameAndGrade) in inventoriesByProductAndGrade" :key="productNameAndGrade" class="total-inventory">
                    {{ productNameAndGrade }}: 총 {{ quantity }}개
                  </div>
                </div>
              </div>



              <div class="form-group">
                <select v-model="sortOption" class="form-control" @change="sortInventories">
                  <option value="">정렬 없음</option>
                  <option value="dateAsc">재고 입고일 순</option>
                  <option value="quantityAsc">수량 순</option>
                </select>
              </div>

<!--              총 재고목록-->
              <div class="card">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
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
                  <tr v-for="inventory in inventories.filteredData" :key="inventory.goodsCode">
                    <td>{{inventory.goodsMaster.goodsName}}</td>
                    <td>{{ inventory.goodsCode }}</td>
                    <td>{{ inventory.goodsGrade }}</td>
                    <td>{{ inventory.inventoryQuantity }}</td>
                    <td>{{ inventory.salesPrice }}</td>
                    <td>{{ inventory.storageCode }}</td>
                    <td>{{ formatDate(inventory.firstStockDate) }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            </div>

            <div class="grades-section">
              <div class="grade-container" v-for="grade in grades" :key="grade">
                <h5>{{ grade }} 등급 재고 목록</h5>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                    <tr>
                      <th>상품 이름</th>
                      <th>수량</th>
                      <th>판매 가격</th>
                      <th>창고 코드</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="inventory in filteredInventoriesByGrade(grade)" :key="inventory.goodsCode">
                      <td>{{ inventory.goodsMaster.goodsName }}</td>
                      <td>{{ inventory.inventoryQuantity }}</td>
                      <td>{{ inventory.salesPrice }}</td>
                      <td>{{ inventory.storageCode }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
      sortOption: '',
      searchQuery: '',
      selectedSearchOption: '',
      inventories: {
        data: [],
        filteredData: [],
      },
      grades: ['A', 'B', 'C', '폐기'],
    };
  },
  mounted() {
    this.fetchInventories();
  },
  methods: {
    fetchInventories() {
      axios.get('http://localhost:8080/api/inventories')
        .then(response => {
          this.inventories.data = response.data;
          this.filterInventories(); // 초기 데이터 로딩 후 필터링
        })
        .catch(error => console.error("재고 목록을 가져오는 데 실패했습니다.", error));
    },
    filterInventories() {
      let result = this.inventories.data;
      if (this.searchQuery && this.selectedSearchOption) {
        result = result.filter(item =>
          String(item[this.selectedSearchOption])
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()));
      }
      this.inventories.filteredData = result;
      this.sortInventories(); // 필터링 후 정렬
    },
    sortInventories() {
      if (this.sortOption === 'dateAsc') {
        this.inventories.filteredData.sort((a, b) => new Date(a.firstStockDate) - new Date(b.firstStockDate));
      } else if (this.sortOption === 'quantityAsc') {
        this.inventories.filteredData.sort((a, b) => parseFloat(a.inventoryQuantity) - parseFloat(b.inventoryQuantity));
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      });
    },
    filteredInventoriesByGrade(grade) {
      return this.inventories.filteredData.filter(inventory => inventory.goodsGrade === grade);
    },
  },



//총 재고
  computed: {
    inventoriesByProductAndGrade() {
      const summary = {};
      this.inventories.data.forEach(inventory => {
        const key = `${inventory.goodsMaster.goodsName} ${inventory.goodsGrade}`;
        if (!summary[key]) {
          summary[key] = 0;
        }
        summary[key] += parseInt(inventory.inventoryQuantity, 10);
      });
      return summary;
    },
  },


  watch: {
    searchQuery() {
      this.filterInventories();
    },
    selectedSearchOption() {
      this.filterInventories();
    },
  },
};
</script>

<style scoped>
.search-options {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}


/* 등급별 섹션 스타일링 */
.grades-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

/* 등급별 컨테이너 스타일링 */
.grade-container {
  flex: 1 1 22%; /* flex-grow, flex-shrink, flex-basis */
  min-width: 220px; /* 최소 너비 설정 */
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-responsive {
  margin-top: 15px;
}

h5 {
  text-align: center;
  margin-bottom: 15px;
}

/* 검색 옵션 및 정렬 드롭다운 사이의 간격 조정 */
.search-options {
  display: flex;
  gap: 10px; /* 간격 조정 */
  margin-bottom: 20px;
  align-items: center; /* 요소들을 수직으로 중앙 정렬 */
}

/* 드롭다운 및 검색 입력 필드 스타일 조정 */
.form-control {
  height: 38px; /* 높이 줄임 */
  width: 150px;
  font-size: 14px; /* 글꼴 크기 줄임 */
}

/* 버튼 스타일 조정 */
.btn {
  padding: 8px 12px; /* 패딩 조정 */
  font-size: 14px; /* 글꼴 크기 줄임 */
}

/* 버튼 아이콘 크기 조정 */
.btn .material-icons {
  font-size: 18px; /* 아이콘 글꼴 크기 줄임 */
}

.total-inventory {
  margin-bottom: 10px;
}

</style>
