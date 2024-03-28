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

<!--    <button v-on:click="redirectToNaverLogin">Naver Login</button>-->


    <button type="button" v-on:click="login()">Login</button>

    <div @click="redirectToNaverLogin" style="cursor: pointer;">
      <img src="https://ndevthumb-phinf.pstatic.net/20240328_198/17115883494735spOD_PNG/T8ahNFGIcZ1c20240328101229.png" height="50px"
           width="50px" alt="Naver Login">





    </div>
    <button>비밀번호 : 영문 숫자 특수기호 조합 8자리 이상 16자리 이하</button>

  </div>


</template>
<script>
import axios from 'axios';
// import Swal from 'sweetalert2'
import Swal from 'sweetalert2'


// ---------------------------------------------------









// ---------------------------------------------------

import router from '@/router'; // Import your Vue Router instance
let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

// ---------------------------------------------------


/*if(tokens == true)
{
  this.$emit("authenticated", true);
}*/

// ---------------------------------------------------
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
    async login() {
      try {
        const formData = new FormData();


        formData.append("username", this.input.username); // Add username to FormData
        formData.append("password", this.input.password); // Add password to FormData

        const response = await axios.post('http://localhost:8080/login', formData);
        // -------------- naver login

        /*try {
          const naverResponse = await axios.get('http://localhost:3000/naverlogin');
          this.info = naverResponse.data; // Assuming you want to store the response data in 'info'
        } catch (error) {
          console.error("Error fetching naver login:", error);
        }*/
        //---------------

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
    },
    async redirectToNaverLogin() {

        window.location.href = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=sFFJbHM5h_DLHn_E5qOH&redirect_uri=http://localhost:8081/secure&state=RAMDOM_STATE-anyword';




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
