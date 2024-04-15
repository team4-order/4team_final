<template>
  <div id="login">
    <h1 id="logo">OMS    Login Page</h1>
    <div class="form-inputs">
      <label for="username" >Username</label>
      <input type="text" id="username" name="username" v-model="input.username" placeholder="Username" />
    </div>
    <div class="form-inputs">

      <div class="form-inputs">

        <label for="password" >Password</label> <br>

        <input type="password" id="password" name="password" v-model="input.password"  placeholder="Password" />



    </div>
      <button type="button" v-on:click="login">Login</button><br><br><br><br><br>
    </div>





    <span class="font left-align">구글 아이디가 있으신가요?</span>
<br><br>


      <button type="button" class = "GLoginButton" v-on:click="GoogleLogin" >Google 로그인</button>

    <img v-if=" this.loginstatus" src="../assets/check.png" alt="Authenticated Image" height="23" width="23" align="right">

<br><br><br><br><br>
  <div v-if ="this.loginstatus">
    <button type="button" class = "GLoginButton" v-on:click="checkUsernameExistence">접속하기</button>
  </div>



  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
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
      ismodalopen: false,
      loginstatus: false,
      usernameExists: false,
      showTooltip: false,
    }
  },
  mounted() {
    this.checkAndStoreCode();
  },
  methods: {
    checkAndStoreCode() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        localStorage.setItem('code', code);
        this.loginstatus = true;
      }

    },
    async login() {
      try {
        const formData = new FormData();
        formData.append("username", this.input.username);
        formData.append("password", this.input.password);

        const response = await axios.post("http://localhost:8080/login", formData);

        Swal.fire({
          title: 'Login Success!',
          text: '로그인 되었습니다. 메인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        });

        const token = response.headers.authorization;
        localStorage.setItem('token', token);
        this.$emit("authenticated", true);
        this.$router.replace({ name: "Secure" });
        console.log("Logged in successfully!");
        console.log(response.data);

      } catch (error) {
        await Swal.fire({
          title: 'Login failed!',
          text: '아이디 및 비밀번호를 확인해주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        console.error("Login failed:", error.response.data);
      }
    },
    async GoogleLogin() {
      await Swal.fire({
        title: '구글 로그인 후',
        text: '접속하기를 눌러주세요!',
        icon: 'info',
        confirmButtonText: '확인'
      });
      window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=1074874386105-qlcav64d5j58f07o9aep4snpko0elgs1.apps.googleusercontent.com&redirect_uri=http://localhost:8080/api/v1/oauth2/google&response_type=code&scope=email%20profile%20openid&access_type=offline";
    },
    async checkUsernameExistence() {
      try {
        const code = localStorage.getItem('code');
        if (code) {
          const response = await axios.post('http://localhost:8080/api/users/findallusername', { code });
          this.usernameExists = response.data.usernameExists;
          console.log(this.usernameExists);
          if (this.usernameExists == true) {

            await Swal.fire({
              title: 'Login Success!',
              text: '로그인에 성공했습니다.',
              icon: 'success',
              confirmButtonText: '확인'
            });

            this.$emit("authenticated", true);
            this.$router.replace({ name: "Secure" });
          }
        } else {
          await Swal.fire({
            title: 'Login failed!',
            text: '구글 로그인을 먼저 진행해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
          });
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
.left-align {
  display: inline-block;
  width: 400px;
  text-align: center;
}
.buttonG{
  /*display: inline-block;*/
  text-align: center;
 /* text-align: center;*/

}
.buttonCenter{
  /*display: inline-block;*/
  text-align: center;
}
body {
  margin: 70px;
  font-family: Arial, Tahoma, sans-serif;
  font-size: 12px;
  font-weight: bold;
  direction: ltr;
  background: #b6b5a7;
}

#login {
  margin: 0 auto;
  padding: 30px;
  width: 400px;
  height: auto;
  overflow: hidden;
  background: #fcf4d4;
  border-radius: 20px;
  text-align: left;
  opacity: 0.78;
}

#login h1 {
  margin: 0 auto;
  width: 200px;
  font-family: 'Lily Script One', cursive;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: #ecce87;
  transition: 0.2s ease all;
}

.font{
  margin: 0 auto;
  width: 400px;

  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
#login h1:hover {
  color: #e3e29e;
}

.form-inputs {
  margin: 15px 0;
}

.form-inputs label {
  font-size: 14px;
  color: #565555;
  cursor: pointer;
}

.form-inputs input {
  margin: 15px 0;
  padding: 15px 15px;
  width: 100%;
  outline: none;
  border: 1px solid #bbb;
  border-radius: 20px;
  /*display: inline-block;*/
  box-sizing: border-box;
  transition: 0.2s ease all;
}

.form-inputs input[type=text]:focus,
.form-inputs input[type=password]:focus {
  border-color: #efe1a5;
  width: 100%;
}

.tooltip {
  position: relative;
  /*display: inline-block;*/
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  height: auto;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 10px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 100%;
  margin-left: -300px;
  opacity: 0;
  transition: opacity 1.3s;

}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 0.7;
}

button {
  padding: 15px 30px;
  width: 150px;
  background: #d2a389;
  border: none;
  color: white;
  cursor: pointer;
  display: inline-block;
  float: right;
  /*clear: right;*/
  transition: 0.2s ease all;
  margin-right: 10px; /* 조절하여 간격 조절 가능 */
  border-radius: 20px;
}
.GLoginButton {
  padding: 15px 30px;
  width: 250px;
  height: 45px;
  background: #d2a389;
  border: none;
  color: white;
  cursor: pointer;
  display: inline-block;
  float: right;
  /*clear: right;*/
  transition: 0.2s ease all;
  margin-right: 10px; /* 조절하여 간격 조절 가능 */
  border-radius: 20px;
}
button:hover {
  opacity: 0.8;
}

button:active {
  opacity: 0.4;
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

/*#login button {
  margin-right: 150px; !* 조절하여 간격 조절 가능 *!
  border-radius: 20px; !* 버튼을 둥글게 만듭니다. *!

}

#login button:last-child {
  margin-right: 150px; !* 마지막 버튼의 오른쪽 여백을 없앱니다. *!
}*/
</style>
