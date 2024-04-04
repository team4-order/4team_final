<template>
  <div id="login">
    <h1>Login</h1>
    <div class="form-inputs">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" v-model="input.username" placeholder="Username" />
    </div>
    <div class="form-inputs">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" v-model="input.password" placeholder="Password" />
    </div>
    <button type="button" v-on:click="login">Login</button>
    <button>비밀번호 : 영문 숫자 특수기호 조합 8자리 이상 16자리 이하</button>
  </div>


</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2'
import router from '@/router';
// ---------------------------------------------------
let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
axios.defaults.withCredentials = true;


// ---------------------------------------------------

export default {
  name: 'Login',
  data() {
    return {
      input: {
        username: "",
        password: ""
      },
    }
  },
  methods: {
    async login() {
      try {
        const formData = new FormData();




        formData.append("username", this.input.username); // Add username to FormData
        formData.append("password", this.input.password); // Add password to FormData

        const response = await axios.post("http://localhost:8080/login", formData,{ headers : {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset = utf-8'
          }
        })

        Swal.fire({
          title: 'Login Success!',
          text: '로그인 되었습니다. 메인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        })

        // Assuming your backend returns a JWT token upon successful login
        const token = response.headers.authorization;
        // You can store the token in localStorage or Vuex for future API requests
        localStorage.setItem('token', token);
        // Redirect to the '/secure' route upon successful login
        this.$emit("authenticated", true);
        this.$router.replace({name: "Secure"});
        console.log("Logged in successfully!");
        console.log(response.data);

      } catch (error) {
        console.error("Login failed:", error.response.data);
        // Handle login failure (display error message, clear inputs, etc.)
      }
    }
  }
}
</script>

<style>

#login .form-inputs {
  padding-bottom: 10px;
}

#login .form-inputs label {
  padding-right: 10px;
}

</style>
