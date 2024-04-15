<template>
  <div id="Register">
    <h1>Register</h1>
    <div class="form-inputs">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" v-model="input.username" placeholder="Username" />
    </div>
    <div class="form-inputs">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" v-model="input.password" placeholder="Password" />
    </div>
    <button>비밀번호 : 영문 숫자 특수기호 조합 8자리 이상 16자리 이하</button>
    <button type="button" v-on:click="register()">Register</button>
  </div>
</template>

<script>
import axios from 'axios';
// import Swal from 'sweetalert2'
import Swal from 'sweetalert2'


import router from '@/router'; // Import your Vue Router instance





let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;




export default {
  name: 'Login',
  data() {
    return {
      input: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    async register() {
      try {
        const formData = new FormData();
        if (reg.test(this.input.password)) {

          formData.append("username", this.input.username); // Add username to FormData
          formData.append("password", this.input.password); // Add password to FormData
        }
        else{
          Swal.fire({
            title: 'Password Error!',
            text: '비밀번호가 너무 짧습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          })
          console.log("비밀번호가 너무 단순합니다.")
        }
        const response = await axios.post('http://localhost:8080/join', formData);
        // Assuming your backend returns some data upon successful registration
        console.log("Registered successfully!");

        Swal.fire({
          title: 'Register Success!',
          text: '계정이 생성되었습니다. 로그인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        })

        this.$router.replace({ name: "Login" });

      } catch (error) {
        console.error("Registration failed:", error.response.data);
        // Handle registration failure (display error message, clear inputs, etc.)
      }
    }
  }
}
</script>

<style>

#Register .form-inputs {
  padding-bottom: 10px;
}

#Register .form-inputs label {
  padding-right: 10px;
}

</style>
