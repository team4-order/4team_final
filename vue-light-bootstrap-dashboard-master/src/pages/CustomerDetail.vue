<template>
  <div class="content-fluid">
    <div class="row justify-content-center">
      <div class="col-md-8 mt-4">
        <card>
          <h4 slot="header" class="card-title">{{ customer.contactName }} Profile</h4>
          <form @submit.prevent="updateProfile">
            <div class="row">
              <div class="col-md-5">
                <base-input
                  type="text"
                  label="Company"
                  placeholder="Company Name"
                  v-model="customer.contactName"
                  :disabled="!isEditing"
                ></base-input>
              </div>
              <div class="col-md-3">
                <base-input
                  type="text"
                  label="ID"
                  placeholder="Company Code"
                  v-model="customer.contactCode"
                  :disabled="true"
                ></base-input>
              </div>
              <div class="col-md-4">
                <base-input
                  type="text"
                  label="Password"
                  placeholder="Company Password"
                  v-model="customer.customerPassword"
                  :disabled="!isEditing"
                ></base-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <base-input
                  type="text"
                  label="Address"
                  placeholder="Address"
                  v-model="customer.contactAddress"
                  :disabled="!isEditing"
                ></base-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <base-input
                  type="text"
                  label="Company Phone"
                  placeholder="Company Phone"
                  v-model="customer.customerPhone"
                  :disabled="!isEditing"
                ></base-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label class="control-label">About Me</label>
                  <textarea
                    class="form-control"
                    v-model="customer.aboutMe"
                    rows="5"
                    placeholder="Tell us about yourself"
                    :disabled="!isEditing"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button
                type="button"
                class="btn btn-info btn-fill float-right"
                @click="toggleEditing"
              >
                {{ isEditing ? '완료' : '수정하기' }}
              </button>
            </div>
          </form>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from 'src/components/Cards/Card.vue';
import axios from 'axios';

export default {
  components: {
    Card,
  },
  data() {
    return {
      customer: {
        contactName: '',
        contactCode: '',
        customerPassword: '',
        contactAddress: '',
        customerPhone: '',
        aboutMe: '',
      },
      originalCustomerData: {}, // 원본 고객 데이터를 저장할 변수
      isEditing: false,
    };
  },
  mounted() {
    this.fetchCustomerDetails();
  },
  methods: {
    async fetchCustomerDetails() {
      try {
        const response = await axios.get(`http://localhost:8080/api/contact/customer/${this.$route.params.customerCode}`);
        this.customer = { ...response.data };
        this.originalCustomerData = { ...response.data };
      } catch (error) {
        console.error('Failed to fetch customer details.', error);
      }
    },
    toggleEditing() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        // 완료 버튼 클릭 시 변경사항을 원본 데이터에 저장
        this.originalCustomerData = { ...this.customer };
        this.updateProfile(); // updateProfile 함수 호출
      } else {
        // 수정하기 버튼 클릭 시 변경 전의 원본 데이터로 복원
        this.customer = { ...this.originalCustomerData };
      }
      console.log('toggleEditing()');
    },
    async updateProfile() {
      console.log('updateProfile()');
      try {
        const contactCode = this.customer.contactCode;
        const updatedData = {
          contactName: this.customer.contactName,
          contactAddress: this.customer.contactAddress,
          customerPassword: this.customer.customerPassword,
          customerPhone: this.customer.customerPhone,
          aboutMe: this.customer.aboutMe,
        };

        const response = await axios.put(`http://localhost:8080/api/contact/customer/${contactCode}`, updatedData);

        if (response.status === 200) {
          this.customer = { ...response.data };
          this.originalCustomerData = { ...response.data };
          this.isEditing = false;
          alert("Profile updated successfully!"); // 사용자에게 성공 알림
        } else {
          console.error('Failed to update profile. Unexpected response:', response);
          alert("Failed to update profile. Please try again."); // 사용자에게 실패 알림
        }
      } catch (error) {
        console.error('Failed to update profile.', error);
        alert(`Failed to update profile: ${error.message}`); // 서버 응답 에러 메시지 제공
      }
    },
  },
};
</script>

<style scoped>
/* 사용자 정의 스타일 및 추가적인 스타일링 */
.card-header h4 {
  color: #333;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: middle;
  border-top: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table-responsive {
  height: 250px;
  overflow-y: auto;
}
</style>
