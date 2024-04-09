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
                <button type="submit" class="btn btn-primary">등록</button>
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
    Card
  },
  data() {
    return {
      customer: {
        contactName: '',
        contactAddress: '',
        customerPhone: '',
        businessId: 'BUS002' // businessId에 "BUS002" 할당 --> businessId는 기업이 로그인하면 그것에 맞는 ID들어가게 수정해야 함
      },
      registeredId: '', // 등록된 아이디 저장 변수
      registeredPassword: '' // 등록된 비밀번호 저장 변수
    }
  },
  methods: {
    submitClient() {
      // 영문 3자리와 숫자 3자리의 난수 생성
      const randomCodeId = this.generateRandomCode();
      const randomCodePassword = this.generateRandomCode();

      // 거래처 정보 및 난수를 서버로 전송
      axios.post('http://localhost:8080/api/contact/inputcustomer', {
        contactCode: randomCodeId,
        customerPassword: randomCodePassword,
        contactName: this.customer.contactName,
        contactAddress: this.customer.contactAddress,
        customerPhone: this.customer.customerPhone,
        businessId: this.customer.businessId // businessId도 함께 전송 (지금은 지정된  ID가 정송됌)
      })
      .then(response => {
        // 서버 응답으로부터 등록된 아이디와 비밀번호 받아오기
        this.registeredId = response.data.contactCode;
        this.registeredPassword = response.data.customerPassword;
        
        // 알림창에 등록된 아이디와 비밀번호 표시
        alert(`거래처가 성공적으로 등록되었습니다. \n아이디: ${this.registeredId}, 비밀번호: ${this.registeredPassword}`); //추가
        
        // 폼 리셋
        this.resetForm();
      })
      .catch(error => {
        console.error("거래처 등록에 실패했습니다.", error);
      });
    },
    resetForm() {
      this.customer.contactName = '';
      this.customer.contactAddress = '';
      this.customer.customerPhone = '';
    },
    generateRandomCode() { //난수 생성 함수
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let code = '';

      // 영문 3자리 생성
      for (let i = 0; i < 3; i++) {
        code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }

      // 숫자 3자리 생성
      for (let i = 0; i < 3; i++) {
        code += Math.floor(Math.random() * 10);
      }

      return code;
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
