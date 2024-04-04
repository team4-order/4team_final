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
    <button type="button" v-on:click="GoogleLogin()">GLogin</button>
    <button type="button" v-on:click="getDatas()">data</button>
    <button>비밀번호 : 영문 숫자 특수기호 조합 8자리 이상 16자리 이하</button>




    <div class="form-inputs">
      <label for="NickName">NickName</label>
      <input type="text" id="NickName" name="NickName" v-model="input.NickName" placeholder="NickName" />
      <button type="button" v-on:click="getDatas">제출</button>
    </div>
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

        const response = await axios.post("http://localhost:8080/login", formData/*,{ headers : {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset = utf-8'
          }
        }*/)

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
    },GoogleLogin(){
window.location.href ="https://accounts.google.com/o/oauth2/v2/auth?scope=profile&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://localhost:8081/login/&client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com"


          /*https://accounts.google.com/o/oauth2/v2/auth?scope=profile&access_type=offline&include_granted_scopes=true&response_type=code& redirect_uri=http://localhost:8081/login/&client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com
              https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&response_type=code&client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com&redirect_uri=http://localhost:8081/login/*/

      /*this.$router.replace({name: "Login"});*/
},async getDatas(){
      // const formData = new FormData();
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

    // formData.append("Nickname", this.input.NickName);

      // console.log(code+ "  /  "+formData)


      await axios.post("http://localhost:8080/glogin/access", code)
          .then(response => {console.log("spring에서온 응답"+ response.data);}
          ).catch(error => {
            console.error("access code 데이터 전송에 문제가 생겼습니다.", error);
      });
      /*await axios.post("http://localhost:8080/glogin/access", formData)
          .then(response => {console.log("spring에서온 응답"+ response.data);}
          ).catch(error => {
            console.error("nickname 데이터 전송에 문제가 생겼습니다.", error);
          });*/


      if(code===params.get("code"))
      {
        this.$emit("authenticated", true);

        Swal.fire({
          title: 'Login Success!',
          text: '로그인 되었습니다. 메인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        })
        /*this.$router.replace({name: "Secure"});*/
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
