<template>
  <div id="login">
    <h1 id="logo">Login</h1>
    <div class="form-inputs">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" v-model="input.username" placeholder="Username" />
    </div>
    <div class="form-inputs">
      <label for="password">Password</label>
      <div class="tooltip">
        <input type="password" id="password" name="password" v-model="input.password" @mouseover="showTooltip = true" @mouseleave="showTooltip = false" placeholder="Password" />
        <span class="tooltiptext" v-show="showTooltip">영문 숫자 특수기호 조합 8자리 이상 16자리 이하로 생성해주세요.</span>
      </div>
    </div>
    <button type="button" v-on:click="login">Login</button>
    <br>
    <br>
    구글 아이디가 있으신가요?<br>
    <button type="button" v-on:click="GoogleLogin">Google 로그인</button>
    <br>
    <button type="button" v-on:click="checkUsernameExistence">접속하기</button>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'
import router from '@/router';

axios.defaults.withCredentials = true;

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      input: {
        username: "",
        password: "",
      },
      ismodalopen : false,
      loginstatus : false,
      usernameExists: false,
      showTooltip: false,
    }
  },
  methods: {
    async login() {
      try {
        const formData = new FormData();
        formData.append("username", this.input.username);
        formData.append("password", this.input.password);

        const response = await axios.post("http://localhost:8080/login", formData)

        Swal.fire({
          title: 'Login Success!',
          text: '로그인 되었습니다. 메인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        })

        const token = response.headers.authorization;
        localStorage.setItem('token', token);
        this.$emit("authenticated", true);
        this.$router.replace({name: "Secure"});
        console.log("Logged in successfully!");
        console.log(response.data);

      } catch (error) {
        await Swal.fire({
          title: 'Login failed!',
          text: '아이디 및 비밀번호를 확인해주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        })
        console.error("Login failed:", error.response.data);
      }
    },
    async GoogleLogin() {
      await Swal.fire({
        title: '구글 로그인 후',
        text: '접속하기를 눌러주세요!',
        icon: 'info',
        confirmButtonText: '확인'
      })

      window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com&redirect_uri=http://localhost:8080/api/v1/oauth2/google&response_type=code&scope=email%20profile%20openid&access_type=offline";
    },
    async checkUsernameExistence() {
      try {
        const code = localStorage.getItem('code');
        if (code) {
          const response = await axios.post('http://localhost:8080/api/users/findallusername', { code });
          this.usernameExists = response.data.usernameExists;
          if(this.usernameExists ==true)
          {
            this.$emit("authenticated", true);
            this.$router.replace({name: "Secure"});
          }
        } else {
          await Swal.fire({
            title: 'Login failed!',
            text: '구글 로그인을 먼저 진행해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
          })
          console.error('Code is not available in the localStorage.');
        }
      } catch (error) {
        console.error('Error checking username existence:', error);
      }
    },
  }
}
</script>

<style>
#login {
  margin: 0 auto;
  padding: 30px;
  width: 400px;
  height: auto;
  overflow: hidden;
  background: white;
  border-radius: 10px;
}

.form-inputs {
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  color: darkgray;
  cursor: pointer;
}

input[type="text"],
input[type="password"] {
  margin: 15px 0;
  padding: 15px 10px;
  width: 100%;
  outline: none;
  border: 1px solid #bbb;
  border-radius: 20px;
  display: inline-block;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  transition: 0.2s ease all;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: cornflowerblue;
}

button[type="button"] {
  padding: 15px 50px;
  width: auto;
  background: #1abc9c;
  border: none;
  color: white;
  border-radius: 30px;
  cursor: pointer;
  display: inline-block;
  float: right;
  clear: right;
  transition: 0.2s ease all;
}

button[type="button"]:hover {
  opacity: 0.8;
}

button[type="button"]:active {
  opacity: 0.4;
}

#logo {
  margin: 0 auto;
  width: 200px;
  font-family: 'Lily Script One', cursive;
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  color: lightgray;
  transition: 0.2s ease all;
}

#logo:hover {
  color: cornflowerblue;
}

.forgot,
.register {
  margin: 10px;
  float: left;
  clear: left;
  display: inline-block;
  color: cornflowerblue;
  text-decoration: none;
}

.forgot:hover,
.register:hover {
  color: darkgray;
}
</style>
