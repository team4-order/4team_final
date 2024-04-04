<!--
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
&lt;!&ndash;    <label>로그인</label> <br>
    <div id="googleLoginBtn" style="cursor: pointer" v-on:click="GoogleLoginBtn()">
      <img id="googleLoginImg" src="../assets/Oauth.png">
    </div>&ndash;&gt;

&lt;!&ndash;    <div> <button v-on="GoogleLoginSuccess">접속</button></div>&ndash;&gt;
    <button type="button" v-on:click="login">Login</button>
    <button>비밀번호 : 영문 숫자 특수기호 조합 8자리 이상 16자리 이하</button>

&lt;!&ndash;    <button type="button" v-on:click="GoogleLogin()">GLogin</button>
    <button type="button" v-on:click="getData()">data</button>&ndash;&gt;
&lt;!&ndash;    <div id="G_OAuth_btn"></div>
    <div>
      <p>email: {{ googleUser.email }}</p>
      <p>name: {{ googleUser.name }}</p>&ndash;&gt;

&lt;!&ndash;    <a href="https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&response_type=code&client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com&redirect_uri=http://localhost:8081/login">
      <img :src="require('../assets/Oauth.png')"/>
    </a>&ndash;&gt;
&lt;!&ndash;  <div> <div class="g-signin2" data-onsuccess="onSignIn"></div></div>
<br></br>
    <div v-on:click="googleLoginBtn">
      <img style="width: 150px; height: 46px" src="../assets/Oauth.png">
    </div>
    <button type="button" v-on:click="getData()">data</button>
    <div id="my-signin2" style="display: none"></div>&ndash;&gt;

  </div>


</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2'
import router from '@/router';
// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;







// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;

let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;



// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;
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

        const response = await axios.post("http://localhost:8080/login", formData);

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
  }
}
</script>

/*,GoogleLogin(){
window.location.href ="https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&response_type=code&client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com&redirect_uri=http://localhost:8081/login/"
// this.$router.replace({name: "Login"});
},getData(){
axios
.get("http://localhost:8081/login/", {withCredentials: true})
.then((res) => {
alert(JSON.stringify(res.data))

})
.catch((error) => alert(error))
}*/

<style>

#login .form-inputs {
  padding-bottom: 10px;
}

#login .form-inputs label {
  padding-right: 10px;
}

</style>
-->
