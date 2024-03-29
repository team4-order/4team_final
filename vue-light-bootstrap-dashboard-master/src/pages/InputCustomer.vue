<template>
    <div class="content">
      <div class="container-fluid">
        <div class="row justify-content-center"> <!-- 컨테이너를 중앙 정렬 -->
          <div class="col-md-8"> <!-- 카드의 너비를 제어하기 위한 부트스트랩 클래스 추가 -->
            <!-- 거래처 정보 등록을 위한 카드 컴포넌트 -->
            <card class="card-form mx-auto"> <!-- 카드 폼 중앙 정렬을 위한 클래스 추가 -->
              <template slot="header">
                <h4 class="card-title">거래처 등록</h4>
                <p class="card-category">거래처 정보를 등록할 수 있습니다.</p>
              </template>
              <!-- 거래처 정보 입력 폼 -->
              <form @submit.prevent="submitClient">
                <div class="form-group text-left"> <!-- 텍스트 왼쪽 정렬 -->
                  <label for="customerName">거래처 명</label>
                  <input type="text" class="form-control" id="customerName" v-model="customer.contactName" required>
                </div>
                <div class="form-group text-left"> <!-- 텍스트 왼쪽 정렬 -->
                  <label for="customerAddress">거래처 주소</label>
                  <input type="text" class="form-control" id="customerAddress" v-model="customer.contactAddress" required>
                </div>
                <div class="form-group text-left"> <!-- 텍스트 왼쪽 정렬 -->
                  <label for="customerPhone">거래처 연락처</label>
                  <input type="text" class="form-control" id="customerPhone" v-model="customer.customerPhone" required>
                </div>
                <div class="form-group text-right"> <!-- 버튼 오른쪽 정렬 -->
                  <button type="submit" class="btn btn-primary" :disabled="!isFormValid">등록</button>
                </div>
              </form>
            </card>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import Card from 'src/components/Cards/Card.vue'
  import axios from 'axios'
  
  export default {
    components: {
      Card // 카드 컴포넌트 등록
    },
    data() {
      return {
        customer: {
          contactCode: this.generateRandomCode(), // 거래처 코드에 대한 랜덤 값 초기화
          customerPassword: this.generateRandomPassword(), // 고객 비밀번호에 대한 랜덤 값 초기화
          contactName: '',     // 거래처 이름
          contactAddress: '',  // 거래처 주소
          customerPhone: ''    // 거래처 연락처
        }
      }
    },
    methods: {
      // 거래처 코드에 대한 랜덤 값을 생성하는 메소드
      generateRandomCode() {
        return Math.random().toString(36).substring(2, 5); // 랜덤 알파벳 문자열 생성
      },
      // 고객 비밀번호에 대한 랜덤 값을 생성하는 메소드
      generateRandomPassword() {
        return Math.random().toString(36).substring(2, 10); // 랜덤 알파벳 문자열 생성
      },
      // 거래처 정보를 서버에 등록하는 메소드
      submitClient() {
        // 랜덤 값이 필요한 경우 여기에서도 업데이트 할 수 있음
        axios.post('http://localhost:8080/api/contact/inputcustomer', this.customer)
          .then(response => {
            // 성공적으로 등록되면 사용자에게 알림
            alert('거래처가 성공적으로 등록되었습니다.');
            // 폼 필드 초기화 및 랜덤 값 재생성
            this.resetForm();
          })
          .catch(error => {
            // 등록 실패 시 오류 메시지 출력
            console.error("거래처 등록에 실패했습니다.", error);
          });
      },
      // 폼 필드를 초기화하는 메소드
      resetForm() {
        this.customer.contactName = '';
        this.customer.contactAddress = '';
        this.customer.customerPhone = '';
        // 랜덤 값 다시 생성
        this.customer.contactCode = this.generateRandomCode();
        this.customer.customerPassword = this.generateRandomPassword();
      }
    }
  }
  </script>
  
 
<style scoped>
.card-form {
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 카드 폼 전체의 중앙 정렬을 위한 스타일 */
.mx-auto {
  margin-right: auto;
  margin-left: auto;
}

/* 라벨과 입력 필드 내의 텍스트 정렬을 위한 스타일 */
.form-group label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  font-size: larger; /* 글씨 크기를 키움 */
}

/* 입력 필드 스타일 */
.form-control {
  display: block;
  width: 100%; /* 폼 그룹 내부 전체 너비 사용 */
  margin-bottom: 1rem; /* 입력 필드 사이의 여백 조정 */
}

/* 등록 버튼 오른쪽 정렬을 위한 스타일 */
.form-group.text-right {
  text-align: right;
}
</style>